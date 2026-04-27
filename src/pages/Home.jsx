import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MapView from '../components/map/MapView';
import IssueList from '../components/issues/IssueList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import apiService from '../services/api';
import { ISSUE_CATEGORIES, ISSUE_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import {
  ArrowRight,
  ClipboardList,
  Filter,
  LayoutGrid,
  ListFilter,
  MapPinned,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

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

  const stats = {
    total: issues.length,
    open: issues.filter((issue) => issue.status === ISSUE_STATUS.OPEN).length,
    inProgress: issues.filter((issue) => issue.status === ISSUE_STATUS.IN_PROGRESS).length,
    resolved: issues.filter((issue) => issue.status === ISSUE_STATUS.RESOLVED).length,
  };

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
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_28%)]" />
        <div className="absolute left-12 top-8 h-28 w-28 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl animate-float" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-civic-300" />
              Real-time civic reporting for your neighborhood
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Make your city feel cared for, one report at a time.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Report issues, follow fixes, and see what your community is doing to improve streets, utilities, and public spaces.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/report')}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Report an issue
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setView('map')}
                icon={<MapPinned className="h-4 w-4" />}
              >
                Explore the map
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Open reports', value: stats.open, icon: Target, color: 'text-rose-300' },
                { label: 'In progress', value: stats.inProgress, icon: ClipboardList, color: 'text-amber-300' },
                { label: 'Resolved', value: stats.resolved, icon: TrendingUp, color: 'text-emerald-300' },
              ].map((item) => (
                <Card key={item.label} className="bg-white/6 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                    </div>
                    <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10', item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative"
          >
            <Card className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-white/0 to-civic-500/10" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Civic activity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Live issue overview</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchIssues}
                    loading={loading}
                    icon={<RefreshCw className="h-4 w-4" />}
                  >
                    Refresh
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Visible reports</p>
                    <p className="mt-2 text-3xl font-bold text-white">{filteredIssues.length}</p>
                    <p className="mt-2 text-sm text-slate-300">Matching your current filters</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Coverage</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
                    <p className="mt-2 text-sm text-slate-300">Reports tracked across the city</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPinned className="h-4 w-4 text-primary-300" />
                      Navigate by map or list
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Switch views based on how you want to browse issues.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Filter className="h-4 w-4 text-civic-300" />
                      Filter by category and status
                    </div>
                    <p className="mt-2 text-sm text-slate-400">Focus on the issues that matter most to you.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Card className="mb-6 p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={view === 'map' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('map')}
                icon={<MapPinned className="h-4 w-4" />}
              >
                Map View
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                icon={<LayoutGrid className="h-4 w-4" />}
              >
                List View
              </Button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <ListFilter className="h-4 w-4 text-slate-300" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-sm text-slate-100 outline-none"
                >
                  <option value="all" className="bg-slate-900">All Categories</option>
                  {ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Filter className="h-4 w-4 text-slate-300" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-sm text-slate-100 outline-none"
                >
                  <option value="all" className="bg-slate-900">All Status</option>
                  <option value={ISSUE_STATUS.OPEN} className="bg-slate-900">Open</option>
                  <option value={ISSUE_STATUS.ASSIGNED} className="bg-slate-900">Assigned</option>
                  <option value={ISSUE_STATUS.IN_PROGRESS} className="bg-slate-900">In Progress</option>
                  <option value={ISSUE_STATUS.RESOLVED} className="bg-slate-900">Resolved</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing <strong className="text-white">{filteredIssues.length}</strong> of <strong className="text-white">{issues.length}</strong> issues
          </div>
        </Card>

        {view === 'map' ? (
          <div className="mb-6">
            {loading ? (
              <Card padding="none">
                <div className="flex h-[600px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-400" />
                    <p className="text-slate-300">Loading issues...</p>
                  </div>
                </div>
              </Card>
            ) : error ? (
              <Card padding="md">
                <div className="py-12 text-center">
                  <div className="mb-4 text-6xl">⚠️</div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Error Loading Map
                  </h3>
                  <p className="mb-4 text-slate-300">{error}</p>
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

        {view === 'map' && !loading && (
          <div className="mt-4 text-center lg:hidden">
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
