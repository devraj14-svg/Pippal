import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { PipPalLogo } from './PipPalLogo';
import { TraderProfile, MarketType, TradingStyle, ExperienceLevel } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: TraderProfile, token: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('devrajjofficial@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAge, setSignupAge] = useState('23');
  const [signupLocation, setSignupLocation] = useState('Bengaluru, India');
  const [signupExperience, setSignupExperience] = useState<ExperienceLevel>('Beginner');
  const [signupMarkets, setSignupMarkets] = useState<MarketType[]>(['NIFTY', 'Options']);
  const [signupStyles, setSignupStyles] = useState<TradingStyle[]>(['Intraday']);
  const [signupHours, setSignupHours] = useState('9:15–11:30 AM IST');
  const [signupRules, setSignupRules] = useState('Max 2 trades per session, Hard stop at 15 pts');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      // Store token
      localStorage.setItem('pippal_auth_token', data.token);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const parsedRules = signupRules
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          username: signupUsername.trim() || undefined,
          email: signupEmail.trim(),
          password: signupPassword,
          age: Number(signupAge) || 24,
          location: signupLocation.trim(),
          experience: signupExperience,
          markets: signupMarkets,
          styles: signupStyles,
          tradingHours: signupHours.trim(),
          tradingRules: parsedRules.length > 0 ? parsedRules : ['Max 2 trades/day'],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Signup failed. Please check details.');
      }

      localStorage.setItem('pippal_auth_token', data.token);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMarket = (m: MarketType) => {
    setSignupMarkets((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const toggleStyle = (s: TradingStyle) => {
    setSignupStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md my-8 rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1 rounded-xl bg-white/15 backdrop-blur-xs">
              <PipPalLogo size={24} />
            </div>
            <span className="font-extrabold text-sm tracking-wide uppercase text-emerald-200">
              PipPal Trader Account
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Welcome Back, Trader' : 'Join the Community'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            {mode === 'login'
              ? 'Sign in to access your morning accountability buddy & trading rooms.'
              : 'Create your trader profile to find disciplined session buddies.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="devrajjofficial@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-emerald-600 font-medium cursor-pointer hover:underline" onClick={() => alert('Demo tip: You can login with password "password123" for any seeded account.')}>
                    Demo password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Database Persistence Enabled</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your session, trading logs, and personal rulebook persist safely across app restarts in the PipPal database store.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to PipPal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-stone-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rohan Mehta"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Handle / Username
                  </label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="rohan_nifty"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="rohan@example.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={signupExperience}
                    onChange={(e) => setSignupExperience(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Beginner">Beginner (&lt; 1 yr)</option>
                    <option value="Intermediate">Intermediate (1-3 yrs)</option>
                    <option value="Experienced">Experienced (3+ yrs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trading Session
                  </label>
                  <input
                    type="text"
                    value={signupHours}
                    onChange={(e) => setSignupHours(e.target.value)}
                    placeholder="9:15–11:30 AM IST"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Markets Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Markets You Trade
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['NIFTY', 'Bank NIFTY', 'Stocks', 'Gold', 'Forex', 'Crypto', 'Options'] as MarketType[]).map(
                    (m) => {
                      const sel = signupMarkets.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleMarket(m)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            sel
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Trading Styles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Execution Style
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Intraday', 'Scalping', 'Swing', 'Position'] as TradingStyle[]).map((s) => {
                    const sel = signupStyles.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleStyle(s)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          sel
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Discipline Rules (comma separated)
                </label>
                <input
                  type="text"
                  value={signupRules}
                  onChange={(e) => setSignupRules(e.target.value)}
                  placeholder="Max 2 trades/day, 15-pt hard stop"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Saving Trader Profile...</span>
                ) : (
                  <>
                    <span>Create Profile & Enter PipPal</span>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
