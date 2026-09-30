import React from 'react';
import { TraderProfile } from '../types';
import { Sparkles, MessageCircle, Home, X, Clock, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PipPalLogo } from './PipPalLogo';

interface MatchModalProps {
  matchedTrader: TraderProfile | null;
  currentUser: TraderProfile;
  onClose: () => void;
  onStartChat: (trader: TraderProfile) => void;
  onCreatePrivateRoom: (trader: TraderProfile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  matchedTrader,
  currentUser,
  onClose,
  onStartChat,
  onCreatePrivateRoom,
}) => {
  if (!matchedTrader) return null;

  // Find common markets
  const commonMarkets = matchedTrader.markets.filter((m) =>
    currentUser.markets.includes(m)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border-2 border-emerald-300 shadow-2xl p-6 text-center space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Celebration Tagline */}
          <div className="space-y-1 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
              <PartyPopper className="h-3.5 w-3.5 text-emerald-700" />
              <span>Mutual Trader Match</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-2">
              🎉 It’s a Match!
            </h2>
          </div>

          {/* Avatars connection illustration */}
          <div className="flex items-center justify-center -space-x-3 my-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-stone-100 shadow-lg">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="z-10 flex items-center justify-center rounded-2xl shadow-md p-0.5 bg-white ring-2 ring-emerald-200">
              <PipPalLogo size={32} />
            </div>

            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-stone-100 shadow-lg">
                <img
                  src={matchedTrader.avatar}
                  alt={matchedTrader.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>

          {/* Mutual explanation */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              You and <span className="text-emerald-700 font-extrabold">{matchedTrader.name}</span> both trade{' '}
              <span className="text-emerald-800 underline decoration-emerald-400">{commonMarkets.join(' & ') || 'similar markets'}</span>{' '}
              and are active during the same hours.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-amber-800 font-mono font-medium">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Active Window: {matchedTrader.tradingHours}</span>
            </div>
          </div>

          {/* Core Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => onStartChat(matchedTrader)}
              className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Start Chat</span>
            </button>

            <button
              onClick={() => onCreatePrivateRoom(matchedTrader)}
              className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 hover:text-slate-900 border border-stone-200 font-bold text-sm hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
            >
              <Home className="h-4 w-4 text-emerald-700 transition-transform group-hover:scale-110" />
              <span>Create Private Room</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-slate-900 transition-colors"
            >
              Keep Swiping / Discover More
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
