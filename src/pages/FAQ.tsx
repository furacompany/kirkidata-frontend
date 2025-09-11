import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import SEO from '../components/SEO'

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = React.useState<number[]>([])

  const faqs = [
    {
      question: "What is Kirkidata?",
      answer: "Kirkidata is Nigeria's leading recharge platform that provides instant data bundles, airtime top-ups, TV subscriptions, and electricity bill payments. We offer fast, secure, and reliable VTU services for all Nigerian networks including MTN, Airtel, Glo, and 9mobile."
    },
    {
      question: "How do I buy data or airtime on Kirkidata?",
      answer: "Simply register for an account, fund your wallet using any of our payment methods (cards, bank transfer, USSD, or virtual accounts), then select your preferred network and data plan. Your data or airtime will be delivered instantly to your phone number."
    },
    {
      question: "Which networks do you support?",
      answer: "We support all major Nigerian networks including MTN, Airtel, Glo, and 9mobile. You can buy data bundles and airtime for any of these networks through our platform."
    },
    {
      question: "How do I fund my wallet?",
      answer: "You can fund your wallet using multiple payment methods including debit/credit cards, bank transfers, USSD codes, or virtual accounts. All payment methods are secure and processed instantly."
    },
    {
      question: "Is Kirkidata safe and secure?",
      answer: "Yes, Kirkidata uses bank-grade security and encryption to protect your transactions. We are a trusted platform with over 50,000 satisfied customers and maintain 99.9% uptime."
    },
    {
      question: "How long does it take to receive my data or airtime?",
      answer: "Data and airtime are delivered instantly to your phone number. In rare cases where there might be a delay, our support team is available 24/7 to assist you."
    },
    {
      question: "Can I buy TV subscriptions on Kirkidata?",
      answer: "Yes, you can buy TV subscriptions for DSTV, GOTV, and Startimes directly on our platform. Simply select your preferred provider and package, and your subscription will be activated instantly."
    },
    {
      question: "Do you offer electricity bill payments?",
      answer: "Yes, you can pay electricity bills for all major distribution companies in Nigeria including EKEDC, IKEDC, AEDC, and others. Just enter your meter number and make payment."
    },
    {
      question: "What if I have issues with my transaction?",
      answer: "Our customer support team is available 24/7 to help with any issues. You can contact us via WhatsApp (+234-706-712-9511), email (kirkidata@gmail.com), or through our live chat feature."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No, there are no hidden charges on Kirkidata. The price you see is exactly what you pay. We believe in transparent pricing and always show the total cost upfront."
    },
    {
      question: "Can I track my transaction history?",
      answer: "Yes, you can view all your transaction history in your dashboard. This includes all data purchases, airtime top-ups, TV subscriptions, and electricity bill payments with detailed receipts."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide 24/7 customer support through multiple channels including WhatsApp, email, phone calls, and live chat. Our support team is always ready to help you with any questions or issues."
    }
  ]

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="FAQ - Frequently Asked Questions | Kirkidata"
        description="Find answers to common questions about Kirkidata's data bundles, airtime top-ups, TV subscriptions, and electricity bill payment services in Nigeria."
        keywords="Kirkidata FAQ, data bundles questions, airtime recharge help, TV subscription support, electricity bill payment FAQ, Nigeria VTU services"
        canonicalUrl="https://kirkidata.ng/faq"
        faqData={faqs}
      />
      
      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services. Can't find what you're looking for? 
            Contact our support team for personalized assistance.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center bg-primary rounded-lg p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-lg mb-6 opacity-90">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2347067129511"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              WhatsApp Support
            </a>
            <a
              href="mailto:kirkidata@gmail.com"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQ
