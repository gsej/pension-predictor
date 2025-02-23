resource "azurerm_resource_group" "group" {
  name     = local.resource_group_name
  location = var.location
}

resource "azurerm_log_analytics_workspace" "log_analytics_workspace" {
  name                = local.log_analytics_name
  location            = azurerm_resource_group.group.location
  resource_group_name = azurerm_resource_group.group.name
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = local.app_insights_name
  location            = azurerm_resource_group.group.location
  resource_group_name = azurerm_resource_group.group.name
  application_type    = "web"
   workspace_id       = azurerm_log_analytics_workspace.log_analytics_workspace.id
}

resource "azurerm_service_plan" "plan" {
  name                = local.app_service_plan_name
  resource_group_name = azurerm_resource_group.group.name
  location            = azurerm_resource_group.group.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" linuxapp {
    name                = local.app_service_name
    resource_group_name = azurerm_resource_group.group.name
    service_plan_id     = azurerm_service_plan.plan.id
    location            = azurerm_resource_group.group.location

    site_config {
    }

    app_settings = {
        APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.appinsights.instrumentation_key
    }   
}