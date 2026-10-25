// src/components/admin/StaffDashboard.tsx
import React, { useState, useEffect } from 'react';
import { ChefHat, LayoutGrid, UtensilsCrossed, Volume2, VolumeX, Clock, Check, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { useCafeStore } from '../../store/useCafeStore';
import { OrderStatus, TableStatus } from '../../types';

export const StaffDashboard: React.FC = () => {
  const {
    orders,
    reservations,
    tables,
    menuItems,
    soundEnabled,
    toggleSound,
    updateOrderStatus,
    updateTableStatus,
    updateReservationStatus,
    toggleMenuItemAvailability,
    playKitchenChime,
  } = useCafeStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'kds' | 'tables' | 'menu'>('kds');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');

  // Clock tick to refresh elapsed times every 15s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMinutes = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  const kdsColumns: { status: OrderStatus; label: string; badgeColor: string }[] = [
    { status: 'PENDING', label: 'Pending Kitchen', badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
    { status: 'PREPARING', label: 'In Preparation', badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20' },
    { status: 'SERVED', label: 'Served to Table', badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
    { status: 'BILLED', label: 'Completed / Billed', badgeColor: 'border-stone-500/40 text-stone-400 bg-stone-900/20' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Admin Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1D1714] border border-[#352820] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A201A] border border-[#48372C] flex items-center justify-center text-[#D96B43]">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-[#FAF7F2]">
                Staff & Kitchen Operations
              </h2>
              <span className="text-[11px] font-mono text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#29201A] border border-[#3E3027]">
                LIVE KDS
              </span>
            </div>
            <p className="text-xs text-[#A89C90]">
              Real-time ticket dispatch, rooftop table floor plan, and 86-ing menu item availability.
            </p>
          </div>
        </div>

        {/* Audio notification toggle & Simulated bell */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2]'
                : 'border-[#332821] bg-[#14100E] text-[#7A6C61]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#D96B43]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => playKitchenChime()}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#3E3027] bg-[#241A15] hover:bg-[#32241D] text-[#C8BCB0] transition-colors"
            title="Test Kitchen Bell"
          >
            Chime Bell
          </button>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-3 border-b border-[#2C241E] pb-4 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('kds')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeAdminTab === 'kds'
              ? 'bg-[#D96B43] text-white shadow-sm'
              : 'text-[#A89C90] hover:text-[#EDE7E1] bg-[#1A1412] border border-[#2D231C]'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Live Kitchen Display (KDS)</span>
          <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.2 rounded-full">
            {orders.filter((o) => o.status !== 'BILLED').length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tables')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeAdminTab === 'tables'
              ? 'bg-[#D96B43] text-white shadow-sm'
              : 'text-[#A89C90] hover:text-[#EDE7E1] bg-[#1A1412] border border-[#2D231C]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Rooftop Floor Plan & Reservations</span>
          <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.2 rounded-full">
            {reservations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('menu')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeAdminTab === 'menu'
              ? 'bg-[#D96B43] text-white shadow-sm'
              : 'text-[#A89C90] hover:text-[#EDE7E1] bg-[#1A1412] border border-[#2D231C]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Menu Inventory & 86-ing Switch</span>
          <span className="font-mono text-[11px] bg-black/30 px-1.5 py-0.2 rounded-full">
            {menuItems.filter((i) => !i.isAvailable).length} Sold Out
          </span>
        </button>
      </div>

      {/* SUB-VIEW 1: LIVE KITCHEN DISPLAY SYSTEM */}
      {activeAdminTab === 'kds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kdsColumns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.status);

            return (
              <div
                key={col.status}
                className="flex flex-col bg-[#161210] border border-[#2B211A] rounded-2xl overflow-hidden min-h-[500px]"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-[#291F18] bg-[#1B1512] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#FAF7F2]">
                      {col.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Tickets Container */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {colOrders.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-center text-xs text-[#6F6054]">
                      No orders in this stage
                    </div>
                  ) : (
                    colOrders.map((ord) => {
                      const elapsed = getElapsedMinutes(ord.createdAt);
                      const isUrgent = elapsed >= 15 && col.status !== 'SERVED' && col.status !== 'BILLED';

                      return (
                        <div
                          key={ord.id}
                          className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                            isUrgent
                              ? 'bg-[#2B1713] border-rose-500/60 shadow-md shadow-rose-950/20'
                              : 'bg-[#1E1714] border-[#352820]'
                          }`}
                        >
                          <div>
                            {/* Ticket Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-[#2B211A]">
                              <span className="font-mono text-xs font-bold text-[#FAF7F2]">
                                {ord.orderNumber}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs">
                                <Clock className={`w-3 h-3 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-[#8F8175]'}`} />
                                <span className={`font-mono text-[11px] ${isUrgent ? 'text-rose-400 font-bold' : 'text-[#A89C90]'}`}>
                                  {elapsed}m ago
                                </span>
                              </div>
                            </div>

                            {/* Table / Fulfillment & Guest */}
                            <div className="mt-2 flex items-center justify-between text-xs">
                              <span className="font-bold text-[#D4AF37] font-mono">
                                {ord.tableNumber ? `Table ${ord.tableNumber}` : 'Takeaway Pre-Order'}
                              </span>
                              <span className="text-[#A89C90] truncate max-w-[110px]">
                                {ord.customerName}
                              </span>
                            </div>

                            {/* Itemized list */}
                            <div className="mt-3 space-y-1.5 text-xs text-[#D1C7BD] border-t border-[#2B211A] pt-2">
                              {ord.items.map((item) => (
                                <div key={item.cartItemId} className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="font-mono font-bold text-[#E07A5F] mr-1.5">
                                      {item.quantity}x
                                    </span>
                                    <span className="font-medium text-[#FAF7F2]">
                                      {item.menuItem.name}
                                    </span>
                                    {item.customizations.milk && (
                                      <span className="block text-[11px] text-[#8F8175]">
                                        ↳ {item.customizations.milk}
                                      </span>
                                    )}
                                    {item.customizations.extraShot && (
                                      <span className="block text-[11px] text-[#D4AF37]">
                                        ↳ Extra Espresso Shot
                                      </span>
                                    )}
                                    {item.customizations.crust && (
                                      <span className="block text-[11px] text-[#8F8175]">
                                        ↳ {item.customizations.crust}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {ord.notes && (
                              <p className="mt-2 text-[11px] text-[#D4AF37] bg-[#291F18] p-1.5 rounded border border-[#3E3027] italic">
                                "{ord.notes}"
                              </p>
                            )}
                          </div>

                          {/* Quick Stage Progression Buttons */}
                          <div className="pt-2 border-t border-[#2B211A] flex items-center justify-between gap-2">
                            {col.status === 'PENDING' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                                className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center justify-center gap-1"
                              >
                                <span>Start Prep</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {col.status === 'PREPARING' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'SERVED')}
                                className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Mark Served</span>
                              </button>
                            )}

                            {col.status === 'SERVED' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'BILLED')}
                                className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-stone-700 hover:bg-stone-600 text-[#EDE7E1] transition-colors flex items-center justify-center gap-1"
                              >
                                <span>Close Ticket</span>
                              </button>
                            )}

                            {col.status === 'BILLED' && (
                              <span className="text-[11px] font-mono text-emerald-400 w-full text-center py-1">
                                Paid & Completed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-VIEW 2: ROOFTOP FLOOR PLAN & RESERVATIONS */}
      {activeAdminTab === 'tables' && (
        <div className="space-y-8">
          {/* Visual Floor Plan Grid */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-[#2B211A]">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                  Rooftop Floor Plan & Seating Matrix
                </h3>
                <p className="text-xs text-[#A89C90]">
                  Overlooking Upper Lake Bhopal with 3 dedicated seating zones.
                </p>
              </div>

              {/* Status legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Available ({tables.filter((t) => t.status === 'AVAILABLE').length})
                </span>
                <span className="flex items-center gap-1.5 text-[#D4AF37]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  Reserved ({tables.filter((t) => t.status === 'RESERVED').length})
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Occupied ({tables.filter((t) => t.status === 'OCCUPIED').length})
                </span>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    tbl.status === 'OCCUPIED'
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : tbl.status === 'RESERVED'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-[#1F1916] border-[#352820]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-[#FAF7F2]">
                        {tbl.tableNumber}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          tbl.status === 'AVAILABLE'
                            ? 'text-emerald-400'
                            : tbl.status === 'RESERVED'
                            ? 'text-[#D4AF37]'
                            : 'text-rose-400'
                        }`}
                      >
                        {tbl.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#A89C90]">{tbl.zone.replace('_', ' ')}</p>
                    <p className="text-[11px] text-[#78695E] mt-0.5">Capacity: {tbl.capacity} Pax</p>

                    {tbl.currentGuestName && (
                      <p className="text-xs text-[#FAF7F2] font-semibold mt-2 pt-2 border-t border-[#2E231C]">
                        Guest: {tbl.currentGuestName}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#2E231C] flex items-center gap-1.5">
                    {tbl.status !== 'AVAILABLE' ? (
                      <button
                        onClick={() => updateTableStatus(tbl.id, 'AVAILABLE')}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-[#2B201A] hover:bg-[#382B23] text-[#EDE7E1] transition-colors"
                      >
                        Release Table
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTableStatus(tbl.id, 'OCCUPIED', 'Walk-in Guest')}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-[#D96B43] hover:bg-[#C25832] text-white transition-colors"
                      >
                        Seat Walk-In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Reservations Log */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-[#2B211A]">
            <h3 className="font-serif text-lg font-bold text-[#FAF7F2] mb-4">
              Upcoming Sunset & Dining Reservations
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#C8BCB0]">
                <thead className="bg-[#1E1714] text-[#8F8175] uppercase font-mono text-[10px] border-b border-[#2B211A]">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Guest</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Zone / Table</th>
                    <th className="p-3">Party</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261E19]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#1C1613]">
                      <td className="p-3 font-mono font-bold text-[#D4AF37]">
                        {res.bookingCode}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#FAF7F2] block">{res.guestName}</span>
                        <span className="text-[11px] text-[#7A6C61]">{res.guestPhone}</span>
                      </td>
                      <td className="p-3">
                        <span>{res.reservationDate}</span>
                        <span className="block text-[11px] text-[#E07A5F]">{res.timeSlot}</span>
                      </td>
                      <td className="p-3">
                        <span>{res.zone.replace('_', ' ')}</span>
                        <span className="block text-[11px] font-mono text-[#D4AF37]">Table: {res.tableNumber}</span>
                      </td>
                      <td className="p-3 font-mono">
                        {res.partySize} Guests
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'SEATED')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            Seat Guest
                          </button>
                        )}
                        {res.status === 'SEATED' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'COMPLETED')}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#2E221A] text-[#EDE7E1]"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: MENU CRUD & 86-ING AVAILABILITY SWITCH */}
      {activeAdminTab === 'menu' && (
        <div className="p-6 rounded-2xl bg-[#171311] border border-[#2B211A] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                Menu 86-ing & Live Availability Toggle
              </h3>
              <p className="text-xs text-[#A89C90]">
                Toggle any item in 1-click if single-origin beans, imported cheeses, or seasonal spritzers run out during service.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dish name..."
                className="w-full text-xs p-2.5 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#6E6157] focus:outline-none focus:border-[#D96B43]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems
              .filter((item) =>
                menuSearch ? item.name.toLowerCase().includes(menuSearch.toLowerCase()) : true
              )
              .map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                    item.isAvailable
                      ? 'bg-[#1F1916] border-[#332821]'
                      : 'bg-rose-950/20 border-rose-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center p-0.5 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                        <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[#8F8175]">
                        {item.categoryId.replace('cat-', '')}
                      </span>
                    </div>

                    <h4 className="font-serif font-semibold text-sm text-[#FAF7F2]">
                      {item.name}
                    </h4>
                    <p className="font-mono text-xs text-[#D4AF37] mt-0.5">₹{item.price}</p>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => toggleMenuItemAvailability(item.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : "86'd (Sold Out)"}
                    </button>
                    <span className="block text-[10px] text-[#7A6C61] mt-1 font-mono">
                      {item.isAvailable ? 'Available online' : 'Hidden from bag'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
