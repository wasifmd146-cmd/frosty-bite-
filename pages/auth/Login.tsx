import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirect handled by checking the user after successful login
      // However, since login is async and updates state, we can infer success if no error was thrown.
      
      // We do a quick check here to decide navigation, though context usually handles the user object update.
      // Note: `wasifmd146@gmail.com` is your hardcoded admin in StoreContext.
      if (email.includes('admin') || email === 'wasifmd146@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Handle Supabase specific errors for clarity
      if (err.message === 'Email not confirmed') {
        setError('Please verify your email address before logging in.');
      } else if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&q=80&w=2070"
            alt="Background" 
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent" />
      </div>

      <div className="glass-panel w-full max-w-md p-8 md:p-12 rounded-lg relative z-10 shadow-2xl animate-fade-in-up">
        
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-gold-500 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-10">
          <Link to="/" className="block text-3xl font-serif italic font-bold text-white tracking-wider mb-6">
            Frosty<span className="text-gold-500">Bite</span>
          </Link>
          <h2 className="text-2xl font-serif text-white mb-2">Welcome Back</h2>
          <p className="text-neutral-400 text-sm">Sign in to access your premium account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm mb-6 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal-900 border border-neutral-800 text-white rounded p-3 pl-10 focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs uppercase tracking-wider text-neutral-500">Password</label>
              <Link to="/forgot-password" className="text-xs text-gold-500 hover:text-gold-400">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal-900 border border-neutral-800 text-white rounded p-3 pl-10 focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </Button>

          <div className="text-center text-xs text-neutral-500 mt-6">
            <p>Don't have an account? <Link to="/signup" className="text-gold-500 hover:underline cursor-pointer font-bold">Create Account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};