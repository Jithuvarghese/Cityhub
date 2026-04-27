import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IssueDetails from '../components/issues/IssueDetails';
import Button from '../components/common/Button';
import MapView from '../components/map/MapView';
import apiService from '../services/api';
import toast from 'react-hot-toast';

/**
 * Issue Details page - shows full details of a single issue
 */
const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await apiService.getIssueById(id);
      setIssue(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError('Failed to load issue details');
      toast.error('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async () => {
    try {
      await apiService.supportIssue(id);
      setIssue(prev => ({
        ...prev,
        supporters: prev.supporters + 1
      }));
      toast.success('Thanks for your support!');
    } catch (err) {
      console.error('Error supporting issue:', err);
      toast.error('Failed to support issue');
    }
  };

  const handleAddComment = async (comment) => {
    try {
      const response = await apiService.addComment(id, comment);
      setIssue(prev => ({
        ...prev,
        comments: [...prev.comments, response.data]
      }));
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Issue Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The issue you\'re looking for doesn\'t exist'}
          </p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <IssueDetails
              issue={issue}
              onSupport={handleSupport}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mini map */}
            <div className="sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Location
              </h3>
              <MapView
                issues={[issue]}
                center={[issue.location.lat, issue.location.lng]}
                zoom={16}
                height="300px"
              />

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<span>🔗</span>}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  Share Issue
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  icon={<span>🗺️</span>}
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${issue.location.lat},${issue.location.lng}`,
                      '_blank'
                    );
                  }}
                >
                  View in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsPage;
