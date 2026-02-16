package service

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"mime"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"crypto/rand"
	"encoding/hex"

	"example.com/oa-workorder/internal/models"
	"example.com/oa-workorder/internal/repo"
)

type WorkService struct {
	Repo       repo.WorkRepo
	StorageDir string // e.g. "uploads/works"
}

func NewWorkService(r repo.WorkRepo, storageDir string) *WorkService {
	return &WorkService{Repo: r, StorageDir: storageDir}
}

type UploadWorkInput struct {
	Title       string
	Description string
	Tags        string
	ZipReader   io.ReaderAt
	ZipSize     int64
}

var slugRegexp = regexp.MustCompile(`[^a-z0-9-]+`)

func generateSlug(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = slugRegexp.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	if s == "" {
		s = "work"
	}
	return s
}

func (s *WorkService) UploadWork(ctx context.Context, input UploadWorkInput) (*models.Work, error) {
	zr, err := zip.NewReader(input.ZipReader, input.ZipSize)
	if err != nil {
		return nil, fmt.Errorf("invalid zip file: %w", err)
	}

	// Detect and strip single top-level directory
	prefix := detectTopLevelDir(zr.File)

	// Check for index.html
	hasIndex := false
	for _, f := range zr.File {
		name := stripPrefix(f.Name, prefix)
		if name == "index.html" {
			hasIndex = true
			break
		}
	}
	if !hasIndex {
		return nil, fmt.Errorf("zip must contain an index.html at root level")
	}

	// Generate unique slug
	slug := generateSlug(input.Title)
	exists, err := s.Repo.ExistsBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if exists {
		b := make([]byte, 4)
		rand.Read(b)
		slug = slug + "-" + hex.EncodeToString(b)
	}

	// Extract files to storage
	storagePath := filepath.Join(s.StorageDir, slug)
	if err := os.MkdirAll(storagePath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create storage dir: %w", err)
	}

	var fileCount int
	var totalSize int64

	for _, f := range zr.File {
		name := stripPrefix(f.Name, prefix)
		if name == "" || f.FileInfo().IsDir() {
			continue
		}

		// Security: prevent path traversal
		if strings.Contains(name, "..") {
			continue
		}

		destPath := filepath.Join(storagePath, name)
		if err := os.MkdirAll(filepath.Dir(destPath), 0755); err != nil {
			return nil, fmt.Errorf("failed to create dir: %w", err)
		}

		rc, err := f.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open zip entry: %w", err)
		}

		outFile, err := os.Create(destPath)
		if err != nil {
			rc.Close()
			return nil, fmt.Errorf("failed to create file: %w", err)
		}

		written, err := io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		if err != nil {
			return nil, fmt.Errorf("failed to write file: %w", err)
		}

		fileCount++
		totalSize += written
	}

	work := &models.Work{
		Title:       input.Title,
		Description: input.Description,
		Slug:        slug,
		Tags:        input.Tags,
		StoragePath: storagePath,
		EntryFile:   "index.html",
		FileCount:   fileCount,
		TotalSize:   totalSize,
		IsPublished: true,
	}

	if err := s.Repo.Create(ctx, work); err != nil {
		os.RemoveAll(storagePath)
		return nil, fmt.Errorf("failed to save work: %w", err)
	}

	return work, nil
}

func (s *WorkService) GetBySlug(ctx context.Context, slug string) (*models.Work, error) {
	return s.Repo.FindBySlug(ctx, slug)
}

func (s *WorkService) List(ctx context.Context, page, size int) ([]models.Work, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 50 {
		size = 12
	}
	return s.Repo.List(ctx, page, size)
}

func (s *WorkService) Delete(ctx context.Context, id uint) error {
	work, err := s.Repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	// Remove files from disk
	if work.StoragePath != "" {
		os.RemoveAll(work.StoragePath)
	}
	return s.Repo.Delete(ctx, id)
}

// GetFilePath returns the absolute file path and content type for a file within a work.
func (s *WorkService) GetFilePath(ctx context.Context, slug, filePath string) (string, string, error) {
	work, err := s.Repo.FindBySlug(ctx, slug)
	if err != nil {
		return "", "", err
	}

	// Default to entry file
	if filePath == "" || filePath == "/" {
		filePath = work.EntryFile
	}

	// Security: prevent path traversal
	cleanPath := filepath.Clean(filePath)
	if strings.Contains(cleanPath, "..") {
		return "", "", fmt.Errorf("invalid file path")
	}

	absPath := filepath.Join(work.StoragePath, cleanPath)

	// Verify the file exists
	if _, err := os.Stat(absPath); os.IsNotExist(err) {
		return "", "", fmt.Errorf("file not found: %s", filePath)
	}

	// Determine content type
	contentType := mime.TypeByExtension(filepath.Ext(absPath))
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	return absPath, contentType, nil
}

// detectTopLevelDir checks if all files share a single top-level directory.
func detectTopLevelDir(files []*zip.File) string {
	if len(files) == 0 {
		return ""
	}

	var topDir string
	for _, f := range files {
		parts := strings.SplitN(f.Name, "/", 2)
		if len(parts) < 2 {
			// There's a file at root level, no common prefix
			return ""
		}
		if topDir == "" {
			topDir = parts[0]
		} else if parts[0] != topDir {
			return ""
		}
	}

	return topDir + "/"
}

func stripPrefix(name, prefix string) string {
	if prefix == "" {
		return name
	}
	return strings.TrimPrefix(name, prefix)
}
