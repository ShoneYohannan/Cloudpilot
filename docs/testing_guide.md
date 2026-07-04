# Testing Guide

This guide details how to verify the end-to-end functionality of CloudPilot.

## 1. Local Testing Setup

To run a clean local testing routine:
1. Ensure your `.env` contains the database connection string and a secret:
   ```env
   MONGO_URI=mongodb://...
   JWT_SECRET=cloudpilot_secret_key
   ```
2. Launch the backend:
   ```bash
   cd server
   npm run dev
   ```
3. Launch the frontend:
   ```bash
   cd client
   npm run dev
   ```

---

## 2. API Validation Routine

You can manually verify endpoints via Postman or Thunder Client using the following sequence:

1. **User Registration**:
   - `POST http://localhost:5000/api/auth/register`
   - Capture the returned `token`.
2. **Project Creation**:
   - `POST http://localhost:5000/api/projects`
   - Include header `Authorization: Bearer <token>`.
   - Body:
     ```json
     {
       "name": "Validation App",
       "gitRepository": "https://github.com/shoneyohannan/CloudPilot"
     }
     ```
   - Capture the returned project `_id`.
3. **Trigger Deployment**:
   - `POST http://localhost:5000/api/deploy`
   - Include header `Authorization: Bearer <token>`.
   - Body:
     ```json
     {
       "projectId": "<project-id>"
     }
     ```
   - Capture the returned deployment `_id`.
4. **Log Polling**:
   - `GET http://localhost:5000/api/deploy/<deployment-id>`
   - Poll this URL multiple times over 15 seconds to watch logs append and check if status changes from `queued` to `in_progress` and finally `success` or `failed`.
5. **Dashboard Analytics Verification**:
   - `GET http://localhost:5000/api/dashboard`
   - Check that statistics count updates correctly.
