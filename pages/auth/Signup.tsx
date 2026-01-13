import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { Button } from '../../components/ui/Button';
import { Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { signup } = useStore();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signup(name, email, password);
      // Instead of navigating, we show the verification message
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=2070"
            alt="Background" 
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950/80 to-charcoal-950" />
      </div>

      <div className="glass-panel w-full max-w-md p-8 md:p-12 rounded-lg relative z-10 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-10">
          <Link to="/" className="block text-3xl font-serif italic font-bold text-white tracking-wider mb-6">
            Frosty<span className="text-gold-500">Bite</span>
          </Link>
          <h2 className="text-2xl font-serif text-white mb-2">Join the Club</h2>
          <p className="text-neutral-400 text-sm">Experience artisanal baking at its finest</p>
        </div>

        {verificationSent ? (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl text-white font-serif mb-4">Verify your email</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
              Please check your inbox (and spam folder) to activate your account.
            </p>
            <Link to="/login">
              <Button className="w-full">Proceed to Login</Button>
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm mb-6 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-charcoal-900 border border-neutral-800 text-white rounded p-3 pl-10 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-charcoal-900 border border-neutral-800 text-white rounded p-3 pl-10 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Password</label>
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

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-neutral-500">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-charcoal-900 border border-neutral-800 text-white rounded p-3 pl-10 focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <div className="text-center text-xs text-neutral-500 mt-6">
                <p>Already have an account? <Link to="/login" className="text-gold-500 hover:underline cursor-pointer font-bold">Log In</Link></p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};