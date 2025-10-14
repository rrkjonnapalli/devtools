// src/config/tools.ts

import { icons } from '@/shared/icons';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof icons;
  path: string;
  category: string;
  page?: string;
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data with syntax highlighting',
    icon: 'braces',
    path: '/json-formatter',
    category: 'Development',
    page: 'JsonFormatter'
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    description: 'Compare two JSON objects and highlight differences',
    icon: 'braces',
    path: '/json-diff',
    category: 'Development',
    page: 'JsonDiff'
  },
  {
    id: 'duration',
    name: 'Duration',
    description: 'Calculate difference between two dates or times',
    icon: 'calendar-off',
    path: '/duration',
    category: 'Utilities',
    page: 'Duration'
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installments for loans',
    icon: 'calculator',
    path: '/emi-calculator',
    category: 'Finance',
    page: 'EMI'
  },
  {
    id: 'template',
    name: 'Template',
    description: 'Populate template with JSON data',
    icon: 'file-text',
    path: '/template',
    category: 'Development',
    page: 'Template'
  },
  {
    id: 'tz',
    name: 'Timezones',
    description: 'Convert times between different time zones',
    icon: 'globe',
    path: '/tz',
    category: 'Utilities',
    page: 'Wip'
  },
  // {
  //   id: 'currency-converter',
  //   name: 'Currency Converter',
  //   description: 'Convert between different currencies',
  //   icon: 'dollar-sign',
  //   path: '/currency-converter',
  //   category: 'Finance',
  //   page: 'Wip'
  // },
  // {
  //   id: 'length-converter',
  //   name: 'Length Converter',
  //   description: 'Convert between different length units',
  //   icon: 'ruler',
  //   path: '/length-converter',
  //   category: 'Converters',
  //   page: 'Wip'
  // },
  // {
  //   id: 'weight-converter',
  //   name: 'Weight Converter',
  //   description: 'Convert between different weight units',
  //   icon: 'scale',
  //   path: '/weight-converter',
  //   category: 'Converters',
  //   page: 'Wip'
  // },
  // {
  //   id: 'memory-converter',
  //   name: 'Memory Converter',
  //   description: 'Convert between different digital storage units',
  //   icon: 'memory-stick',
  //   path: '/memory-converter',
  //   category: 'Converters',
  //   page: 'Wip'
  // }
];