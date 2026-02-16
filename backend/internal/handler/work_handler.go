package handler

import (
	"bytes"
	"net/http"
	"strconv"
	"strings"

	"example.com/oa-workorder/internal/service"
	"example.com/oa-workorder/pkg/response"
	"github.com/gin-gonic/gin"
)

const maxZipSize = 50 << 20 // 50 MB

type WorkHandler struct {
	Svc *service.WorkService
}

func (h *WorkHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "missing zip file")
		return
	}
	defer file.Close()

	if header.Size > maxZipSize {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "file too large (max 50MB)")
		return
	}

	// Read file into memory for zip.NewReader
	buf := make([]byte, header.Size)
	if _, err := file.Read(buf); err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "failed to read file")
		return
	}

	title := strings.TrimSpace(c.PostForm("title"))
	if title == "" {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "title is required")
		return
	}

	input := service.UploadWorkInput{
		Title:       title,
		Description: strings.TrimSpace(c.PostForm("description")),
		Tags:        strings.TrimSpace(c.PostForm("tags")),
		ZipReader:   bytes.NewReader(buf),
		ZipSize:     header.Size,
	}

	work, err := h.Svc.UploadWork(c.Request.Context(), input)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", err.Error())
		return
	}

	response.Created(c, work)
}

func (h *WorkHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "12"))

	works, total, err := h.Svc.List(c.Request.Context(), page, size)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to list works")
		return
	}

	response.OK(c, gin.H{
		"items": works,
		"total": total,
		"page":  page,
		"size":  size,
	})
}

func (h *WorkHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	work, err := h.Svc.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.Error(c, http.StatusNotFound, "NOT_FOUND", "work not found")
		return
	}
	response.OK(c, work)
}

func (h *WorkHandler) ServeFile(c *gin.Context) {
	slug := c.Param("slug")
	filePath := c.Param("filepath")
	// Gin wildcard includes leading slash
	filePath = strings.TrimPrefix(filePath, "/")

	absPath, contentType, err := h.Svc.GetFilePath(c.Request.Context(), slug, filePath)
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}

	c.Header("Content-Type", contentType)
	c.Header("Cache-Control", "public, max-age=3600")
	c.File(absPath)
}

func (h *WorkHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "BAD_REQUEST", "invalid id")
		return
	}

	if err := h.Svc.Delete(c.Request.Context(), uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "ERROR", "failed to delete work")
		return
	}

	response.OK(c, gin.H{"deleted": true})
}
