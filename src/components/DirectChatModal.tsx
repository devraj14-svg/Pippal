import React, { useState } from 'react';
import { TraderProfile, RoomMessage } from '../types';
import {
  X,
  Send,
  Lock,
  ShieldCheck,
  Phone,
  MoreVertical,
  UserX,
  Flag,
  CheckCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface DirectChatModalProps {
  trader: TraderProfile;
  currentUser: TraderProfile;
  isOpen: boolean;
  onClose: () => void;
  myWhatsAppConsent: boolean;
  theirWhatsAppConsent: boolean;
  onToggleMyWhatsAppConsent: () => void;
  onBlockUser: (traderId: string) => void;
  onReportUser: (traderId: string, reason: string) => void;
}

export const DirectChatModal: React.FC<DirectChatModalProps> = ({
  trader,
  currentUser,
  isOpen,
  onClose,
  myWhatsAppConsent,
  theirWhatsAppConsent,
  onToggleMyWhatsAppConsent,
  onBlockUser,
  onReportUser,
}) => {
  const [messages, setMessages] = useState<RoomMessage[]>([
    {
      id: 'dm_1',
      senderId: trader.id,
      senderName: trader.name,
      senderAvatar: trader.avatar,
      text: `Hey ${currentUser.name}! Saw we both trade ${trader.markets[0]} around ${trader.tradingHours.split(' ')[0]}. How was your morning session today?`,
      timestamp: '10:05 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: RoomMessage = {
      id: `dm_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (You)`,
      senderAvatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const bothConsented = myWhatsAppConsent && theirWhatsAppConsent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-stone-200 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={trader.avatar}
                alt={trader.name}
                className="h-10 w-10 rounded-full object-cover border border-stone-300 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{trader.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {trader.experience}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span>{trader.markets.join(', ')}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-amber-800 font-semibold">{trader.tradingHours}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 relative">
            <button
              onClick={() => setShowSafetyMenu(!showSafetyMenu)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Safety & Privacy Options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Safety Dropdown Menu (Block, Report, Remove) */}
            {showSafetyMenu && (
              <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl bg-white border border-stone-200 p-1.5 shadow-xl space-y-1 text-xs">
                <button
                  onClick={() => {
                    onReportUser(trader.id, 'Inappropriate behavior or signal solicitation');
                    setReportSuccess(true);
                    setShowSafetyMenu(false);
                    setTimeout(() => setReportSuccess(false), 3000);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-medium"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>Report Trader</span>
                </button>

                <button
                  onClick={() => {
                    onBlockUser(trader.id);
                    setShowSafetyMenu(false);
                    onClose();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <UserX className="h-3.5 w-3.5" />
                  <span>Block Connection</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Mutual Consent Banner */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/80 p-3 sm:px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>WhatsApp Connection</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    (Mutual Consent Only)
                  </span>
                </div>
                <div className="text-[11px] text-stone-600">
                  {bothConsented
                    ? 'Both traders agreed to share contacts!'
                    : myWhatsAppConsent
                    ? `You shared your contact. Waiting for ${trader.name} to consent.`
                    : theirWhatsAppConsent
                    ? `${trader.name} shared contact with you. Click below to connect!`
                    : 'Numbers are private until both traders click Share Contact.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {bothConsented ? (
                <a
                  href={`https://wa.me/${(trader.whatsappNumber || '919823411223').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(trader.name)},%20we%20connected%20on%20PipPal!`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Open WhatsApp</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <button
                  onClick={onToggleMyWhatsAppConsent}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs ${
                    myWhatsAppConsent
                      ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {myWhatsAppConsent ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Contact Shared</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Share Contact</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {reportSuccess && (
            <div className="mt-2 text-xs text-amber-900 bg-amber-100 p-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
              <span>Report filed to community moderators. Safety is our top priority.</span>
            </div>
          )}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9f6]">
          <div className="text-center py-2">
            <span className="text-[11px] text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-xs">
              Matched on PipPal · Discussing {trader.markets.join(', ')}
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={m.senderAvatar}
                    alt={m.senderName}
                    className="h-6 w-6 rounded-full object-cover border border-stone-200"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-none border border-stone-200 shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`text-[9px] font-mono mt-1 ${
                      isMe ? 'text-emerald-100 text-right' : 'text-stone-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${trader.name}...`}
            className="flex-1 h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition-colors flex items-center justify-center shrink-0 shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
