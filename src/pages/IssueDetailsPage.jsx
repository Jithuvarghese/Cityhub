import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IssueDetails from '../components/issues/IssueDetails';
import Button from '../components/common/Button';
import MapView from '../components/map/MapView';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPinned, Share2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-400"></div>
          <p className="text-slate-300">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="mb-2 text-2xl font-semibold text-white">
            Issue Not Found
          </h2>
          <p className="mb-6 text-slate-300">
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
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
          icon={<ArrowLeft className="h-4 w-4" />}
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
            <div className="sticky top-20">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <MapPinned className="h-5 w-5 text-primary-300" />
                Location
              </div>
              <MapView
                issues={[issue]}
                center={[issue.location.lat, issue.location.lng]}
                zoom={16}
                height="300px"
              />

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Share2 className="h-4 w-4" />}
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
                  icon={<MapPinned className="h-4 w-4" />}
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
