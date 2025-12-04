import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Shield, FileText, Phone, Mail, MapPin, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const AccountDeletionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Account Deletion | Kirkidata"
        description="Learn how to delete your Kirkidata account. Follow simple steps to request account deletion, which will be processed within 90 days."
        keywords="Kirkidata account deletion, delete account, close account, account removal, data deletion"
        canonicalUrl="https://kirkidata.ng/account-deletion"
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
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Account Deletion
              </h1>
              <p className="text-gray-600 mt-2">How to delete your Kirkidata account</p>
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

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Important: Account Deletion Process</h3>
              <p className="text-red-800 leading-relaxed">
                When you request account deletion, your account will be scheduled for deletion and will be permanently removed after 90 days. 
                During this period, your account will be deactivated and you won't be able to access it. You can contact our support team 
                within 90 days to cancel the deletion request.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Kirkidata, we understand that you may want to delete your account for various reasons. We've made the process simple and transparent. 
                This page explains how to delete your account and what happens during the deletion process.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please note that account deletion is permanent and cannot be undone after the 90-day grace period. We recommend reviewing your account 
                and downloading any important information before proceeding with deletion.
              </p>
            </section>

            {/* Steps */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Delete Your Account</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Follow these simple steps to delete your Kirkidata account:
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Log in to Your Account</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Visit <Link to="/login" className="text-primary hover:underline">kirkidata.ng/login</Link> and log in with your email and password.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Navigate to Your Profile</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Once logged in, click on "Profile" in the navigation menu or dashboard sidebar to access your profile settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Click "Delete Account" Button</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Scroll down to the bottom of your profile page and click the "Delete Account" button. You'll see a confirmation modal explaining 
                      the deletion process.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Review the information in the confirmation modal. If you're sure you want to proceed, confirm the deletion. 
                      Your account will be scheduled for deletion and will be permanently removed after 90 days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What Happens Next */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens After You Request Deletion?</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">90-Day Grace Period</h3>
                    <p className="text-blue-800 text-sm">
                      Your account will be deactivated immediately, but permanent deletion will occur after 90 days. 
                      During this period, you can contact our support team to cancel the deletion if you change your mind.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Immediate:</strong> Your account will be deactivated and you won't be able to log in or use our services.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Within 24 hours:</strong> All pending transactions will be cancelled, and your wallet will be locked.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>After 90 days:</strong> Your account and all associated data will be permanently deleted from our systems.</p>
                </div>
              </div>
            </section>

            {/* Important Considerations */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Considerations</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Before You Delete Your Account:</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Download or save any important transaction receipts or data you may need</li>
                  <li>• Withdraw any remaining funds from your wallet (if applicable)</li>
                  <li>• Cancel any pending transactions or subscriptions</li>
                  <li>• Note that you won't be able to recover your account after the 90-day period</li>
                  <li>• Your transaction history and account data will be permanently lost</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention and Deletion</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In compliance with Nigerian Data Protection Regulation (NDPR) and financial regulations, we may retain certain information for legal 
                and regulatory purposes even after account deletion:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Transaction records may be retained for up to 7 years as required by financial regulations</li>
                <li>• Personal identification information may be retained for fraud prevention and legal compliance</li>
                <li>• Some anonymized data may be retained for analytical purposes</li>
              </ul>
            </section>

            {/* Canceling Deletion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Can You Cancel Account Deletion?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Yes! If you change your mind within 90 days of requesting account deletion, you can contact our support team to cancel the deletion request. 
                Your account will be reactivated, and you can continue using our services.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">To Cancel Deletion:</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Contact our support team via email: <a href="mailto:kirkidata@gmail.com" className="underline">kirkidata@gmail.com</a></li>
                  <li>• Call us at: <a href="tel:+2347067129511" className="underline">+234 706 712 9511</a></li>
                  <li>• Provide your account email or phone number for verification</li>
                  <li>• Our team will assist you in reactivating your account</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about account deletion or need assistance, our support team is here to help:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Email:</strong> <a href="mailto:kirkidata@gmail.com" className="text-primary hover:underline">kirkidata@gmail.com</a></li>
                <li>• <strong>Phone:</strong> <a href="tel:+2347067129511" className="text-primary hover:underline">+234 706 712 9511</a></li>
                <li>• <strong>WhatsApp:</strong> <a href="https://wa.me/2347067129511" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+234 706 712 9511</a></li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
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

export default AccountDeletionPage;

