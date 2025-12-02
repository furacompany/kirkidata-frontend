import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Phone, Mail, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Privacy Policy | Kirkidata"
        description="Read Kirkidata's Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with NDPR regulations."
        keywords="Kirkidata privacy policy, data protection, NDPR compliance, personal information, data privacy, Nigeria data protection"
        canonicalUrl="https://kirkidata.ng/privacy-policy"
      />
      
      <div className="container mx-auto max-w-4xl py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="p-3 bg-primary/10 rounded-lg mr-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-gray-600 mt-2">NDPR-Compliant • Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">Kirkidata</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">kirkidata@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+234 706 712 9511</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">Kano, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction – Our Promise to You</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Kirkidata, Nigeria's leading recharge platform. We value your trust and understand the responsibility that comes with handling your personal information. Our mission is simple: to provide reliable services for airtime, data, wallet management, and virtual accounts while protecting your data with utmost care.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When you use Kirkidata to buy airtime, purchase data bundles, manage your wallet, or access virtual accounts, you entrust us with sensitive details. This Privacy Policy explains what information we collect, why we collect it, how we use and protect it, and your rights under the Nigeria Data Protection Regulation (NDPR).
              </p>
            </section>

            {/* Legal Framework */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Legal Framework and Our Commitment</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kirkidata complies with the Nigeria Data Protection Regulation (NDPR) 2019, issued by NITDA. This means:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• We collect only necessary data</li>
                <li>• We use your data lawfully, fairly, and transparently</li>
                <li>• We do not sell your data to third parties</li>
                <li>• We secure your data against unauthorized access</li>
                <li>• We respect your rights regarding your personal information</li>
              </ul>
            </section>

            {/* Data Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. What Personal Data We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We only collect data that helps us serve you better. Depending on the service you use, we may collect:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Full Name:</strong> For identification and account management purposes</li>
                <li>• <strong>Email Address:</strong> For account security, communication, and transaction notifications</li>
                <li>• <strong>Phone Number:</strong> Essential for airtime and data purchases, and account verification</li>
                <li>• <strong>Bank Account Details:</strong> For virtual account creation and wallet funding (where applicable)</li>
                <li>• <strong>Payment Information:</strong> We do NOT store your full card information; payment processing is handled by secure third-party processors</li>
                <li>• <strong>Device Information:</strong> For security, fraud detection, and service optimization</li>
                <li>• <strong>Transaction History:</strong> For records, dispute resolution, and account management</li>
                <li>• <strong>Wallet Balance and Virtual Account Details:</strong> For managing your funds and transactions</li>
                <li>• <strong>Location Data:</strong> Collected only when necessary for security or fraud prevention</li>
              </ul>
            </section>

            {/* Why We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Why We Collect Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Your data is collected for these reasons:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• To deliver our services (airtime, data, wallet management, virtual accounts)</li>
                <li>• To process and complete your transactions</li>
                <li>• To improve user experience and personalize offers</li>
                <li>• To comply with financial and regulatory obligations</li>
                <li>• To detect and prevent fraud or unauthorized transactions</li>
                <li>• To communicate important updates (e.g., service changes, security alerts, transaction confirmations)</li>
                <li>• To provide customer support and resolve disputes</li>
                <li>• To maintain account security and prevent unauthorized access</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We will never use your data for anything outside these purposes without your consent.
              </p>
            </section>

            {/* Legal Basis */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Legal Basis for Processing Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under NDPR, the lawful bases we rely on include:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Consent:</strong> You agree to our use of your data by using our services</li>
                <li>• <strong>Contractual Obligation:</strong> We need your data to deliver the services you request (airtime, data, wallet, virtual accounts)</li>
                <li>• <strong>Legal Compliance:</strong> We retain some information to meet financial regulations and legal requirements</li>
                <li>• <strong>Legitimate Interest:</strong> For fraud prevention, security, and service improvement</li>
              </ul>
            </section>

            {/* Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How We Store and Protect Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use industry-standard security measures, including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Data encryption during transmission (HTTPS/TLS)</li>
                <li>• Secure servers with restricted access</li>
                <li>• Regular security audits to prevent breaches</li>
                <li>• Access controls and authentication mechanisms</li>
                <li>• Secure storage of sensitive information</li>
                <li>• Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                If a data breach occurs, we will notify you and the regulator within 72 hours, as required by NDPR.
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sharing Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your data. However, we may share it with:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Payment Processors:</strong> Secure third-party payment providers (e.g., Flutterwave, Paystack) to process transactions</li>
                <li>• <strong>Network Providers:</strong> Telecommunication companies for delivering airtime and data services</li>
                <li>• <strong>Banking Partners:</strong> For virtual account management and wallet services</li>
                <li>• <strong>Regulatory Authorities:</strong> If required by law or for compliance purposes</li>
                <li>• <strong>Service Providers:</strong> Strictly for service delivery (hosting, analytics, customer support tools)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We ensure all partners comply with NDPR standards and maintain strict confidentiality agreements.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights Under NDPR</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the following rights:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                <li>• <strong>Correction:</strong> Fix inaccuracies in your data</li>
                <li>• <strong>Erasure:</strong> Ask us to delete your data when no longer needed (subject to legal requirements)</li>
                <li>• <strong>Withdraw Consent:</strong> Stop us from processing your data (may affect service delivery)</li>
                <li>• <strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                <li>• <strong>Object to Processing:</strong> Object to certain types of data processing</li>
                <li>• <strong>Complaint:</strong> Report violations to NITDA or other relevant authorities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise any of these rights, contact us at kirkidata@gmail.com or through our support channels.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We only keep your data as long as necessary:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• For active accounts: until you close the account or request deletion</li>
                <li>• For transaction records: up to 7 years after the transaction (as required by financial regulations)</li>
                <li>• For legal compliance: as required by applicable laws and regulations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                After this period, we securely delete or anonymize your data.
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website uses cookies and similar technologies to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Improve site functionality and user experience</li>
                <li>• Remember your preferences and login status</li>
                <li>• Analyze usage patterns for better performance</li>
                <li>• Enhance security and prevent fraud</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can disable cookies in your browser settings, though this may affect some site functionality.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Our Data Protection Officer</h2>
              <p className="text-gray-700 mb-4">If you have questions, requests, or complaints about how we handle your data:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Email:</strong> kirkidata@gmail.com</li>
                <li>• <strong>Phone:</strong> +234 706 712 9511</li>
                <li>• <strong>WhatsApp:</strong> +234 706 712 9511</li>
                <li>• <strong>Location:</strong> Kano, Nigeria</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We aim to respond to all data protection inquiries within 30 days.
              </p>
            </section>

            {/* Security Notice */}
            <section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Security Notice</h3>
                <p className="text-blue-800 leading-relaxed">
                  We take your privacy seriously. Our platform uses industry-standard encryption and security measures to protect your personal information. We never store your full payment card details and all sensitive data is encrypted both in transit and at rest. Your wallet and virtual account information are secured with multiple layers of protection.
                </p>
              </div>
            </section>

            {/* Your Rights Summary */}
            <section className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Your Rights Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800">
                  <div>
                    <h4 className="font-medium mb-2">Access & Control</h4>
                    <ul className="text-sm space-y-1">
                      <li>• View your personal data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Delete your data</li>
                      <li>• Export your data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Communication</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Opt out of marketing</li>
                      <li>• Withdraw consent</li>
                      <li>• Object to processing</li>
                      <li>• Report violations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/" className="hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

