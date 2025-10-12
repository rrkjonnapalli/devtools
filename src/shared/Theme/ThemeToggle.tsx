// src/components/ThemeToggle.tsx
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle-inner">
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'light' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <Moon size={20} className="theme-icon" />
          ) : (
            <Sun size={20} className="theme-icon" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}