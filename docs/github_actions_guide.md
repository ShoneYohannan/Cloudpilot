# GitHub Actions CI/CD Configuration Guide

This guide details how to wire GitHub Actions pipelines to deploy CloudPilot.

## 1. Secrets Configuration in GitHub Repository

For the CI/CD pipeline to interact with Microsoft Azure, you must configure the following repository secrets under **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example / Format |
| :--- | :--- | :--- |
| `AZURE_CREDENTIALS` | JSON credentials returned by Azure Service Principal setup. | `{ "clientId": "...", ... }` |
| `AZURE_ACR_NAME` | Global registry name of your Azure Container Registry. | `acrcloudpilot` |
| `AZURE_BACKEND_APP_SERVICE_NAME` | Resource name of the backend Web App on Linux. | `webapp-cloudpilot-backend` |
| `AZURE_FRONTEND_APP_SERVICE_NAME` | Resource name of the frontend Web App on Linux. | `webapp-cloudpilot-frontend` |

---

## 2. Setting up Azure Service Principal

Execute the following Azure CLI command to generate the `AZURE_CREDENTIALS` JSON token:

```bash
az ad sp create-for-rbac --name "sp-github-actions-cloudpilot" --sdk-auth --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/rg-cloudpilot
```

Copy the complete outputted JSON block directly into the `AZURE_CREDENTIALS` secret input on GitHub.

---

## 3. Workflow Stages Breakdown

The workflow configured in `.github/workflows/deploy.yml` runs on every merge/push to `master` and `main` branches:

1. **build-and-test**: 
   - Restores dependencies.
   - Compiles client static assets.
2. **build-and-push-docker**:
   - Performs Docker login into ACR.
   - Compiles frontend and backend container images.
   - Pushes both images tagged with the commit SHA and `latest` tags to ACR.
3. **deploy-to-azure**:
   - Authenticates to Azure subscription.
   - Updates target App Services configurations to pull the newly published Docker image layers.
