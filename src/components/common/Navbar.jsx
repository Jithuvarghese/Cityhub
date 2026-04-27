import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import { cn } from '../../utils/cn';
import {
  ChevronDown,
  ClipboardList,
  House,
  LogIn,
  Menu,
  PenSquare,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  X,
} from 'lucide-react';

/**
 * Main navigation bar component
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: House },
    { path: '/report', label: 'Report Issue', icon: PenSquare },
  ];

  const authenticatedLinks = [
    { path: '/my-issues', label: 'My Issues', icon: ClipboardList },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 text-lg font-bold text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-300 ring-1 ring-primary-400/20">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-xl tracking-tight">CityReport</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                    isActive ? 'bg-white text-slate-950 shadow-lg shadow-primary-500/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}

              {isAuthenticated && authenticatedLinks.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                    isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  icon={<UserRoundPlus className="h-4 w-4" />}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                    alt={user?.name}
                    className="h-9 w-9 rounded-full ring-2 ring-white/10"
                  />
                  <span className="hidden xl:block">
                    <span className="block text-sm font-semibold text-white">{user?.name}</span>
                    <span className="block text-xs text-slate-400">{user?.email}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                      <Link
                        to="/my-issues"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ClipboardList className="h-4 w-4" />
                        My Issues
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-300 hover:bg-white/5"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-100 hover:bg-white/10"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-3 pb-2 pt-3">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                  isActive ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/5'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}

            {isAuthenticated && authenticatedLinks.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                  isActive ? 'bg-primary-500 text-white' : 'text-slate-200 hover:bg-white/5'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-white/10 px-3 pb-4 pt-4">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  icon={<LogIn className="h-4 w-4" />}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  icon={<UserRoundPlus className="h-4 w-4" />}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-base font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={handleLogout}
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
