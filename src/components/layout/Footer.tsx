// src/components/layout/Footer.tsx
import React from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'menu' | 'reserve' | 'table-qr' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#100D0B] border-t border-[#231A14] text-[#A89C90] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_xlhewixlhewixlhe_42a20da6.png"
                alt="aschauhan-dev cafe"
                className="w-9 h-9 object-contain rounded-full bg-[#201814] p-0.5 border border-[#443328]"
              />
              <span className="font-serif text-lg font-bold text-[#FAF7F2]">
                aschauhan-dev <span className="text-[#D96B43] font-sans font-light">cafe</span>
              </span>
            </div>
            <p className="text-xs text-[#8F8175] leading-relaxed">
              Open-air rooftop specialty coffee house and sunset bistro overlooking Bhopal’s Upper Lake (Bada Talaab). Designed for remote engineers by day, sunset diners by dusk.
            </p>
            <div className="text-[11px] text-[#D4AF37] font-mono">
              EST. 2024 · BHOPAL, MP
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2">
              Explore
            </p>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Rooftop Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('menu')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Interactive Artisanal Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('reserve')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Reserve Sunset Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('table-qr')}
                  className="hover:text-[#FAF7F2] transition-colors"
                >
                  Dine-In QR Codes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-[#FAF7F2] transition-colors text-[#D96B43]"
                >
                  Kitchen KDS Console
                </button>
              </li>
            </ul>
          </div>

          {/* Timings & Sunset Slot */}
          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2">
              Hours & Golden Hour
            </p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D96B43] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#EDE7E1] font-medium">Monday – Sunday</p>
                  <p className="text-[11px] text-[#7A6C61]">11:00 AM – 11:30 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#D4AF37] font-medium">Bhopal Sunset Window</p>
                  <p className="text-[11px] text-[#7A6C61]">5:00 PM – 7:00 PM (Prior Booking Recommended)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2">
              Find Our Rooftop
            </p>
            <div className="space-y-1.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D96B43] shrink-0 mt-0.5" />
                <span>Rooftop Promenade, VIP Road, Overlooking Upper Lake (Bada Talaab), Bhopal, MP 462001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D96B43] shrink-0" />
                <span>+91 755 240 8891</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D96B43] shrink-0" />
                <span>hello@aschauhandev.cafe</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-6 border-t border-[#1C1510] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#706256]">
          <p>© {new Date().getFullYear()} aschauhan-dev cafe. Crafted with artisanal coffee passion in Bhopal.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#8F8175]">
              <Instagram className="w-3 h-3 text-[#D96B43]" />
              <a
                href="https://instagram.com/a.s.chauhxn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#EDE7E1] transition-colors"
              >
                @a.s.chauhxn
              </a>
            </span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
