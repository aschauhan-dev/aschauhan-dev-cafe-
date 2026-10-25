// src/components/cart/CartDrawer.tsx
import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Check, ArrowRight, Utensils, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCafeStore } from '../../store/useCafeStore';
import { RazorpayModal } from './RazorpayModal';
import { QrCodeGenerator } from '../common/QrCodeGenerator';
import { Order, PaymentMethod } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeItem,
    clearCart,
    fulfillmentType,
    setFulfillmentType,
    tableNumber,
    customerName,
    customerPhone,
    setCustomerDetails,
    appliedPromo,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    tipPercentage,
    setTipPercentage,
    customTipAmount,
    setCustomTip,
    getSubtotal,
    getGst,
    getTip,
    getTotal,
    getItemCount,
  } = useCartStore();

  const createOrder = useCafeStore((s) => s.createOrder);

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();
  const gst = getGst();
  const tip = getTip();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoStatus(res);
  };

  const handleInitiateCheckout = () => {
    setValidationError(null);
    if (items.length === 0) {
      setValidationError('Your order bag is empty.');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentId: string, paymentMethod: PaymentMethod) => {
    setShowRazorpay(false);

    const newOrder = createOrder({
      tableNumber: fulfillmentType === 'DINE_IN' ? tableNumber || 'LAKE-01' : undefined,
      fulfillmentType,
      items: [...items],
      subtotal,
      gstAmount: gst,
      tipAmount: tip,
      discountAmount,
      totalAmount: total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      paymentStatus: 'SUCCESSFUL',
      paymentMethod,
    });

    setCompletedOrder(newOrder);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#191412] border-l border-[#332820] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#2C231C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-[#FAF7F2]">
                Your Order Bag
              </h2>
              {itemCount > 0 && (
                <span className="text-xs font-mono text-[#D4AF37] bg-[#29201A] px-2 py-0.5 rounded-full border border-[#443328]">
                  {itemCount} items
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setCartDrawerOpen(false);
                setCompletedOrder(null);
              }}
              className="p-1.5 rounded-lg text-[#A89C90] hover:text-white hover:bg-[#2B211A] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          {completedOrder ? (
            /* Order Placed Success View */
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono text-[#E07A5F] uppercase tracking-wider">
                  Order Transmitted to Kitchen
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#FAF7F2] mt-1">
                  {completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#A89C90] mt-1">
                  {completedOrder.fulfillmentType === 'DINE_IN'
                    ? `Assigned to Rooftop Table: ${completedOrder.tableNumber}`
                    : 'Packed for Takeaway at Bar Counter'}
                </p>
              </div>

              {/* Order QR Ticket */}
              <div className="p-5 bg-[#14100E] rounded-2xl border border-[#2B211A] flex flex-col items-center">
                <QrCodeGenerator
                  value={`ASCHAUHAN-ORDER-${completedOrder.orderNumber}`}
                  size={120}
                  label="Kitchen Order Token"
                />
                <div className="mt-4 w-full text-xs text-[#A89C90] space-y-1.5 border-t border-[#29201A] pt-3">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-semibold text-[#EDE7E1]">{completedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-mono font-bold text-emerald-400">₹{completedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Prep:</span>
                    <span className="font-mono text-[#D4AF37]">12 – 18 mins</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#241B17] border border-[#352820] text-xs text-[#C8BCB0] space-y-2">
                <p className="font-medium text-[#FAF7F2]">Live Preparation Status:</p>
                <div className="flex items-center gap-2 text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Kitchen has accepted your ticket</span>
                </div>
                <p className="text-[11px] text-[#8F8175]">
                  Our baristas and pizzaiolos on the rooftop terrace are assembling your order. Enjoy the lake sunset breeze!
                </p>
              </div>

              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setCartDrawerOpen(false);
                }}
                className="w-full py-3 text-xs font-semibold rounded-xl bg-[#D96B43] hover:bg-[#C25832] text-white transition-colors"
              >
                Back to Cafe Menu
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#241B17] border border-[#3A2C22] flex items-center justify-center text-[#D96B43] mb-4">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                Your Order Bag is Empty
              </h3>
              <p className="text-xs text-[#A89C90] mt-1.5 max-w-xs">
                Explore our single origin pour-overs, rooftop sunset coolers, and sourdough pizzas.
              </p>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="mt-6 px-5 py-2.5 text-xs font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] rounded-xl transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            /* Active Items List */
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Dine-In vs Takeaway selector */}
              <div className="p-1 bg-[#14100E] rounded-xl border border-[#2B211A] flex text-xs">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('DINE_IN')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    fulfillmentType === 'DINE_IN'
                      ? 'bg-[#D96B43] text-white font-semibold'
                      : 'text-[#A89C90] hover:text-[#EDE7E1]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dine-In {tableNumber ? `(T-${tableNumber})` : '(Rooftop)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('TAKEAWAY')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    fulfillmentType === 'TAKEAWAY'
                      ? 'bg-[#D96B43] text-white font-semibold'
                      : 'text-[#A89C90] hover:text-[#EDE7E1]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Takeaway</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3.5 rounded-xl bg-[#201814] border border-[#30241C] flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#FAF7F2]">
                          {cartItem.menuItem.name}
                        </h4>
                        <div className="text-[11px] text-[#A89C90] space-y-0.5 mt-0.5">
                          {cartItem.customizations.milk && <span>Milk: {cartItem.customizations.milk}</span>}
                          {cartItem.customizations.sweetness && (
                            <span className="block">Sweetness: {cartItem.customizations.sweetness}</span>
                          )}
                          {cartItem.customizations.extraShot && (
                            <span className="block text-[#D4AF37]">Extra Espresso Shot (+₹60)</span>
                          )}
                          {cartItem.customizations.crust && (
                            <span className="block">Crust: {cartItem.customizations.crust}</span>
                          )}
                          {cartItem.customizations.spiceLevel && (
                            <span className="block">Spice: {cartItem.customizations.spiceLevel}</span>
                          )}
                          {cartItem.customizations.specialInstructions && (
                            <span className="block text-[#7A6C61] italic">Note: "{cartItem.customizations.specialInstructions}"</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(cartItem.cartItemId)}
                        className="p-1 text-[#78695E] hover:text-rose-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2B2018] mt-1">
                      <div className="flex items-center gap-2 bg-[#17110E] border border-[#2B2018] rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="p-0.5 text-[#C8BCB0] hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-bold text-[#EDE7E1] px-1 tabular-nums">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="p-0.5 text-[#C8BCB0] hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#EDE7E1] tabular-nums">
                        ₹{cartItem.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8F8175] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Try: BHOPALSUNSET or DEVCAFE10"
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-[#14100E] border border-[#332821] text-[#EDE7E1] placeholder-[#6E6157] uppercase focus:outline-none focus:border-[#D96B43] font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#2E221A] hover:bg-[#3D2E24] text-[#EDE7E1] border border-[#443328] transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="mt-2 flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      {appliedPromo} (-₹{discountAmount})
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[11px] text-[#A89C90] hover:text-white underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoStatus && !appliedPromo && (
                  <p className="mt-1 text-[11px] text-rose-400">{promoStatus.message}</p>
                )}
              </div>

              {/* Staff Tip Option */}
              <div className="pt-1">
                <label className="block text-[11px] font-mono text-[#D1C7BD] uppercase tracking-wider mb-1.5">
                  Artisanal Crew Tip
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                  {[0, 5, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercentage(pct)}
                      className={`py-1.5 rounded-lg border text-center transition-colors ${
                        tipPercentage === pct && customTipAmount === 0
                          ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                          : 'border-[#2D231C] bg-[#14100E] text-[#8F8175] hover:text-[#EDE7E1]'
                      }`}
                    >
                      {pct === 0 ? 'No Tip' : `${pct}%`}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomTip(50)}
                    className={`py-1.5 rounded-lg border text-center transition-colors ${
                      customTipAmount === 50
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#2D231C] bg-[#14100E] text-[#8F8175] hover:text-[#EDE7E1]'
                    }`}
                  >
                    ₹50
                  </button>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="pt-2 space-y-2 border-t border-[#29201A]">
                <label className="block text-[11px] font-mono text-[#D1C7BD] uppercase tracking-wider">
                  Contact Information
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerDetails(e.target.value, customerPhone)}
                  placeholder="Your Name *"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#14100E] border border-[#332821] text-[#EDE7E1] placeholder-[#6E6157] focus:outline-none focus:border-[#D96B43]"
                  required
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerDetails(customerName, e.target.value)}
                  placeholder="WhatsApp Mobile Number *"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#14100E] border border-[#332821] text-[#EDE7E1] placeholder-[#6E6157] focus:outline-none focus:border-[#D96B43]"
                  required
                />
                {validationError && (
                  <p className="text-[11px] text-rose-400 font-medium">{validationError}</p>
                )}
              </div>
            </div>
          )}

          {/* Footer Bill Summary & Razorpay Trigger */}
          {!completedOrder && items.length > 0 && (
            <div className="p-6 border-t border-[#2C231C] bg-[#14100E] space-y-3">
              <div className="space-y-1.5 text-xs text-[#A89C90]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#EDE7E1] tabular-nums">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedPromo})</span>
                    <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span title="India Restaurant Food GST (5%)">Food GST (5%)</span>
                  <span className="font-mono text-[#EDE7E1] tabular-nums">₹{gst}</span>
                </div>

                {tip > 0 && (
                  <div className="flex justify-between">
                    <span>Crew Tip</span>
                    <span className="font-mono text-[#EDE7E1] tabular-nums">₹{tip}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#29201A] flex justify-between text-sm font-bold text-[#FAF7F2]">
                  <span>Total Payable</span>
                  <span className="font-mono text-base text-[#D4AF37] tabular-nums">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiateCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#D96B43] hover:bg-[#C25832] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-[#D96B43]/20 flex items-center justify-between"
              >
                <span>Proceed to Pay (Razorpay India)</span>
                <span className="flex items-center gap-1 font-mono font-bold">
                  ₹{total}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      {showRazorpay && (
        <RazorpayModal
          amount={total}
          customerName={customerName}
          customerPhone={customerPhone}
          orderNumber={`ORD-${Math.floor(1000 + Math.random() * 9000)}`}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowRazorpay(false)}
        />
      )}
    </div>
  );
};
