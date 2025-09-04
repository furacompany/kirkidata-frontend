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
  noIndex?: boolean
  articleAuthor?: string
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleSection?: string
  articleTags?: string[]
  breadcrumbs?: Array<{ name: string; url: string }>
  faqData?: Array<{ question: string; answer: string }>
  productData?: {
    name: string
    description: string
    price: string
    currency: string
    availability: string
    brand: string
    category: string
  }
}

const SEO: React.FC<SEOProps> = ({
  title = "Kirkidata - Affordable Data & Airtime Services in Nigeria",
  description = "Kirkidata offers affordable data, airtime top-up, cable TV subscriptions, and electricity bill payments with instant delivery and 24/7 support. Buy MTN, Airtel, Glo, 9mobile data bundles online.",
  keywords = "Kirkidata, data bundles, airtime top-up, cable subscription, electricity bill payment, Nigeria VTU, MTN data, Airtel data, Glo data, 9mobile data, buy data online, cheap data, instant airtime",
  canonicalUrl = "https://kirkidata.com/",
  ogImage = "https://kirkidata.com/logo.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noIndex = false,
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
  articleTags,
  breadcrumbs,
  faqData,
  productData
}) => {
  // Enhanced structured data for Kirkidata
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kirkidata",
    "alternateName": "Kirki Data",
    "url": "https://kirkidata.com",
    "logo": "https://kirkidata.com/logo.jpg",
    "description": "Kirkidata offers affordable data, airtime top-up, cable TV subscriptions, and electricity bill payments with instant delivery and 24/7 support across all Nigerian networks.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Kirkidata Team"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressRegion": "Nigeria"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+2347067129511",
      "contactType": "customer service",
      "areaServed": "NG",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://twitter.com/kirkidata",
      "https://facebook.com/kirkidata",
      "https://instagram.com/kirkidata"
    ],
    "offers": {
      "@type": "Offer",
      "description": "Data bundles, airtime top-up, cable TV subscriptions, and electricity bill payments",
      "areaServed": "Nigeria",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://kirkidata.com",
        "serviceName": "Online VTU Services"
      }
    },
    "serviceType": "VTU Services",
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    }
  }

  // FAQ structured data
  const faqStructuredData = faqData ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null

  // Product structured data
  const productStructuredData = productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "description": productData.description,
    "brand": {
      "@type": "Brand",
      "name": productData.brand
    },
    "category": productData.category,
    "offers": {
      "@type": "Offer",
      "price": productData.price,
      "priceCurrency": productData.currency,
      "availability": productData.availability,
      "seller": {
        "@type": "Organization",
        "name": "Kirkidata"
      }
    }
  } : null

  const finalStructuredData = structuredData || defaultStructuredData

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={articleAuthor || "Kirkidata"} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph (Facebook, LinkedIn Preview) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Kirkidata Services`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Kirkidata" />
      <meta property="og:locale" content="en_NG" />
      
      {/* Article specific Open Graph tags */}
      {articleAuthor && <meta property="article:author" content={articleAuthor} />}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
      {articleTags && articleTags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Business Location for SEO */}
      <meta property="business:contact_data:country_name" content="Nigeria" />
      <meta property="business:contact_data:phone_number" content="+2347067129511" />
      <meta property="business:contact_data:website" content="https://kirkidata.com" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} - Kirkidata Services`} />
      <meta name="twitter:creator" content="@kirkidata" />
      <meta name="twitter:site" content="@kirkidata" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="NG" />
      <meta name="geo.placename" content="Nigeria" />
      <meta name="geo.position" content="9.0765;7.3986" />
      <meta name="ICBM" content="9.0765, 7.3986" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="expires" content="never" />
      <meta name="copyright" content="Kirkidata" />
      <meta name="reply-to" content="support@kirkidata.com" />
      <meta name="owner" content="Kirkidata" />
      <meta name="url" content="https://kirkidata.com" />
      <meta name="identifier-URL" content="https://kirkidata.com" />
      <meta name="category" content="Telecommunications, VTU Services, Data Bundles, Airtime" />
      <meta name="coverage" content="Nigeria" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Kirkidata" />
      <meta name="application-name" content="Kirkidata" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Mobile and Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-navbutton-color" content="#3B82F6" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/jpeg" href="/logo.jpg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/logo.jpg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="152x152" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="144x144" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="120x120" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="114x114" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="76x76" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="72x72" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="60x60" href="/logo.jpg" />
      <link rel="apple-touch-icon" sizes="57x57" href="/logo.jpg" />
      
      {/* JSON-LD Schema for Google Knowledge Panel */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* FAQ Structured Data */}
      {faqStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
      
      {/* Product Structured Data */}
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
