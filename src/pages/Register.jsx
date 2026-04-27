import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

/**
 * Register page
 */
const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        toast.success('Registration successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(watch('password'));

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card padding="lg" className="w-full">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-white mb-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-civic-500/20 text-civic-300 ring-1 ring-civic-400/20">
                  <UserPlus className="h-5 w-5" />
                </span>
                <span className="font-display">CityReport</span>
              </Link>
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="mt-2 text-slate-300">Join the platform that helps neighborhoods move faster.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters',
                  },
                })}
              />

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

              <div>
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
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />

                {watch('password') && (
                  <div className="mt-2">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-300">{passwordStrength.label}</span>
                    </div>
                    <p className="text-xs text-slate-400">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === watch('password') || 'Passwords do not match',
                })}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-white/10 text-primary-500 focus:ring-primary-500"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions',
                  })}
                />
                <label className="ml-2 text-sm text-slate-300">
                  I agree to the{' '}
                  <a href="#" className="text-primary-300 hover:text-white">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-300 hover:text-white">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && <p className="text-sm text-red-400">{errors.terms.message}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Create Account
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
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-300 hover:text-white">
                  Sign in
                </Link>
              </p>
            </form>
          </Card>
        </motion.div>

        <Card className="hidden overflow-hidden p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-civic-300" />
                Create your account in minutes
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
                Set up your profile and start reporting.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Save your activity, track responses, and keep your neighborhood improvements organized.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { icon: CheckCircle2, label: 'Fast onboarding with a clean first step' },
                { icon: ShieldCheck, label: 'Your account details stay organized in one place' },
                { icon: ArrowRight, label: 'Move from registration to reporting in one flow' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <item.icon className="h-4 w-4 text-primary-300" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
