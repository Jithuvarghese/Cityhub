import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { getCategoryById, STATUS_CONFIG, formatDate } from '../../utils/constants';

/**
 * IssueCard component to display issue summary
 */
const IssueCard = ({ issue, compact = false }) => {
  const navigate = useNavigate();
  const category = getCategoryById(issue.category);
  const status = STATUS_CONFIG[issue.status];

  const handleClick = () => {
    navigate(`/issues/${issue.id}`);
  };

  if (compact) {
    return (
      <Card 
        padding="sm" 
        hover 
        onClick={handleClick}
        className="cursor-pointer"
      >
        <div className="flex gap-3">
          {issue.photos && issue.photos.length > 0 && (
            <img
              src={issue.photos[0]}
              alt={issue.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {issue.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${status.color} text-xs`}>
                {status.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(issue.reportedAt)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" hover onClick={handleClick} className="overflow-hidden">
      {/* Image */}
      {issue.photos && issue.photos.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={issue.photos[0]}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className={`badge ${status.color} shadow-lg`}>
              {status.label}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{category.icon}</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {category.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {issue.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {issue.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>👍</span>
              <span>{issue.supporters || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{issue.comments?.length || 0}</span>
            </div>
          </div>
          
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(issue.reportedAt)}
          </span>
        </div>

        {/* Location */}
        {issue.location?.address && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
            <span className="flex-shrink-0">📍</span>
            <span className="line-clamp-1">{issue.location.address}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

IssueCard.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    photos: PropTypes.array,
    supporters: PropTypes.number,
    comments: PropTypes.array,
    reportedAt: PropTypes.string.isRequired,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
      address: PropTypes.string
    })
  }).isRequired,
  compact: PropTypes.bool
};

export default IssueCard;
