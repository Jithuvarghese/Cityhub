import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';
import { getCategoryById, STATUS_CONFIG, URGENCY_CONFIG, formatDate } from '../../utils/constants';

/**
 * IssueDetails component showing full issue information
 */
const IssueDetails = ({ issue, onSupport, onAddComment }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const category = getCategoryById(issue.category);
  const status = STATUS_CONFIG[issue.status];
  const urgency = URGENCY_CONFIG[issue.urgency];

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? issue.photos.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === issue.photos.length - 1 ? 0 : prev + 1
    );
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      await onAddComment(comment);
      setComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Status timeline
  const statusSteps = [
    { status: 'open', label: 'Reported', icon: '📝' },
    { status: 'assigned', label: 'Assigned', icon: '👤' },
    { status: 'in_progress', label: 'In Progress', icon: '🔧' },
    { status: 'resolved', label: 'Resolved', icon: '✅' }
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.status === issue.status);

  return (
    <div className="space-y-6">
      {/* Photos Carousel */}
      {issue.photos && issue.photos.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <div className="relative">
            <img
              src={issue.photos[currentImageIndex]}
              alt={`${issue.title} - Photo ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />
            
            {issue.photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {issue.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {issue.photos.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {issue.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden ${
                    index === currentImageIndex 
                      ? 'ring-4 ring-primary-500' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Main Info */}
      <Card padding="md">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.name}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {issue.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`badge ${status.color}`}>
                {status.icon} {status.label}
              </span>
              <span className={`badge ${urgency.color}`}>
                {urgency.label} Priority
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {issue.description}
            </p>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Location
            </h2>
            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span>📍</span>
              <div>
                <p>{issue.location.address}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {issue.location.lat.toFixed(6)}, {issue.location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Reported by <strong>{issue.reportedBy.name}</strong></p>
              <p>{formatDate(issue.reportedAt)}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSupport}
              icon={<span>👍</span>}
            >
              Support ({issue.supporters})
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Timeline */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Status Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={step.status} className="relative flex items-center gap-4">
                  <div className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-lg
                    ${isCompleted 
                      ? 'bg-civic-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }
                    ${isCurrent ? 'ring-4 ring-civic-200 dark:ring-civic-800' : ''}
                  `}>
                    {step.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isCompleted 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current status</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Comments */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Updates & Comments ({issue.comments?.length || 0})
        </h2>

        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add a comment or update..."
            className="input mb-2"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!comment.trim() || submittingComment}
            loading={submittingComment}
          >
            Add Comment
          </Button>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          {issue.comments && issue.comments.length > 0 ? (
            issue.comments.map(comment => (
              <div 
                key={comment.id} 
                className={`p-4 rounded-lg ${
                  comment.isOfficial 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {comment.author}
                    </p>
                    {comment.isOfficial && (
                      <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                        Official
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

IssueDetails.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    urgency: PropTypes.string.isRequired,
    photos: PropTypes.array,
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      address: PropTypes.string
    }).isRequired,
    reportedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    reportedAt: PropTypes.string.isRequired,
    supporters: PropTypes.number,
    comments: PropTypes.array
  }).isRequired,
  onSupport: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired
};

export default IssueDetails;
