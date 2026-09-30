import React, { useState } from 'react';
import { TradingRoom, RoomMessage, TraderProfile, SetupShareDetails } from '../types';
import {
  MessageSquare,
  Lock,
  Globe,
  Plus,
  Send,
  HelpCircle,
  X,
  Share2,
} from 'lucide-react';

interface RoomsViewProps {
  privateRooms: TradingRoom[];
  publicRooms: TradingRoom[];
  currentUser: TraderProfile;
  availableTraders: TraderProfile[];
  onCreatePrivateRoom: (newRoom: TradingRoom) => void;
  onSendMessage: (roomId: string, message: RoomMessage) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  privateRooms,
  publicRooms,
  currentUser,
  availableTraders,
  onCreatePrivateRoom,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    privateRooms[0]?.id || publicRooms[0]?.id || ''
  );
  const [messageText, setMessageText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSetupShareModal, setShowSetupShareModal] = useState(false);

  // New room form state
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<'NIFTY' | 'Gold' | 'Forex' | 'Crypto' | 'Stocks' | 'Psychology'>('NIFTY');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUser.id]);

  // Setup share form state
  const [setupSymbol, setSetupSymbol] = useState('NIFTY 22400 CE');
  const [setupDirection, setSetupDirection] = useState<'Long' | 'Short'>('Long');
  const [setupTimeframe, setSetupTimeframe] = useState('5-minute');
  const [setupPnl, setSetupPnl] = useState('1200');
  const [setupReason, setSetupReason] = useState('Opening gap pull-back to 15m VWAP bounce with 12 pt stop');
  const [setupQuestion, setSetupQuestion] = useState('Did I trail my stop loss too quickly or was taking 1:2 R:R the right decision?');

  const allRooms = [...privateRooms, ...publicRooms];
  const activeRoom = allRooms.find((r) => r.id === selectedRoomId) || allRooms[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom) return;

    const newMsg: RoomMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (You)`,
      senderAvatar: currentUser.avatar,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(activeRoom.id, newMsg);
    setMessageText('');
  };

  const handleShareSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom) return;

    const setupDetails: SetupShareDetails = {
      symbol: setupSymbol,
      direction: setupDirection,
      timeframe: setupTimeframe,
      pnl: setupPnl ? Number(setupPnl) : undefined,
      entryReason: setupReason,
      reflectionQuestion: setupQuestion,
    };

    const newMsg: RoomMessage = {
      id: `msg_setup_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (You)`,
      senderAvatar: currentUser.avatar,
      text: `I took this setup today. What do you guys think I could have done better?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      setup: setupDetails,
      reactions: { insightful: 1, goodRisk: 1 },
    };

    onSendMessage(activeRoom.id, newMsg);
    setShowSetupShareModal(false);
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const roomMembers: TradingRoom['members'] = availableTraders
      .filter((t) => selectedMembers.includes(t.id))
      .map((t) => ({ id: t.id, name: t.name, avatar: t.avatar, role: 'member' }));

    roomMembers.unshift({
      id: currentUser.id,
      name: `${currentUser.name} (You)`,
      avatar: currentUser.avatar,
      role: 'host',
    });

    const newRoom: TradingRoom = {
      id: `room_${Date.now()}`,
      title: newRoomTitle.trim(),
      description: newRoomDesc.trim() || 'A private room for disciplined trading discussions.',
      isPrivate: true,
      category: newRoomCategory,
      membersCount: roomMembers.length,
      members: roomMembers,
      sessionNotice: 'Private Trader Mastermind',
      messages: [
        {
          id: `m_init_${Date.now()}`,
          senderId: currentUser.id,
          senderName: `${currentUser.name} (You)`,
          senderAvatar: currentUser.avatar,
          text: `Welcome to ${newRoomTitle.trim()}! Let's use this room for reviewing setups, mistakes, and keeping risk in check.`,
          timestamp: 'Just now',
        },
      ],
    };

    onCreatePrivateRoom(newRoom);
    setSelectedRoomId(newRoom.id);
    setShowCreateModal(false);
    setNewRoomTitle('');
    setNewRoomDesc('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span>PEER COLLABORATION</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>LEARNING OVER SIGNALS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trading Rooms
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Discuss morning market setups, review execution mistakes, and enjoy trading alongside friendly peers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Private Room</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar List + Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl bg-white border border-stone-200/90 overflow-hidden shadow-xl shadow-stone-200/50 min-h-[640px]">
        {/* Left Column: Room Categories & Room List (4 cols) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col bg-stone-50/60">
          {/* Segmented Switch: Private vs Public */}
          <div className="p-3 border-b border-stone-200">
            <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-xl">
              <button
                onClick={() => setActiveTab('private')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'private'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Private ({privateRooms.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('public')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'public'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Public ({publicRooms.length})</span>
              </button>
            </div>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px] lg:max-h-[560px]">
            {(activeTab === 'private' ? privateRooms : publicRooms).map((room) => {
              const isSelected = room.id === selectedRoomId;
              const lastMsg = room.messages[room.messages.length - 1];

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-white border-emerald-300 shadow-md text-slate-900 ring-1 ring-emerald-300/40'
                      : 'bg-white/70 hover:bg-white hover:border-emerald-200 hover:shadow-xs border-stone-200/80 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {room.title}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0 font-medium">
                      {room.membersCount} peers
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-normal">
                    {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : room.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px]">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {room.category}
                    </span>
                    {room.sessionNotice && (
                      <>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-stone-500 truncate max-w-[150px]">
                          {room.sessionNotice}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Room Active Chat & Discussion (8 cols) */}
        {activeRoom ? (
          <div className="lg:col-span-8 flex flex-col h-full bg-white justify-between min-h-[500px]">
            {/* Room Top Bar */}
            <div className="p-4 border-b border-stone-200 bg-stone-50/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{activeRoom.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono font-medium border border-stone-200">
                    {activeRoom.isPrivate ? 'Private Room' : 'Public Desk'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{activeRoom.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSetupShareModal(true)}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Setup for Feedback</span>
                </button>
              </div>
            </div>

            {/* Room Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[460px] bg-[#faf9f6]/40">
              {/* Notice encouraging discussion */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Supportive Culture: </span>
                  Focus on process, risk-to-reward discipline, and psychology. Ask questions to grow together!
                </div>
              </div>

              {activeRoom.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="h-8 w-8 rounded-full object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />

                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isMe ? 'items-end' : ''}`}>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span className="font-bold text-slate-700">{msg.senderName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px]">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-slate-900 rounded-tl-none border border-stone-200 shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* If this message contains a Trade Setup Share */}
                        {msg.setup && (
                          <div className={`mt-3 p-3 rounded-xl border text-xs space-y-2 ${
                            isMe ? 'bg-emerald-700/70 border-emerald-500/80 text-white' : 'bg-emerald-50/80 border-emerald-200 text-slate-800'
                          }`}>
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-200/40 pb-2">
                              <span className="font-bold font-mono">
                                📊 {msg.setup.symbol} · {msg.setup.direction} ({msg.setup.timeframe})
                              </span>
                              {msg.setup.pnl !== undefined && (
                                <span
                                  className={`font-mono font-bold ${
                                    msg.setup.pnl >= 0 ? (isMe ? 'text-emerald-100' : 'text-emerald-700') : 'text-rose-600'
                                  }`}
                                >
                                  {msg.setup.pnl >= 0 ? `+₹${msg.setup.pnl.toLocaleString('en-IN')}` : `-₹${Math.abs(msg.setup.pnl).toLocaleString('en-IN')}`}
                                </span>
                              )}
                            </div>

                            <div>
                              <strong className={isMe ? 'text-emerald-100' : 'text-stone-600'}>Setup Rationale:</strong>{' '}
                              {msg.setup.entryReason}
                            </div>

                            <div className={`p-2 rounded-lg italic font-medium ${isMe ? 'bg-emerald-800/60 text-emerald-100' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                              ❓ <strong>Critique Question:</strong> "{msg.setup.reflectionQuestion}"
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Micro Reactions */}
                      {msg.reactions && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          {msg.reactions.insightful && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                              💡 {msg.reactions.insightful}
                            </span>
                          )}
                          {msg.reactions.goodRisk && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                              🛡️ {msg.reactions.goodRisk} Good Risk
                            </span>
                          )}
                          {msg.reactions.support && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                              🤝 {msg.reactions.support}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Discuss market setups in ${activeRoom.title}...`}
                className="flex-1 h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-600/25 active:translate-y-0 active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none text-white font-bold transition-all duration-200 flex items-center justify-center shrink-0 shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 text-stone-400">
            Select a room to begin discussing.
          </div>
        )}
      </div>

      {/* Modal: Create Private Trading Room */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span>Create Private Trading Room</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🏠 Morning NIFTY Room, Gold Scalpers Desk"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Market Focus
                </label>
                <select
                  value={newRoomCategory}
                  onChange={(e) => setNewRoomCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="NIFTY">NIFTY / Bank NIFTY</option>
                  <option value="Gold">Gold & Commodities (MCX)</option>
                  <option value="Stocks">Stocks / Cash Market</option>
                  <option value="Forex">Forex</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Psychology">Psychology & Discipline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description & Ground Rules
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Review morning VWAP entries, stop losses, and daily mistakes."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Invite Matched Traders
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {availableTraders.map((t) => {
                    const isSelected = selectedMembers.includes(t.id);
                    return (
                      <label
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-100 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="text-slate-900 font-semibold">{t.name}</span>
                          <span className="text-stone-500">({t.markets.join(', ')})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers((prev) => [...prev, t.id]);
                            } else {
                              setSelectedMembers((prev) => prev.filter((id) => id !== t.id));
                            }
                          }}
                          className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Share Trade Setup to Room for Critique */}
      {showSetupShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-600" />
                <span>Share Trade Setup for Peer Critique</span>
              </h3>
              <button
                onClick={() => setShowSetupShareModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleShareSetup} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Symbol
                  </label>
                  <input
                    type="text"
                    required
                    value={setupSymbol}
                    onChange={(e) => setSetupSymbol(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Direction
                  </label>
                  <select
                    value={setupDirection}
                    onChange={(e) => setSetupDirection(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Long">Long (Buy)</option>
                    <option value="Short">Short (Sell)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={setupTimeframe}
                    onChange={(e) => setSetupTimeframe(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Result P&L (₹)
                  </label>
                  <input
                    type="number"
                    value={setupPnl}
                    onChange={(e) => setSetupPnl(e.target.value)}
                    placeholder="e.g. 1200 or -600"
                    className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Why did you take this trade? (Entry Rationale)
                </label>
                <textarea
                  rows={2}
                  required
                  value={setupReason}
                  onChange={(e) => setSetupReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-800 mb-1">
                  What question do you want the room to answer?
                </label>
                <textarea
                  rows={2}
                  required
                  value={setupQuestion}
                  onChange={(e) => setSetupQuestion(e.target.value)}
                  placeholder="e.g. What could I have done better on entry or exit?"
                  className="w-full p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSetupShareModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Post to Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
