import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

/**
 * Login page
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Card className="hidden overflow-hidden p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-civic-300" />
                Welcome back to CityReport
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
                Sign in and keep the city moving.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Track reports, review updates, and manage your activity from a single, clean dashboard.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { icon: ShieldCheck, label: 'Secure sign-in for your account' },
                { icon: UserRound, label: 'Keep your reports and comments in one place' },
                { icon: ArrowRight, label: 'Jump straight back into your latest activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <item.icon className="h-4 w-4 text-primary-300" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card padding="lg" className="w-full">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-white mb-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-300 ring-1 ring-primary-400/20">
                  <Eye className="h-5 w-5" />
                </span>
                <span className="font-display">CityReport</span>
              </Link>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-slate-300">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="your@email.com"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-white/10 text-primary-500 focus:ring-primary-500"
                    {...register('remember')}
                  />
                  <span className="ml-2 text-sm text-slate-300">Remember me</span>
                </label>

                <a href="#" className="text-sm text-primary-300 hover:text-white">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>

              <div className="pt-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-950 px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 shadow-sm hover:bg-white/10"
                  >
                    <span className="mr-2">🔵</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 shadow-sm hover:bg-white/10"
                  >
                    <span className="mr-2">⚫</span>
                    GitHub
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-slate-300">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-300 hover:text-white">
                  Sign up
                </Link>
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
