import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AppIcon } from '@/shared/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md">
        {/* Icon with subtle animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <AppIcon 
              name="compass" 
              className="w-12 h-12 text-primary" 
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-text mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text mb-4">
            Page Not Found
          </h2>
          <p className="text-text-light mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <AppIcon name="home" className="w-4 h-4 inline mr-2" />
                Back to Home
              </motion.button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-border text-text rounded-lg font-medium hover:bg-alt transition-colors"
            >
              <AppIcon name="arrow-left" className="w-4 h-4 inline mr-2" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Optional: Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 pt-6 border-t border-border"
        >
          <p className="text-text-light text-sm mb-4">Quick Links</p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/tools" 
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              Tools
            </Link>
            <Link 
              to="/about" 
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              About
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}