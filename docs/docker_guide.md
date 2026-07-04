# Docker and Containerization Guide

This guide details how to build and orchestrate the local environment using Docker.

## Configuration Profiles

### Backend Dockerfile (`server/Dockerfile`)
The backend targets a lightweight **Node 22 Alpine** build. It performs:
1. Production dependency caching (`npm ci --only=production`).
2. Directory copying.
3. Exposing port 5000.

### Frontend Dockerfile (`client/Dockerfile`)
The frontend uses a **multi-stage build**:
1. **Stage 1 (Build)**: Performs compilation of client assets (`npm run build`) on a Node 22 parent image.
2. **Stage 2 (Serve)**: Copies compiled static HTML/CSS/JS files into an **Nginx Alpine** image. Mounts a custom configuration to route refreshes directly back to `index.html` (supporting Single Page Application router navigation).

---

## Service Orchestration (`docker-compose.yml`)

The compose environment spins up two main services:
- **backend**: Map host port `5000:5000`. Configures database connect URIs and JWT secret keys.
- **frontend**: Map host port `80:80`. Pulls dependency on `backend`.

---

## Execution Commands

### Build and Start Environment
```bash
docker-compose up --build
```

### Stop Services
```bash
docker-compose down
```

### Clean volumes and orphans
```bash
docker-compose down -v --remove-orphans
```
