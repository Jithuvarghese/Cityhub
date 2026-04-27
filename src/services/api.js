import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const MOCK_ISSUES = [
  {
    id: 1,
    title: 'Large pothole on Main Street',
    description: 'There is a large pothole causing traffic issues near the intersection.',
    category: 'pothole',
    status: 'open',
    urgency: 'high',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: '123 Main St, New York, NY 10001'
    },
    photos: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800'
    ],
    reportedBy: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    reportedAt: '2025-11-15T10:30:00Z',
    supporters: 24,
    comments: [
      {
        id: 1,
        author: 'City Works Department',
        content: 'We have received your report and will investigate shortly.',
        createdAt: '2025-11-15T14:00:00Z',
        isOfficial: true
      }
    ]
  },
  {
    id: 2,
    title: 'Streetlight not working',
    description: 'The streetlight has been out for several days, making the area unsafe at night.',
    category: 'streetlight',
    status: 'in_progress',
    urgency: 'medium',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: '456 Park Ave, New York, NY 10022'
    },
    photos: [
      'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800'
    ],
    reportedBy: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    reportedAt: '2025-11-14T08:15:00Z',
    supporters: 12,
    comments: [
      {
        id: 2,
        author: 'Electrical Department',
        content: 'Technician assigned. Will be fixed by end of week.',
        createdAt: '2025-11-16T09:00:00Z',
        isOfficial: true
      }
    ]
  },
  {
    id: 3,
    title: 'Overflowing garbage bin',
    description: 'The public garbage bin is overflowing and attracting pests.',
    category: 'garbage',
    status: 'resolved',
    urgency: 'medium',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: '789 Central Park West, New York, NY 10024'
    },
    photos: [
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800'
    ],
    reportedBy: {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    reportedAt: '2025-11-13T16:45:00Z',
    supporters: 8,
    comments: [
      {
        id: 3,
        author: 'Sanitation Department',
        content: 'Bin has been emptied. Thank you for reporting.',
        createdAt: '2025-11-14T11:30:00Z',
        isOfficial: true
      }
    ]
  },
  {
    id: 4,
    title: 'Graffiti on public building',
    description: 'Vandalism on the side of the community center.',
    category: 'graffiti',
    status: 'assigned',
    urgency: 'low',
    location: {
      lat: 40.7282,
      lng: -73.9942,
      address: '321 Broadway, New York, NY 10007'
    },
    photos: [
      'https://images.unsplash.com/photo-1611290198300-0f13f944f7e1?w=800'
    ],
    reportedBy: {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com'
    },
    reportedAt: '2025-11-12T13:20:00Z',
    supporters: 5,
    comments: []
  },
  {
    id: 5,
    title: 'Broken sidewalk',
    description: 'Cracked and uneven sidewalk poses tripping hazard.',
    category: 'sidewalk',
    status: 'open',
    urgency: 'high',
    location: {
      lat: 40.7420,
      lng: -73.9898,
      address: '555 5th Ave, New York, NY 10017'
    },
    photos: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'
    ],
    reportedBy: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    },
    reportedAt: '2025-11-17T09:00:00Z',
    supporters: 18,
    comments: []
  }
];

// Mock user for development
const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
};

// API Service Functions
const apiService = {
  // Issues
  getIssues: async (params = {}) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredIssues = [...MOCK_ISSUES];
    
    if (params.category) {
      filteredIssues = filteredIssues.filter(issue => issue.category === params.category);
    }
    
    if (params.status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === params.status);
    }
    
    if (params.userId) {
      filteredIssues = filteredIssues.filter(issue => issue.reportedBy.id === params.userId);
    }
    
    return { data: filteredIssues };
  },

  getIssueById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const issue = MOCK_ISSUES.find(i => i.id === parseInt(id));
    if (!issue) throw new Error('Issue not found');
    return { data: issue };
  },

  createIssue: async (issueData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newIssue = {
      id: MOCK_ISSUES.length + 1,
      ...issueData,
      status: 'open',
      reportedAt: new Date().toISOString(),
      supporters: 0,
      comments: [],
      reportedBy: MOCK_USER
    };
    MOCK_ISSUES.unshift(newIssue);
    return { data: newIssue };
  },

  supportIssue: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const issue = MOCK_ISSUES.find(i => i.id === parseInt(id));
    if (issue) {
      issue.supporters += 1;
    }
    return { data: issue };
  },

  addComment: async (issueId, comment) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issue = MOCK_ISSUES.find(i => i.id === parseInt(issueId));
    if (issue) {
      const newComment = {
        id: issue.comments.length + 1,
        author: MOCK_USER.name,
        content: comment,
        createdAt: new Date().toISOString(),
        isOfficial: false
      };
      issue.comments.push(newComment);
      return { data: newComment };
    }
    throw new Error('Issue not found');
  },

  // Authentication
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock login - accept any credentials
    const token = 'mock-jwt-token-' + Date.now();
    return { 
      data: { 
        token, 
        user: MOCK_USER 
      } 
    };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const token = 'mock-jwt-token-' + Date.now();
    const user = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`
    };
    return { 
      data: { 
        token, 
        user 
      } 
    };
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: MOCK_USER };
  },

  // Upload images (mock)
  uploadImages: async (files) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Return mock URLs
    return {
      data: files.map((_, index) => ({
        url: `https://images.unsplash.com/photo-${1600000000000 + index}?w=800`
      }))
    };
  }
};

export default apiService;
export { api };
