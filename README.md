# APIAtlas — API Monitoring & Testing Platform

APIAtlas is a full-stack API monitoring and testing platform built to simplify API management, execution tracking, and monitoring. It provides a centralized interface to manage API endpoints, execute requests, track execution history, and monitor API health.

## 🚀 Live Demo

| Component            | URL                                                 |
|----------------------|-----------------------------------------------------|
| Frontend Application | https://api-atlas-theta.vercel.app                  |
| Backend API          | https://apiatlas-utnr.onrender.com                  |
| Backend Health Check | https://apiatlas-utnr.onrender.com/actuator/health  |

**Note:** The backend is hosted on Render's free tier and may take some time to wake up after inactivity.

## ✨ Features

- **API Endpoint Management** — Manage and organize API endpoints.
- **API Execution** — Execute API requests and inspect responses.
- **Execution History** — Track previous API executions.
- **API Monitoring** — Monitor endpoint availability and health.
- **Incident Management** — Track and manage API-related incidents.
- **Beneficiary Management** — Register beneficiaries and track registration status.
- **Payment Management** — Initiate and track payment operations.
- **Centralized Dashboard** — Access API monitoring and testing information through a single interface.

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- MySQL

### Frontend
- React
- Vite
- JavaScript
- Recharts
- Lucide React

### Database & Deployment
- Aiven MySQL
- Render — Backend hosting
- Vercel — Frontend hosting
- GitHub — Source code management

## 🏗️ Project Structure

```text
APIAtlas/
├── api-atlas-backend/
│   ├── src/
│   ├── certs/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## ⚙️ Local Setup

### Prerequisites

- Java 21
- Maven
- Node.js and npm
- MySQL

### 1. Clone the repository

```bash
git clone https://github.com/IshaManerikar/APIAtlas.git
cd APIAtlas
```

### 2. Configure the backend

Navigate to the backend:

```bash
cd api-atlas-backend
```

Configure your database connection in `application.properties` or through environment variables:

```properties
DB_URL=jdbc:mysql://localhost:3306/api_atlas
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Start the backend:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## ☁️ Deployment

- Frontend is deployed on Vercel.
- Backend is deployed on Render using Docker.
- MySQL database is hosted on Aiven.
- Frontend communicates with the backend through the configured API base URL.
- CORS is configured to allow the deployed frontend origin.

## 🔗 Project Links

- GitHub: https://github.com/IshaManerikar/APIAtlas
- Live Application: https://api-atlas-theta.vercel.app
- Backend Health: https://apiatlas-utnr.onrender.com/actuator/health

## 👩‍💻 Author

**Isha Manerikar**

---

*APIAtlas — Monitor, test, and manage APIs from one place.*