import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Initialize server-side Gemini AI client safely
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_pippal_salt').digest('hex');
}

let whoLikedUnlocked = false;

async function startServer() {
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // 1. Health check & Cloud Run Liveness/Readiness Probes
  // -------------------------------------------------------------
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PipPal PWA Backend with Persistent JSON Database',
      version: '1.1.0',
      pwa: true,
      environment: isProd ? 'production' : 'development',
      hasGeminiKey: Boolean(geminiApiKey),
      uptimeSeconds: Math.floor(process.uptime()),
      dbStats: db.getStats(),
      timestamp: new Date().toISOString(),
    });
  });

  // -------------------------------------------------------------
  // 2. Authentication & Database Endpoints
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email or username and password are required.' });
    }

    // Lookup user by email or username
    const user = db.findUserByEmail(identifier) || db.findUserByUsername(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'No trader account found with that email/handle.' });
    }

    // Verify hash (or accept password123 default seed)
    const incomingHash = hashPassword(password);
    const isValid = user.passwordHash === incomingHash || password === 'password123';
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Try again or use password123.' });
    }

    const session = db.createSession(user.id);
    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      token: session.token,
      user: safeUser,
      message: `Welcome back, ${user.name}!`,
    });
  });

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const {
      name,
      username,
      email,
      password,
      age,
      location,
      experience,
      markets,
      styles,
      tradingHours,
      tradingRules,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (db.findUserByEmail(email)) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_') + '_trader').replace(/[^a-zA-Z0-9_]/g, '');
    if (db.findUserByUsername(cleanUsername)) {
      return res.status(409).json({ success: false, message: 'This handle is already taken. Try another.' });
    }

    const newUser = db.createUser({
      name: name.trim(),
      username: cleanUsername,
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      age: Number(age) || 24,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=400&q=80`,
      location: location || 'Mumbai, India',
      experience: experience || 'Beginner',
      markets: Array.isArray(markets) && markets.length > 0 ? markets : ['NIFTY', 'Options'],
      styles: Array.isArray(styles) && styles.length > 0 ? styles : ['Intraday'],
      tradingHours: tradingHours || '9:15–11:30 AM IST',
      languages: ['English', 'Hindi'],
      bio: 'Committed to strictly following risk management rules and trading with accountability.',
      interests: ['Price Action', 'Risk Management (1:2 R:R)', 'Trading Psychology'],
      tradingRules: Array.isArray(tradingRules) && tradingRules.length > 0 ? tradingRules : ['Max 2 trades per session', 'Strict 15-pt stop-loss'],
      whatsappConsent: false,
      streakDays: 1,
      lastCheckinStatus: 'adhered',
    });

    const session = db.createSession(newUser.id);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      token: session.token,
      user: safeUser,
      message: 'Account created! Welcome to PipPal.',
    });
  });

  app.get('/api/auth/session', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      const session = db.getSession(token);
      if (session) {
        const user = db.findUserById(session.userId);
        if (user) {
          const { passwordHash: _, ...safeUser } = user;
          return res.json({ authenticated: true, user: safeUser });
        }
      }
    }

    // Default to the first registered user for instant demo
    const defaultUser = db.findUserByEmail('devrajjofficial@gmail.com') || Array.from((db as any).users.values())[0];
    if (defaultUser) {
      const { passwordHash: _, ...safeUser } = defaultUser as any;
      return res.json({ authenticated: true, user: safeUser });
    }

    return res.json({ authenticated: false, user: null });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (token) {
      db.deleteSession(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // -------------------------------------------------------------
  // 3. User Profile Endpoints
  // -------------------------------------------------------------
  app.get('/api/user/profile', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    let user = token ? (db.getSession(token) ? db.findUserById(db.getSession(token)!.userId) : null) : null;
    if (!user) {
      user = db.findUserByEmail('devrajjofficial@gmail.com');
    }
    if (user) {
      const { passwordHash: _, ...safeUser } = user;
      return res.json(safeUser);
    }
    return res.status(404).json({ error: 'User not found' });
  });

  app.put('/api/user/profile', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const session = token ? db.getSession(token) : null;
    const userId = session?.userId || 'user_devraj';

    const updated = db.updateUser(userId, req.body);
    if (updated) {
      const { passwordHash: _, ...safeUser } = updated;
      return res.json({ success: true, profile: safeUser });
    }
    return res.status(400).json({ success: false, message: 'Could not update profile' });
  });

  // -------------------------------------------------------------
  // 3b. Database Journal Trades Endpoints
  // -------------------------------------------------------------
  app.get('/api/trades', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const session = token ? db.getSession(token) : null;
    const userId = session?.userId || 'user_devraj';

    const trades = db.getTrades(userId);
    return res.json({ success: true, trades });
  });

  app.post('/api/trades', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const session = token ? db.getSession(token) : null;
    const userId = session?.userId || 'user_devraj';

    const { symbol, direction, pnl, market, notes, followedRules } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    const newTrade = db.addTrade({
      userId,
      symbol: symbol.trim(),
      direction: direction || 'Long',
      pnl: Number(pnl) || 0,
      market: market || 'NIFTY',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      notes: notes || '',
      followedRules: followedRules ?? true,
    });

    return res.status(201).json({ success: true, trade: newTrade });
  });

  // -------------------------------------------------------------
  // 4. Who Liked You & Payment Gateway Verification Endpoints
  // -------------------------------------------------------------
  app.get('/api/who-liked/status', (req: Request, res: Response) => {
    res.json({
      unlocked: whoLikedUnlocked,
      likesCount: 3,
    });
  });

  app.post('/api/who-liked/unlock', (req: Request, res: Response) => {
    whoLikedUnlocked = true;
    res.json({
      success: true,
      unlocked: true,
      message: 'PipPal Pass activated! Who Liked You profiles unblurred.',
    });
  });

  app.post('/api/who-liked/lock', (req: Request, res: Response) => {
    whoLikedUnlocked = false;
    res.json({
      success: true,
      unlocked: false,
      message: 'Who Liked You locked for testing.',
    });
  });

  app.post('/api/payment/verify', (req: Request, res: Response) => {
    const { plan, method, upiId, amount } = req.body;
    // Simulated banking webhook / transaction logging
    whoLikedUnlocked = true;
    res.json({
      success: true,
      paymentId: `pay_${Date.now()}`,
      orderId: `order_${Math.floor(Math.random() * 1000000)}`,
      amount: amount || (plan === 'monthly' ? 199 : 49),
      currency: 'INR',
      method: method || 'upi',
      status: 'captured',
      message: 'Payment verified successfully via NPCI / Gateway gateway.',
    });
  });

  // -------------------------------------------------------------
  // 5. Server-Side Gemini AI Endpoints (No API keys exposed to client)
  // -------------------------------------------------------------
  app.post('/api/ai/match-advice', async (req: Request, res: Response) => {
    const { traderName, targetMarket, tradingHours, myRules } = req.body;

    if (!ai) {
      // Deterministic fallback if API key not configured yet
      return res.json({
        success: true,
        source: 'rule-engine',
        advice: `High compatibility with ${traderName || 'this trader'}. Both trade ${targetMarket || 'NIFTY'} during the ${tradingHours || 'morning'} session. Recommendation: set a mutual rule to message each other after your 2nd trade to lock terminal!`,
        suggestedAccountabilityRule: 'Ping buddy after 2 completed trades to prevent overtrading tilt.',
      });
    }

    try {
      const prompt = `You are PipPal AI, an expert trading psychology and discipline mentor for young retail traders.
Provide a concise, punchy 2-3 sentence compatibility summary and 1 accountability action item for two traders wanting to buddy up.
Trader 1 (User): Morning NIFTY session trader, 2-trade limit per day, strict 15-pt stop.
Trader 2: ${traderName || 'Peer'}, Market: ${targetMarket || 'NIFTY'}, Hours: ${tradingHours || 'Morning'}.
User rules: ${myRules ? JSON.stringify(myRules) : 'Max 2 trades per session'}.
Tone: Energetic, disciplined, anti-gambling, focused on risk management.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        source: 'gemini-2.5-flash',
        advice: response.text || 'Great session match! Hold each other strictly to your stop-loss pledges.',
      });
    } catch (err: unknown) {
      console.error('[Gemini AI Backend Error]:', err);
      return res.json({
        success: true,
        source: 'fallback',
        advice: `Strong session alignment with ${traderName || 'this trader'}. Enforce each other's 2-trade rule before midday!`,
      });
    }
  });

  app.post('/api/ai/journal-review', async (req: Request, res: Response) => {
    const { symbol, direction, pnl, followedRules, notes } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'rule-engine',
        analysis: followedRules
          ? `Great execution on ${symbol}! Even if P&L fluctuated, adhering to your trading plan is the only habit that yields long-term compounding.`
          : `Rule violation flagged on ${symbol}. Take 10 deep breaths, log the root emotion (FOMO vs revenge), and step away from charts today.`,
        grade: followedRules ? 'A' : 'C-',
      });
    }

    try {
      const prompt = `You are a professional trading psychology coach.
Review this trade entry:
Symbol: ${symbol} (${direction})
P&L: ${pnl >= 0 ? '+' : ''}${pnl}
Followed Rules: ${followedRules ? 'YES' : 'NO - BROKE RULES'}
Notes: "${notes || 'No notes provided'}"

Provide:
1) A 2-sentence psychological review (praising discipline if rules followed, or constructively pointing out tilt risk if broken).
2) One mindset tip for tomorrow.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        source: 'gemini-2.5-flash',
        analysis: response.text,
      });
    } catch (err: unknown) {
      console.error('[Gemini AI Journal Review Error]:', err);
      return res.json({
        success: true,
        source: 'fallback',
        analysis: followedRules
          ? 'Process over outcome: Adhering to your rules is what builds a profitable trading career.'
          : 'Discipline breach identified. Step away from the screen and review your rulebook before the next bell.',
      });
    }
  });

  // -------------------------------------------------------------
  // 6. Vite Dev Middleware / Production Static File Serving
  // -------------------------------------------------------------
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        index: false,
        maxAge: '1d',
        setHeaders: (res, filepath) => {
          // Service worker and manifest should never be aggressively cached
          if (filepath.endsWith('sw.js') || filepath.endsWith('manifest.webmanifest')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          }
        },
      })
    );

    // Fallback to index.html for SPA client navigation
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // -------------------------------------------------------------
  // 7. Start listening on 0.0.0.0 (Port 3000 / Cloud Run PORT)
  // -------------------------------------------------------------
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[PipPal PWA] Full-Stack server running at http://0.0.0.0:${PORT} [${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch((err) => {
  console.error('[PipPal Server Startup Error]:', err);
  process.exit(1);
});
