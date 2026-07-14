# 🚛 TransitOps - Smart Transport Operation System

> A modern Fleet & Transport Management System built with **Spring Boot**, **React**, and **MySQL** to streamline vehicle operations, driver management, trip tracking, maintenance, fuel monitoring, and financial reporting.

---

## 📌 Problem Statement

Transport and logistics companies often struggle with:

- Manual vehicle allocation
- Inefficient trip management
- Poor maintenance tracking
- Lack of fuel consumption monitoring
- No centralized expense management
- Driver license expiry oversight
- Limited operational visibility

These issues lead to:

- Increased operational costs
- Poor fleet utilization
- Delayed maintenance
- Safety compliance risks
- Difficult financial reporting

---

# 💡 Our Solution

**TransitOps** is a centralized Transport Operations Management Platform that digitizes the complete transport lifecycle.

The system enables administrators to efficiently manage:

- Fleet
- Drivers
- Trips
- Maintenance
- Fuel Usage
- Expenses
- Operational Reports

through a single dashboard with **Role-Based Access Control (RBAC).**

---

# 🎯 Key Features

## 👨‍💼 Admin

- User Management
- Vehicle Management
- Driver Management
- Trip Creation
- Trip Dispatch
- Maintenance Scheduling
- Fuel Price Management
- Dashboard Analytics
- Reports

---

## 🚚 Driver

- Secure Login
- View Assigned Trips
- Complete Trips
- Submit Ending Odometer
- Automatic Fuel Calculation

---

## 🦺 Safety Officer

- Monitor Driver License Expiry
- View Drivers with Expired Licenses
- Track Vehicles Under Maintenance
- Improve Fleet Safety Compliance

---

## 💰 Financial Analyst

- Expense Monitoring
- Fuel Cost Analysis
- Maintenance Cost Reports
- Operational Expense Dashboard

---

# ⚙️ Core Functionalities

### 🚛 Vehicle Management

- Add Vehicles
- Update Vehicle Details
- Vehicle Status Tracking
- Capacity Management

Vehicle Status:

- Available
- On Trip
- In Maintenance
- Retired

---

### 👨‍✈️ Driver Management

- Add Drivers
- Driver Availability
- License Expiry Monitoring
- Safety Score Tracking

Driver Status:

- Available
- On Trip
- Off Duty
- Suspended

---

### 🗺 Trip Management

Admin can:

- Create Trip
- Assign Driver
- Assign Vehicle
- Dispatch Trip
- Complete Trip
- Cancel Trip

When a trip is completed:

✔ Distance is calculated

✔ Fuel Used is calculated

✔ Fuel Cost is calculated

✔ Fuel Log is created automatically

✔ Expense entry is generated automatically

✔ Driver becomes Available

✔ Vehicle becomes Available

---

### ⛽ Fuel Management

Admin sets current fuel price.

When a trip completes:

```
Distance = Ending Odometer - Starting Odometer

Fuel Used = Distance / Vehicle Mileage

Fuel Cost = Fuel Used × Current Fuel Price
```

Fuel logs are automatically stored.

---

### 🔧 Maintenance Management

Admin can:

- Schedule Maintenance
- Track Progress
- Complete Maintenance

Vehicle status automatically changes:

```
Available
        ↓

In Maintenance
        ↓

Available
```

Maintenance expenses are recorded automatically.

---

### 💵 Expense Management

Expenses include:

- Fuel
- Maintenance
- Other Operational Costs

Financial dashboard provides:

- Total Expenses
- Fuel Expenses
- Maintenance Expenses
- Monthly Expense Summary

---

# 🔐 Role-Based Authentication

TransitOps uses **Role-Based Access Control (RBAC).**

| Role | Access |
|------|--------|
| Admin | Full System Access |
| Driver | Assigned Trips Only |
| Safety Officer | Safety Dashboard |
| Financial Analyst | Financial Dashboard |

Only **Admin** can create users.

---

# 🏗 System Architecture

```
React Frontend
        │
        ▼
REST Controllers
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
MySQL Database
```

The project follows a layered Spring Boot architecture:

- Controller
- Service
- Repository
- Entity
- DTO

---

# 🗂 Project Structure

```
src
 ├── controller
 ├── service
 │     ├── interfaces
 │     └── implementation
 ├── repository
 ├── entity
 ├── dto
 │     ├── request
 │     └── response
 ├── enums
 ├── config
 ├── exception
 └── util
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router
- Axios

---

## Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- Lombok

---

## Database

- MySQL

---

## Build Tool

- Maven

---

## Authentication

- JWT Authentication
- Role-Based Authorization

---

# 🗃 Database Modules

- Users
- Drivers
- Vehicles
- Trips
- Maintenance
- Fuel Logs
- Expenses
- Fuel Settings

---

# 🚀 Future Enhancements

- Live GPS Vehicle Tracking
- Google Maps Integration
- Email Notifications
- SMS Alerts
- Predictive Maintenance
- AI-Based Fuel Consumption Prediction
- Driver Performance Analytics
- Export Reports (PDF / Excel)
- Real-Time Dashboard
- Mobile Application

---

# 🌟 Why TransitOps?

TransitOps is designed to improve fleet efficiency by:

- Digitizing transport operations
- Automating fuel calculations
- Reducing manual work
- Improving driver safety
- Tracking maintenance proactively
- Generating financial insights
- Providing centralized operational control

---

# 📄 License

This project was developed for a Hackathon and is intended for educational and demonstration purposes.

---

⭐ If you like this project, consider giving it a star!
