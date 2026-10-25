// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, SelectedCustomizations, FulfillmentType } from '../types';

interface CartState {
  items: CartItem[];
  fulfillmentType: FulfillmentType;
  tableNumber: string | null;
  customerName: string;
  customerPhone: string;
  notes: string;
  appliedPromo: string | null;
  discountAmount: number;
  tipPercentage: number;
  customTipAmount: number;
  isCartDrawerOpen: boolean;

  // Actions
  addItem: (item: MenuItem, quantity?: number, customizations?: SelectedCustomizations) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setTableNumber: (tableNumber: string | null) => void;
  setCustomerDetails: (name: string, phone: string) => void;
  setNotes: (notes: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  setTipPercentage: (pct: number) => void;
  setCustomTip: (amount: number) => void;
  setCartDrawerOpen: (open: boolean) => void;

  // Computed helpers
  getSubtotal: () => number;
  getGst: () => number;
  getTip: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillmentType: 'DINE_IN',
      tableNumber: null,
      customerName: '',
      customerPhone: '',
      notes: '',
      appliedPromo: null,
      discountAmount: 0,
      tipPercentage: 0,
      customTipAmount: 0,
      isCartDrawerOpen: false,

      addItem: (menuItem, quantity = 1, customizations = {}) => {
        // Calculate add-on cost
        let addon = 0;
        if (customizations.milk && customizations.milk.includes('+₹40')) addon += 40;
        if (customizations.milk && customizations.milk.includes('+₹30')) addon += 30;
        if (customizations.crust && customizations.crust.includes('+₹40')) addon += 40;
        if (customizations.extraShot) addon += 60;
        if (customizations.extraCheese) addon += 70;

        const unitPrice = menuItem.price + addon;
        const customSignature = JSON.stringify(customizations);
        const cartItemId = `${menuItem.id}-${customSignature}`;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.cartItemId === cartItemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const current = updated[existingIndex];
            const newQty = current.quantity + quantity;
            updated[existingIndex] = {
              ...current,
              quantity: newQty,
              totalPrice: newQty * unitPrice,
            };
            return { items: updated, isCartDrawerOpen: true };
          }

          const newItem: CartItem = {
            cartItemId,
            menuItem,
            quantity,
            customizations: {
              ...customizations,
              customPriceAddon: addon,
            },
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
          return { items: [...state.items, newItem], isCartDrawerOpen: true };
        });
      },

      updateQuantity: (cartItemId, newQty) => {
        set((state) => {
          if (newQty <= 0) {
            return { items: state.items.filter((i) => i.cartItemId !== cartItemId) };
          }
          return {
            items: state.items.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice }
                : item
            ),
          };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          appliedPromo: null,
          discountAmount: 0,
          notes: '',
        });
      },

      setFulfillmentType: (type) => set({ fulfillmentType: type }),
      setTableNumber: (tableNumber) => set({ tableNumber }),
      setCustomerDetails: (name, phone) => set({ customerName: name, customerPhone: phone }),
      setNotes: (notes) => set({ notes }),

      applyPromoCode: (code) => {
        const subtotal = get().getSubtotal();
        const upper = code.trim().toUpperCase();

        if (upper === 'BHOPALSUNSET') {
          if (subtotal < 500) {
            return { success: false, message: 'Minimum order ₹500 required for BHOPALSUNSET' };
          }
          const discount = 100;
          set({ appliedPromo: 'BHOPALSUNSET', discountAmount: discount });
          return { success: true, message: '₹100 Sunset special coupon applied!' };
        }

        if (upper === 'DEVCAFE10') {
          const discount = Math.round(subtotal * 0.1);
          set({ appliedPromo: 'DEVCAFE10', discountAmount: discount });
          return { success: true, message: '10% Dev Community discount applied!' };
        }

        if (upper === 'ROOFTOP50') {
          const discount = Math.min(50, subtotal);
          set({ appliedPromo: 'ROOFTOP50', discountAmount: discount });
          return { success: true, message: '₹50 rooftop welcome voucher applied!' };
        }

        return { success: false, message: 'Invalid promo code' };
      },

      removePromoCode: () => set({ appliedPromo: null, discountAmount: 0 }),
      setTipPercentage: (pct) => set({ tipPercentage: pct, customTipAmount: 0 }),
      setCustomTip: (amount) => set({ customTipAmount: amount, tipPercentage: 0 }),
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.totalPrice, 0);
      },

      getGst: () => {
        // India Restaurant Food GST is 5%
        const subtotal = get().getSubtotal();
        const afterDiscount = Math.max(0, subtotal - get().discountAmount);
        return Math.round(afterDiscount * 0.05);
      },

      getTip: () => {
        const { tipPercentage, customTipAmount } = get();
        if (customTipAmount > 0) return customTipAmount;
        if (tipPercentage > 0) {
          const subtotal = get().getSubtotal();
          return Math.round((subtotal * tipPercentage) / 100);
        }
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discountAmount;
        const gst = get().getGst();
        const tip = get().getTip();
        return Math.max(0, subtotal - discount + gst + tip);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'aschauhan-cafe-cart-v1',
      partialize: (state) => ({
        items: state.items,
        tableNumber: state.tableNumber,
        fulfillmentType: state.fulfillmentType,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
      }),
    }
  )
);
