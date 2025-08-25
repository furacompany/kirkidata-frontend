import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, Wifi, CreditCard, ArrowRight,
  Star, Users, Phone, Mail, MapPin, Menu, X,
  Shield, Clock, Headphones, Crown, Zap, CheckCircle2,
  MessageCircle, Facebook, Instagram, Twitter
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
// import heroImage from '../assets/hero-image.jpg' // Using string path instead

const features = [
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'Instant Airtime',
    desc: 'Buy airtime for all networks instantly with zero delays MTN, Airtel, Glo, 9mobile supported.'
  },
  {
    icon: <Wifi className="w-8 h-8 text-accent" />,
    title: 'Data Bundles',
    desc: 'Affordable data plans for every need. From daily plans to monthly subscriptions.'
  },
  {
    icon: <CreditCard className="w-8 h-8 text-yellow" />,
    title: 'Multiple Payment Options',
    desc: 'Fund your wallet with cards, bank transfers, USSD, or virtual accounts.'
  },
  {
    icon: <Shield className="w-8 h-8 text-success" />,
    title: 'Bank-Grade Security',
    desc: 'Your transactions are protected with enterprise-level security and encryption.'
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: '24/7 Availability',
    desc: 'Our platform never sleeps. Buy airtime and data anytime, anywhere.'
  },
  {
    icon: <Headphones className="w-8 h-8 text-accent" />,
    title: 'Expert Support',
    desc: 'Get help when you need it with our responsive customer support team.'
  },
]

const testimonials = [
  {
    name: 'Ada Okonkwo',
    location: 'Lagos, Nigeria',
    rating: 5,
            text: 'Kirkidata has transformed how I manage my recharges. Fast, reliable, and incredibly user-friendly!',
    avatar: 'AO'
  },
  {
    name: 'Chinedu Eze',
    location: 'Abuja, Nigeria',
    rating: 5,
    text: 'The best recharge platform I\'ve used. The admin dashboard is powerful and the customer interface is smooth.',
    avatar: 'CE'
  },
  {
    name: 'Fatima Hassan',
    location: 'Nigeria',
    rating: 5,
            text: 'Secure, easy to use, and lightning fast. Kirkidata has earned my complete trust.',
    avatar: 'FH'
  },
]

const dataPlans = [
  {
    network: 'MTN',
    logo: '📱',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    bgColor: 'bg-yellow-400',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-900',
    headerTextColor: 'text-black',
    popular: false,
    plans: [
      { size: '500MB', duration: '3 days' },
      { size: '1GB', duration: '7 days' },
      { size: '2GB', duration: '14 days' },
      { size: '5GB', duration: '30 days' },
      { size: '10GB', duration: '30 days' }
    ]
  },
  {
    network: 'Airtel',
    logo: '📶',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600',
    textColor: 'text-red-900',
    headerTextColor: 'text-white',
    popular: true,
    plans: [
      { size: '750MB', duration: '7 days' },
      { size: '1.5GB', duration: '14 days' },
      { size: '3GB', duration: '30 days' },
      { size: '6GB', duration: '30 days' },
      { size: '12GB', duration: '30 days' }
    ]
  },
  {
    network: 'Glo',
    logo: '🌐',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600',
    textColor: 'text-green-900',
    headerTextColor: 'text-white',
    popular: false,
    plans: [
      { size: '1GB', duration: '5 days' },
      { size: '2.5GB', duration: '14 days' },
      { size: '4GB', duration: '30 days' },
      { size: '7.5GB', duration: '30 days' },
      { size: '15GB', duration: '30 days' }
    ]
  },
  {
    network: '9mobile',
    logo: '📡',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-900',
    headerTextColor: 'text-white',
    popular: false,
    plans: [
      { size: '650MB', duration: '7 days' },
      { size: '1.2GB', duration: '14 days' },
      { size: '2.8GB', duration: '30 days' },
      { size: '5.5GB', duration: '30 days' },
      { size: '11GB', duration: '30 days' }
    ]
  }
]



