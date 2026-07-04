# CloudPilot - Cloud Deployment Simulator

CloudPilot is a full-stack, cloud-native telemetry dashboard built for the Cloud Developer (AZ-204) track. It simulates continuous integration and deployment pipelines by containerizing source repositories using Docker, pushing images to Azure Container Registry (ACR), and deploying web hosts to Azure App Service.

## 🚀 Key Features

- **Project Management**: Full CRUD interface to connect Git repositories.
- **Simulated Build Runner**: Multi-stage mock build pipeline running asynchronously in Node.js, spitting out rolling terminal compilation logs.
- **Visual Telemetry Dashboard**: Complete visual reports showing build ratios, success trends, and system audit logs.
- **JWT Protection Guard**: Secure password hashing via `bcrypt` and route interception utilizing JSON Web Tokens.
- **Dark Mode**: Persisted elegant custom themes using Tailwind CSS v4.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite 6+), Tailwind CSS v4, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express.js, Mongoose 8+, MongoDB Atlas.
- **Infrastructure**: Docker & Docker Compose.
- **Cloud targets**: Azure App Service, Azure Container Registry, GitHub Actions CI/CD.

---

## 📂 Project Structure

```text
CloudPilot/
 ├── client/                  # React Frontend
 │    ├── src/
 │    │    ├── components/    # Navigation layouts and route guards
 │    │    ├── context/       # Auth state, session context, theme management
 │    │    ├── pages/         # Dashboard, Projects, Logs Console, Profile
 │    │    └── utils/         # Axios api connection interceptor
 │    └── Dockerfile          # Frontend container definition
 ├── server/                  # Express Backend
 │    ├── src/
 │    │    ├── config/        # Mongoose database connections
 │    │    ├── controllers/   # CRUD handlers and simulation runners
 │    │    ├── middleware/    # Auth guards and error handlers
 │    │    ├── models/        # Schemas for Project, Deployment, Activity
 │    │    └── routes/        # Router configuration bindings
 │    └── Dockerfile          # Backend container definition
 ├── docker-compose.yml       # Orchestrates both services
 └── .github/workflows/       # GitHub Actions workflow
```

---

## 🐳 Running with Docker

Ensure Docker Desktop is running, then execute:

```bash
docker-compose up --build
```
- Frontend will be accessible at: `http://localhost` (Port 80)
- Backend will be accessible at: `http://localhost:5000`

---

## 📑 Documentation

Complete guides are available in the `docs/` folder:
- [API Documentation](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/api_documentation.md)
- [Docker Configuration Guide](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/docker_guide.md)
- [Azure Deployment Guide](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/azure_guide.md)
- [GitHub Actions CI/CD Guide](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/github_actions_guide.md)
- [Technical Architecture Details](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/technical_architecture.md)
- [Testing Guide](file:///c:/Users/Shone/OneDrive/Desktop/CloudPilot/docs/testing_guide.md)
