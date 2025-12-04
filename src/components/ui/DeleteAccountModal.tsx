import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertTriangle, X, Clock } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen) return null

  // Calculate the deletion date (90 days from now)
  const deletionDate = new Date()
  deletionDate.setDate(deletionDate.getDate() + 90)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-6 relative">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Delete Account</CardTitle>
              <CardDescription className="text-gray-600">
                This action cannot be undone
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Warning: Permanent Action</p>
                    <p>Your account will be scheduled for deletion and permanently removed after 90 days.</p>
                  </div>
                </div>
              </div>

              {/* Deletion Timeline */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Account Deletion Timeline</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Your account will be deactivated immediately</li>
                      <li>Permanent deletion will occur on: <strong>{deletionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></li>
                      <li>You can contact support within 90 days to cancel</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* What Will Happen */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">What will happen:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>You won't be able to log in to your account</li>
                  <li>All services will be immediately unavailable</li>
                  <li>Your wallet will be locked (withdraw funds first if needed)</li>
                  <li>All your data will be permanently deleted after 90 days</li>
                  <li>Transaction history will be permanently removed</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-md"
                  onClick={onConfirm}
                  loading={isDeleting}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </div>

              {/* Help Link */}
              <div className="text-center pt-2">
                <a
                  href="/account-deletion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Learn more about account deletion
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DeleteAccountModal

