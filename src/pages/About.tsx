import { AppIcon, icons } from '@/shared/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

type Feature = {
  icon: keyof typeof icons;
  title: string;
  description: string;
};

export default function AboutPage() {
  const navigate = useNavigate();
  const features: Feature[] = [
    {
      icon: 'code',
      title: 'Developer First',
      description: 'Built by developers, for developers. Every tool is designed with your workflow in mind.'
    },
    {
      icon: 'zap',
      title: 'Fast & Efficient',
      description: 'No unnecessary bloat. Tools that load quickly and perform instantly in your browser.'
    },
    {
      icon: 'shield',
      title: 'Privacy Focused',
      description: 'Your data stays on your device. No server processing, no data collection, no tracking.'
    },
    {
      icon: 'sparkles',
      title: 'Always Evolving',
      description: 'Regular updates with new tools and improvements based on community feedback.'
    }
  ];

  const stats = [
    // { number: '15+', label: 'Developer Tools' },
    { number: '100%', label: 'Client-Side' },
    { number: '0', label: 'Data Collected' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-text mb-4">About DevTools</h1>
        <p className="text-xl text-text-light max-w-2xl mx-auto leading-relaxed">
          A comprehensive collection of powerful utilities designed to streamline
          your development workflow and boost productivity.
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card bg-alt p-8 mb-12 text-center"
      >
        <AppIcon name="target" className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-text mb-4">Our Mission</h2>
        <p className="text-text-light text-lg leading-relaxed max-w-3xl mx-auto">
          To provide developers with a fast, reliable, and privacy-focused toolkit that
          eliminates the need for multiple online services. We believe in building tools
          that respect your privacy and work exactly how you expect them to.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-text text-center mb-12">Why Choose Our Tools?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AppIcon name={feature.icon} className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-text-light leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-row justify-around gap-8 mb-16"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-text mb-2">{stat.number}</div>
            <div className="text-text-light text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Technology & Principles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid md:grid-cols-2 gap-12"
      >
        <div>
          <h3 className="text-2xl font-semibold text-text mb-6">Built With Modern Tech</h3>
          <div className="space-y-4">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
              <div key={tech} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-text">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-text mb-6">Our Principles</h3>
          <div className="space-y-4">
            {[
              'No user tracking or data collection',
              'All processing happens in your browser',
              'Open source and transparent',
              'Regular updates and new features'
            ].map((principle) => (
              <div key={principle} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-text">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-16 pt-8 border-t border-border"
      >
        <h3 className="text-2xl font-semibold text-text mb-4">Ready to Boost Your Productivity?</h3>
        <p className="text-text-light mb-6">
          Explore our collection of developer tools and find your new favorites.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tools')}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <AppIcon name="rocket" className="w-5 h-5 inline mr-2" />
          Explore Tools
        </motion.button>
      </motion.div>
    </div>
  );
}