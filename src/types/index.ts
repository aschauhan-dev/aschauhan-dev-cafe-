// src/types/index.ts

export type Role = 'CUSTOMER' | 'KITCHEN_STAFF' | 'WAITER' | 'ADMIN' | 'MANAGER';

export type TableZone = 'LAKESIDE_DECK' | 'CABANA_LOUNGE' | 'INDOOR_GLASSHOUSE';

export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';

export type ReservationStatus = 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'COMPLETED';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'BILLED' | 'CANCELLED';

export type FulfillmentType = 'DINE_IN' | 'TAKEAWAY';

export type PaymentMethod = 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'RAZORPAY_NETBANKING' | 'CASH_AT_COUNTER';

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED';

export interface CafeTable {
  id: string;
  tableNumber: string;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  notes?: string;
  currentOrderId?: string;
  currentGuestName?: string;
}

export interface MenuItemCustomOptions {
  milkChoices?: string[];
  sweetness?: string[];
  iceLevel?: string[];
  roastPreference?: string[];
  temp?: string[];
  crust?: string[];
  spiceLevel?: string[];
  drizzle?: string[];
  extraShot?: boolean;
  extraCheese?: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in INR ₹
  imageUrl?: string;
  isAvailable: boolean; // 86-ing
  isChefSpecial?: boolean;
  isVeg: boolean;
  isVegan: boolean;
  spiceLevel?: number; // 0, 1, 2, 3
  prepTimeMin: number;
  customOptions?: MenuItemCustomOptions;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface SelectedCustomizations {
  milk?: string;
  sweetness?: string;
  extraShot?: boolean;
  spiceLevel?: string;
  crust?: string;
  extraCheese?: boolean;
  drizzle?: string;
  specialInstructions?: string;
  customPriceAddon?: number;
}

export interface CartItem {
  cartItemId: string; // unique item id in cart including customizations
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomizations;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-8291"
  tableNumber?: string;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  gstAmount: number; // 5% Food GST
  tipAmount: number;
  discountAmount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  createdAt: string;
  elapsedSeconds?: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface Reservation {
  id: string;
  bookingCode: string; // e.g. "BHP-SUNSET-9214"
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  reservationDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "17:30 - 19:30"
  isSunsetSlot: boolean;
  zone: TableZone;
  tableNumber?: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface BhopalSunsetInfo {
  sunsetTime: string;
  goldenHourStart: string;
  goldenHourEnd: string;
  currentTempC: number;
  weatherCondition: string;
  lakeBreeze: string;
  isCurrentlySunset: boolean;
  minutesUntilGoldenHour: number;
}
