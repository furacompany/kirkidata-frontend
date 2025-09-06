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
  title = "Kirkidata | Buy Cheap Data, Airtime, TV Subscription & Electricity Bill Payment",
  description = "Kirkidata offers affordable and instant data bundles, airtime top-ups, cable TV subscriptions, and electricity bill payments in Nigeria. Fast, reliable, and secure VTU services.",
  keywords = "kirkidata, cheap data, data bundles, airtime top-up, TV subscription, DSTV, GOTV, Startimes, electricity bill payment, VTU Nigeria",
  canonicalUrl = "https://kirkidata.com/",
  ogImage = "https://kirkidata.com/logo.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noIndex = false,
  articleAuthor,
  breadcrumbs,
  faqData,
  productData
}) => {
  // Enhanced structured data for Kirkidata
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kirkidata",
    "url": "https://kirkidata.com",
    "logo": "https://kirkidata.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+234-703-555-4333",
      "contactType": "customer service",
      "areaServed": "NG",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.facebook.com/kirkidata",
      "https://www.twitter.com/kirkidata"
    ]
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
      <meta name="author" content={articleAuthor || "Kirkidata Technologies"} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph (Facebook & WhatsApp) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      {/* Web App Manifest for Install Prompt */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* JSON-LD Schema for Google Rich Results */}
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