import { Link } from 'react-router-dom';

/**
 * Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              🏙️ CityReport
            </h3>
            <p className="text-sm text-slate-300">
              Making cities better, one report at a time. Help improve your community by reporting issues.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-slate-300 hover:text-primary-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-sm text-slate-300 hover:text-primary-300">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link to="/my-issues" className="text-sm text-slate-300 hover:text-primary-300">
                  My Issues
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-100">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-primary-300">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-center text-sm text-slate-400">
            © {currentYear} CityReport. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
