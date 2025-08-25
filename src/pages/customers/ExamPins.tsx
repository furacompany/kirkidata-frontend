import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const ExamPins: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Exam Pins</h1>
            <p className="text-gray-600">Purchase exam pins for various examinations</p>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon!
            </CardTitle>
            <p className="text-gray-600">
              We're working hard to bring you exam pin services. 
              Stay tuned for updates!
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Coming:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Purchase WAEC, NECO, and other exam pins</li>
                <li>• Instant pin delivery</li>
                <li>• Multiple exam types</li>
                <li>• Secure payment options</li>
                <li>• Pin verification and support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ExamPins
