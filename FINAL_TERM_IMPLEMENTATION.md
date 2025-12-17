# Companies Scraper - Final Term Implementation

This document provides complete implementation details for all final term exam requirements.

## 📋 Project Overview

**Companies Scraper** is a comprehensive web scraping platform for Italian and Romanian software companies, featuring:
- **Frontend**: React.js application with responsive UI
- **Backend**: Node.js REST API with Express.js
- **Database**: PostgreSQL with Supabase integration
- **Queue System**: Redis with Bull for background job processing
- **Containerization**: Docker containers for all components
- **CI/CD**: GitHub Actions pipeline
- **Infrastructure**: Kubernetes deployment on Azure AKS
- **Configuration**: Ansible playbooks for server management
- **Testing**: Selenium automated tests

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                      (Nginx)                           │
└─────────────────────┬───────────────────────────────────┘
                      │
              ┌───────▼───────┐
              │   Frontend    │
              │   (React)     │
              │   Port: 3000  │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │   Backend     │
              │   (Node.js)   │
              │   Port: 3001  │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │Database │   │  Redis  │   │ Supabase│
   │(PostgreSQL)  │(Queue)  │   │(Cloud)  │
   │Port: 5432│   │Port: 6379   │         │
   └─────────┘   └─────────┘   └─────────┘
