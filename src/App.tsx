import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  TraderProfile,
  MatchProfile,
  TradingRoom,
  TradeEntry,
  FeedPost,
  RoomMessage,
  WhoLikedProfile,
} from './types';
import {
  CURRENT_USER,
  DISCOVER_TRADERS,
  INITIAL_MATCHES,
  INITIAL_PRIVATE_ROOMS,
  PUBLIC_ROOMS,
  INITIAL_TRADES,
  INITIAL_FEED_POSTS,
  INITIAL_WHO_LIKED_YOU,
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DiscoverView } from './components/DiscoverView';
import { BuddyFinderView } from './components/BuddyFinderView';
import { RoomsView } from './components/RoomsView';
import { JournalView } from './components/JournalView';
import { CommunityFeedView } from './components/CommunityFeedView';
import { ProfileView } from './components/ProfileView';
import { MatchModal } from './components/MatchModal';
import { DirectChatModal } from './components/DirectChatModal';
import { PipPalProModal } from './components/PipPalProModal';
import { LaunchPlaybookModal } from './components/LaunchPlaybookModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // PWA Standalone navigation persistence: restores last active tab from hash or localStorage
  const getInitialTab = (): ActiveTab => {
    try {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      const validTabs: ActiveTab[] = ['discover', 'buddy', 'rooms', 'journal', 'community', 'profile'];
      if (validTabs.includes(hash)) return hash;
      const saved = localStorage.getItem('pippal_active_tab') as ActiveTab;
      if (validTabs.includes(saved)) return saved;
    } catch {
      // Ignore if localStorage unavailable in private mode
    }
    return 'discover';
  };

  const [activeTab, setActiveTabState] = useState<ActiveTab>(getInitialTab);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('pippal_active_tab', tab);
      if (window.location.hash !== `#${tab}`) {
        window.history.pushState(null, '', `#${tab}`);
      }
    } catch {
      // safe fallback
    }
  };

  // Sync back/forward browser and Android hardware navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      const validTabs: ActiveTab[] = ['discover', 'buddy', 'rooms', 'journal', 'community', 'profile'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [currentUser, setCurrentUser] = useState<TraderProfile>(CURRENT_USER);
  const [traders, setTraders] = useState<TraderProfile[]>(DISCOVER_TRADERS);
  const [matches, setMatches] = useState<MatchProfile[]>(INITIAL_MATCHES);
  const [privateRooms, setPrivateRooms] = useState<TradingRoom[]>(INITIAL_PRIVATE_ROOMS);
  const [publicRooms, setPublicRooms] = useState<TradingRoom[]>(PUBLIC_ROOMS);
  const [trades, setTrades] = useState<TradeEntry[]>(INITIAL_TRADES);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);

  // Who Liked You & Payment Gateway state
  const [whoLikedList, setWhoLikedList] = useState<WhoLikedProfile[]>(INITIAL_WHO_LIKED_YOU);
  const [hasUnlockedWhoLiked, setHasUnlockedWhoLiked] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  // Auth & Database Modal State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Modals state
  const [matchedCelebrationTrader, setMatchedCelebrationTrader] = useState<TraderProfile | null>(null);
  const [activeChatTrader, setActiveChatTrader] = useState<TraderProfile | null>(null);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [chatWhatsAppConsentMap, setChatWhatsAppConsentMap] = useState<Record<string, boolean>>({
    trader_aarav: true,
  });

  // Check backend session & load persisted trades on boot
  useEffect(() => {
    const token = localStorage.getItem('pippal_auth_token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    // 1. Fetch user session from database
    fetch('/api/auth/session', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.log('[Session Load Error]:', err));

    // 2. Fetch user's persistent trades from database
    fetch('/api/trades', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.trades) && data.trades.length > 0) {
          setTrades(data.trades);
        }
      })
      .catch((err) => console.log('[Trades Load Error]:', err));
  }, []);

  const handleAuthSuccess = (user: TraderProfile, token: string) => {
    setCurrentUser(user);
    // Reload trades for this newly authenticated trader
    fetch('/api/trades', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.trades)) {
          setTrades(data.trades);
        }
      })
      .catch(() => {});
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('pippal_auth_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    localStorage.removeItem('pippal_auth_token');
    // Prompt login modal
    setAuthMode('login');
    setShowAuthModal(true);
  };

  // Sync profile edits with backend database
  const handleUpdateProfile = async (updated: TraderProfile) => {
    setCurrentUser(updated);
    const token = localStorage.getItem('pippal_auth_token');
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Profile Update Error]:', err);
    }
  };

  // Handle Connect in Discover Deck
  const handleConnectTrader = (trader: TraderProfile) => {
    // Check if this trader is high compatibility (simulate mutual connect)
    const isMutual = trader.markets.some((m) => currentUser.markets.includes(m));

    if (isMutual) {
      // Trigger match celebration modal!
      const newMatch: MatchProfile = {
        id: `match_${Date.now()}`,
        trader,
        matchedAt: 'Just now',
        compatibilityScore: 94,
        matchReasons: [
          `Both trade ${trader.markets[0]} in the same time session`,
          `Shared discipline rules: ${trader.tradingRules[0]}`,
        ],
        myWhatsAppConsent: false,
        theirWhatsAppConsent: trader.whatsappConsent,
      };

      setMatches((prev) => [newMatch, ...prev.filter((m) => m.trader.id !== trader.id)]);
      setMatchedCelebrationTrader(trader);
    }
  };

  const handleSkipTrader = (trader: TraderProfile) => {
    // Skipped action
  };

  // Chat Actions
  const handleStartChat = (trader: TraderProfile) => {
    setMatchedCelebrationTrader(null);
    setActiveChatTrader(trader);
  };

  const handleToggleWhatsAppConsent = (traderId: string) => {
    setChatWhatsAppConsentMap((prev) => ({
      ...prev,
      [traderId]: !prev[traderId],
    }));
  };

  const handleBlockUser = (traderId: string) => {
    setTraders((prev) => prev.filter((t) => t.id !== traderId));
    setMatches((prev) => prev.filter((m) => m.trader.id !== traderId));
    setActiveChatTrader(null);
  };

  const handleReportUser = (traderId: string, reason: string) => {
    // Reported action
  };

  // Private room creation from match or button
  const handleCreatePrivateRoomForTrader = (trader: TraderProfile) => {
    setMatchedCelebrationTrader(null);
    const newRoom: TradingRoom = {
      id: `room_${Date.now()}`,
      title: `${trader.markets[0] || 'Trading'} Mastermind: ${currentUser.name.split(' ')[0]} & ${trader.name.split(' ')[0]}`,
      description: `Private trading desk for discussing market setups, psychology, and risk rules during active sessions.`,
      isPrivate: true,
      category: (trader.markets[0] as any) || 'NIFTY',
      membersCount: 2,
      members: [
        { id: currentUser.id, name: `${currentUser.name} (You)`, avatar: currentUser.avatar, role: 'host' },
        { id: trader.id, name: trader.name, avatar: trader.avatar, role: 'member' },
      ],
      sessionNotice: `Session Hours: ${trader.tradingHours}`,
      messages: [
        {
          id: `init_${Date.now()}`,
          senderId: currentUser.id,
          senderName: `${currentUser.name} (You)`,
          senderAvatar: currentUser.avatar,
          text: `Hey ${trader.name}! Created this private room so we can share setups and hold each other accountable without noise.`,
          timestamp: 'Just now',
        },
      ],
    };

    setPrivateRooms((prev) => [newRoom, ...prev]);
    setActiveTab('rooms');
  };

  const handleCreatePrivateRoomGeneric = (newRoom: TradingRoom) => {
    setPrivateRooms((prev) => [newRoom, ...prev]);
  };

  const handleSendRoomMessage = (roomId: string, message: RoomMessage) => {
    setPrivateRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return { ...r, messages: [...r.messages, message] };
        }
        return r;
      })
    );

    setPublicRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return { ...r, messages: [...r.messages, message] };
        }
        return r;
      })
    );
  };

  // Journal Actions
  const handleAddTrade = async (newTrade: TradeEntry) => {
    setTrades((prev) => [newTrade, ...prev]);
    // Persist to backend database
    const token = localStorage.getItem('pippal_auth_token');
    try {
      await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newTrade),
      });
    } catch (err) {
      console.error('[Add Trade Persistence Error]:', err);
    }
  };

  const handleShareTradeToRoom = (trade: TradeEntry, targetRoomId: string, question: string) => {
    const setupMsg: RoomMessage = {
      id: `msg_trade_share_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (You)`,
      senderAvatar: currentUser.avatar,
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      setup: {
        symbol: trade.symbol,
        direction: trade.direction,
        timeframe: '5-minute',
        pnl: trade.pnl,
        entryReason: trade.notes,
        reflectionQuestion: question,
      },
      reactions: { insightful: 1, goodRisk: 1 },
    };

    handleSendRoomMessage(targetRoomId, setupMsg);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-900 relative">
      {/* Cheerful subtle warm morning aura */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-100/40 via-amber-50/30 to-transparent pointer-events-none -z-10" />

      {/* Universal Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenPro={() => setShowProModal(true)}
        onOpenLaunchPlaybook={() => setShowLaunchModal(true)}
        onOpenAuth={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        matchesCount={matches.length}
        whoLikedCount={whoLikedList.length}
      />

      {/* PWA Install & Offline Status Banner */}
      <PWAInstallBanner />

      {/* Main App Content Container with Smooth Tab Transitions */}
      <main className="flex-1 pb-20 md:pb-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.992 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeTab === 'discover' && (
              <DiscoverView
                traders={traders}
                currentUser={currentUser}
                onConnect={handleConnectTrader}
                onSkip={handleSkipTrader}
                onViewBuddySearch={() => setActiveTab('buddy')}
              />
            )}

            {activeTab === 'buddy' && (
              <BuddyFinderView
                traders={traders}
                currentUser={currentUser}
                whoLikedList={whoLikedList}
                hasUnlockedWhoLiked={hasUnlockedWhoLiked}
                onOpenPaymentGateway={() => setShowPaymentModal(true)}
                onToggleUnlockState={() => setHasUnlockedWhoLiked((prev) => !prev)}
                onConnectTrader={handleConnectTrader}
                onUpdateCurrentUser={handleUpdateProfile}
                onStartChat={handleStartChat}
                onCreatePrivateRoom={handleCreatePrivateRoomForTrader}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomsView
                privateRooms={privateRooms}
                publicRooms={publicRooms}
                currentUser={currentUser}
                availableTraders={traders}
                onCreatePrivateRoom={handleCreatePrivateRoomGeneric}
                onSendMessage={handleSendRoomMessage}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                trades={trades}
                privateRooms={privateRooms}
                onAddTrade={handleAddTrade}
                onShareTradeToRoom={handleShareTradeToRoom}
              />
            )}

            {activeTab === 'community' && (
              <CommunityFeedView
                posts={feedPosts}
                currentUser={currentUser}
                onAddPost={(p) => setFeedPosts([p, ...feedPosts])}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onOpenPro={() => setShowProModal(true)}
                onOpenLaunchPlaybook={() => setShowLaunchModal(true)}
                onOpenAuth={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Ergonomic thumb zone) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchesCount={matches.length}
        whoLikedCount={whoLikedList.length}
      />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
      <PaymentGatewayModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => {
          setHasUnlockedWhoLiked(true);
        }}
        likesCount={whoLikedList.length}
      />

      <MatchModal
        matchedTrader={matchedCelebrationTrader}
        currentUser={currentUser}
        onClose={() => setMatchedCelebrationTrader(null)}
        onStartChat={handleStartChat}
        onCreatePrivateRoom={handleCreatePrivateRoomForTrader}
      />

      {activeChatTrader && (
        <DirectChatModal
          trader={activeChatTrader}
          currentUser={currentUser}
          isOpen={!!activeChatTrader}
          onClose={() => setActiveChatTrader(null)}
          myWhatsAppConsent={!!chatWhatsAppConsentMap[activeChatTrader.id]}
          theirWhatsAppConsent={activeChatTrader.whatsappConsent}
          onToggleMyWhatsAppConsent={() => handleToggleWhatsAppConsent(activeChatTrader.id)}
          onBlockUser={handleBlockUser}
          onReportUser={handleReportUser}
        />
      )}

      <PipPalProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />

      <LaunchPlaybookModal
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
      />
    </div>
  );
}
