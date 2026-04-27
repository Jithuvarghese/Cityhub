import PropTypes from 'prop-types';
import IssueCard from './IssueCard';

/**
 * IssueList component to display a grid/list of issues
 */
const IssueList = ({ 
  issues, 
  loading = false, 
  error = null,
  emptyMessage = 'No issues found',
  compact = false 
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card p-4 space-y-3">
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Error Loading Issues
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  // Empty state
  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No issues match your current filters.
        </p>
      </div>
    );
  }

  // Issues grid
  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} compact={compact} />
      ))}
    </div>
  );
};

IssueList.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  compact: PropTypes.bool
};

export default IssueList;
