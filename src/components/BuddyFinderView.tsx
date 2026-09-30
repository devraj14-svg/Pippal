import React, { useState } from 'react';
import { TraderProfile, MarketType, WhoLikedProfile } from '../types';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Flame,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
  MapPin,
  CalendarCheck,
  HeartHandshake,
  Lock,
  Unlock,
  CreditCard,
  Clock,
  UserCheck,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PipPalLogo } from './PipPalLogo';

interface BuddyFinderViewProps {
  traders: TraderProfile[];
  currentUser: TraderProfile;
  whoLikedList: WhoLikedProfile[];
  hasUnlockedWhoLiked: boolean;
  onOpenPaymentGateway: () => void;
  onToggleUnlockState: () => void;
  onConnectTrader: (trader: TraderProfile) => void;
  onUpdateCurrentUser: (user: TraderProfile) => void;
  onStartChat: (trader: TraderProfile) => void;
  onCreatePrivateRoom: (trader: TraderProfile) => void;
}

export const BuddyFinderView: React.FC<BuddyFinderViewProps> = ({
  traders,
  currentUser,
  whoLikedList,
  hasUnlockedWhoLiked,
  onOpenPaymentGateway,
  onToggleUnlockState,
  onConnectTrader,
  onUpdateCurrentUser,
  onStartChat,
  onCreatePrivateRoom,
}) => {
  // Search state
  const [selectedMarket, setSelectedMarket] = useState<string>('NIFTY');
  const [selectedExperience, setSelectedExperience] = useState<string>('Beginner');
  const [selectedHours, setSelectedHours] = useState<string>('9:15–11:30 AM');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi');

  // Check-in feedback state
  const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);

  // Active buddy
  const activeBuddy = traders.find((t) => t.id === currentUser.activeBuddyId) || traders[0];

  // Perform search query
  const searchResults = traders.filter((t) => {
    if (t.id === currentUser.id) return false;
    let matches = 0;
    if (t.markets.includes(selectedMarket as MarketType)) matches++;
    if (t.experience === selectedExperience) matches++;
    if (t.tradingHours.includes(selectedHours.split(' ')[0])) matches++;
    if (t.languages.some((l) => l.toLowerCase().includes(selectedLanguage.toLowerCase()))) matches++;
    return matches >= 2;
  });

  const handlePairBuddy = (buddy: TraderProfile) => {
    onUpdateCurrentUser({
      ...currentUser,
      activeBuddyId: buddy.id,
      streakDays: 1,
    });
  };

  const handleCheckin = (status: 'adhered' | 'deviated') => {
    const newStreak =
      status === 'adhered' ? (currentUser.streakDays || 0) + 1 : 0;

    onUpdateCurrentUser({
      ...currentUser,
      lastCheckinStatus: status,
      streakDays: newStreak,
    });

    setShowCheckinSuccess(true);
    setTimeout(() => setShowCheckinSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
            <span>ACCOUNTABILITY PARTNERS</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>WHO LIKED YOU</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>DAILY STREAK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trading Buddy & Accountability 🤝
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            See which traders want to connect with you, pair with an accountability partner, and stay disciplined together.
          </p>
        </div>

        {/* Quick status badge / test toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleUnlockState}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors shadow-2xs"
            title="Toggle between locked and unlocked state for review"
          >
            {hasUnlockedWhoLiked ? '🔓 Unlocked (Demo)' : '🔒 Locked (Demo)'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 0: WHO LIKED YOU (BEELINE & PAYMENT GATEWAY UNLOCK) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-6 shadow-xl shadow-stone-200/50 space-y-5 relative overflow-hidden">
        {/* Glow ambient background banner */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-50/70 via-emerald-50/40 to-transparent pointer-events-none -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 px-2.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin-slow" />
                <span>{whoLikedList.length} INCOMING LIKES</span>
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Traders who swiped Connect on you
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {hasUnlockedWhoLiked
                ? '🎉 Unlocked: Traders Who Want to Connect With You'
                : '🔒 Who Liked You — Instant Match Available'}
            </h2>
            <p className="text-xs text-stone-600 max-w-xl">
              {hasUnlockedWhoLiked
                ? 'These traders sent you a connection request. Click "Connect Back" to immediately trigger a mutual match and start chatting!'
                : 'These traders want to pair up for market sessions. Unlock with PipPal Pass to see their unblurred profiles and match instantly without waiting.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {!hasUnlockedWhoLiked ? (
              <button
                onClick={onOpenPaymentGateway}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
              >
                <Lock className="h-4 w-4" />
                <span>See Who Liked You (₹199 / ₹49)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Pass Active · All Unlocked</span>
              </div>
            )}
          </div>
        </div>

        {/* Cards Grid: 3 Traders Who Liked You */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {whoLikedList.map((item) => {
            const t = item.trader;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
                  hasUnlockedWhoLiked
                    ? 'bg-white border-stone-200/90 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300'
                    : 'bg-stone-50/70 border-stone-200/90 hover:border-amber-300'
                }`}
              >
                {/* Top Media / Avatar */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className={`h-full w-full object-cover object-center transition-all duration-300 ${
                      !hasUnlockedWhoLiked
                        ? 'filter blur-md scale-105 brightness-95'
                        : 'filter blur-0 scale-100'
                    }`}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Compatibility Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-xs">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    <span>{item.compatibilityScore}% Match</span>
                  </div>

                  {/* Timing Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono">
                    {item.likedAt}
                  </div>

                  {/* Overlay when locked */}
                  {!hasUnlockedWhoLiked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-900/35 backdrop-blur-[1px]">
                      <div className="h-10 w-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center text-emerald-700 mb-1.5 border border-emerald-200">
                        <Lock className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-black text-white drop-shadow-md">
                        {t.name.split(' ')[0]} Liked You!
                      </span>
                      <span className="text-[10px] text-emerald-200 font-mono mt-0.5">
                        {item.teaserMarket}
                      </span>
                    </div>
                  )}

                  {/* Bottom name info */}
                  <div className="absolute bottom-2.5 inset-x-3 text-white">
                    <div className="font-extrabold text-sm sm:text-base leading-tight drop-shadow-xs">
                      {hasUnlockedWhoLiked ? `${t.name}, ${t.age}` : `${t.name.split(' ')[0]} ••, ${t.age}`}
                    </div>
                    <div className="text-[11px] text-stone-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span>{t.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.teaserMarket}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                        {t.experience}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-mono">
                      <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{item.teaserHours}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {hasUnlockedWhoLiked ? `"${t.bio}"` : item.teaserNote}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-2 border-t border-stone-100">
                    {hasUnlockedWhoLiked ? (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => onConnectTrader(t)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Connect Back & Match 🤝</span>
                        </button>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onStartChat(t)}
                            className="flex-1 py-1.5 text-[11px] font-semibold text-stone-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            Chat
                          </button>
                          <button
                            onClick={() => onCreatePrivateRoom(t)}
                            className="flex-1 py-1.5 text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            Private Room
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={onOpenPaymentGateway}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Unlock to Match (₹199 / ₹49)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Instant notification: You'll receive real-time alerts whenever a new trader connects.</span>
          </div>
          {!hasUnlockedWhoLiked && (
            <button
              onClick={onOpenPaymentGateway}
              className="text-emerald-700 font-bold hover:underline self-start sm:self-auto flex items-center gap-1"
            >
              <span>View UPI & Card Checkout Options</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>


      {/* SECTION 1: Active Buddy Accountability Dashboard */}
      {activeBuddy && (
        <div className="rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-6 shadow-xl shadow-stone-200/50 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <img
                  src={activeBuddy.avatar}
                  alt={activeBuddy.name}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs ring-2 ring-white">
                  🤝
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{activeBuddy.name}</h3>
                  <span className="text-xs text-stone-500">({activeBuddy.age}, {activeBuddy.location})</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1">
                  <span className="text-emerald-700 font-bold">Your Active Trading Buddy</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="font-mono text-amber-800 font-semibold">{activeBuddy.tradingHours}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1.5 italic font-normal">
                  "{activeBuddy.bio}"
                </p>
              </div>
            </div>

            {/* Streak & Accountability Stat */}
            <div className="flex items-center gap-4 bg-amber-50/70 border border-amber-200 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-amber-900 font-mono tabular-nums leading-none">
                    {currentUser.streakDays || 0} Days
                  </div>
                  <div className="text-[10px] text-amber-700 mt-0.5 uppercase tracking-wider font-bold">
                    Discipline Streak
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-amber-200" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStartChat(activeBuddy)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Chat Buddy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daily Discipline Check-in Box */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                  <span>Today's Daily Rule Check-in</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Did you stick strictly to your trading rules today without overtrading or moving stop-losses?
                </p>
              </div>

              {currentUser.lastCheckinStatus && (
                <div className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-stone-100 border border-stone-200 self-start sm:self-auto">
                  <span className="text-stone-500">Today:</span>
                  <span
                    className={`font-bold ${
                      currentUser.lastCheckinStatus === 'adhered'
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {currentUser.lastCheckinStatus === 'adhered'
                      ? 'Followed All Rules ✅'
                      : 'Broke Rules / Off-Plan ⚠️'}
                  </span>
                </div>
              )}
            </div>

            {showCheckinSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Check-in recorded! Your buddy {activeBuddy.name} has been notified of your discipline milestone.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleCheckin('adhered')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] ${
                  currentUser.lastCheckinStatus === 'adhered'
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 text-slate-900 shadow-xs'
                    : 'bg-stone-50/70 hover:bg-stone-100 hover:border-emerald-200 border-stone-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Yes, stuck to my rules 🎯</div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Respected stop losses, max trade limits, and didn't chase out of FOMO.
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCheckin('deviated')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] ${
                  currentUser.lastCheckinStatus === 'deviated'
                    ? 'bg-rose-50 border-2 border-rose-400 text-slate-900 shadow-xs'
                    : 'bg-stone-50/70 hover:bg-stone-100 hover:border-rose-200 border-stone-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">No, broke my plan today 🛡️</div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Overtraded or moved stops. Honest debrief and reset streak.
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Buddy's commitments */}
            <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Shield className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  {activeBuddy.name}'s pledge: <strong className="text-slate-900 font-semibold">"{activeBuddy.accountabilityGoal}"</strong>
                </span>
              </div>
              <button
                onClick={() => onCreatePrivateRoom(activeBuddy)}
                className="text-emerald-700 hover:text-emerald-600 font-bold whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>Launch Private Room</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Search For Compatible Trading Buddies */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="h-4 w-4 text-emerald-600" />
            <span>Search For a New Trading Buddy</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Filter by specific market, trading hours, and experience level to find your ideal accountability partner.
          </p>
        </div>

        {/* Filter Input Grid */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-md shadow-stone-200/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-800 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="NIFTY">NIFTY 50</option>
              <option value="Bank NIFTY">Bank NIFTY</option>
              <option value="Gold">Gold (MCX)</option>
              <option value="Stocks">Stocks / Cash</option>
              <option value="Options">Index Options</option>
              <option value="Forex">Forex Majors</option>
              <option value="Crypto">Crypto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-800 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trading Hours
            </label>
            <select
              value={selectedHours}
              onChange={(e) => setSelectedHours(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-800 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="9:15–11:30 AM">9:15–11:30 AM (Opening Session)</option>
              <option value="1:00–3:30 PM">1:00–3:30 PM (Afternoon/Expiry)</option>
              <option value="5:00–11:30 PM">5:00–11:30 PM (MCX Commodities)</option>
              <option value="6:00–10:30 PM">6:00–10:30 PM (Forex/US Session)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-800 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="Hindi">Hindi / Hinglish</option>
              <option value="English">English</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>
        </div>

        {/* Search Results Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Found <strong className="text-slate-900 font-mono">{searchResults.length}</strong> compatible traders matching your schedule
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((trader) => {
              const isCurrentBuddy = currentUser.activeBuddyId === trader.id;
              return (
                <div
                  key={trader.id}
                  className="rounded-2xl bg-white border border-stone-200/90 p-4 space-y-3 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={trader.avatar}
                          alt={trader.name}
                          className="h-12 w-12 rounded-xl object-cover bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900">{trader.name}, {trader.age}</h4>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                              {trader.experience}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-stone-400" />
                              {trader.location}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-800 font-mono text-[11px] font-semibold">
                              {trader.tradingHours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      "{trader.bio}"
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {trader.markets.map((m) => (
                        <span
                          key={m}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          {m}
                        </span>
                      ))}
                      <span className="text-[11px] text-stone-400 py-0.5">
                        · {trader.languages.join(', ')}
                      </span>
                    </div>

                    {/* Rule pledge */}
                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-1.5">
                      <Shield className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Rule: {trader.tradingRules[0]}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onStartChat(trader)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200"
                    >
                      Message
                    </button>

                    {isCurrentBuddy ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Current Buddy</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePairBuddy(trader)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-600/25 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-xs"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Pair as Trading Buddy</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
