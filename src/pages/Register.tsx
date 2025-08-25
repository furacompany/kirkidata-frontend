import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Smartphone, User, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import SEO from '../components/SEO';
import AuthNavbar from '../components/AuthNavbar';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!formData.phone.match(/^[0-9]{11}$/)) {
      setError('Phone number must be 11 digits');
      return;
    }
    // TODO: Add registration logic here (API call)
    alert('Registration successful!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-light">
      {/* SEO Component */}
      <SEO 
        title="Create Account | Kirkidata"
        description="Sign up for your Kirkidata account to buy airtime and data bundles instantly. Join thousands of satisfied customers."
        keywords="Kirkidata register, create account, sign up, airtime registration, data registration, Nigeria recharge signup"
        canonicalUrl="https://www.kirkidata.com/register"
      />
      
      {/* Auth Navbar */}
      <AuthNavbar currentPage="register" />
      
      <div className="flex items-start justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="Kirkidata Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
              <CardDescription className="text-gray-600">
                Sign up for your Kirkidata account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative mb-6" 
                  role="alert"
                  whileHover={{ scale: 1.02 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                    <button
                      onClick={() => setError('')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    required
                    icon={<User className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number (e.g., 08123456789)"
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                    required
                    icon={<Smartphone className="h-4 w-4" />}
                  />
                </div>
                
                <div>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      required
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      name="confirmPassword"
                      required
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                >
                  Create Account
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign In
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;