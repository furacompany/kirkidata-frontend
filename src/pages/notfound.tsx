import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../components/ui/Button'
import SEO from '../components/SEO'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* SEO Component */}
      <SEO 
        title="404 - Page Not Found | Kirkidata"
        description="The page you're looking for doesn't exist or has been moved. Return to Kirkidata homepage to buy airtime and data bundles."
        keywords="404, page not found, Kirkidata error, broken link"
        canonicalUrl="https://kirkidata.com/404"
        noIndex={true}
      />
      
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound 