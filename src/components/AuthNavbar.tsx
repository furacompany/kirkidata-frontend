import React from 'react'
import { Link } from 'react-router-dom'

interface AuthNavbarProps {
  currentPage: 'login' | 'register'
}

const AuthNavbar: React.FC<AuthNavbarProps> = ({ currentPage }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Kirkidata Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">KIRKIDATA</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/">
              <button className="text-gray-700 hover:text-primary transition-colors font-medium">
                Home
              </button>
            </Link>
            {currentPage === 'login' ? (
              <Link to="/register">
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  Register
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AuthNavbar
