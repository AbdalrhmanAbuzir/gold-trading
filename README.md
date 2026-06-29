# 🪙 GoldMarket

[![Backend](https://img.shields.io/badge/Backend-ASP.NET_Core_Web_API-purple.svg)](https://dotnet.microsoft.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React.js-blue.svg)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-MS_SQL_Server-red.svg)](https://www.microsoft.com/en-us/sql-server)

GoldMarket is a secure, full-stack online marketplace designed to revolutionize gold trading by bridging the gap between digital consumers, independent sellers, and verified physical gold shops. The platform ensures absolute transparency and safety through real-time market pricing, comprehensive identity verification, and structured transaction tracking.

---

## Project Objectives

*   **Trusted Ecosystem:** Establish a highly secure and dependable environment for digital gold trading.
*   **Seamless Connection:** Seamlessly unite buyers, individual sellers, and established physical gold shops within a single marketplace.
*   **Anti-Fraud Environment:** Drastically mitigate trading fraud using robust identity verification and structural limits.
*   **Transparent Pricing:** Provide reliable, unmanipulated product costs pegged dynamically to current gold market rates.

---

## System Overview & Multi-Role Architecture

GoldMarket implements a strict Multi-Role system with distinct permissions and customized workflows:

*    **Verified Users (Customers):** Register, verify identity, browse gold catalogs, manage reservations, and track active orders.
*    **Sellers:** Dedicated tools to list products, manage active inventory, and track independent sales metrics.
*    **Gold Shops:** Specialized institutions tasked with validating transaction authenticity, uploading official receipts, and final order processing through a custom dashboard.
*    **Administrators:** Oversee complete platform operations, approve user identity verification requests, and monitor marketplace integrity.

---

##  Core Features

###  Authentication & Control
*   **JWT Authentication:** Fully secure login states utilizing JSON Web Tokens.
*   **Identity Verification:** Built-in verification flows to protect against fraudulent accounts.
*   **User Limits:** Smart algorithms to enforce system-defined cancellation caps and user trade boundaries.

###  Marketplace & Order Lifecycle
*   **Inventory Control:** Advanced product CRUD, multi-image upload streams, and dynamic tag categorization.
*   **Automated Expiration:** Real-time ordering equipped with auto-expiring reservations to prevent inventory lockups.
*   **Live Ticker Integration:** Price architecture tracking live market fluctuations to ensure gold pricing precision.

### 📊 Gold Shop Management Hub
*   **Dashboard Statistics:** Instant views of Total Orders, Reserved Statuses, Completed Deals, and Revenue Streams.
*   **Receipt Verification:** Secure system for uploading verified physical transaction receipts before closing sales.
*   **History Logs:** Full-scale history tracing for comprehensive auditing.

###  Smart Notifications
*   Instant triggers for order state updates, reservation timeouts, and successful completion alerts.

---

##  Technology Stack

### Backend Architecture
*   **Framework:** ASP.NET Core Web API
*   **Language:** C#
*   **ORM:** Entity Framework Core
*   **Database:** Microsoft SQL Server
*   **Security:** JSON Web Tokens (JWT) & Authorization Filters

### Frontend Architecture
*   **Core Library:** React.js
*   **State Management:** Redux Toolkit
*   **Routing:** React Router
*   **HTTP Client:** Axios (Integrated with security request interceptors)
