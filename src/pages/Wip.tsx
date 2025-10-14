import { AppIcon } from '@/shared/icons';
import { motion } from 'framer-motion';

export default function WIPPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="text-center max-w-md">
        {/* Simple Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <AppIcon name="construction" className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        {/* Minimal Content */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-text mb-2">Work in Progress</h1>
          <p className="text-text-light mb-6">
            This page is currently under development. Stay tuned for updates.
          </p>
          
          {/* Simple Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="px-6 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <AppIcon name="arrow-left" className="w-4 h-4 inline mr-2" />
            Go Back
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}