export type MarketType = 'NIFTY' | 'Bank NIFTY' | 'Stocks' | 'Gold' | 'Forex' | 'Crypto' | 'Options';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Experienced';

export type TradingStyle = 'Intraday' | 'Swing' | 'Scalping' | 'Position';

export interface TraderProfile {
  id: string;
  name: string;
  username: string;
  age: number;
  avatar: string;
  location: string;
  experience: ExperienceLevel;
  markets: MarketType[];
  styles: TradingStyle[];
  tradingHours: string;
  languages: string[];
  bio: string;
  interests: string[];
  tradingRules: string[];
  whatsappConsent: boolean;
  whatsappNumber?: string;
  accountabilityGoal?: string;
  streakDays?: number;
  lastCheckinStatus?: 'adhered' | 'deviated' | null;
  activeBuddyId?: string;
}

export interface MatchProfile {
  id: string;
  trader: TraderProfile;
  matchedAt: string;
  compatibilityScore: number;
  matchReasons: string[];
  myWhatsAppConsent: boolean;
  theirWhatsAppConsent: boolean;
  unreadCount?: number;
}

export interface SetupShareDetails {
  symbol: string;
  direction: 'Long' | 'Short';
  timeframe: string;
  pnl?: number;
  entryReason: string;
  reflectionQuestion: string;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  setup?: SetupShareDetails;
  reactions?: {
    insightful?: number;
    goodRisk?: number;
    support?: number;
  };
}

export interface TradingRoom {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  category: 'NIFTY' | 'Gold' | 'Forex' | 'Crypto' | 'Stocks' | 'Psychology';
  membersCount: number;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    role?: 'host' | 'member';
  }>;
  messages: RoomMessage[];
  sessionNotice?: string;
}

export interface TradeEntry {
  id: string;
  symbol: string;
  direction: 'Long' | 'Short';
  pnl: number;
  market: MarketType;
  time: string;
  date: string;
  notes: string;
  followedRules: boolean;
  sharedToRoomId?: string;
}

export interface FeedPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    experience: ExperienceLevel;
    location: string;
    primaryMarket: MarketType;
  };
  content: string;
  topic: 'Psychology' | 'Discipline' | 'Setups' | 'Beginner Help' | 'Milestone';
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  timestamp: string;
  comments?: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }>;
}

export interface WhoLikedProfile {
  id: string;
  trader: TraderProfile;
  likedAt: string;
  compatibilityScore: number;
  teaserMarket: string;
  teaserHours: string;
  teaserNote: string;
}

export type ActiveTab = 'discover' | 'buddy' | 'rooms' | 'journal' | 'community' | 'profile';
