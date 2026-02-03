package http

import (
	"net/http"
	"strings"

	"example.com/oa-workorder/internal/config"
	"example.com/oa-workorder/internal/handler"
	"example.com/oa-workorder/internal/middleware"
	"example.com/oa-workorder/internal/repo"
	"example.com/oa-workorder/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(cfg config.Config, db *gorm.DB) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	if len(cfg.Server.TrustedProxies) > 0 {
		_ = r.SetTrustedProxies(cfg.Server.TrustedProxies)
	}

	r.Use(corsMiddleware(cfg.Server.CORSOrigins))

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	authHandler := &handler.AuthHandler{DB: db, Cfg: cfg}
	userHandler := &handler.UserHandler{DB: db}
	ticketHandler := &handler.TicketHandler{DB: db}
	openHandler := &handler.OpenHandler{DB: db}
	deptHandler := &handler.DepartmentHandler{DB: db}
	formRepo := repo.NewFormRepo(db)
	reimbRepo := repo.NewReimbursementRepo(db)
	workflowRepo := repo.NewWorkflowRepo(db)
	logRepo := repo.NewApprovalLogRepo(db)
	formSvc := service.NewFormService(formRepo)
	reimbSvc := service.NewReimbursementService(db, reimbRepo, formRepo)
	workflowSvc := service.NewWorkflowService(workflowRepo)
	logSvc := service.NewApprovalLogService(logRepo)
	formHandler := &handler.FormHandler{Svc: formSvc}
	reimbursementHandler := &handler.ReimbursementHandler{ReimbSvc: reimbSvc, FormSvc: formSvc, WorkflowSvc: workflowSvc, LogSvc: logSvc}
	workflowHandler := &handler.WorkflowHandler{Svc: workflowSvc}
	approvalLogHandler := &handler.ApprovalLogHandler{ReimbSvc: reimbSvc, LogSvc: logSvc}

	api := r.Group("/api/v1")
	api.POST("/auth/slider/verify", authHandler.SliderVerify)
	api.POST("/auth/login", authHandler.Login)
	api.POST("/auth/refresh", authHandler.Refresh)
	api.POST("/auth/logout", authHandler.Logout)

	auth := api.Group("")
	auth.Use(middleware.RequireAuth(cfg))
	{
		auth.GET("/users/me", userHandler.Me)
		auth.GET("/users", userHandler.List)

		auth.GET("/departments", deptHandler.List)
		auth.GET("/departments/:id/users", deptHandler.GetUsers)

		auth.GET("/tickets", middleware.RequirePermission(db, "ticket:read"), ticketHandler.List)
		auth.GET("/tickets/:id", middleware.RequirePermission(db, "ticket:read"), ticketHandler.Get)
		auth.POST("/tickets", middleware.RequirePermission(db, "ticket:write"), ticketHandler.Create)
		auth.PATCH("/tickets/:id", middleware.RequirePermission(db, "ticket:write"), ticketHandler.Update)

		// OA 审批模块路由（表单/流程/报销）
		forms := auth.Group("/forms")
		{
			forms.GET("", formHandler.List)
			forms.POST("", formHandler.Create)
			forms.GET("/:id", formHandler.Get)
		}

		workflows := auth.Group("/workflows")
		{
			workflows.GET("/templates", workflowHandler.ListTemplates)
			workflows.POST("/templates", workflowHandler.CreateTemplate)
			workflows.GET("/templates/:id", workflowHandler.GetTemplate)
		}

		reimbursements := auth.Group("/reimbursements")
		{
			reimbursements.GET("", reimbursementHandler.List)
			reimbursements.POST("", reimbursementHandler.Create)
			reimbursements.GET("/:id", reimbursementHandler.Get)
			reimbursements.PATCH("/:id", reimbursementHandler.Update)
			reimbursements.POST("/:id/submit", reimbursementHandler.Submit)
			reimbursements.POST("/:id/approve", reimbursementHandler.Approve)
			reimbursements.POST("/:id/reject", reimbursementHandler.Reject)
			reimbursements.GET("/:id/logs", approvalLogHandler.ListByReimbursement)
		}
	}

	open := r.Group("/open/v1")
	open.Use(middleware.RequireOpenAPISignature(cfg, db))
	{
		open.POST("/tickets", openHandler.CreateTicket)
	}

	public := r.Group("/public/v1")
	{
		public.GET("/approvals", ticketHandler.PublicList)
	}

	return r
}

func corsMiddleware(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		originNorm := strings.TrimRight(strings.TrimSpace(origin), "/")
		allowedOrigin := ""

		if originNorm != "" {
			c.Header("X-Debug-Origin", originNorm)
		}

		if len(origins) == 0 {
			allowedOrigin = "*"
		} else {
			for _, o := range origins {
				oNorm := strings.TrimRight(strings.TrimSpace(o), "/")
				if oNorm == "*" {
					allowedOrigin = originNorm
					break
				}
				if oNorm != "" && oNorm == originNorm {
					allowedOrigin = originNorm
					break
				}
			}
		}

		if allowedOrigin == "" {
			if originNorm != "" {
				allowedOrigin = originNorm
			} else if len(origins) == 0 {
				allowedOrigin = "*"
			}
		}

		if allowedOrigin != "" {
			c.Header("Access-Control-Allow-Origin", allowedOrigin)
		}
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-API-Key, X-API-Timestamp, X-API-Nonce, X-API-Signature")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