const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Component */}
      <SEO 
        title="Kirkidata | Buy Airtime & Data Instantly in Nigeria"
        description="Kirkidata is your trusted platform for buying airtime and data bundles instantly and securely across all Nigerian networks. Simple, fast, and reliable."
        keywords="Kirkidata, Kirki, Data, Airtime recharge, Buy data online, MTN data, Airtel data, Glo data, 9mobile data, Airtime purchase, Nigeria, Affordable data plans"
        canonicalUrl="https://www.kirkidata.com/"
        ogImage="https://www.kirkidata.com/logo.png"
      />
      
      {/* Navigation */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors font-medium">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <button className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
                <a href="#pricing" className="block text-gray-700 hover:text-primary transition-colors font-medium">Pricing</a>
                <a href="#testimonials" className="block text-gray-700 hover:text-primary transition-colors font-medium">Reviews</a>
                <a href="#contact" className="block text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link to="/login" className="block">
                    <button className="w-full px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium text-left">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register" className="block">
                    <button className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium">
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Real Image */}
      <section className="relative bg-light py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow/10 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Content - Left Side */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                  <Zap className="w-4 h-4 mr-2" />
                  Nigeria's #1 Recharge Platform
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                KIRKIDATA
                <span className="block text-primary">
                  DATA PLATFORM
                </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
                Buy airtime and data bundles for all networks in Nigeria. 
                Trusted by over 50,000 users for instant, secure recharges.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                                <Link to="/register">
                  <button className="px-8 py-4 rounded-xl bg-success text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    GET STARTED <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
                    Sign In
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>All Networks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Secure & Safe</span>
                </div>
              </motion.div>
            </div>

            {/* Hero Image - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 lg:mt-0 lg:flex lg:justify-end order-1 lg:order-2"
            >
              <div className="relative max-w-md mx-auto lg:max-w-lg">
                {/* Main Hero Image */}
                <div className="relative">
                  <img
                    src="/kirki.png"
                    alt="Kirkidata Data Platform - Buy airtime and data bundles for all networks in Nigeria"
                    className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                    loading="eager"
                  />

                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                
                {/* Floating feature badges */}
                <div className="absolute -top-6 -left-6 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-semibold text-gray-800">Instant</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-gray-800">Secure</span>
                  </div>
                </div>
                
                {/* Additional floating badge */}
                <div className="absolute top-1/2 -left-8 bg-white rounded-full px-3 py-2 shadow-lg border border-gray-100 transform -translate-y-1/2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-800">50K+ Users</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Happy Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6"
            >
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">1M+</div>
              <div className="text-gray-600 font-medium">Transactions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6"
            >
              <div className="text-3xl lg:text-4xl font-bold text-yellow mb-2">₦500M+</div>
              <div className="text-gray-600 font-medium">Total Volume</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6"
            >
              <div className="text-3xl lg:text-4xl font-bold text-success mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From instant recharges to powerful analytics, Kirkidata provides all the tools 
              you need for seamless airtime and data management.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6 p-3 bg-gray-50 rounded-xl w-fit">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Affordable Data Plans And Prices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the best data deals for all networks in Nigeria. Fast, reliable, and affordable.
            </p>
            </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {dataPlans.map((network, index) => (
              <motion.div
                key={network.network}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 border-2 ${
                  network.popular ? 'border-primary shadow-2xl transform scale-105' : 'shadow-lg'
                } hover:shadow-xl transition-all duration-300`}
                style={{
                  backgroundColor: 
                    network.network === 'MTN' ? '#FCD34D' :
                    network.network === 'Airtel' ? '#EF4444' :
                    network.network === 'Glo' ? '#10B981' :
                    network.network === '9mobile' ? '#8B5CF6' : '#ffffff'
                }}
              >
                                 {network.popular && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                     <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border-2 border-yellow-400">
                       <Crown className="w-3 h-3 text-yellow-500" />
                       BEST VALUE
                     </div>
                   </div>
                 )}

                                 {/* Network Header */}
                 <div className="text-center mb-6">
                   <div className="text-3xl mb-2">{network.logo}</div>
                   <h3 className={`text-xl font-bold ${network.network === 'MTN' ? 'text-black' : 'text-white'} mb-1`}>{network.network}</h3>
                   <p className={`${network.network === 'MTN' ? 'text-black' : 'text-white'} text-sm font-medium`}>DATA PLANS</p>
                 </div>

                {/* Data Plans */}
                <div className="space-y-3 mb-6">
                  {network.plans.map((plan, planIndex) => (
                                         <div key={planIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                       <div className="flex-1">
                         <div className="font-semibold text-gray-900 text-sm">{plan.size}</div>
                         <div className="text-xs text-gray-600">{plan.duration}</div>
                       </div>
                     </div>
                  ))}
                </div>

                                 {/* Order Button */}
                 <Link to="/register" className="block">
                   <button className="w-full py-3 px-4 rounded-xl bg-white text-gray-900 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg border-2 border-white hover:border-gray-200">
                     Order Now
                   </button>
                 </Link>
              </motion.div>
            ))}
          </div>

                      <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              All data plans are instantly delivered with no hidden charges
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Instant activation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>All networks supported</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Secure transactions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers say about their experience with Kirkidata
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Recharges?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made Kirkidata their trusted 
              platform for all airtime and data needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Create Free Account
                </button>
              </Link>
              <Link to="/login">
                <button className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105">
                  Sign In Now
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? Need support? We're here to help you 24/7. 
              Reach out to us through any of our channels below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <a 
                    href="tel:+2347067129511"
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-primary/30 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone Number</h4>
                      <p className="text-gray-600 group-hover:text-primary transition-colors">+234 706 712 9511</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/2347067129511"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-green-300 group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <p className="text-gray-600 group-hover:text-green-600 transition-colors">+234 706 712 9511</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:kirkidata@gmail.com"
                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 hover:border-blue-300 group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Address</h4>
                      <p className="text-gray-600 group-hover:text-blue-600 transition-colors">kirkidata@gmail.com</p>
                    </div>
                  </a>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600">Kano, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://wa.me/2347067129511" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://facebook.com/kirkidata" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://instagram.com/kirkidata" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://twitter.com/kirkidata" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Click on any social media icon to connect with us
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="Kirkidata Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold">KIRKIDATA</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Nigeria's leading recharge platform. Fast, secure, and reliable 
                services for all your airtime and data needs.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/kirkidata" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/kirkidata" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://instagram.com/kirkidata" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
                >
                  <Instagram className="w-5 h-5" />
                </a>
            </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Guide</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Kirkidata. All rights reserved. Built with ❤️ in Nigeria.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home 