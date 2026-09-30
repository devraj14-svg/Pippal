import React, { useState } from 'react';
import {
  Rocket,
  Smartphone,
  Server,
  Scale,
  TrendingUp,
  X,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PipPalLogo } from './PipPalLogo';

interface LaunchPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchPlaybookModal: React.FC<LaunchPlaybookModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pwa' | 'appstore' | 'backend' | 'legal' | 'marketing'>('pwa');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <PipPalLogo size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
              <Rocket className="h-3.5 w-3.5 text-emerald-600" />
              <span>PipPal Launch Playbook</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How to Launch PipPal as a Real Mobile & Web App
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A comprehensive, step-by-step engineering roadmap to go from this working prototype to live app stores and real traders.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>1. Instant PWA App</span>
          </button>

          <button
            onClick={() => setActiveTab('appstore')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'appstore'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>2. Play Store & iOS</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'backend'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>3. Real Cloud Database</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'legal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>4. SEBI & Legal</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'marketing'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>5. Trader Acquisition</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pwa' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>PWA is Now Active in this Applet!</span>
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                PipPal is now configured with an offline-capable Service Worker, Web App Manifest, and mobile app icons. You and your beta users can install it immediately onto your smartphone home screen.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isInstallable ? (
                  <button
                    onClick={install}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Install PipPal App Now</span>
                  </button>
                ) : isInstalled ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                    ✓ Running as Installed App
                  </span>
                ) : isIOS ? (
                  <div className="text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                    <strong>On iPhone/iPad:</strong> Tap Safari's <strong>Share</strong> button (📤) → select <strong>"Add to Home Screen"</strong> (➕).
                  </div>
                ) : (
                  <span className="text-xs text-stone-500">
                    Open in mobile Chrome or Safari to test the 1-click home screen install.
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Production Custom Domain Setup
              </h4>
              <p className="text-stone-600 text-xs">
                To launch publicly with your own brand domain (e.g. <code className="bg-stone-200 px-1 py-0.5 rounded">pippal.in</code> or <code className="bg-stone-200 px-1 py-0.5 rounded">pippal.app</code>):
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700 pl-1">
                <li>Buy a domain on Namecheap or Cloudflare (<strong className="font-semibold">pippal.in</strong> is ideal for Indian traders).</li>
                <li>Connect the domain CNAME records to your Cloud Run / Vercel deployment.</li>
                <li>SSL (HTTPS) will be automatically provisioned for installable PWA compliance.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'appstore' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Packaging for Google Play Store & Apple App Store (Zero Rewrite)
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                You do <strong>not</strong> need to rewrite PipPal in Flutter or React Native! You can wrap this React/Vite codebase into a real native Android (<code className="bg-stone-200 px-1 py-0.5 rounded">.apk</code> / <code className="bg-stone-200 px-1 py-0.5 rounded">.aab</code>) and iOS (<code className="bg-stone-200 px-1 py-0.5 rounded">.ipa</code>) package using <strong>Capacitor</strong>.
              </p>

              {/* Terminal Code Snippet */}
              <div className="p-3 bg-stone-900 text-emerald-400 rounded-xl font-mono text-xs space-y-1 relative">
                <button
                  onClick={() =>
                    handleCopy(
                      'npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios\nnpx cap init PipPal com.pippal.app\nnpm run build\nnpx cap add android\nnpx cap add ios\nnpx cap open android',
                      'cap-cmd'
                    )
                  }
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[10px] flex items-center gap-1 font-sans"
                >
                  {copiedCmd === 'cap-cmd' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCmd === 'cap-cmd' ? 'Copied!' : 'Copy'}</span>
                </button>
                <div className="text-stone-400"># 1. Install Capacitor in your project</div>
                <div>npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios</div>
                <div className="text-stone-400 mt-2"># 2. Initialize native project</div>
                <div>npx cap init PipPal com.pippal.app</div>
                <div className="text-stone-400 mt-2"># 3. Build & generate native Android Studio / Xcode project</div>
                <div>npm run build && npx cap add android && npx cap add ios</div>
                <div>npx cap open android</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 text-xs">Google Play Console</span>
                <p className="text-stone-500 text-[11px]">
                  One-time $25 registration fee. Upload the generated <code className="text-slate-800">.aab</code> bundle directly to production or closed testing tracks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
                <span className="font-bold text-slate-900 text-xs">Apple Developer Program</span>
                <p className="text-stone-500 text-[11px]">
                  $99/year fee. Archive directly in Xcode and submit through App Store Connect.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backend' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <h3 className="font-bold text-slate-900 text-sm">
                Upgrading to a Live Cloud Database & Auth
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Currently, user matches, chat messages, and trade journals are stored in client memory and localStorage. For production, connect a real backend:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 shadow-xs">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>Option A: Firebase Firestore & Authentication (Recommended for Rapid Launch)</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Provides instant real-time synchronization (<code className="bg-stone-100 px-1">onSnapshot</code>) so chat messages and trade reviews appear instantly across all users' devices without writing custom WebSockets.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 shadow-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Option B: Supabase (PostgreSQL) + Row-Level Security</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Relational PostgreSQL database with built-in Indian phone number SMS OTP authentication (via Twilio or MSG91).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900">Phone Number Verification for India:</div>
              <p className="text-stone-700">
                Most young Indian traders prefer logging in with their mobile number (+91 SMS OTP) or 1-tap Google Sign-In rather than email/password.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SEBI Guidelines & Legal Safeguards for India</span>
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                In India, SEBI strictly regulates investment advice and unregistered financial influencers ("finfluencers"). PipPal’s architecture was deliberately designed to comply with these regulations:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-slate-900">1. Mandatory Non-Advisory Disclaimer</span>
                  <p className="text-stone-600 text-[11px]">
                    Display in the footer and sign-up flow: <em>"PipPal is a social peer networking platform for discussing personal learning and trading psychology. PipPal is NOT a SEBI-registered Research Analyst or Investment Adviser. Users do not provide buy/sell recommendations or financial advice."</em>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-slate-900">2. Strict Anti-Tip / Anti-Signal Community Rules</span>
                  <p className="text-stone-600 text-[11px]">
                    Ban "guaranteed return" claims and automated tip bots. Keep the focus strictly on educational setup reviews and personal discipline tracking.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-slate-900">3. Mutual WhatsApp Consent Terms</span>
                  <p className="text-stone-600 text-[11px]">
                    Ensure Terms of Service specify that WhatsApp numbers are exchanged only with explicit voluntary consent from both parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <h3 className="font-bold text-emerald-950 text-sm">
                Acquiring Your First 500 Young Traders
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Young traders (18–35) in India do not respond to corporate financial ads. They respond to humor, shared pain, and community connection:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1 shadow-xs">
                  <span className="font-bold text-slate-900">Instagram Reels & YouTube Shorts</span>
                  <p className="text-stone-600 text-[11px]">
                    "POV: You took 1 trade at 9:15 and now you're staring at the chart for 6 hours alone." → "Find your NIFTY trading buddy on PipPal."
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1 shadow-xs">
                  <span className="font-bold text-slate-900">Discipline & Streak Challenges</span>
                  <p className="text-stone-600 text-[11px]">
                    Launch a "20-Day No Revenge Trading Challenge" where buddies pair up and hold each other accountable daily.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <span className="font-bold text-slate-900">Target Launch Communities:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium">NIFTY Scalpers Club</span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium">MCX Gold Evening Desks</span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium">College Finance Societies</span>
                <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium">Prop Firm Challenge Seekers</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>PipPal Architecture is 100% production-ready for deployment</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  );
};
