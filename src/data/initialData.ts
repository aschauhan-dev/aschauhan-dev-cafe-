// src/data/initialData.ts
import { CafeTable, Category, MenuItem, BhopalSunsetInfo } from '../types';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_TABLES } from '../../prisma/seed';

export const CATEGORIES: Category[] = INITIAL_CATEGORIES;

export const MENU_ITEMS: MenuItem[] = INITIAL_MENU_ITEMS.map((item) => ({
  ...item,
  imageUrl: undefined, // fallback UI ensures zero broken image frames
}));

export const TABLES: CafeTable[] = INITIAL_TABLES.map((tbl) => ({
  id: tbl.id,
  tableNumber: tbl.tableNumber,
  capacity: tbl.capacity,
  zone: tbl.zone as CafeTable['zone'],
  status: tbl.status as CafeTable['status'],
  notes: tbl.notes,
  currentOrderId: tbl.status === 'OCCUPIED' ? (tbl.id === 'tbl-01' ? 'ORD-4011' : 'ORD-4012') : undefined,
  currentGuestName: tbl.status === 'OCCUPIED' ? (tbl.id === 'tbl-01' ? 'Siddharth V.' : 'Ananya M.') : undefined,
}));

export function getBhopalSunsetInfo(): BhopalSunsetInfo {
  // Bhopal, Madhya Pradesh coordinates: 23.2599° N, 77.4126° E
  // In late October / autumn, Bhopal sunset is typically around 5:44 PM – 5:50 PM IST.
  return {
    sunsetTime: '5:48 PM',
    goldenHourStart: '5:00 PM',
    goldenHourEnd: '6:30 PM',
    currentTempC: 24,
    weatherCondition: 'Clear Autumn Sunset & Lake Mist',
    lakeBreeze: 'Gentle 9 km/h NW from Bada Talaab',
    isCurrentlySunset: true,
    minutesUntilGoldenHour: 45,
  };
}

export const TIME_SLOTS = [
  { time: '11:30 AM - 01:30 PM', label: 'Remote Work & Artisanal Lunch', isSunset: false },
  { time: '01:30 PM - 03:30 PM', label: 'Afternoon Pour-Over Brews', isSunset: false },
  { time: '03:30 PM - 05:00 PM', label: 'Pre-Sunset High Tea & Sourdough', isSunset: false },
  { time: '05:00 PM - 07:00 PM', label: 'Lake Sunset Golden Hour (Prime Slot)', isSunset: true },
  { time: '07:00 PM - 09:00 PM', label: 'Starlight Bistro & Fairy Lights', isSunset: false },
  { time: '09:00 PM - 11:30 PM', label: 'Late Night Acoustic Rooftop Lounge', isSunset: false },
];
