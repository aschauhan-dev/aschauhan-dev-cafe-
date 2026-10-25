// src/App.tsx
import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { MenuSection } from './components/menu/MenuSection';
import { ReservationSection } from './components/reserve/ReservationSection';
import { TableQrSection } from './components/dinein/TableQrSection';
import { StaffDashboard } from './components/admin/StaffDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { useCartStore } from './store/useCartStore';

type AppTab = 'home' | 'menu' | 'reserve' | 'table-qr' | 'admin';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const setFulfillmentType = useCartStore((s) => s.setFulfillmentType);

  // Auto-detect table query param (e.g. ?table=07 or ?table=LAKE-01)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tableParam = urlParams.get('table');
      if (tableParam) {
        const formatted = tableParam.startsWith('LAKE-') || tableParam.startsWith('CABANA-') || tableParam.startsWith('GLASS-')
          ? tableParam
          : `LAKE-${tableParam.padStart(2, '0')}`;
        setTableNumber(formatted);
        setFulfillmentType('DINE_IN');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [setTableNumber, setFulfillmentType]);

  const handleSelectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121110] text-[#EDE7E1]">
      {/* Fixed/Sticky Top Bar */}
      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onReserveClick={() => handleSelectTab('reserve')}
              onMenuClick={() => handleSelectTab('menu')}
              onTableQrClick={() => handleSelectTab('table-qr')}
            />
            {/* Quick Teaser of Menu */}
            <MenuSection onTableQrClick={() => handleSelectTab('table-qr')} />
          </>
        )}

        {currentTab === 'menu' && (
          <MenuSection onTableQrClick={() => handleSelectTab('table-qr')} />
        )}

        {currentTab === 'reserve' && (
          <ReservationSection />
        )}

        {currentTab === 'table-qr' && (
          <TableQrSection onStartOrdering={() => handleSelectTab('menu')} />
        )}

        {currentTab === 'admin' && (
          <StaffDashboard />
        )}
      </main>

      {/* Slide-over Order Bag Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
