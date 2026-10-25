// src/components/dinein/TableQrSection.tsx
import React from 'react';
import { QrCode, Check, Utensils, ShoppingBag } from 'lucide-react';
import { useCafeStore } from '../../store/useCafeStore';
import { useCartStore } from '../../store/useCartStore';
import { QrCodeGenerator } from '../common/QrCodeGenerator';

interface TableQrSectionProps {
  onStartOrdering: () => void;
}

export const TableQrSection: React.FC<TableQrSectionProps> = ({ onStartOrdering }) => {
  const tables = useCafeStore((s) => s.tables);
  const activeTable = useCartStore((s) => s.tableNumber);
  const setTableNumber = useCartStore((s) => s.setTableNumber);
  const setFulfillmentType = useCartStore((s) => s.setFulfillmentType);
  const fulfillmentType = useCartStore((s) => s.fulfillmentType);

  const handleSelectTable = (tblNumber: string) => {
    setTableNumber(tblNumber);
    setFulfillmentType('DINE_IN');
    onStartOrdering();
  };

  const handleSelectTakeaway = () => {
    setTableNumber(null);
    setFulfillmentType('TAKEAWAY');
    onStartOrdering();
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1916] rounded-full border border-[#3B2D24] text-xs text-[#E07A5F] mb-3">
          <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Contactless Rooftop Table Service</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2]">
          Scan or Select Your Table
        </h2>
        <p className="mt-2 text-sm text-[#A89C90]">
          Each table on the rooftop deck has its own dedicated QR code. Orders placed are transmitted instantly to the kitchen KDS with your table tag.
        </p>

        {/* Mode Toggle: Dine-In vs Takeaway */}
        <div className="mt-6 inline-flex p-1 bg-[#1A1412] border border-[#2E241D] rounded-xl">
          <button
            onClick={() => setFulfillmentType('DINE_IN')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
              fulfillmentType === 'DINE_IN'
                ? 'bg-[#D96B43] text-white shadow-sm'
                : 'text-[#A89C90] hover:text-[#EDE7E1]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Dine-In at Rooftop
          </button>
          <button
            onClick={handleSelectTakeaway}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
              fulfillmentType === 'TAKEAWAY'
                ? 'bg-[#D96B43] text-white shadow-sm'
                : 'text-[#A89C90] hover:text-[#EDE7E1]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Takeaway Pre-Order
          </button>
        </div>
      </div>

      {/* Grid of Rooftop Tables with simulated QR tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((tbl) => {
          const isSelected = activeTable === tbl.tableNumber;
          const tableQrValue = `https://aschauhan-cafe.bhopal.in/?table=${tbl.tableNumber}`;

          return (
            <div
              key={tbl.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#D96B43] bg-[#231A15] ring-2 ring-[#D96B43]/50'
                  : 'border-[#2D231C] bg-[#181412] hover:border-[#4B3B2F]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#FAF7F2] bg-[#2A201A] px-2.5 py-1 rounded-md border border-[#443328]">
                    {tbl.tableNumber}
                  </span>
                  <span
                    className={`text-[11px] font-mono ${
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

                {/* QR Code Graphic */}
                <div className="my-4 flex justify-center">
                  <QrCodeGenerator
                    value={tableQrValue}
                    size={110}
                    label={`Scan Table ${tbl.tableNumber}`}
                  />
                </div>

                <div className="text-xs text-[#A89C90] space-y-1">
                  <p className="font-medium text-[#FAF7F2]">
                    {tbl.zone === 'LAKESIDE_DECK' ? 'Lakeside Deck' : tbl.zone === 'CABANA_LOUNGE' ? 'Cabana Lounge' : 'Indoor Glasshouse'}
                  </p>
                  <p className="text-[11px] text-[#7A6C61] line-clamp-2">{tbl.notes}</p>
                  <p className="text-[11px] font-mono text-[#8A7B6E]">Capacity: {tbl.capacity} Persons</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#261E1A]">
                <button
                  onClick={() => handleSelectTable(tbl.tableNumber)}
                  className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-[#D96B43] hover:bg-[#C25832] text-white active:scale-95'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Active (Order Here)
                    </>
                  ) : (
                    'Order For This Table'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
