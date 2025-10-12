// ToolCard.tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import type { Tool } from '../config/tools';
import { random } from '../utils/color-utils';
import { DynamicIcon } from 'lucide-react/dynamic';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const cardColor = random.color();
  const iconGradient = random.deepColor({ c: cardColor });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/tools/${tool.id}`} className="tool-card-link">
        <div
          className="tool-card"
          style={{
            background: cardColor,
          }}
        >
          <div className="tool-card-header">
            <div
              className="tool-icon-container"
              style={{
                background: iconGradient,
              }}
            >
              <DynamicIcon name={tool.icon} className="tool-icon" />
              {/* <Icon className="tool-icon" /> */}
            </div>
            <div className="tool-info">
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

