locals {
  resource_group_name   = "rg-${var.environment}-${var.service_name}"
  app_service_plan_name = "asp-${var.environment}-${var.service_name}"
  app_service_name      = "app-${var.environment}-${var.service_name}"
  app_insights_name     = "ai-${var.environment}-${var.service_name}"
  log_analytics_name    = "ai-${var.environment}-${var.service_name}"
}