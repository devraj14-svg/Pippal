import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, 'data_store');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface StoredUser {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string; // salted SHA-256 for secure storage
  age: number;
  avatar: string;
  location: string;
  experience: 'Beginner' | 'Intermediate' | 'Experienced';
  markets: string[];
  styles: string[];
  tradingHours: string;
  languages: string[];
  bio: string;
  interests: string[];
  tradingRules: string[];
  whatsappConsent: boolean;
  whatsappNumber?: string;
  accountabilityGoal?: string;
  streakDays: number;
  lastCheckinStatus: 'adhered' | 'deviated' | null;
  activeBuddyId?: string;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface StoredTrade {
  id: string;
  userId: string;
  symbol: string;
  direction: 'Long' | 'Short';
  pnl: number;
  market: string;
  timestamp: string;
  notes: string;
  followedRules: boolean;
}

export interface StoredMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  setup?: any;
}

export interface StoredPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorExperience: string;
  topic: 'Discipline' | 'Psychology' | 'Setups' | 'Loss Review';
  content: string;
  timeAgo: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    timeAgo: string;
  }>;
}

class JsonDatabase {
  private usersFile = path.join(DATA_DIR, 'users.json');
  private sessionsFile = path.join(DATA_DIR, 'sessions.json');
  private tradesFile = path.join(DATA_DIR, 'trades.json');
  private roomsFile = path.join(DATA_DIR, 'rooms.json');
  private postsFile = path.join(DATA_DIR, 'posts.json');

  private users: Map<string, StoredUser> = new Map();
  private sessions: Map<string, StoredSession> = new Map();
  private trades: StoredTrade[] = [];
  private rooms: any[] = [];
  private posts: StoredPost[] = [];

  constructor() {
    this.loadAll();
    this.seedDefaultsIfEmpty();
  }

  private loadFile<T>(filePath: string, fallback: T): T {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`[DB] Error loading ${filePath}:`, e);
    }
    return fallback;
  }

  private saveFile(filePath: string, data: any) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`[DB] Error saving ${filePath}:`, e);
    }
  }

  private loadAll() {
    const usersArr = this.loadFile<StoredUser[]>(this.usersFile, []);
    usersArr.forEach((u) => this.users.set(u.id, u));

    const sessArr = this.loadFile<StoredSession[]>(this.sessionsFile, []);
    sessArr.forEach((s) => this.sessions.set(s.token, s));

    this.trades = this.loadFile<StoredTrade[]>(this.tradesFile, []);
    this.rooms = this.loadFile<any[]>(this.roomsFile, []);
    this.posts = this.loadFile<StoredPost[]>(this.postsFile, []);
  }

  private seedDefaultsIfEmpty() {
    if (this.users.size === 0) {
      const defaultUser: StoredUser = {
        id: 'user_devraj',
        name: 'Devraj Joshi',
        username: 'devraj_trades',
        email: 'devrajjofficial@gmail.com',
        // pre-hashed SHA-256 for password "password123"
        passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        age: 24,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        location: 'Bengaluru, India',
        experience: 'Beginner',
        markets: ['NIFTY', 'Gold', 'Options'],
        styles: ['Intraday', 'Scalping'],
        tradingHours: '9:15–11:30 AM IST',
        languages: ['Hindi', 'English'],
        bio: 'Learning price action and VWAP pullbacks. Main goal is strict risk management—stopping after 2 trades win or lose.',
        interests: ['Price Action', 'Trading in the Zone', 'Risk Management (1:2 R:R)', 'Psychology', 'Morning Momentum'],
        tradingRules: [
          'Max 2 trades per session',
          'Hard stop-loss of 15 points on NIFTY index',
          'No trading after 11:30 AM IST',
          'Never add to a losing position',
        ],
        whatsappConsent: false,
        whatsappNumber: '+91 98765 43210',
        accountabilityGoal: 'Complete 20 trading days adhering strictly to my 2-trade limit.',
        streakDays: 4,
        lastCheckinStatus: 'adhered',
        activeBuddyId: 'trader_aarav',
        createdAt: new Date().toISOString(),
      };
      this.users.set(defaultUser.id, defaultUser);
      this.persistUsers();
    }

    if (this.trades.length === 0) {
      this.trades = [
        {
          id: 'trade_1',
          userId: 'user_devraj',
          symbol: 'NIFTY 23500 CE',
          direction: 'Long',
          pnl: 1450,
          market: 'NIFTY',
          timestamp: 'Today, 9:42 AM',
          notes: 'VWAP bounce with volume confirmation on 5m chart. Took 1:2.2 R:R and respected strict trailing stop.',
          followedRules: true,
        },
        {
          id: 'trade_2',
          userId: 'user_devraj',
          symbol: 'BANKNIFTY 50800 PE',
          direction: 'Short',
          pnl: -620,
          market: 'Bank NIFTY',
          timestamp: 'Yesterday, 10:15 AM',
          notes: 'Entered near resistance but market consolidated. Hit planned 15-pt hard stop without hesitation.',
          followedRules: true,
        },
        {
          id: 'trade_3',
          userId: 'user_devraj',
          symbol: 'CRUDEOIL 6100 CE',
          direction: 'Long',
          pnl: 2100,
          market: 'Options',
          timestamp: '2 days ago',
          notes: 'Breakout pullback after inventory numbers. Waited 15 mins for candle close. Followed rules 100%.',
          followedRules: true,
        },
      ];
      this.persistTrades();
    }
  }

  private persistUsers() {
    this.saveFile(this.usersFile, Array.from(this.users.values()));
  }

  private persistSessions() {
    this.saveFile(this.sessionsFile, Array.from(this.sessions.values()));
  }

  private persistTrades() {
    this.saveFile(this.tradesFile, this.trades);
  }

  private persistRooms() {
    this.saveFile(this.roomsFile, this.rooms);
  }

  private persistPosts() {
    this.saveFile(this.postsFile, this.posts);
  }

  // --- User Operations ---
  public findUserByEmail(email: string): StoredUser | undefined {
    const lower = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === lower) return u;
    }
    return undefined;
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    const lower = username.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === lower) return u;
    }
    return undefined;
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.users.get(id);
  }

  public createUser(userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: StoredUser = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    this.persistUsers();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<StoredUser>): StoredUser | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    this.persistUsers();
    return updated;
  }

  // --- Sessions Operations ---
  public createSession(userId: string): StoredSession {
    const token = `pippal_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    const session: StoredSession = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    this.sessions.set(token, session);
    this.persistSessions();
    return session;
  }

  public getSession(token: string): StoredSession | undefined {
    const session = this.sessions.get(token);
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(token);
      this.persistSessions();
      return undefined;
    }
    return session;
  }

  public deleteSession(token: string): boolean {
    const deleted = this.sessions.delete(token);
    if (deleted) this.persistSessions();
    return deleted;
  }

  // --- Trades Operations ---
  public getTrades(userId: string): StoredTrade[] {
    return this.trades.filter((t) => t.userId === userId);
  }

  public addTrade(trade: Omit<StoredTrade, 'id'>): StoredTrade {
    const newTrade: StoredTrade = {
      ...trade,
      id: `trade_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    this.trades.unshift(newTrade);
    this.persistTrades();
    return newTrade;
  }

  // --- Database Stats ---
  public getStats() {
    return {
      usersCount: this.users.size,
      activeSessions: this.sessions.size,
      tradesCount: this.trades.length,
      storageEngine: 'JsonFilePersistence (data_store/*.json)',
    };
  }
}

export const db = new JsonDatabase();
