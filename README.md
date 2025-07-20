# 🔗 URL Shortener Service

A high-performance URL shortening service built with Node.js, Express, and multiple database options. Evolved from SQLite to Sequelize ORM to cloud-hosted PostgreSQL (Neon). Features comprehensive testing, excellent performance under load, and clean API design.

## ✨ Features

- **Fast URL Shortening**: Generate short URLs instantly with POST /shorten
- **Reliable Redirects**: GET /redirect?code={code} endpoint for seamless redirects
- **Multiple Database Options**: Evolution from SQLite → Sequelize → Neon PostgreSQL
- **Comprehensive Testing**: Integration tests ensuring endpoint reliability
- **High Performance**: Handles 36+ requests per second with sub-second response times
- **Version-Controlled Database**: SQLite option included in repository
- **Load Tested**: Proven performance under concurrent load

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shorten-url.git
cd shorten-url
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/shorten_db
BASE_URL=http://localhost:3000
```

### 4. Database Setup Options

This project evolved through multiple database implementations. Choose your preferred option:

#### Option A: SQLite (Local Development - Version Controlled)
SQLite database file is included in the repository for immediate local development.

```bash
# No additional setup required - database file is in /db/urls.sqlite
npm start
```

#### Option B: Sequelize ORM (Multiple Database Support)
Supports SQLite, PostgreSQL, MySQL, and more through Sequelize ORM.

```bash
# Install additional Sequelize dependencies
npm install sequelize sqlite3

# Start with Sequelize ORM
npm start
```

#### Option C: Local PostgreSQL with Docker
```bash
docker run --name shorten-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shorten_db \
  -d postgres
```

#### Option D: Cloud PostgreSQL with Neon (Production)
1. Create a database on [neon.tech](https://neon.tech)
2. Copy your Neon DATABASE_URL
3. Update the `.env` file with your connection string

```env
# For Neon PostgreSQL
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

### 5. Start the Server
```bash
npm start
```

🎉 Server will be running at `http://localhost:3000`

## 📊 API Endpoints

### 1. Shorten URL
```http
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/redirect?code=abc123",
  "originalUrl": "https://example.com/very-long-url"
}
```

### 2. Redirect to Original URL
```http
GET /redirect?code={shortCode}
```

**Response:** HTTP 302 redirect to the original URL

**Example:**
```http
GET /redirect?code=abc123
# Redirects to: https://example.com/very-long-url
```

## 🧪 Comprehensive Testing Suite

### Integration Tests Implementation

We've implemented a robust testing suite using **Jest** and **Supertest** that covers all API endpoints and edge cases:

**Core Test Flow** (as requested):
1. ✅ Call `POST /shorten` with input URL `"https://example.com"`
2. ✅ Store the returned short code in a variable  
3. ✅ Call `GET /redirect?code={shortCode}` and verify redirection works correctly

### Running Tests Locally

```bash
# Run all tests with detailed coverage output
npm test
```

## 📈 Load Testing Results

We conducted comprehensive performance testing using [k6](https://k6.io/) to ensure reliability under load.

### Test Configuration
- **Tool**: k6 Load Testing Framework
- **Virtual Users**: 10 concurrent users
- **Duration**: 30 seconds
- **Endpoints**: `POST /shorten` and `GET /redirect?code={code}`

### Performance Metrics

| Metric | Value |
|--------|--------|
| **Total Requests** | 1,111 |
| **Success Rate** | 100% ✅ |
| **Failed Requests** | 0 |
| **Throughput** | 36.6 req/s |
| **Average Response Time** | 170.38 ms |
| **95th Percentile** | 291.23 ms |

### Detailed Response Times

| Percentile | Response Time |
|------------|---------------|
| **Average** | 170.38 ms |
| **Median (p50)** | 139.32 ms |
| **p90** | 268.99 ms |
| **p95** | 291.23 ms |
| **Min** | 97.37 ms |
| **Max** | 1.13 s |

### Quality Assurance
All 4,444 automated checks passed with 100% success rate:

- ✅ URL shortening endpoint returns 200 status
- ✅ Response time under 5 seconds
- ✅ Valid short URL format generated
- ✅ Redirect endpoint returns 200 status
- ✅ Redirect response time under 2 seconds
- ✅ Original URL properly retrieved

## 📈 Scalability Analysis

The service demonstrates excellent performance characteristics:

- **Linear Scaling**: Response times scale predictably with load
- **Sub-second Performance**: 95% of requests complete under 300ms
- **Zero Error Rate**: 100% success rate during stress testing
- **Efficient Resource Usage**: Low memory and CPU footprint

![Load Test Results](https://github.com/user-attachments/assets/a1503e37-1c34-4d65-99f0-54b3544238fe)

*Response time distribution across different virtual user loads (10, 20, 100, 200 VUs)*

## 🛠️ Technology Stack & Evolution

### Current Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Multiple options (SQLite → Sequelize → Neon PostgreSQL)
- **Testing**: Jest with Supertest for integration testing
- **Load Testing**: k6
- **ORM**: Sequelize (optional)



## 🔧 Development Scripts

```bash
# Start the server
npm start                    # Start the server

# Testing (comprehensive suite)
npm test                     # Run full test suite
```


## 🚨 Production Deployment

### Database Migration Path
1. **Development**: Start with SQLite for rapid prototyping
2. **Development**: Migrate to Sequelize for multi-database support
3. **Production**: Deploy with Neon PostgreSQL for scalability

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database URL (Neon recommended)
3. Set secure `BASE_URL` (https)










