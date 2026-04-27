// Issue Categories
export const ISSUE_CATEGORIES = [
  {
    id: 'pothole',
    name: 'Pothole',
    icon: '🕳️',
    color: '#ef4444',
    description: 'Road damage or potholes'
  },
  {
    id: 'streetlight',
    name: 'Streetlight',
    icon: '💡',
    color: '#f59e0b',
    description: 'Broken or malfunctioning streetlights'
  },
  {
    id: 'garbage',
    name: 'Garbage',
    icon: '🗑️',
    color: '#22c55e',
    description: 'Overflowing bins or littering'
  },
  {
    id: 'graffiti',
    name: 'Graffiti',
    icon: '🎨',
    color: '#8b5cf6',
    description: 'Vandalism or graffiti'
  },
  {
    id: 'road_damage',
    name: 'Road Damage',
    icon: '🚧',
    color: '#ec4899',
    description: 'Damaged roads or infrastructure'
  },
  {
    id: 'sidewalk',
    name: 'Sidewalk Issue',
    icon: '🚶',
    color: '#06b6d4',
    description: 'Broken or damaged sidewalks'
  },
  {
    id: 'tree',
    name: 'Tree/Plant',
    icon: '🌳',
    color: '#10b981',
    description: 'Tree trimming or fallen branches'
  },
  {
    id: 'water',
    name: 'Water Issue',
    icon: '💧',
    color: '#3b82f6',
    description: 'Water leaks or drainage problems'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📋',
    color: '#6b7280',
    description: 'Other city issues'
  }
];

// Issue Status
export const ISSUE_STATUS = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const STATUS_CONFIG = {
  [ISSUE_STATUS.OPEN]: {
    label: 'Open',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: '🔴'
  },
  [ISSUE_STATUS.ASSIGNED]: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: '🔵'
  },
  [ISSUE_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: '🟡'
  },
  [ISSUE_STATUS.RESOLVED]: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: '🟢'
  },
  [ISSUE_STATUS.CLOSED]: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    icon: '⚫'
  }
};

// Urgency Levels
export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const URGENCY_CONFIG = {
  [URGENCY_LEVELS.LOW]: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  },
  [URGENCY_LEVELS.MEDIUM]: {
    label: 'Medium',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  [URGENCY_LEVELS.HIGH]: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  },
  [URGENCY_LEVELS.CRITICAL]: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: [
    parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 40.7128,
    parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG) || -74.0060
  ],
  defaultZoom: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 13,
  maxZoom: 18,
  minZoom: 3,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileLayerAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Date formatting helper
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Get category by ID
export const getCategoryById = (id) => {
  return ISSUE_CATEGORIES.find(cat => cat.id === id) || ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1];
};

// Image compression options
export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg'
};
