import PropTypes from 'prop-types';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

/**
 * Main layout component that wraps all pages
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
