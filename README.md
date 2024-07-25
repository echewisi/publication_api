# Book Selling Platform

A comprehensive backend application for a book-selling platform using Node.js, Express.js, and Sequelize. This project includes features for managing books, users with role-based access control (RBAC), real-time notifications, advanced analytics, and external API integrations.

## Table of Contents

- [Book Selling Platform](#book-selling-platform)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [API DOCUMENTATION](#api-documentation)

## Project Overview

This project is a backend application designed for a book-selling platform. It provides endpoints to manage books, users with various roles, real-time notifications, and advanced analytics.

## Features

- **CRUD Operations for Books**: Create, read, update, and delete books.
- **User Management**: Register users, authenticate, and assign roles.
- **Role-Based Access Control (RBAC)**: Define permissions for different user roles (Admin, Seller, Buyer).
- **Real-Time Notifications**: Use WebSocket for real-time updates on book stock and price changes.
- **Analytics**: Analyze book sales, user behavior, and sales trends.
- **External API Integration**: Fetch book details and convert book prices using external APIs.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building the API.
- **Sequelize**: ORM for database interactions.
- **PostgreSQL**: Relational database for storing data.
- **Swagger**: API documentation and testing.
- **WebSocket (`ws`)**: Real-time communication.
- **Joi**: Validation library for request data.

## Setup

### Prerequisites

- Node.js and npm installed on your machine.
- PostgreSQL installed and running.

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/echewisi/publication-api.git
    cd book-selling-platform
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_HOST=your_db_host
    PORT=3000
    JWT_SECRET=your_jwt_secret
    ```

4. **Run Migrations**:
    Ensure your database schema is up-to-date:
    ```bash
    npx sequelize-cli db:migrate
    ```

## Configuration

The application uses different configurations for development, test, and production environments. Update `config/config.js` with your database credentials.

For production, you can use a single `DATABASE_URL` environment variable.

## Running the Application

Start the application with:
```bash
npm start
```
The server will be available at http://localhost:3000.


## Testing
```bash
npm test
```
Ensure you have a separate test database configured in your .env file.

## API DOCUMENTATION
The API documentation is available at http://localhost:3000/api-docs. It provides detailed information about all available endpoints and their usage.

