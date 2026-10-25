// src/components/menu/ItemCustomizationModal.tsx
import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, SelectedCustomizations } from '../../types';
import { useCartStore } from '../../store/useCartStore';

interface ItemCustomizationModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({ item, onClose }) => {
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [milk, setMilk] = useState<string>('Dairy');
  const [sweetness, setSweetness] = useState<string>('Subtle Sweet');
  const [extraShot, setExtraShot] = useState(false);
  const [crust, setCrust] = useState<string>('Classic Neapolitan Sourdough');
  const [spiceLevel, setSpiceLevel] = useState<string>('Bhopali Medium');
  const [drizzle, setDrizzle] = useState<string>('Warm Espresso Caramel');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!item) return null;

  // Calculate dynamic add-on price
  let addonPrice = 0;
  if (milk.includes('+₹40')) addonPrice += 40;
  if (milk.includes('+₹30')) addonPrice += 30;
  if (crust.includes('+₹40')) addonPrice += 40;
  if (extraShot) addonPrice += 60;

  const itemUnitPrice = item.price + addonPrice;
  const totalPrice = itemUnitPrice * quantity;

  const handleAddToCart = () => {
    const customizations: SelectedCustomizations = {
      milk: item.customOptions?.milkChoices ? milk : undefined,
      sweetness: item.customOptions?.sweetness ? sweetness : undefined,
      extraShot: item.customOptions?.extraShot ? extraShot : undefined,
      crust: item.customOptions?.crust ? crust : undefined,
      spiceLevel: item.customOptions?.spiceLevel ? spiceLevel : undefined,
      drizzle: item.customOptions?.drizzle ? drizzle : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    addItem(item, quantity, customizations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#191512] border border-[#3A2E25] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2C231C] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </span>
              <span className="text-xs text-[#A89C90] uppercase tracking-wider font-mono">
                {item.categoryId.replace('cat-', '').replace('-', ' ')}
              </span>
            </div>
            <h2 id="modal-title" className="text-xl font-serif font-bold text-[#FAF7F2]">
              {item.name}
            </h2>
            <p className="text-xs text-[#B5A89C] mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A89C90] hover:text-white hover:bg-[#2B211A] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Options */}
        <div className="px-6 py-4 overflow-y-auto space-y-5 text-sm">
          {/* Milk Options */}
          {item.customOptions?.milkChoices && (
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                Milk Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.customOptions.milkChoices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setMilk(choice)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between transition-colors ${
                      milk === choice
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#332821] bg-[#1F1916] text-[#A89C90] hover:border-[#4B3B30]'
                    }`}
                  >
                    <span>{choice}</span>
                    {milk === choice && <Check className="w-3.5 h-3.5 text-[#D96B43]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {item.customOptions?.sweetness && (
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                Sweetness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.customOptions.sweetness.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSweetness(s)}
                    className={`px-3 py-2 text-xs rounded-xl border text-center transition-colors ${
                      sweetness === s
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#332821] bg-[#1F1916] text-[#A89C90] hover:border-[#4B3B30]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shot */}
          {item.customOptions?.extraShot && (
            <div className="p-3 rounded-xl bg-[#201A16] border border-[#332821] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#EDE7E1]">Extra Espresso Shot (+₹60)</p>
                <p className="text-[11px] text-[#A89C90]">Double extraction of single-origin beans</p>
              </div>
              <button
                type="button"
                onClick={() => setExtraShot(!extraShot)}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  extraShot ? 'bg-[#D96B43] border-[#D96B43] text-white' : 'border-[#4A3B30] bg-[#16120F]'
                }`}
              >
                {extraShot && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Pizza Crust Choice */}
          {item.customOptions?.crust && (
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                Crust Profile
              </label>
              <div className="space-y-2">
                {item.customOptions.crust.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrust(c)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between transition-colors ${
                      crust === c
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#332821] bg-[#1F1916] text-[#A89C90] hover:border-[#4B3B30]'
                    }`}
                  >
                    <span>{c}</span>
                    {crust === c && <Check className="w-3.5 h-3.5 text-[#D96B43]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {item.customOptions?.spiceLevel && (
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                Spice Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {item.customOptions.spiceLevel.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpiceLevel(lvl)}
                    className={`px-3 py-2 text-xs rounded-xl border text-center transition-colors ${
                      spiceLevel === lvl
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#332821] bg-[#1F1916] text-[#A89C90] hover:border-[#4B3B30]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dessert Drizzle */}
          {item.customOptions?.drizzle && (
            <div>
              <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-2 font-mono">
                Chef's Drizzle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.customOptions.drizzle.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDrizzle(d)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between transition-colors ${
                      drizzle === d
                        ? 'border-[#D96B43] bg-[#2E2018] text-[#FAF7F2] font-semibold'
                        : 'border-[#332821] bg-[#1F1916] text-[#A89C90] hover:border-[#4B3B30]'
                    }`}
                  >
                    <span>{d}</span>
                    {drizzle === d && <Check className="w-3.5 h-3.5 text-[#D96B43]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-[#D1C7BD] uppercase tracking-wider mb-1 font-mono">
              Special Kitchen Note
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less ice, extra hot, allergies, or lake view service timing..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-[#130F0D] border border-[#332821] text-[#EDE7E1] placeholder-[#6E6157] focus:outline-none focus:border-[#D96B43] transition-colors"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="px-6 py-4 border-t border-[#2C231C] bg-[#15110E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#241D18] border border-[#3A2D23] rounded-xl px-2 py-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded text-[#C8BCB0] hover:text-white disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold text-[#EDE7E1] min-w-[20px] text-center tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded text-[#C8BCB0] hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 text-sm font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] active:scale-[0.98] transition-all rounded-xl shadow-md flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="font-mono font-bold tabular-nums">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
