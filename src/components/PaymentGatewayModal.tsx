import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PipPalLogo } from './PipPalLogo';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  initialPlan?: 'monthly' | 'daily';
  likesCount?: number;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialPlan = 'monthly',
  likesCount = 3,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'daily'>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Form states
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'vpa'>('gpay');
  const [customVpa, setCustomVpa] = useState('trader@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [cardName, setCardName] = useState('Devraj Joshi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const planPrice = selectedPlan === 'monthly' ? 199 : 49;
  const planLabel = selectedPlan === 'monthly' ? 'Monthly Pass (Unlimited)' : '24-Hour Day Pass';

  const handlePay = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to secure 256-bit payment gateway...');

    setTimeout(() => {
      setProcessingStep(
        paymentMethod === 'upi'
          ? 'Routing request to NPCI UPI network...'
          : paymentMethod === 'card'
          ? 'Authorizing card with 3D Secure / OTP...'
          : `Initiating session with ${selectedBank}...`
      );
    }, 700);

    setTimeout(() => {
      setProcessingStep('Payment verified! Provisioning PipPal Pass...');
    }, 1500);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1200);
    }, 2200);
  };

  const handleAutofillCard = () => {
    setCardNumber('4532 8912 3456 8821');
    setCardExpiry('08/28');
    setCardCvv('742');
    setCardName('Devraj Joshi');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header with Security Badge */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white/15 backdrop-blur-xs">
              <PipPalLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base tracking-tight">PipPal Pay</h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-md bg-white/20 font-bold">
                  SECURE CHECKOUT
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
                <span>256-Bit SSL Encrypted & NPCI Verified</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Unlocking Target Value Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-3 text-xs text-amber-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0 font-bold text-sm">
              ⚡ {likesCount}
            </div>
            <div>
              <span className="font-bold text-slate-900">
                {likesCount} Traders want to connect with your profile right now!
              </span>
              <p className="text-stone-600 mt-0.5">
                Unlock to immediately see unblurred photos, bios, trading setups, and match instantly.
              </p>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Your Access Plan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative ${
                  selectedPlan === 'monthly'
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                }`}
              >
                <span className="absolute -top-2.5 right-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  Most Popular
                </span>
                <div className="font-black text-sm text-slate-900">Monthly Pass</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black font-mono text-emerald-700">₹199</span>
                  <span className="text-[11px] text-stone-500 font-medium">/ month</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  Unlimited "Who Liked You" + Unlimited Private Rooms.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('daily')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                  selectedPlan === 'daily'
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                }`}
              >
                <div className="font-black text-sm text-slate-900">24-Hour Pass</div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black font-mono text-slate-800">₹49</span>
                  <span className="text-[11px] text-stone-500 font-medium">one-time</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  Unlock current pending likes for 24 hours.
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Choose Payment Method
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-white border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                }`}
              >
                <Smartphone className="h-4 w-4 text-emerald-600" />
                <span>UPI (Fast)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-white border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                }`}
              >
                <CreditCard className="h-4 w-4 text-teal-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-white border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/20 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                }`}
              >
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Popular UPI Apps</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    Instant 0% Fee
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay', icon: '🟢 GPay' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣 PhonePe' },
                    { id: 'paytm', label: 'Paytm', icon: '🔵 Paytm' },
                    { id: 'cred', label: 'CRED UPI', icon: '⚫ CRED' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id as any)}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        upiApp === app.id
                          ? 'bg-white border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-400/30'
                          : 'bg-white/80 hover:bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {app.icon}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Or enter UPI ID / VPA
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customVpa}
                      onChange={(e) => setCustomVpa(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="flex-1 h-9 px-3 rounded-xl bg-white border border-stone-200 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomVpa('trader@okhdfcbank')}
                      className="px-2.5 py-1 text-[10px] font-semibold text-stone-600 bg-stone-200/80 hover:bg-stone-300 rounded-lg transition-colors"
                    >
                      Sample
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Card Information</span>
                  <button
                    type="button"
                    onClick={handleAutofillCard}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    Auto-fill Demo Card
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-0.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white border border-stone-200 font-mono text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-0.5">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white border border-stone-200 font-mono text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-0.5">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-white border border-stone-200 font-mono text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <label className="block font-semibold text-slate-800">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                          selectedBank === bank
                            ? 'bg-white border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-300'
                            : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="p-3.5 rounded-2xl bg-stone-100/70 border border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>{planLabel}</span>
              <span className="font-mono font-semibold text-slate-800">₹{planPrice}.00</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>Taxes & GST (Included)</span>
              <span className="font-mono">₹0.00</span>
            </div>
            <div className="pt-1.5 border-t border-stone-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Total Payable</span>
              <span className="font-mono text-emerald-700">₹{planPrice}.00</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 shrink-0 space-y-2">
          {isProcessing ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>{processingStep}</span>
              </div>
              <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: '15%' }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          ) : isSuccess ? (
            <div className="p-3 rounded-2xl bg-emerald-600 text-white text-center flex items-center justify-center gap-2 font-bold text-sm shadow-md">
              <CheckCircle2 className="h-5 w-5" />
              <span>Payment Successful! Unlocking Traders...</span>
            </div>
          ) : (
            <button
              onClick={handlePay}
              className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
            >
              <Lock className="h-4 w-4" />
              <span>Pay ₹{planPrice} & Reveal Who Liked You</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 font-medium">
            <span>🔒 RBI compliant simulated gateway</span>
            <span>·</span>
            <span>Instant reveal guaranteed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
