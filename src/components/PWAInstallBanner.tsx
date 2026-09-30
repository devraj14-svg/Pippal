import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  WifiOff,
  RefreshCw,
  Sparkles,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PipPalLogo } from './PipPalLogo';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Network online / offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA service worker refresh event
    const handleNeedRefresh = () => setHasUpdate(true);
    window.addEventListener('pwa:need-refresh', handleNeedRefresh);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa:need-refresh', handleNeedRefresh);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    const success = await install();
    if (success) {
      setIsDismissed(true);
    }
  };

  const handleReloadUpdate = () => {
    window.location.reload();
  };

  // If already installed and everything is normal, don't show banners
  if (isInstalled && !isOffline && !hasUpdate) {
    return null;
  }

  return (
    <>
      {/* 1. Offline Mode Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="h-4 w-4 animate-pulse shrink-0" />
            <span>
              You're currently offline. PipPal PWA is operating in offline mode. Journal entries and cached trading rooms remain accessible.
            </span>
          </div>
        </div>
      )}

      {/* 2. New Version Available Banner */}
      {hasUpdate && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>A new version of PipPal is ready!</span>
            </div>
            <button
              onClick={handleReloadUpdate}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 rounded-lg text-[11px] font-bold shadow-xs hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Update Now</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Mobile Install Prompt Banner (Visible on mobile web when not standalone) */}
      {!isInstalled && !isDismissed && (isInstallable || isIOS) && (
        <div className="mx-auto max-w-5xl px-3 sm:px-6 pt-3">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-3.5 sm:p-4 shadow-xl border border-emerald-700/40 flex items-center justify-between gap-3 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 p-1 rounded-xl bg-white/10 backdrop-blur-xs">
                <PipPalLogo size={28} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm tracking-tight truncate">
                    Install PipPal on your Home Screen
                  </h4>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-200">
                    PWA App
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 truncate mt-0.5">
                  Full-screen experience, 0-lag market rooms & instant buddy alerts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isIOS ? 'Add to iPhone' : 'Install App'}</span>
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. iOS Safari Add to Home Screen Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-5">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Install PipPal on iOS Safari
              </h3>
              <p className="text-xs text-stone-600">
                Apple requires installing web apps via the Safari Share menu. Follow these 2 steps:
              </p>
            </div>

            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-slate-800">Tap the Safari Share button</span>
                  <div className="text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <span>Look for</span>
                    <Share2 className="h-3.5 w-3.5 text-blue-600 inline" />
                    <span>at the bottom toolbar of Safari.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-stone-200">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-800">Select "Add to Home Screen"</span>
                  <div className="text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <span>Scroll down and tap</span>
                    <PlusSquare className="h-3.5 w-3.5 text-emerald-600 inline" />
                    <span>Add to Home Screen.</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
