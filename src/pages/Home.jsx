import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import IssueList from '../components/issues/IssueList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import apiService from '../services/api';
import { ISSUE_CATEGORIES, ISSUE_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

/**
 * Home page with map view and issue filters
 */
const Home = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('map'); // 'map' or 'list'
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [issues, selectedCategory, selectedStatus]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await apiService.getIssues();
      setIssues(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    setFilteredIssues(filtered);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-civic-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏙️ Make Your City Better
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Report issues, track progress, and help improve your community
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/report')}
            icon={<span>📝</span>}
          >
            Report an Issue
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle & Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={view === 'map' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('map')}
                icon={<span>🗺️</span>}
              >
                Map View
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                icon={<span>📋</span>}
              >
                List View
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Categories</option>
                {ISSUE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Status</option>
                <option value={ISSUE_STATUS.OPEN}>Open</option>
                <option value={ISSUE_STATUS.ASSIGNED}>Assigned</option>
                <option value={ISSUE_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={ISSUE_STATUS.RESOLVED}>Resolved</option>
              </select>

              {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing <strong>{filteredIssues.length}</strong> of <strong>{issues.length}</strong> issues
          </div>
        </Card>

        {/* Map or List View */}
        {view === 'map' ? (
          <div className="mb-6">
            {loading ? (
              <Card padding="none">
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading issues...</p>
                  </div>
                </div>
              </Card>
            ) : error ? (
              <Card padding="md">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Error Loading Map
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <Button onClick={fetchIssues}>Try Again</Button>
                </div>
              </Card>
            ) : (
              <MapView
                issues={filteredIssues}
                height="600px"
              />
            )}
          </div>
        ) : (
          <IssueList
            issues={filteredIssues}
            loading={loading}
            error={error}
            emptyMessage="No issues found matching your filters"
          />
        )}

        {/* Mobile: Switch to list view hint */}
        {view === 'map' && !loading && (
          <div className="lg:hidden mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('list')}
            >
              Switch to List View for Mobile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
