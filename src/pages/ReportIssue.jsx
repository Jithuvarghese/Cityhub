import IssueForm from '../components/issues/IssueForm';

/**
 * Report Issue page
 */
const ReportIssue = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Report a City Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help improve your community by reporting issues you encounter
          </p>
        </div>

        <IssueForm />
      </div>
    </div>
  );
};

export default ReportIssue;
