import React from 'react';
import { ActiveTab, TraderProfile } from '../types';
import { Sparkles, ShieldCheck, SunMedium, Rocket, User } from 'lucide-react';
import { motion } from 'motion/react';
import { PipPalLogo } from './PipPalLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: TraderProfile;
  onOpenPro: () => void;
  onOpenLaunchPlaybook: () => void;
  onOpenAuth?: () => void;
  matchesCount: number;
  whoLikedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenPro,
  onOpenLaunchPlaybook,
  onOpenAuth,
  whoLikedCount = 3,
}) => {
  const tabs = [
    { id: 'discover' as ActiveTab, label: 'Discover' },
    {
      id: 'buddy' as ActiveTab,
      label: 'Trading Buddy',
      badge: whoLikedCount ? `⚡ ${whoLikedCount} Likes` : currentUser.streakDays ? `${currentUser.streakDays}d` : null,
      isLikeBadge: !!whoLikedCount,
    },
    { id: 'rooms' as ActiveTab, label: 'Rooms' },
    { id: 'journal' as ActiveTab, label: 'Journal' },
    { id: 'community' as ActiveTab, label: 'Community' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-white/85 backdrop-blur-md shadow-xs transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element Brand mark with cheerful heart + uptrend logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none group active:scale-95 transition-all duration-200"
            title="PipPal — Find your trading people"
          >
            <PipPalLogo size="md" />
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors duration-200">
                PipPal
              </span>
            </div>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-stone-200 text-xs text-stone-500">
            <SunMedium className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
            <span className="font-medium text-stone-500">Find your trading people</span>
          </div>
        </div>

        {/* Zone 2: Navigation links with smooth sliding layout indicator and subtle hover */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/60 p-1 rounded-2xl border border-stone-200/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors duration-200 flex items-center gap-1.5 z-10 ${
                  isActive
                    ? 'text-emerald-900'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-tab"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-stone-200/80 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md transition-colors ${
                    isActive ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-stone-200/70 text-stone-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions with responsive hover effects */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenLaunchPlaybook}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300/80 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 whitespace-nowrap shadow-xs"
            title="Production launch & PWA install guide"
          >
            <Rocket className="h-3.5 w-3.5 text-emerald-600 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Launch App</span>
            <span className="sm:hidden">Launch</span>
          </button>

          <button
            onClick={onOpenPro}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/80 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 whitespace-nowrap shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden lg:inline">PipPal Pro</span>
          </button>

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 border border-stone-200/90 hover:border-emerald-300 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xs"
              title="Sign in or register a new trader profile"
            >
              <User className="h-3.5 w-3.5 text-emerald-600" />
              <span>Account</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-400/20'
                : 'bg-white border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300 shadow-xs'
            }`}
          >
            <div className="relative">
              <div className="h-7 w-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-xs text-emerald-800">
                {currentUser.name.charAt(0)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold leading-none truncate max-w-[90px] text-slate-800">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
                <span>Verified</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

