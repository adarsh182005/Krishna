# E-commerce Sweet Shop Application (KRISHNA)

This is a full-stack e-commerce application with a React frontend and a Node.js backend.

## Features

  * User authentication and authorization (login, register).
  * View a list of products on the home and products pages.
  * Add products to a cart.
  * Manage user orders.
  * Admin functionality for managing products, including importing, creating, updating, and deleting products.

## Tech Stack

### Frontend

  * **Framework**: React + Vite
  * **Routing**: `react-router-dom`
  * **API Calls**: `axios`
  * **Styling**: `tailwind-css`, `shadcn-ui`, `clsx`, `tailwind-merge`, `tailwind-variants`

### Backend

  * **Framework**: Express.js
  * **Database**: MongoDB with Mongoose ODM
  * **Authentication**: JWT (`jsonwebtoken`) and password hashing (`bcryptjs`)
  * **CORS**: `cors`
  * **Environment Variables**: `dotenv`

## Setup Instructions

### Prerequisites

  * Node.js and npm installed.
  * MongoDB database (local or cloud-based).

### Backend Setup

1.  Navigate to the `Backend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory with your MongoDB connection string and a JWT secret:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```
    *Note: The `MONGO_URI` in the provided file has a hardcoded password. For production, you should use a more secure method to store your credentials.*
4.  Run the server:
    ```bash
    npm start
    ```
    The server will run on the specified port (e.g., `http://localhost:5000`) and connect to your MongoDB database.

### Frontend Setup

1.  Navigate to the `Frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Frontend` directory to specify the backend URL:
    ```
    VITE_BACKEND_URL=http://localhost:5000
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend application will be accessible at `http://localhost:5173` (or another port specified by Vite).
