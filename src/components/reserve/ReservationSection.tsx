// src/components/reserve/ReservationSection.tsx
import React, { useState } from 'react';
import { Calendar, Users, Sparkles, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TableZone, Reservation } from '../../types';
import { TIME_SLOTS } from '../../data/initialData';
import { useCafeStore } from '../../store/useCafeStore';
import { QrCodeGenerator } from '../common/QrCodeGenerator';

export const ReservationSection: React.FC = () => {
  const createReservation = useCafeStore((s) => s.createReservation);
  const tables = useCafeStore((s) => s.tables);

  // Form state
  const [selectedZone, setSelectedZone] = useState<TableZone>('LAKESIDE_DECK');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('05:00 PM - 07:00 PM');
  const [partySize, setPartySize] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const zones: { id: TableZone; title: string; subtitle: string; tag: string; description: string }[] = [
    {
      id: 'LAKESIDE_DECK',
      title: 'Lakeside Deck & Edge Seating',
      subtitle: 'Upper Lake Waterfront Horizon',
      tag: 'Most Popular for Sunset',
      description: 'Front-row rooftop edge seating with unobstructed golden hour reflection over Bada Talaab.',
    },
    {
      id: 'CABANA_LOUNGE',
      title: 'Cabana Lounge & Fairy Lights',
      subtitle: 'Acoustic Stage & Intimate Cushions',
      tag: 'Romantic & Group Lounging',
      description: 'Private bamboo framed cabanas with fairy light canopies, Moroccan floor poufs, and soft acoustics.',
    },
    {
      id: 'INDOOR_GLASSHOUSE',
      title: 'Indoor Glasshouse Bar',
      subtitle: 'Espresso Bar & Remote Work Docks',
      tag: 'Air-Conditioned Comfort',
      description: 'Panoramic glass pavilion facing the lake with Slayer espresso bar, quiet acoustics, and high-speed fiber.',
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) {
      setFormError('Please enter the primary guest name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 10) {
      setFormError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }

    const isSunset = selectedSlot.includes('05:00 PM') || selectedSlot.includes('Sunset');

    // Auto-match an available table in the zone
    const matchingTable = tables.find(
      (t) => t.zone === selectedZone && t.capacity >= partySize && t.status === 'AVAILABLE'
    );

    const booking = createReservation({
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || `${guestName.toLowerCase().replace(/\s+/g, '')}@cafe.guest`,
      guestPhone: guestPhone.trim(),
      partySize,
      reservationDate: selectedDate,
      timeSlot: selectedSlot,
      isSunsetSlot: isSunset,
      zone: selectedZone,
      tableNumber: matchingTable?.tableNumber || (selectedZone === 'LAKESIDE_DECK' ? 'LAKE-02' : 'CABANA-01'),
      specialRequests: specialRequests.trim() || undefined,
    });

    setConfirmedBooking(booking);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D96B43', '#D4AF37', '#EDE7E1'],
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {confirmedBooking ? (
        /* Confirmed Ticket Pass */
        <div className="max-w-xl mx-auto bg-[#1C1613] border border-[#3E3027] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-[#2C231C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#E07A5F] uppercase tracking-wider">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
                  Sunset Table Pass
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#8F8175]">Booking ID</span>
              <p className="font-mono text-sm font-bold text-[#D4AF37]">
                {confirmedBooking.bookingCode}
              </p>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#231B17] border border-[#332821]">
                <span className="text-[#8F8175] block mb-1">Guest Name</span>
                <p className="font-semibold text-[#FAF7F2] text-sm">{confirmedBooking.guestName}</p>
                <span className="text-[11px] text-[#A89C90]">{confirmedBooking.guestPhone}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#231B17] border border-[#332821]">
                <span className="text-[#8F8175] block mb-1">Date & Time</span>
                <p className="font-semibold text-[#FAF7F2] text-sm">{confirmedBooking.reservationDate}</p>
                <span className="text-[11px] text-[#D4AF37] font-medium">{confirmedBooking.timeSlot}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#231B17] border border-[#332821]">
                <span className="text-[#8F8175] block mb-1">Rooftop Zone</span>
                <p className="font-semibold text-[#FAF7F2] text-sm">
                  {confirmedBooking.zone === 'LAKESIDE_DECK' ? 'Lakeside Deck' : confirmedBooking.zone === 'CABANA_LOUNGE' ? 'Cabana Lounge' : 'Indoor Glasshouse'}
                </p>
                <span className="text-[11px] text-[#A89C90]">Table: {confirmedBooking.tableNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#231B17] border border-[#332821]">
                <span className="text-[#8F8175] block mb-1">Party Size</span>
                <p className="font-semibold text-[#FAF7F2] text-sm font-mono">{confirmedBooking.partySize} Guests</p>
                <span className="text-[11px] text-emerald-400">Guaranteed Seating</span>
              </div>
            </div>

            {/* QR Code Validation */}
            <div className="mt-6 flex flex-col items-center justify-center p-5 bg-[#14100E] rounded-2xl border border-[#2B211A]">
              <QrCodeGenerator
                value={`ASCHAUHAN-CAFE-BOOKING-${confirmedBooking.bookingCode}`}
                size={130}
                label="Show at Rooftop Host Desk"
              />
              <p className="mt-3 text-[11px] text-[#A89C90] text-center max-w-xs">
                Present this QR pass to the rooftop host on VIP Road, Bhopal. Tables are held for up to 20 minutes past slot time.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#2C231C] flex items-center justify-between gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#261E1A] hover:bg-[#322722] text-[#EDE7E1] border border-[#3E3027] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Save Pass / Print
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `My sunset reservation at aschauhan-dev cafe Bhopal! Booking ID: ${confirmedBooking.bookingCode} for ${confirmedBooking.reservationDate} at ${confirmedBooking.timeSlot}`
                );
                alert('Booking details copied to clipboard!');
              }}
              className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#261E1A] hover:bg-[#322722] text-[#EDE7E1] border border-[#3E3027] transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#D96B43] hover:bg-[#C25832] text-white transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1916] rounded-full border border-[#3B2D24] text-xs text-[#E07A5F] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Upper Lake Panoramic Seating</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2]">
              Reserve Your Sunset Experience
            </h2>
            <p className="mt-2 text-sm text-[#A89C90]">
              Golden Hour tables overlooking Bada Talaab are highly coveted. Book your preferred zone with guaranteed lake sightlines and bespoke table service.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Step 1: Rooftop Zone Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-3 font-mono">
                1. Select Rooftop Table Zone
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      selectedZone === zone.id
                        ? 'border-[#D96B43] bg-[#241A15] shadow-lg shadow-[#D96B43]/10 ring-1 ring-[#D96B43]'
                        : 'border-[#2C231C] bg-[#181311] hover:border-[#3F3127]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] uppercase">
                          {zone.tag}
                        </span>
                        {selectedZone === zone.id && (
                          <span className="w-2 h-2 rounded-full bg-[#D96B43]" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-[#FAF7F2] text-base mb-1">
                        {zone.title}
                      </h4>
                      <p className="text-xs text-[#A89C90] leading-relaxed">
                        {zone.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#29201A] text-[11px] text-[#7A6C61]">
                      {zone.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date, Time & Party Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#191412] border border-[#2D231C]">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E07A5F]" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] focus:outline-none focus:border-[#D96B43]"
                  required
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E07A5F]" />
                  Party Size
                </label>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[2, 3, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPartySize(num)}
                      className={`px-3 py-2 text-xs font-mono font-semibold rounded-xl border transition-colors ${
                        partySize === num
                          ? 'border-[#D96B43] bg-[#D96B43] text-white'
                          : 'border-[#332821] bg-[#120F0D] text-[#A89C90] hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                  Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] focus:outline-none focus:border-[#D96B43]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time} {slot.isSunset ? '★ (Sunset Slot)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Contact & Notes */}
            <div className="p-6 rounded-2xl bg-[#191412] border border-[#2D231C] space-y-4">
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider font-mono">
                3. Primary Guest Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#706257] focus:outline-none focus:border-[#D96B43]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Phone (WhatsApp for ticket) *"
                    className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#706257] focus:outline-none focus:border-[#D96B43]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#706257] focus:outline-none focus:border-[#D96B43]"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Special requests (e.g. Birthday anniversary candlelight, edge corner table, high-chair)..."
                  className="w-full text-xs p-3 rounded-xl bg-[#120F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#706257] focus:outline-none focus:border-[#D96B43]"
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-400 font-medium">{formError}</p>
              )}
            </div>

            {/* Submission CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#8F8175]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero reservation deposit required. Free cancellation up to 1 hour prior.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] active:scale-95 transition-all rounded-xl shadow-lg shadow-[#D96B43]/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                Confirm Table Reservation
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
