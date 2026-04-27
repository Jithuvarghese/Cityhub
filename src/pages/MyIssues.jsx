import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IssueList from '../components/issues/IssueList';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import apiService from '../services/api';
import { ISSUE_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';

/**
 * My Issues page - shows user's reported issues
 */
const MyIssues = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyIssues();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    applyFilters();
  }, [issues, statusFilter]);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      const response = await apiService.getIssues({ userId: user.id });
      setIssues(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching my issues:', err);
      setError('Failed to load your issues');
      toast.error('Failed to load your issues');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (statusFilter === 'all') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === statusFilter));
    }
  };

  // Calculate statistics
  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === ISSUE_STATUS.OPEN).length,
    inProgress: issues.filter(i => i.status === ISSUE_STATUS.IN_PROGRESS).length,
    resolved: issues.filter(i => i.status === ISSUE_STATUS.RESOLVED).length
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Reported Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the status of issues you've reported
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Issues</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {stats.open}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {stats.inProgress}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </Card>
          
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.resolved}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Resolved</div>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Status</option>
                <option value={ISSUE_STATUS.OPEN}>Open</option>
                <option value={ISSUE_STATUS.ASSIGNED}>Assigned</option>
                <option value={ISSUE_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={ISSUE_STATUS.RESOLVED}>Resolved</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/report')}
              icon={<span>📝</span>}
            >
              Report New Issue
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing <strong>{filteredIssues.length}</strong> of <strong>{issues.length}</strong> issues
          </div>
        </Card>

        {/* Issues List */}
        <IssueList
          issues={filteredIssues}
          loading={loading}
          error={error}
          emptyMessage="You haven't reported any issues yet"
        />
      </div>
    </div>
  );
};

export default MyIssues;
