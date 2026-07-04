# API Documentation

The CloudPilot backend communicates via JSON REST APIs. All state-modifying requests require header tokens unless stated otherwise.

## Authentication (Public)

### Register User
`POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "_id": "64b0f...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "token": "eyJhb..."
    }
  }
  ```

### Login User
`POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK)**: (Same structure as registration)

---

## Projects (Protected)
*Requires `Authorization: Bearer <token>` header*

### List Projects
`GET /api/projects`
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [...]
  }
  ```

### Create Project
`POST /api/projects`
- **Request Body**:
  ```json
  {
    "name": "Microservice A",
    "gitRepository": "https://github.com/user/repo",
    "description": "Payment microservice logic"
  }
  ```
- **Response (201 Created)**

### Update Project
`PUT /api/projects/:id`
- **Request Body**: (Optional name, gitRepository, description, status)
- **Response (200 OK)**

### Delete Project
`DELETE /api/projects/:id`
- **Response (200 OK)**: `{ "status": "success", "message": "Project removed successfully" }`

---

## Deployments (Protected)
*Requires `Authorization: Bearer <token>` header*

### Trigger Deployment Simulation
`POST /api/deploy`
- **Request Body**:
  ```json
  {
    "projectId": "64b0f..."
  }
  ```
- **Response (202 Accepted)**:
  ```json
  {
    "status": "success",
    "message": "Deployment triggered successfully and running in background",
    "data": {
      "_id": "64c0...",
      "status": "queued",
      "commitHash": "8fa2f1",
      "logs": [...]
    }
  }
  ```

### Get Logs and Build Status
`GET /api/deploy/:id`
- **Response (200 OK)**: Returns the current logs list, execution status, and build duration.

### Get Global Deployment History
`GET /api/deploy/history`
- **Response (200 OK)**: Returns all deployments matching the user's projects.

---

## Dashboard (Protected)
*Requires `Authorization: Bearer <token>` header*

### Get Summary Statistics
`GET /api/dashboard`
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "stats": {
        "totalProjects": 3,
        "totalDeployments": 10,
        "successfulDeployments": 8,
        "failedDeployments": 2
      },
      "recentActivities": [...]
    }
  }
  ```
