import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=2089"
            alt="Background" 
            className="w-full h-full object-cover opacity-10 blur-sm"
          />
      </div>

      <div className="glass-panel w-full max-w-md p-8 md:p-12 rounded-lg relative z-10 shadow-2xl animate-fade-in-up">
        {!isSubmitted ? (
          <>
            <div className="mb-8">
              <Link to="/login" className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 text-sm">
                <ArrowLeft size={16} /> Back to Login
              </Link>
              <h2 className="text-2xl font-serif text-white mb-2">Reset Password</h2>
              <p className="text-neutral-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm mb-6 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gold-500/10 text-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-serif text-white mb-2">Check your email</h2>
            <p className="text-neutral-400 text-sm mb-8">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};