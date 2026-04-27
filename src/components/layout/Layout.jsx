import PropTypes from 'prop-types';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

/**
 * Main layout component that wraps all pages
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-civic-500/10 blur-3xl animate-float" />
      </div>
      <Navbar />
      <main className="relative flex-1">
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
