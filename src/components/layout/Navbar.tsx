// src/components/layout/Navbar.tsx
import React from 'react';
import { ShoppingBag, Sparkles, ChefHat } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCafeStore } from '../../store/useCafeStore';

interface NavbarProps {
  currentTab: 'home' | 'menu' | 'reserve' | 'table-qr' | 'admin';
  onSelectTab: (tab: 'home' | 'menu' | 'reserve' | 'table-qr' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setCartDrawerOpen);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const { currentRole, setRole } = useCafeStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121110]/90 backdrop-blur-md border-b border-[#2C241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 text-left group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B43] rounded-lg p-1"
        >
          <img
            src="/assets/aistudio/Gemini_Generated_Image_xlhewixlhewixlhe_42a20da6.png"
            alt="aschauhan-dev cafe"
            className="w-10 h-10 object-contain rounded-full bg-[#261E1A] p-0.5 border border-[#4A3B32] group-hover:border-[#D96B43] transition-colors"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#EDE7E1] whitespace-nowrap">
              aschauhan-dev <span className="text-[#D96B43] font-sans font-light">cafe</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C8BCB0]">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-[#E07A5F] font-semibold border-b-2 border-[#E07A5F]'
                : 'hover:text-[#EDE7E1]'
            }`}
          >
            Rooftop Experience
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'menu'
                ? 'text-[#E07A5F] font-semibold border-b-2 border-[#E07A5F]'
                : 'hover:text-[#EDE7E1]'
            }`}
          >
            Artisanal Menu
          </button>

          <button
            onClick={() => onSelectTab('reserve')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'reserve'
                ? 'text-[#E07A5F] font-semibold border-b-2 border-[#E07A5F]'
                : 'hover:text-[#EDE7E1]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Sunset Reserve
          </button>

          <button
            onClick={() => onSelectTab('table-qr')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'table-qr'
                ? 'text-[#E07A5F] font-semibold border-b-2 border-[#E07A5F]'
                : 'hover:text-[#EDE7E1]'
            }`}
          >
            Dine-In QR
          </button>

          <button
            onClick={() => {
              setRole(currentRole === 'CUSTOMER' ? 'KITCHEN_STAFF' : 'CUSTOMER');
              onSelectTab('admin');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'text-[#E07A5F] font-semibold border-b-2 border-[#E07A5F]'
                : 'hover:text-[#EDE7E1]'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-[#D96B43]" />
            Kitchen KDS
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Bag drawer trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          {tableNumber && (
            <span className="hidden sm:inline-block text-xs font-mono text-[#D4AF37] bg-[#2A221C] px-2.5 py-1 rounded-md border border-[#47382F] whitespace-nowrap">
              Table {tableNumber}
            </span>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B43]"
            aria-label="View Order Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">Order Bag</span>
            {itemCount > 0 && (
              <span className="bg-[#1C1613] text-[#EDE7E1] font-mono text-xs px-1.5 py-0.5 rounded-full font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-[#231C18] gap-4 text-xs font-medium text-[#C8BCB0] scrollbar-none">
        <button
          onClick={() => onSelectTab('home')}
          className={`whitespace-nowrap shrink-0 py-1 ${currentTab === 'home' ? 'text-[#E07A5F] font-semibold' : ''}`}
        >
          Rooftop
        </button>
        <button
          onClick={() => onSelectTab('menu')}
          className={`whitespace-nowrap shrink-0 py-1 ${currentTab === 'menu' ? 'text-[#E07A5F] font-semibold' : ''}`}
        >
          Menu
        </button>
        <button
          onClick={() => onSelectTab('reserve')}
          className={`whitespace-nowrap shrink-0 py-1 ${currentTab === 'reserve' ? 'text-[#E07A5F] font-semibold' : ''}`}
        >
          Sunset Reserve
        </button>
        <button
          onClick={() => onSelectTab('table-qr')}
          className={`whitespace-nowrap shrink-0 py-1 ${currentTab === 'table-qr' ? 'text-[#E07A5F] font-semibold' : ''}`}
        >
          Dine-In QR
        </button>
        <button
          onClick={() => {
            setRole('KITCHEN_STAFF');
            onSelectTab('admin');
          }}
          className={`whitespace-nowrap shrink-0 py-1 ${currentTab === 'admin' ? 'text-[#E07A5F] font-semibold' : ''}`}
        >
          Staff KDS
        </button>
      </div>
    </header>
  );
};
