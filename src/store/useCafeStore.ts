// src/store/useCafeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CafeTable, MenuItem, Order, OrderStatus, Reservation, Role, TableStatus } from '../types';
import { MENU_ITEMS, TABLES } from '../data/initialData';

// Initial sample live orders for demonstration of the KDS
const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-4011',
    tableNumber: 'LAKE-01',
    fulfillmentType: 'DINE_IN',
    status: 'PREPARING',
    items: [
      {
        cartItemId: 'item-lake-sunset-cold-drip-init',
        menuItem: MENU_ITEMS[0],
        quantity: 2,
        customizations: { milk: 'None', sweetness: 'Subtle Sweet' },
        unitPrice: 280,
        totalPrice: 560,
      },
      {
        cartItemId: 'item-burrata-margherita-init',
        menuItem: MENU_ITEMS[6],
        quantity: 1,
        customizations: { crust: 'Garlic Butter Glazed Rim (+₹40)', customPriceAddon: 40 },
        unitPrice: 500,
        totalPrice: 500,
      },
    ],
    subtotal: 1060,
    gstAmount: 53,
    tipAmount: 50,
    discountAmount: 0,
    totalAmount: 1163,
    customerName: 'Siddharth Verma',
    customerPhone: '+91 98260 11234',
    customerEmail: 'siddharth@example.com',
    notes: 'Please serve the cold drip first with extra ice.',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    paymentStatus: 'SUCCESSFUL',
    paymentMethod: 'RAZORPAY_UPI',
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-4012',
    tableNumber: 'CABANA-01',
    fulfillmentType: 'DINE_IN',
    status: 'PENDING',
    items: [
      {
        cartItemId: 'item-poha-arancini-init',
        menuItem: MENU_ITEMS[9],
        quantity: 1,
        customizations: { spiceLevel: 'Zesty' },
        unitPrice: 320,
        totalPrice: 320,
      },
      {
        cartItemId: 'item-bhopal-berry-spritzer-init',
        menuItem: MENU_ITEMS[4],
        quantity: 2,
        customizations: { sweetness: 'Regular Sweet' },
        unitPrice: 240,
        totalPrice: 480,
      },
    ],
    subtotal: 800,
    gstAmount: 40,
    tipAmount: 0,
    discountAmount: 50,
    totalAmount: 790,
    customerName: 'Ananya Mishra',
    customerPhone: '+91 94250 88291',
    notes: 'Celebrating golden hour birthday.',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    paymentStatus: 'SUCCESSFUL',
    paymentMethod: 'RAZORPAY_CARD',
  },
];

const SAMPLE_INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-01',
    bookingCode: 'BHP-SUNSET-8821',
    guestName: 'Rohit Agrawal',
    guestEmail: 'rohit.agrawal@devcorp.in',
    guestPhone: '+91 98930 44123',
    partySize: 4,
    reservationDate: new Date().toISOString().split('T')[0],
    timeSlot: '05:00 PM - 07:00 PM',
    isSunsetSlot: true,
    zone: 'LAKESIDE_DECK',
    tableNumber: 'LAKE-02',
    specialRequests: 'Sunset edge view requested for tech anniversary.',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-02',
    bookingCode: 'BHP-SUNSET-7734',
    guestName: 'Megha & Friends',
    guestEmail: 'megha.design@gmail.com',
    guestPhone: '+91 75520 99120',
    partySize: 6,
    reservationDate: new Date().toISOString().split('T')[0],
    timeSlot: '07:00 PM - 09:00 PM',
    isSunsetSlot: false,
    zone: 'CABANA_LOUNGE',
    tableNumber: 'CABANA-03',
    specialRequests: 'Near acoustic performance setup.',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
];

interface CafeState {
  currentRole: Role;
  orders: Order[];
  reservations: Reservation[];
  tables: CafeTable[];
  menuItems: MenuItem[];
  soundEnabled: boolean;
  selectedTableForOrdering: string | null;

  // Actions
  setRole: (role: Role) => void;
  toggleSound: () => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createReservation: (reservation: Omit<Reservation, 'id' | 'bookingCode' | 'createdAt' | 'status'>) => Reservation;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;
  updateTableStatus: (tableId: string, status: TableStatus, guestName?: string) => void;
  toggleMenuItemAvailability: (menuItemId: string) => void;
  setSelectedTableForOrdering: (tableNumber: string | null) => void;
  playKitchenChime: () => void;
}

// Gentle Web Audio API synthesizer for kitchen bell / chime
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context may be restricted by browser until user gesture
  }
}

export const useCafeStore = create<CafeState>()(
  persist(
    (set, get) => ({
      currentRole: 'CUSTOMER',
      orders: SAMPLE_INITIAL_ORDERS,
      reservations: SAMPLE_INITIAL_RESERVATIONS,
      tables: TABLES,
      menuItems: MENU_ITEMS,
      soundEnabled: true,
      selectedTableForOrdering: null,

      setRole: (role) => set({ currentRole: role }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      playKitchenChime: () => {
        if (get().soundEnabled) {
          playNotificationChime();
        }
      },

      createOrder: (orderData) => {
        const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        // If table dine-in, mark table as occupied if not already
        if (orderData.tableNumber) {
          const table = get().tables.find((t) => t.tableNumber === orderData.tableNumber);
          if (table && table.status === 'AVAILABLE') {
            get().updateTableStatus(table.id, 'OCCUPIED', orderData.customerName);
          }
        }

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        get().playKitchenChime();
        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) => {
        set((state) => {
          const updated = state.orders.map((ord) => {
            if (ord.id === orderId) {
              return { ...ord, status: newStatus };
            }
            return ord;
          });
          return { orders: updated };
        });

        get().playKitchenChime();
      },

      createReservation: (resData) => {
        const bookingCode = `BHP-SUNSET-${Math.floor(1000 + Math.random() * 9000)}`;
        const newReservation: Reservation = {
          ...resData,
          id: `res-${Date.now()}`,
          bookingCode,
          status: 'CONFIRMED',
          createdAt: new Date().toISOString(),
        };

        // If a table is assigned, mark it reserved
        if (resData.tableNumber) {
          const tbl = get().tables.find((t) => t.tableNumber === resData.tableNumber);
          if (tbl) {
            get().updateTableStatus(tbl.id, 'RESERVED', resData.guestName);
          }
        }

        set((state) => ({
          reservations: [newReservation, ...state.reservations],
        }));

        return newReservation;
      },

      updateReservationStatus: (reservationId, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === reservationId ? { ...r, status } : r
          ),
        }));
      },

      updateTableStatus: (tableId, status, guestName) => {
        set((state) => ({
          tables: state.tables.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  status,
                  currentGuestName: status === 'AVAILABLE' ? undefined : guestName || t.currentGuestName,
                  currentOrderId: status === 'AVAILABLE' ? undefined : t.currentOrderId,
                }
              : t
          ),
        }));
      },

      toggleMenuItemAvailability: (menuItemId) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === menuItemId ? { ...item, isAvailable: !item.isAvailable } : item
          ),
        }));
      },

      setSelectedTableForOrdering: (tableNumber) => set({ selectedTableForOrdering: tableNumber }),
    }),
    {
      name: 'aschauhan-cafe-system-v1',
      partialize: (state) => ({
        orders: state.orders,
        reservations: state.reservations,
        tables: state.tables,
        menuItems: state.menuItems,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
