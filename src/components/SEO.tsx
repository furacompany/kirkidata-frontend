import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  structuredData?: object
}

const SEO: React.FC<SEOProps> = ({
  title = "Kirkidata | Buy Airtime & Data Instantly in Nigeria",
  description = "Kirkidata is your trusted platform for buying airtime and data bundles instantly and securely across all Nigerian networks. Simple, fast, and reliable.",
  keywords = "Kirkidata, Kirki, Data, Airtime recharge, Buy data online, MTN data, Airtel data, Glo data, 9mobile data, Airtime purchase, Nigeria, Affordable data plans",
  canonicalUrl = "https://www.kirkidata.com/",
  ogImage = "https://www.kirkidata.com/logo.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData
}) => {
  // Default structured data for Kirkidata
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kirkidata",
    "url": "https://www.kirkidata.com",
    "logo": "https://www.kirkidata.com/logo.png",
    "description": "Kirkidata is a platform for buying airtime and data bundles instantly across all Nigerian networks.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Federal Low-Cost",
      "addressLocality": "Gombe",
      "addressRegion": "Gombe State",
      "addressCountry": "Nigeria"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+2347067129511",
      "contactType": "customer service",
      "areaServed": "NG",
      "availableLanguage": ["English"]
    }
  }

  const finalStructuredData = structuredData || defaultStructuredData

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph (Facebook, LinkedIn Preview) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Kirkidata" />
      
      {/* Business Location for SEO */}
      <meta property="business:contact_data:street_address" content="Federal Low-Cost" />
      <meta property="business:contact_data:locality" content="Gombe" />
      <meta property="business:contact_data:region" content="Gombe State" />
      <meta property="business:contact_data:country_name" content="Nigeria" />
      <meta property="business:contact_data:phone_number" content="+234-706-712-9511" />
      <meta property="business:contact_data:website" content="https://www.kirkidata.com" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Kirkidata" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="NG-GO" />
      <meta name="geo.placename" content="Gombe, Nigeria" />
      <meta name="geo.position" content="10.2891;11.1674" />
      <meta name="ICBM" content="10.2891, 11.1674" />
      
      {/* Mobile and Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/logo.jpg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.jpg" />
      
      {/* JSON-LD Schema for Google Knowledge Panel */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  )
}

export default SEO
