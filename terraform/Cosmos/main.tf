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
  default = "Eastus"
}

variable "failover_location" {
  default = "westeurope"
}

variable "prefix" {
  default = "memeteca"
}

resource "azurerm_resource_group" "rg" {
  name     = var.rg_name
  location = var.rg_location
}

resource "azurerm_cosmosdb_account" "db" {
  name                = "${var.prefix}cosmosdev"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  enable_automatic_failover = true

  capabilities {
    name = "EnableAggregationPipeline"
  }

  capabilities {
    name = "mongoEnableDocLevelTTL"
  }

  capabilities {
    name = "MongoDBv3.4"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 400
    max_staleness_prefix    = 200000
  }


  geo_location {
    location          = var.failover_location
    failover_priority = 1
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}


# Mongo database

resource "azurerm_cosmosdb_mongo_database" "db" {
  name                = "memetecaDB"
  resource_group_name = azurerm_cosmosdb_account.db.resource_group_name
  account_name        = azurerm_cosmosdb_account.db.name
  throughput          = 400
}

# Mongo first collection 

#Memes 
resource "azurerm_cosmosdb_mongo_collection" "users" {
  name                = "MemesCollection"
  resource_group_name = azurerm_cosmosdb_account.db.resource_group_name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_mongo_database.db.name
  default_ttl_seconds = "777"
  shard_key           = "_id"
  throughput          = 400
}