```

---

## 📦 SECTION A: CONTAINERIZATION (10 Marks)

### Task A1: Docker Images

#### 1. Frontend Dockerfile (`Dockerfile.frontend`)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Backend Dockerfile (`Dockerfile`)
```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs
EXPOSE 3001
CMD ["npm", "start"]
```

#### 3. Database Dockerfile (`Dockerfile.database`)
```dockerfile
FROM postgres:15-alpine
ENV POSTGRES_DB=companies_scraper
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
COPY supabase/migrations/*.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
```

### Task A2: Multi-Service Setup

#### Docker Compose Configuration (`docker-compose.yml`)
- **Frontend**: React app served by Nginx on port 3000
- **Backend**: Node.js API on port 3001  
- **Database**: PostgreSQL on port 5432 with persistent volumes
- **Redis**: Queue management on port 6379
- **Network**: Custom bridge network for inter-service communication
- **Volumes**: Persistent storage for database and Redis data
- **Health Checks**: Comprehensive health monitoring for all services

### Screenshots & Verification
```powershell
# Start all containers
docker-compose up --build -d

# Verify all containers are running
docker-compose ps

# Check container health
docker-compose logs
```

---

## 🚀 SECTION B: CI/CD AUTOMATION (14 Marks)

### Task B1: Pipeline Development

#### GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

**Pipeline Stages:**

1. **Build Stage**
   - Backend: Node.js build, lint, test
   - Frontend: React build, test, coverage

2. **Security Stage**
   - Trivy vulnerability scanning
   - SARIF upload to GitHub Security

3. **Docker Stage**
   - Multi-architecture image builds
   - Push to Docker Hub registry
   - Image caching for faster builds

4. **Deploy Stage**
   - Azure AKS deployment
   - Kubernetes manifest updates
   - Rolling deployment strategy

### Task B2: Trigger Configuration

**Triggers:**
- Push to `main` branch → Full pipeline
- Push to `develop` branch → Build and test only
- Pull requests → Test and security scan

**Required Secrets:**
- `DOCKER_USERNAME` & `DOCKER_PASSWORD`
- `AZURE_CREDENTIALS`
- `AZURE_RESOURCE_GROUP`
- `AKS_CLUSTER_NAME`

### Pipeline Features
- Parallel job execution
- Artifact management
- Automated rollbacks on failure
- Notification system
- Environment-specific deployments

---

## ☸️ SECTION C: KUBERNETES ON AZURE (AKS) (12 Marks)

### Task C1: Kubernetes Manifests

#### Kubernetes Resources (`k8s/` directory):

1. **Namespace**: `companies-scraper`
2. **ConfigMaps**: Application configuration
3. **Secrets**: Sensitive data (base64 encoded)
4. **Deployments**: 
   - Frontend (2 replicas)
   - Backend (2 replicas) 
   - Database (1 replica)
   - Redis (1 replica)
5. **Services**: ClusterIP and LoadBalancer
6. **Persistent Volumes**: Database and Redis storage
7. **Ingress**: External access configuration

#### Deployment Commands:
```bash
# Create AKS cluster
az aks create --resource-group myRG --name companies-scraper-aks

# Get credentials
az aks get-credentials --resource-group myRG --name companies-scraper-aks

# Deploy application
kubectl apply -f k8s/
```

### Task C2: AKS Deployment Verification

**Verification Steps:**
```bash
# Check all pods
kubectl get pods -n companies-scraper

# Check services
kubectl get svc -n companies-scraper

# Check ingress
kubectl get ingress -n companies-scraper

# Get external IP
kubectl get service frontend-service -n companies-scraper
```

**Expected Outputs:**
- All pods in `Running` state
- Services properly configured
- External LoadBalancer IP assigned
- Application accessible via public IP

---

## 🔧 SECTION D: CONFIGURATION MANAGEMENT USING ANSIBLE (8 Marks)

### Task D1: Inventory Setup

#### Inventory File (`ansible/hosts.ini`):
```ini
[webservers]
web1 ansible_host=10.0.1.10 ansible_user=ubuntu
web2 ansible_host=10.0.1.11 ansible_user=ubuntu

[databases]  
db1 ansible_host=10.0.1.20 ansible_user=ubuntu

[loadbalancers]
lb1 ansible_host=10.0.1.30 ansible_user=ubuntu

[azure_vms]
azure-vm1 ansible_host=20.25.25.25 ansible_user=azureuser
azure-vm2 ansible_host=20.25.25.26 ansible_user=azureuser
```

### Task D2: Playbook Implementation

#### Main Playbook (`ansible/playbook.yml`):

**Automated Configurations:**

1. **Common Tasks** (All Servers):
   - Package updates and security patches
   - User management and SSH configuration
   - Firewall setup (UFW)
   - Fail2ban installation

2. **Web Servers**:
   - Docker and Docker Compose installation
   - Node.js runtime setup
   - PM2 process manager
   - Application deployment
   - Nginx reverse proxy

3. **Database Servers**:
   - PostgreSQL installation and configuration
   - Redis setup
   - Database user creation
   - Security hardening

4. **Load Balancers**:
   - Nginx load balancer configuration
   - SSL certificate management
   - Health check endpoints

5. **Azure VMs**:
   - Azure CLI installation
   - Kubectl and Helm setup
   - Monitoring agent configuration

#### Execution:
```bash
# Run playbook
ansible-playbook -i hosts.ini playbook.yml

# Run specific roles
ansible-playbook -i hosts.ini playbook.yml --tags "webservers"

# Check syntax
ansible-playbook -i hosts.ini playbook.yml --syntax-check
```

---

## 🧪 SECTION E: SELENIUM AUTOMATED TESTING (6 Marks)

### Task E1: Test Cases (Minimum 3)

#### Test Suite Implementation:

1. **Homepage Tests** (`test/homepage.test.js`):
   - Verify page loads correctly
   - Check navigation functionality
   - Validate content display
   - Test responsive design
   - Verify stats loading from API

2. **Companies Page Tests** (`test/companies.test.js`):
   - Filter functionality testing
   - Search feature validation
   - Pagination testing
   - Company card structure validation
   - Email and website link verification

3. **API Integration Tests** (`test/api-integration.test.js`):
   - Backend health check verification
   - Real-time updates testing
   - Data validation
   - Error handling testing
   - Form submission testing

#### Test Features:
- Cross-browser testing (Chrome, Firefox)
- Headless mode support
- Screenshot capture on failures
- Detailed HTML reports
- Parallel test execution

### Task E2: Execution Report

#### Test Execution:
```powershell
# Install dependencies
cd selenium-tests
npm install

# Run all tests
npm test

# Run with specific browser
$env:BROWSER="chrome"; npm test
$env:BROWSER="firefox"; npm test

# Run in headless mode
$env:HEADLESS="true"; npm test

# Generate detailed report
npm test -- --reporter mochawesome
```

#### Test Results:
- **Test Framework**: Mocha with Chai assertions
- **WebDriver**: Selenium WebDriver 4.x
- **Reports**: Mochawesome HTML reports with screenshots
- **Coverage**: All major user workflows tested
- **Browser Support**: Chrome, Firefox, Edge

---

## 🚀 Quick Start Guide

### Prerequisites
- Docker Desktop
- Node.js 18+
- PowerShell (Windows) or Bash (Linux/Mac)

### 1. Clone and Setup
```powershell
git clone https://github.com/AdilYassar/companies_scrapper.git
cd companies_scrapper
```

### 2. Start Application
```powershell
# Start all services
.\start-application.ps1

# Or manually
docker-compose up --build -d
```

### 3. Run Tests
```powershell
cd selenium-tests
npm install
npm test
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/v1

### 5. Stop Application
```powershell
.\stop-application.ps1
```

---

## 📊 Implementation Summary

| Section | Requirement | Implementation | Status |
|---------|-------------|----------------|--------|
| A | Containerization | Docker + Compose | ✅ Complete |
| B | CI/CD Pipeline | GitHub Actions | ✅ Complete |
| C | Kubernetes/AKS | K8s Manifests | ✅ Complete |
| D | Ansible Config | Playbooks + Inventory | ✅ Complete |
| E | Selenium Tests | 3+ Test Cases | ✅ Complete |

**Total Features Implemented**: 50+ components across all sections

---

## 📸 Documentation & Screenshots

All implementations include:
- ✅ Complete source code
- ✅ Configuration files
- ✅ Deployment scripts
- ✅ Comprehensive documentation
- ✅ Test execution guides
- ✅ Troubleshooting instructions

**Ready for Final Term Evaluation** 🎯
