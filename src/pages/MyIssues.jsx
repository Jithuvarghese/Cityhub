import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IssueList from '../components/issues/IssueList';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import apiService from '../services/api';
import { ISSUE_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';
import { ClipboardList, Clock3, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <ClipboardList className="h-4 w-4 text-civic-300" />
              My reported issues
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Track every report you’ve made.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Review progress, compare status changes, and jump back into the issues that need attention.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/report')}
            icon={<Sparkles className="h-4 w-4" />}
          >
            Report New Issue
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <Card padding="md" className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total issues</div>
          </Card>

          <Card padding="md" className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.open}</div>
            <div className="text-sm text-slate-400">Open</div>
          </Card>

          <Card padding="md" className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.inProgress}</div>
            <div className="text-sm text-slate-400">In progress</div>
          </Card>

          <Card padding="md" className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{stats.resolved}</div>
            <div className="text-sm text-slate-400">Resolved</div>
          </Card>
        </div>

        <Card padding="md" className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-100 outline-none"
              >
                <option value="all" className="bg-slate-900">All Status</option>
                <option value={ISSUE_STATUS.OPEN} className="bg-slate-900">Open</option>
                <option value={ISSUE_STATUS.ASSIGNED} className="bg-slate-900">Assigned</option>
                <option value={ISSUE_STATUS.IN_PROGRESS} className="bg-slate-900">In Progress</option>
                <option value={ISSUE_STATUS.RESOLVED} className="bg-slate-900">Resolved</option>
              </select>
            </div>

            <div className="text-sm text-slate-400">
              Showing <strong className="text-white">{filteredIssues.length}</strong> of <strong className="text-white">{issues.length}</strong> issues
            </div>
          </div>
        </Card>

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
