import React, { useState } from 'react';
import { TradeEntry, TradingRoom, MarketType } from '../types';
import {
  BookOpenCheck,
  Plus,
  TrendingUp,
  TrendingDown,
  Share2,
  CheckCircle2,
  XCircle,
  Shield,
  Calendar,
  Sparkles,
  X,
  Check,
} from 'lucide-react';

interface JournalViewProps {
  trades: TradeEntry[];
  privateRooms: TradingRoom[];
  onAddTrade: (trade: TradeEntry) => void;
  onShareTradeToRoom: (trade: TradeEntry, roomId: string, question: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  trades,
  privateRooms,
  onAddTrade,
  onShareTradeToRoom,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [sharingTrade, setSharingTrade] = useState<TradeEntry | null>(null);
  const [targetRoomId, setTargetRoomId] = useState(privateRooms[0]?.id || '');
  const [reflectionQuestion, setReflectionQuestion] = useState(
    'I took this setup today. What do you guys think I could have done better?'
  );
  const [shareSuccess, setShareSuccess] = useState(false);

  // Form state
  const [symbol, setSymbol] = useState('NIFTY');
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [pnl, setPnl] = useState('800');
  const [market, setMarket] = useState<MarketType>('NIFTY');
  const [notes, setNotes] = useState('');
  const [followedRules, setFollowedRules] = useState(true);

  // Today's result calculation
  const totalResult = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const followedCount = trades.filter((t) => t.followedRules).length;
  const disciplineRate = trades.length > 0 ? Math.round((followedCount / trades.length) * 100) : 100;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TradeEntry = {
      id: `trade_${Date.now()}`,
      symbol: symbol.trim(),
      direction,
      pnl: Number(pnl) || 0,
      market,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      notes: notes.trim() || 'Discipline-focused trade.',
      followedRules,
    };

    onAddTrade(newEntry);
    setShowAddModal(false);
    setSymbol('NIFTY');
    setPnl('');
    setNotes('');
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharingTrade || !targetRoomId) return;

    onShareTradeToRoom(sharingTrade, targetRoomId, reflectionQuestion);
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
      setSharingTrade(null);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <BookOpenCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>DISCIPLINE TRACKER</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>PROCESS OVER P&L</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Simple Trading Journal 📖
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track daily trades, celebrate adhering to your rules, and share setups with your private room for honest peer advice.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Log Trade</span>
        </button>
      </div>

      {/* Summary Scorecard in Cheerful Light Design with Hover Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Net Result */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 space-y-1">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Today’s Result
          </div>
          <div
            className={`text-3xl font-black font-mono tabular-nums ${
              totalResult >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {totalResult >= 0
              ? `+₹${totalResult.toLocaleString('en-IN')}`
              : `-₹${Math.abs(totalResult).toLocaleString('en-IN')}`}
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1 font-medium">
            <Calendar className="h-3.5 w-3.5 text-stone-400" />
            <span>{trades.length} trades executed today</span>
          </div>
        </div>

        {/* Rule Discipline Adherence */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 space-y-1">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Rule Adherence Rate
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-emerald-700">
            {disciplineRate}%
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1 font-medium">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>{followedCount} of {trades.length} respected plan</span>
          </div>
        </div>

        {/* Win / Loss Split */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 transition-all duration-200 space-y-1">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Win / Loss Ratio
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-slate-800">
            {winningTrades}W / {trades.length - winningTrades}L
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Strict 1:2 R:R target execution</span>
          </div>
        </div>
      </div>

      {/* Today's Trades List */}
      <div className="rounded-3xl bg-white border border-stone-200/90 overflow-hidden shadow-xl shadow-stone-200/40">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today’s Trades</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Review individual setups and get friendly peer feedback on your execution.
            </p>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {trades.map((trade, idx) => {
            const isProfit = trade.pnl >= 0;

            return (
              <div
                key={trade.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 hover:pl-6 transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isProfit
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isProfit ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        Trade {idx + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-slate-800 font-mono font-bold">
                        {trade.symbol}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          trade.direction === 'Long'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {trade.direction}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 max-w-lg leading-relaxed font-normal">
                      {trade.notes}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-2 font-medium">
                      <span>{trade.time}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        {trade.followedRules ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Followed Rules</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-rose-500" />
                            <span className="text-rose-600 font-bold">Broke Rule Plan</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: P&L + Share Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div
                    className={`text-lg font-mono font-black tabular-nums ${
                      isProfit ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isProfit
                      ? `+₹${trade.pnl.toLocaleString('en-IN')}`
                      : `-₹${Math.abs(trade.pnl).toLocaleString('en-IN')}`}
                  </div>

                  <button
                    onClick={() => setSharingTrade(trade)}
                    className="px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:text-slate-900 bg-stone-100 hover:bg-stone-200/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Share2 className="h-3 w-3 text-emerald-600" />
                    <span>Share to Room</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer result banner */}
        <div className="p-4 bg-stone-50/80 border-t border-stone-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Today’s Net Result
          </span>
          <span
            className={`text-base font-black font-mono tabular-nums ${
              totalResult >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {totalResult >= 0
              ? `+₹${totalResult.toLocaleString('en-IN')}`
              : `-₹${Math.abs(totalResult).toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* Modal: Log New Trade */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-emerald-600" />
                <span>Log Trade in Daily Journal</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Market
                  </label>
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value as MarketType)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="NIFTY">NIFTY</option>
                    <option value="Bank NIFTY">Bank NIFTY</option>
                    <option value="Gold">Gold (MCX)</option>
                    <option value="Stocks">Stocks</option>
                    <option value="Options">Options</option>
                    <option value="Forex">Forex</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Symbol / Strike
                  </label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="e.g. NIFTY 22400 CE"
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Long">Long (Buy)</option>
                    <option value="Short">Short (Sell)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Result P&L in ₹ (Use '-' for loss)
                  </label>
                  <input
                    type="number"
                    required
                    value={pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder="e.g. 1200 or -600"
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Setup Notes & Execution Thoughts
                </label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Waited for 15m VWAP bounce with 12 pt stop. Exited at 1:2 R:R."
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Did you follow your trading rules?</div>
                  <div className="text-[11px] text-stone-500">
                    Did not chase, held defined stop-loss, respected lot size.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={followedRules}
                  onChange={(e) => setFollowedRules(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Share Trade to Room */}
      {sharingTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-600" />
                <span>Share Trade with Private Room</span>
              </h3>
              <button
                onClick={() => setSharingTrade(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {shareSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <Check className="h-8 w-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-slate-900">Trade Shared to Room!</div>
                <div className="text-xs text-stone-600">
                  Your peers in the room have been notified to review your setup.
                </div>
              </div>
            ) : (
              <form onSubmit={handleShareSubmit} className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {sharingTrade.symbol} ({sharingTrade.direction})
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        sharingTrade.pnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {sharingTrade.pnl >= 0 ? `+₹${sharingTrade.pnl}` : `-₹${Math.abs(sharingTrade.pnl)}`}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] line-clamp-2">
                    {sharingTrade.notes}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Target Room
                  </label>
                  <select
                    value={targetRoomId}
                    onChange={(e) => setTargetRoomId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    {privateRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.membersCount} peers)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-amber-800 mb-1">
                    Reflection Question for Peers
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reflectionQuestion}
                    onChange={(e) => setReflectionQuestion(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Asking a specific question encourages constructive feedback rather than blind congratulations.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSharingTrade(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                  >
                    Share Trade
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
