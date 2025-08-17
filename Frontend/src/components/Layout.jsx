import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Sweet Shop
          </Link>
          <nav className="flex space-x-4">
            <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Products
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8">{children}</main>

    </div>
  );
};

export default Layout;