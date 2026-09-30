import React from 'react';
import { ActiveTab } from '../types';
import { Compass, Users, MessageSquareText, BookOpenCheck, Flame, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  matchesCount: number;
  whoLikedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  whoLikedCount = 3,
}) => {
  const navItems = [
    { id: 'discover' as ActiveTab, label: 'Discover', icon: Compass },
    { id: 'buddy' as ActiveTab, label: 'Buddy', icon: Users, badge: whoLikedCount },
    { id: 'rooms' as ActiveTab, label: 'Rooms', icon: MessageSquareText },
    { id: 'journal' as ActiveTab, label: 'Journal', icon: BookOpenCheck },
    { id: 'community' as ActiveTab, label: 'Feed', icon: Flame },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200/90 pb-safe shadow-lg shadow-stone-300/30">
      <div className="grid grid-cols-6 items-center h-16 px-1 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-all duration-200 active:scale-90 relative z-10 ${
                isActive ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active-pill"
                  className="absolute inset-1.5 bg-emerald-50/80 rounded-2xl -z-10 border border-emerald-200/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative"
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-emerald-600' : 'text-stone-500'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-[15px] text-center rounded-full bg-amber-500 text-white font-black text-[9px] leading-tight shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && (
                  <motion.span
                    layoutId="bottomnav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              <span className={`text-[10px] tracking-tight mt-1 truncate max-w-[50px] transition-colors ${
                isActive ? 'text-emerald-800 font-bold' : 'text-stone-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

