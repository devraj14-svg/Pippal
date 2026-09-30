import React, { useState } from 'react';
import { TraderProfile, MarketType } from '../types';
import {
  X,
  UserCheck,
  RotateCcw,
  Sparkles,
  Clock,
  MapPin,
  Shield,
  Filter,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Smile,
  HeartHandshake,
  Hand,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiscoverViewProps {
  traders: TraderProfile[];
  currentUser: TraderProfile;
  onConnect: (trader: TraderProfile) => void;
  onSkip: (trader: TraderProfile) => void;
  onViewBuddySearch: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  traders,
  currentUser,
  onConnect,
  onSkip,
  onViewBuddySearch,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>('All');
  const [selectedExperienceFilter, setSelectedExperienceFilter] = useState<string>('All');
  const [history, setHistory] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dragX, setDragX] = useState<number>(0);
  const [exitX, setExitX] = useState<number>(0);

  // Filtered list
  const filteredTraders = traders.filter((t) => {
    if (t.id === currentUser.id) return false;
    if (selectedMarketFilter !== 'All' && !t.markets.includes(selectedMarketFilter as MarketType)) {
      return false;
    }
    if (selectedExperienceFilter !== 'All' && t.experience !== selectedExperienceFilter) {
      return false;
    }
    return true;
  });

  const currentTrader = filteredTraders[currentIndex];
  const nextTrader = filteredTraders[currentIndex + 1];

  const handleSkip = () => {
    if (!currentTrader) return;
    setExitX(-450);
    setHistory((prev) => [...prev, currentIndex]);
    setTimeout(() => {
      onSkip(currentTrader);
      setCurrentIndex((prev) => prev + 1);
      setExitX(0);
      setDragX(0);
    }, 220);
  };

  const handleConnect = () => {
    if (!currentTrader) return;
    setExitX(450);
    setHistory((prev) => [...prev, currentIndex]);
    setTimeout(() => {
      onConnect(currentTrader);
      setCurrentIndex((prev) => prev + 1);
      setExitX(0);
      setDragX(0);
    }, 220);
  };

  const handleRewind = () => {
    if (history.length === 0) return;
    const lastIdx = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIdx);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistory([]);
    setDragX(0);
    setExitX(0);
  };

  // Calculate compatibility between currentUser and trader
  const calculateCompatibility = (t: TraderProfile) => {
    let score = 70;
    const sharedMarkets = t.markets.filter((m) => currentUser.markets.includes(m));
    score += sharedMarkets.length * 8;
    if (t.tradingHours.includes('9:15') && currentUser.tradingHours.includes('9:15')) {
      score += 10;
    }
    if (t.experience === currentUser.experience) {
      score += 5;
    }
    return Math.min(score, 98);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Cheerful Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1">
              <Smile className="h-3.5 w-3.5 text-emerald-600" />
              DISCOVER TRADING PEERS
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>SUPPORTIVE COMMUNITY</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>NO SIGNALS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 text-balance">
            Find your trading people ✨
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Say goodbye to lonely trading desks. Swipe right to connect or drag the card directly!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 shadow-xs hover:-translate-y-0.5 active:scale-95 ${
              showFilters || selectedMarketFilter !== 'All' || selectedExperienceFilter !== 'All'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {(selectedMarketFilter !== 'All' || selectedExperienceFilter !== 'All') && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={onViewBuddySearch}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700 hover:text-stone-900 hover:border-stone-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-xs"
          >
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
            <span>Buddy Search</span>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Filter drawer / bar */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 mb-6 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              <span>Target Market Filter</span>
            </span>
            <button
              onClick={() => {
                setSelectedMarketFilter('All');
                setSelectedExperienceFilter('All');
                setCurrentIndex(0);
              }}
              className="text-xs text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['All', 'NIFTY', 'Bank NIFTY', 'Gold', 'Options', 'Stocks', 'Forex', 'Crypto'].map(
              (m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMarketFilter(m);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 hover:scale-105 active:scale-95 ${
                    selectedMarketFilter === m
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <span className="font-semibold text-slate-800">Experience:</span>
            {['All', 'Beginner', 'Intermediate', 'Experienced'].map((exp) => (
              <button
                key={exp}
                onClick={() => {
                  setSelectedExperienceFilter(exp);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                  selectedExperienceFilter === exp
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Tinder Card Deck Area */}
      <div className="relative mx-auto max-w-md w-full select-none">
        {currentTrader ? (
          <div className="relative">
            {/* Visual background card to simulate a physical deck with smooth depth */}
            {nextTrader && (
              <div
                className="absolute inset-0 rounded-3xl bg-white border border-stone-200/90 shadow-md transform pointer-events-none transition-all duration-200 overflow-hidden flex flex-col"
                style={{
                  transform: `translateY(${Math.max(6, 12 - Math.abs(dragX) * 0.05)}px) scale(${Math.min(0.99, 0.95 + Math.abs(dragX) * 0.0004)})`,
                  opacity: Math.min(0.9, 0.7 + Math.abs(dragX) * 0.002),
                  zIndex: 0,
                }}
              >
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={nextTrader.avatar}
                    alt={nextTrader.name}
                    className="h-full w-full object-cover object-center filter blur-[0.4px] brightness-95"
                  />
                  <div className="absolute inset-0 bg-stone-900/20" />
                </div>
                <div className="p-5 space-y-2 bg-white">
                  <div className="h-5 w-1/3 bg-stone-200/80 rounded-md" />
                  <div className="h-3 w-1/2 bg-stone-100 rounded-md" />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrader.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDrag={(_, info) => setDragX(info.offset.x)}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 85 || info.velocity.x > 400) {
                    handleConnect();
                  } else if (info.offset.x < -85 || info.velocity.x < -400) {
                    handleSkip();
                  } else {
                    setDragX(0);
                  }
                }}
                initial={{ scale: 0.95, opacity: 0, y: 14 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  rotate: exitX !== 0 ? (exitX > 0 ? 12 : -12) : dragX * 0.045,
                  x: exitX !== 0 ? exitX : 0,
                }}
                exit={{
                  x: exitX !== 0 ? exitX : (dragX > 0 ? 450 : -450),
                  opacity: 0,
                  rotate: exitX !== 0 ? (exitX > 0 ? 16 : -16) : (dragX > 0 ? 16 : -16),
                  transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 26,
                  mass: 0.8,
                }}
                className="overflow-hidden rounded-3xl bg-white border border-stone-200/90 shadow-xl shadow-stone-200/70 cursor-grab active:cursor-grabbing relative z-10"
              >
                {/* Dynamic Drag Stamp Overlays */}
                {dragX > 20 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      opacity: Math.min(1, dragX / 65),
                      scale: Math.min(1.15, 0.85 + dragX / 120),
                    }}
                    className="absolute top-16 left-6 z-20 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-black text-sm tracking-wider shadow-lg shadow-emerald-700/30 transform -rotate-12 border-2 border-white pointer-events-none"
                  >
                    CONNECT 🤝
                  </motion.div>
                )}

                {dragX < -20 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      opacity: Math.min(1, Math.abs(dragX) / 65),
                      scale: Math.min(1.15, 0.85 + Math.abs(dragX) / 120),
                    }}
                    className="absolute top-16 right-6 z-20 px-4 py-2 rounded-2xl bg-rose-600 text-white font-black text-sm tracking-wider shadow-lg shadow-rose-700/30 transform rotate-12 border-2 border-white pointer-events-none"
                  >
                    SKIP ✕
                  </motion.div>
                )}

                {/* Visual Header / Avatar with Warm Scrim */}
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden pointer-events-none">
                  <img
                    src={currentTrader.avatar}
                    alt={currentTrader.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Fallback container if image fails to render */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-stone-100 -z-10">
                    <span className="text-6xl font-black text-emerald-200">
                      {currentTrader.name.charAt(0)}
                    </span>
                  </div>

                  {/* Gradient Scrim for WCAG contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

                  {/* Top Bar on Avatar: Cheerful Compatibility & Hours */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{calculateCompatibility(currentTrader)}% Match</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-200 text-amber-900 text-xs font-mono font-medium shadow-xs">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      <span>{currentTrader.tradingHours}</span>
                    </div>
                  </div>

                  {/* Bottom overlay info on card */}
                  <div className="absolute bottom-3 inset-x-4 text-white">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl font-black tracking-tight drop-shadow-xs">
                        {currentTrader.name}, {currentTrader.age}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-200 mt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {currentTrader.location}
                      </span>
                      <span aria-hidden="true" className="text-stone-400">·</span>
                      <span className="text-emerald-300 font-semibold">
                        {currentTrader.experience} Level
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body & Details in Clean Light Style */}
                <div className="p-5 space-y-4">
                  {/* Clean cheerful markets & styles */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                      Markets & Focus
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {currentTrader.markets.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 transition-transform duration-150 hover:scale-105"
                        >
                          {m === 'NIFTY' && '📈 '}
                          {m === 'Gold' && '🥇 '}
                          {m === 'Options' && '⚡ '}
                          {m === 'Forex' && '💱 '}
                          {m === 'Crypto' && '₿ '}
                          {m === 'Stocks' && '📊 '}
                          {m}
                        </span>
                      ))}
                      {currentTrader.styles.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 text-stone-700 border border-stone-200/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio & Trading Philosophy */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                      About & Philosophy
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-normal">
                      "{currentTrader.bio}"
                    </p>
                  </div>

                  {/* Trading Rules Pledge */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Shield className="h-3.5 w-3.5 text-amber-600" />
                      <span>Trading Rules Followed</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {currentTrader.tradingRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="font-medium">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Languages & Privacy */}
                  <div className="text-xs text-stone-500 pt-1 flex items-center justify-between border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <span>Speaks:</span>
                      <strong className="text-slate-800 font-semibold">
                        {currentTrader.languages.join(', ')}
                      </strong>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span>✓ Privacy Protected</span>
                    </span>
                  </div>
                </div>

                {/* Tactile Action Zone with Smooth Hover Effects */}
                <div className="p-4 bg-stone-50/80 border-t border-stone-200/80 flex items-center justify-between gap-3">
                  <button
                    onClick={handleRewind}
                    disabled={history.length === 0}
                    className="h-12 w-12 rounded-2xl flex items-center justify-center bg-white border border-stone-200 text-stone-500 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/60 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:border-stone-200 transition-all duration-200 shadow-xs group"
                    title="Undo last swipe"
                  >
                    <RotateCcw className="h-5 w-5 transition-transform duration-200 group-hover:-rotate-45" />
                  </button>

                  <button
                    onClick={handleSkip}
                    className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 bg-white hover:bg-rose-50/80 border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 font-bold text-sm hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs group"
                  >
                    <X className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-90" />
                    <span>Skip</span>
                  </button>

                  <button
                    onClick={handleConnect}
                    className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 group"
                  >
                    <UserCheck className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    <span>Connect</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Gesture Hint with cheerful pulsing hand */}
            <div className="text-center mt-3 text-[11px] text-stone-400 flex items-center justify-center gap-1.5 font-medium">
              <Hand className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Drag card left to Skip, right to Connect</span>
            </div>
          </div>
        ) : (
          /* Empty Deck State */
          <div className="rounded-3xl bg-white border border-stone-200 p-8 text-center space-y-4 shadow-lg shadow-stone-200/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Sparkles className="h-8 w-8 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">You've explored all traders in this view!</h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                Reset the deck to review traders again, or broaden your market and experience filters.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleResetDeck}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-600/25 active:translate-y-0 active:scale-95 transition-all duration-200"
              >
                Reset Discovery Deck
              </button>
              <button
                onClick={() => {
                  setSelectedMarketFilter('All');
                  setSelectedExperienceFilter('All');
                  setCurrentIndex(0);
                }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cheerful Friendly Footnote */}
      <div className="mt-8 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 text-xs text-stone-500 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-200 transition-colors">
          <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>PipPal connects traders for mutual accountability. Your broker details and balance remain 100% private.</span>
        </div>
      </div>
    </div>
  );
};
