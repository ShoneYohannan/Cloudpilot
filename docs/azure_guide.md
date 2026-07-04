# Azure App Service and Container Registry Guide

This guide provides step-by-step instructions on deploying the CloudPilot application to Microsoft Azure using Docker containers.

## 1. Setup Resource Group and Container Registry (ACR)

Execute the following commands in the Azure CLI to spin up resources:

```bash
# Variables
RG_NAME="rg-cloudpilot"
LOCATION="eastus"
ACR_NAME="acrcloudpilot" # Must be globally unique

# 1. Create Resource Group
az group create --name $RG_NAME --location $LOCATION

# 2. Create Azure Container Registry
az acr create --resource-group $RG_NAME --name $ACR_NAME --sku Basic --admin-enabled true
```

---

## 2. Compile and Push Local Images to ACR

```bash
# 1. Log in to ACR
az acr login --name $ACR_NAME

# 2. Tag local docker images
docker tag cloudpilot-backend:latest acrcloudpilot.azurecr.io/cloudpilot-backend:latest
docker tag cloudpilot-frontend:latest acrcloudpilot.azurecr.io/cloudpilot-frontend:latest

# 3. Push to registry
docker push acrcloudpilot.azurecr.io/cloudpilot-backend:latest
docker push acrcloudpilot.azurecr.io/cloudpilot-frontend:latest
```

---

## 3. Provision Azure App Service (Web App for Containers)

```bash
# Plan variables
PLAN_NAME="plan-cloudpilot"
BACKEND_WEBAPP="webapp-cloudpilot-backend"
FRONTEND_WEBAPP="webapp-cloudpilot-frontend"

# 1. Create App Service plan (Linux tier)
az appservice plan create --name $PLAN_NAME --resource-group $RG_NAME --location $LOCATION --is-linux --sku B1

# 2. Create Web App for Container (Backend)
az webapp create --resource-group $RG_NAME --plan $PLAN_NAME --name $BACKEND_WEBAPP --deployment-container-image-name acrcloudpilot.azurecr.io/cloudpilot-backend:latest

# 3. Configure backend environment keys
az webapp config appsettings set --resource-group $RG_NAME --name $BACKEND_WEBAPP --settings PORT=5000 MONGO_URI="mongodb+srv://..." JWT_SECRET="your_secret"

# 4. Create Web App for Container (Frontend)
az webapp create --resource-group $RG_NAME --plan $PLAN_NAME --name $FRONTEND_WEBAPP --deployment-container-image-name acrcloudpilot.azurecr.io/cloudpilot-frontend:latest
```

---

## 4. Enable Webhooks for Auto-Deployment

```bash
# Enable continuous deployment from ACR
az webapp deployment container config --enable-cd true --name $BACKEND_WEBAPP --resource-group $RG_NAME
az webapp deployment container config --enable-cd true --name $FRONTEND_WEBAPP --resource-group $RG_NAME
```
Any subsequent pushes to `acrcloudpilot.azurecr.io/cloudpilot-frontend:latest` will automatically update the running Azure App Service host.
