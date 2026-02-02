package dto

// PageQuery 分页查询参数
// 默认值在 handler 中设置

type PageQuery struct {
	Page int `form:"page" json:"page"`
	Size int `form:"size" json:"size"`
}

// IDResponse 仅返回主键

type IDResponse struct {
	ID uint `json:"id"`
}

// ListResponse 通用列表返回

type ListResponse struct {
	Items interface{} `json:"items"`
	Total int64       `json:"total"`
}
