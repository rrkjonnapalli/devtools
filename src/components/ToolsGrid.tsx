// Updated ToolsGrid.tsx with proper styling
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ToolCard from './ToolCard';
import { tools } from '../config/tools';
// import ThemeToggle from '@shared/Theme/ThemeToggle';

export default function ToolsGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="tools-container">
      {/* Header */}
      <div className="tools-header">
        <div className="header-flex-container">
          <div className="header-spacer"></div> {/* Empty spacer for balance */}
          <div className="header-text-center">
            <h1 className="tools-title">Developer Tools</h1>
            <p className="tools-subtitle">
              A collection of powerful utilities for developers and professionals
            </p>
          </div>
          {/* <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div> */}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-container">
            <Search className="search-icon" size={24} />
            <input
              type="text"
              placeholder="Search for tools... (e.g., JSON, converter, date)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="results-count">
          Found {filteredTools.length} of {tools.length} tools
        </div>
      </div>

      {/* Tools Grid */}
      <div className="tools-grid">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, ix) => (
            <ToolCard key={tool.id} index={ix} tool={tool} />
          ))
        ) : (
          <div className="no-results">
            <h3 className="no-results-title">No tools found</h3>
            <p>Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
}