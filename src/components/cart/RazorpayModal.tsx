// src/components/cart/RazorpayModal.tsx
import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types';

interface RazorpayModalProps {
  amount: number;
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  onSuccess: (paymentId: string, method: PaymentMethod) => void;
  onClose: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  amount,
  customerName,
  customerPhone,
  orderNumber,
  onSuccess,
  onClose,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('RAZORPAY_UPI');
  const [upiId, setUpiId] = useState('ayush@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate real Razorpay gateway response time
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      const paymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0C2340', '#D96B43', '#10B981'],
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        onSuccess(paymentId, method);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181A20] border border-[#2D3139] rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] px-6 py-4 flex items-center justify-between border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3395FF] flex items-center justify-center text-white font-bold text-xs tracking-tighter">
              R
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-sky-300">
                Razorpay Secure Checkout
              </p>
              <h3 className="text-sm font-bold text-white">aschauhan-dev cafe</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close payment modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paymentComplete ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Payment Successful</h4>
            <p className="text-xs text-slate-400">
              ₹{amount} paid successfully via {method.replace('RAZORPAY_', '')}. Transmitting ticket to kitchen display...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="flex items-center justify-between p-3.5 bg-[#121418] rounded-xl border border-[#262A33]">
              <div>
                <span className="text-[11px] text-slate-400">Order #{orderNumber}</span>
                <p className="text-xs font-medium text-slate-300">{customerName || 'Guest'}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Total Payable</span>
                <p className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                  ₹{amount}
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Select Indian Payment Option
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('RAZORPAY_UPI')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'RAZORPAY_UPI'
                      ? 'border-[#3395FF] bg-[#17263C] text-sky-300'
                      : 'border-[#262A33] bg-[#121418] text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1 text-[#3395FF]" />
                  <span className="text-xs font-semibold block">Instant UPI</span>
                  <span className="text-[10px] text-slate-400">GPay/PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('RAZORPAY_CARD')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'RAZORPAY_CARD'
                      ? 'border-[#3395FF] bg-[#17263C] text-sky-300'
                      : 'border-[#262A33] bg-[#121418] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs font-semibold block">Card</span>
                  <span className="text-[10px] text-slate-400">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('RAZORPAY_NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    method === 'RAZORPAY_NETBANKING'
                      ? 'border-[#3395FF] bg-[#17263C] text-sky-300'
                      : 'border-[#262A33] bg-[#121418] text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs font-semibold block">NetBanking</span>
                  <span className="text-[10px] text-slate-400">HDFC/SBI/ICICI</span>
                </button>
              </div>
            </div>

            {/* Method Inputs */}
            {method === 'RAZORPAY_UPI' && (
              <div className="p-3.5 bg-[#121418] rounded-xl border border-[#262A33] space-y-2">
                <label className="block text-xs text-slate-300">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis or name@paytm"
                  className="w-full text-xs p-2.5 rounded-lg bg-[#181A20] border border-[#2D3139] text-white focus:outline-none focus:border-sky-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  A payment request will be sent to your UPI app for fast approval.
                </p>
              </div>
            )}

            {method === 'RAZORPAY_CARD' && (
              <div className="p-3.5 bg-[#121418] rounded-xl border border-[#262A33] space-y-2 text-xs">
                <input
                  type="text"
                  defaultValue="4111 •••• •••• 9018"
                  placeholder="Card Number"
                  className="w-full text-xs p-2.5 rounded-lg bg-[#181A20] border border-[#2D3139] text-white font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="12/28"
                    placeholder="MM/YY"
                    className="w-full text-xs p-2.5 rounded-lg bg-[#181A20] border border-[#2D3139] text-white font-mono"
                  />
                  <input
                    type="password"
                    defaultValue="829"
                    maxLength={3}
                    placeholder="CVV"
                    className="w-full text-xs p-2.5 rounded-lg bg-[#181A20] border border-[#2D3139] text-white font-mono"
                  />
                </div>
              </div>
            )}

            {method === 'RAZORPAY_NETBANKING' && (
              <div className="p-3.5 bg-[#121418] rounded-xl border border-[#262A33] text-xs">
                <select className="w-full p-2.5 rounded-lg bg-[#181A20] border border-[#2D3139] text-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Razorpay Trust footer & Pay button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#3395FF] hover:bg-[#2084F5] active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="inline-block animate-spin mr-2">◷</span>
                ) : null}
                <span>{isProcessing ? 'Verifying with Bank...' : `Pay ₹${amount}`}</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PCI-DSS Level 1 Certified 256-bit Encrypted</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
