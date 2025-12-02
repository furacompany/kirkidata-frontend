import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Phone, Mail, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Terms and Conditions | Kirkidata"
        description="Read Kirkidata's Terms and Conditions. Learn about our services, user responsibilities, and policies for wallet, virtual accounts, airtime, and data purchases."
        keywords="Kirkidata terms and conditions, terms of service, user agreement, legal terms, Nigeria VTU services"
        canonicalUrl="https://kirkidata.ng/terms-and-conditions"
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Terms and Conditions
              </h1>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
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

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Welcome Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kirkidata</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Thank you for choosing Kirkidata, Nigeria's leading recharge platform. We provide instant and reliable services for purchasing airtime, data bundles, managing wallets, and accessing virtual accounts. These Terms and Conditions (the "Terms") outline what you can expect from us, what we expect from you, and how we handle our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By creating an account, using our website, or completing a transaction on Kirkidata, you agree to be bound by these Terms and any policies we reference here, such as our Privacy Policy. If you disagree with any part of these Terms, you should not use our Service.
              </p>
            </section>

            {/* Key Sections */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Terms</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>"Account"</strong> means your registered user profile on Kirkidata.</li>
                <li><strong>"Service"</strong> means any feature we provide, including airtime and data purchases, wallet management, virtual accounts, and related support services.</li>
                <li><strong>"User", "you", or "your"</strong> means anyone who visits, registers, or uses Kirkidata.</li>
                <li><strong>"We", "us", or "our"</strong> means Kirkidata and its operators.</li>
                <li><strong>"Wallet"</strong> means the stored-value balance within your Kirkidata account that can be used to purchase services.</li>
                <li><strong>"Virtual Account"</strong> means the unique bank account number assigned to your account for receiving payments and managing funds.</li>
              </ul>
            </section>

            {/* Eligibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility and Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use paid services on Kirkidata, you must be at least 18 years old and capable of entering into a binding contract under Nigerian law. If you are younger than 18, you may use Kirkidata only with verifiable parental or guardian consent.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to use the Service lawfully and responsibly. You will not misuse Kirkidata to commit fraud, launder money, harm other users, or interfere with our systems. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scope of Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kirkidata provides a unified platform for purchasing and managing digital services. Our current services include:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• <strong>Airtime Recharge:</strong> Instant airtime top-up for major Nigerian networks (MTN, Airtel, Glo, 9mobile)</li>
                <li>• <strong>Mobile Data Bundles:</strong> Affordable data plans and renewals for all supported networks</li>
                <li>• <strong>Wallet Services:</strong> Secure wallet management for storing and managing funds</li>
                <li>• <strong>Virtual Accounts:</strong> Unique bank account numbers for receiving payments and managing transactions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice to users.
              </p>
            </section>

            {/* Account Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Security</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Important: Kirkidata will never ask for your password, PIN, or transaction details by phone, SMS, WhatsApp, or email. If anyone does, it is a scam. Report such attempts immediately.
                </p>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Choose a strong password and keep your account credentials secure</li>
                <li>• Do not share your account credentials with anyone</li>
                <li>• Report unauthorized access or suspicious activity immediately</li>
                <li>• Keep your contact information and email address current</li>
                <li>• Enable two-factor authentication if available</li>
                <li>• You are responsible for all transactions made from your account</li>
              </ul>
            </section>

            {/* Payments */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments and Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All transactions on Kirkidata are prepaid. We accept payments through various methods including debit/credit cards, bank transfers, USSD codes, and virtual accounts. Prices for services are displayed in Nigerian Naira (₦) and are subject to change without prior notice.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds are only processed when value was not delivered due to a system error on our part, and the failure is confirmed. If value was delivered to the phone number or details you provided, we cannot provide a refund—even if you entered incorrect information. Refund requests must be submitted within 24 hours of the transaction.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Refunds are typically processed within 24–72 hours after confirmation; bank settlements may vary depending on your payment method.
              </p>
            </section>

            {/* Wallet and Virtual Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet and Virtual Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your Kirkidata wallet allows you to store funds securely for future transactions. Virtual accounts are unique bank account numbers assigned to your account for receiving payments and managing funds.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Wallet funds do not expire and can be used at any time for services</li>
                <li>• Virtual accounts are linked to your Kirkidata account and cannot be transferred</li>
                <li>• You are responsible for verifying account details before making transfers to virtual accounts</li>
                <li>• We reserve the right to review and verify wallet transactions for security purposes</li>
                <li>• Withdrawal of wallet funds is subject to our withdrawal policies and applicable fees</li>
              </ul>
            </section>

            {/* Prohibited Uses */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree not to use Kirkidata for any unlawful or prohibited purpose. Prohibited activities include:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Submitting false information or impersonating others</li>
                <li>• Using stolen cards, accounts, or identities</li>
                <li>• Attempting to hack, scrape, or reverse engineer the platform</li>
                <li>• Harassing support staff or other users</li>
                <li>• Using Kirkidata to facilitate illegal activities or money laundering</li>
                <li>• Creating multiple accounts to circumvent system limits or restrictions</li>
                <li>• Manipulating transaction prices or exploiting system vulnerabilities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Violation of these terms may result in immediate account suspension or termination without refund.
              </p>
            </section>

            {/* Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We respect your privacy and are committed to protecting your personal information. Our processing of personal data complies with the Nigerian Data Protection Regulation (NDPR). Please read our Privacy Policy for comprehensive details on how we collect, use, and protect your data.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• We collect only what we need to provide and improve the Service</li>
                <li>• We do not sell your personal data to third parties</li>
                <li>• We use technical and organizational measures to keep your data secure</li>
                <li>• You can request access, correction, deletion, or withdrawal of consent</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kirkidata provides services on an "as is" basis. While we strive to ensure service availability and reliability, we do not guarantee uninterrupted or error-free service. We are not liable for:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Service interruptions due to network issues, maintenance, or circumstances beyond our control</li>
                <li>• Losses resulting from user error, incorrect information, or unauthorized account access</li>
                <li>• Indirect, incidental, or consequential damages arising from use of our services</li>
                <li>• Issues with third-party payment processors or network providers</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact and Support</h2>
              <p className="text-gray-700 mb-4">If you need help, have questions, or want to report an issue, reach out to us:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Website:</strong> https://kirkidata.ng</li>
                <li>• <strong>Email:</strong> kirkidata@gmail.com</li>
                <li>• <strong>Phone:</strong> +234 706 712 9511</li>
                <li>• <strong>WhatsApp:</strong> +234 706 712 9511</li>
                <li>• <strong>Location:</strong> Kano, Nigeria</li>
              </ul>
            </section>

            {/* Version */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Version and Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms were last updated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. We may update these Terms to reflect new services, safety improvements, or legal requirements. We will post updates on our website and, where significant, notify you by email or in-app notice. Continued use of our Service after changes constitutes acceptance of the updated Terms.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
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

export default TermsAndConditionsPage;
