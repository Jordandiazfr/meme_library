# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.66.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

#Import variables 
variable "rg_name" {
  default = "memeteca-dev"
}

variable "rg_location" {
  default = "westEurope"
}

# Resource Group 
resource "azurerm_resource_group" "rg" {
  name     = "${var.rg_name}-rg"
  location = var.rg_location
}

########### BLOB STORAGE ################
resource "azurerm_storage_account" "storage-acc" {
  name                     = "memetecastorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_blob_public_access = true

  tags = {
    environment = "blob"
  }
}

resource "azurerm_storage_container" "container" {
  name                  = "memes-container"
  storage_account_name  = azurerm_storage_account.storage-acc.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "blob" {
  name                   = "hola.txt"
  storage_account_name   = azurerm_storage_account.storage-acc.name
  storage_container_name = azurerm_storage_container.container.name
  type                   = "Block"
  source                 = "./hola.txt"
}


data "azurerm_storage_account_sas" "sas-token" {
  connection_string = azurerm_storage_account.storage-acc.primary_connection_string
  https_only        = true
  signed_version    = "2017-07-29"

  resource_types {
    service   = true
    container = false
    object    = false
  }

  services {
    blob  = true
    queue = false
    table = false
    file  = false
  }

  start  = "2021-07-07T00:00:00Z"
  expiry = "2022-03-21T00:00:00Z"

  permissions {
    read    = true
    write   = true
    delete  = true
    list    = false
    add     = true
    create  = true
    update  = true
    process = false
  }
}

output "sas_url_query_string" {
  value = data.azurerm_storage_account_sas.sas-token.sas
  sensitive = true
}