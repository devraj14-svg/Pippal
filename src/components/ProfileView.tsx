import React, { useState } from 'react';
import { TraderProfile, MarketType, ExperienceLevel, TradingStyle } from '../types';
import {
  Shield,
  ShieldCheck,
  Edit3,
  Clock,
  MapPin,
  CheckCircle,
  Phone,
  X,
  Sparkles,
  Rocket,
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: TraderProfile;
  onUpdateProfile: (updated: TraderProfile) => void;
  onOpenPro: () => void;
  onOpenLaunchPlaybook?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onOpenPro,
  onOpenLaunchPlaybook,
  onOpenAuth,
  onLogout,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age.toString());
  const [location, setLocation] = useState(currentUser.location);
  const [experience, setExperience] = useState<ExperienceLevel>(currentUser.experience);
  const [tradingHours, setTradingHours] = useState(currentUser.tradingHours);
  const [bio, setBio] = useState(currentUser.bio);
  const [selectedMarkets, setSelectedMarkets] = useState<MarketType[]>(currentUser.markets);
  const [selectedStyles, setSelectedStyles] = useState<TradingStyle[]>(currentUser.styles);
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser.whatsappNumber || '');
  const [whatsappConsent, setWhatsappConsent] = useState(currentUser.whatsappConsent);

  const allMarkets: MarketType[] = ['NIFTY', 'Bank NIFTY', 'Stocks', 'Gold', 'Forex', 'Crypto', 'Options'];
  const allStyles: TradingStyle[] = ['Intraday', 'Swing', 'Scalping', 'Position'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name: name.trim(),
      age: Number(age) || 24,
      location: location.trim(),
      experience,
      tradingHours: tradingHours.trim(),
      bio: bio.trim(),
      markets: selectedMarkets,
      styles: selectedStyles,
      whatsappNumber: whatsappNumber.trim(),
      whatsappConsent,
    });
    setShowEditModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5 shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">Financial Privacy Guaranteed 🛡️</h3>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              PipPal does not require or display your account balance, broker login, or live P&L portfolio. Focus on finding compatible peers and building discipline safely.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenLaunchPlaybook && (
            <button
              onClick={onOpenLaunchPlaybook}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Launch & Install App</span>
            </button>
          )}

          <button
            onClick={onOpenPro}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>PipPal Pro</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card in Cheerful Light Theme */}
      <div className="rounded-3xl bg-white border border-stone-200/90 p-6 shadow-xl shadow-stone-200/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl font-black text-emerald-800 shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="text-xs text-stone-500 font-mono">@{currentUser.username}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" />
                  {currentUser.location}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-emerald-700 font-bold">{currentUser.experience} Trader</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{currentUser.age} years old</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Edit Profile</span>
            </button>

            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors shadow-xs"
                title="Switch account or register a new trader account"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Switch / Sign In</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-xs"
              >
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio & Philosophy */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-1">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Trader Bio & Philosophy
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-normal">
            "{currentUser.bio}"
          </p>
        </div>

        {/* Grid info: Markets, Styles, Hours, Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Markets Traded
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.markets.map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Trading Style
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.styles.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-stone-700 border border-stone-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-1">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Trading Hours</span>
            </div>
            <div className="text-sm font-mono font-bold text-slate-800">
              {currentUser.tradingHours}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-1">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Languages
            </div>
            <div className="text-sm text-slate-800 font-medium">
              {currentUser.languages.join(', ')}
            </div>
          </div>
        </div>

        {/* Trading Rules Followed */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>My Strict Trading Rules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentUser.tradingRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-center gap-2.5 text-xs text-slate-800 font-medium"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Mutual Consent Privacy Settings */}
        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">WhatsApp Privacy Control</span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 font-medium">
              {currentUser.whatsappConsent ? 'Consent Active' : 'Hidden by Default'}
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Your phone number ({currentUser.whatsappNumber || '+91 98765 XXXXX'}) is completely masked. Matched traders will only see an option to connect on WhatsApp after you explicitly select "Share Contact" with each specific individual.
          </p>
        </div>

        {/* Database & Account Security Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">PipPal Database Storage</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synced & Active</span>
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            All trades, rules, and profile parameters are persistently stored in the local server database. When you log in with your email or handle from any device, your session and journal automatically restore.
          </p>
          <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-medium">
              Account ID: <code className="text-emerald-700 font-bold">{currentUser.id}</code>
            </span>
            <span className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-medium">
              Security: <span className="text-slate-800 font-semibold">Salted SHA-256 Tokens</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-emerald-600" />
                <span>Edit Trader Profile</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Trading Hours
                </label>
                <input
                  type="text"
                  required
                  value={tradingHours}
                  onChange={(e) => setTradingHours(e.target.value)}
                  placeholder="e.g. 9:15–11:30 AM IST"
                  className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Markets Traded (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allMarkets.map((m) => {
                    const active = selectedMarkets.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => {
                          if (active) {
                            setSelectedMarkets(selectedMarkets.filter((x) => x !== m));
                          } else {
                            setSelectedMarkets([...selectedMarkets, m]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          active
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Trading Styles
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allStyles.map((s) => {
                    const active = selectedStyles.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          if (active) {
                            setSelectedStyles(selectedStyles.filter((x) => x !== s));
                          } else {
                            setSelectedStyles([...selectedStyles, s]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-stone-800 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Trader Bio & Accountability Goal
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
