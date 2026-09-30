import React from 'react';
import { Sparkles, Check, X, Shield, Users, Radio, BarChart3, Lock } from 'lucide-react';
import { PipPalLogo } from './PipPalLogo';

interface PipPalProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipPalProModal: React.FC<PipPalProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2">
            <PipPalLogo size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Community Roadmap & Vision</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            PipPal Free MVP vs. PipPal Pro
          </h2>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            Our goal is making trading social, accountable, and supportive without heavy subscription paywalls.
          </p>
        </div>

        {/* Comparison Grid in Light Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Free Tier */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-slate-900 text-sm">PipPal Free</span>
              <span className="text-emerald-700 font-bold font-mono">₹0 / month</span>
            </div>
            <p className="text-stone-500 text-[11px]">
              Everything you need to find trading buddies and maintain daily discipline.
            </p>

            <ul className="space-y-2 text-stone-700 font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Trader Profile & Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Tinder-Style Discover Swiping</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Mutual Matching & Direct Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Private & Public Trading Rooms</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Simple Daily Trading Journal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>WhatsApp Mutual Consent Link</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier Future Roadmap */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/70 to-white border-2 border-amber-300 space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute top-2 right-2 text-[10px] uppercase font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
              Upcoming
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-bold text-amber-900 text-sm">PipPal Pro</span>
              <span className="text-amber-800 font-bold font-mono">₹199–499/mo</span>
            </div>
            <p className="text-stone-500 text-[11px]">
              Optional advanced tools for prop firms and mastermind desks.
            </p>

            <ul className="space-y-2 text-stone-700 font-medium">
              <li className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Live Audio / Voice Rooms</span>
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Journal Psychology Heatmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Unlimited Private Mastermind Desks</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>AI-Free Algorithmic Partner Search</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Custom Private Communities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safe notice */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 text-center flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>PipPal will never sell buy/sell signals or trade on your behalf.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors shadow-xs"
        >
          Got it, continue exploring Free MVP
        </button>
      </div>
    </div>
  );
};
