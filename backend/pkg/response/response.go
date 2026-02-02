package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Code:    "OK",
		Message: "ok",
		Data:    data,
	})
}

func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, APIResponse{
		Success: true,
		Code:    "CREATED",
		Message: "created",
		Data:    data,
	})
}

func Error(c *gin.Context, status int, code, msg string) {
	c.JSON(status, APIResponse{
		Success: false,
		Code:    code,
		Message: msg,
	})
}
