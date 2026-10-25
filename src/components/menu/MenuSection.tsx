// src/components/menu/MenuSection.tsx
import React, { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, Plus, Compass } from 'lucide-react';
import { MenuItem } from '../../types';
import { CATEGORIES } from '../../data/initialData';
import { useCafeStore } from '../../store/useCafeStore';
import { useCartStore } from '../../store/useCartStore';
import { ItemCustomizationModal } from './ItemCustomizationModal';

interface MenuSectionProps {
  onTableQrClick?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onTableQrClick }) => {
  const menuItems = useCafeStore((s) => s.menuItems);
  const tableNumber = useCartStore((s) => s.tableNumber);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [filterChefSpecial, setFilterChefSpecial] = useState<boolean>(false);
  const [filterVeganOnly, setFilterVeganOnly] = useState<boolean>(false);

  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Filtered menu logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Dietary filters
      if (filterVegOnly && !item.isVeg) return false;
      if (filterVeganOnly && !item.isVegan) return false;
      if (filterChefSpecial && !item.isChefSpecial) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, filterVegOnly, filterVeganOnly, filterChefSpecial, searchQuery]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Table Dine-In Status Bar if table selected */}
      {tableNumber && (
        <div className="mb-8 p-3.5 rounded-xl bg-[#261E1A] border border-[#443328] flex items-center justify-between text-xs sm:text-sm text-[#EDE7E1]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
            <span>
              Connected to <strong className="font-mono text-[#D4AF37]">Table {tableNumber}</strong> — Orders will be served directly to your rooftop seat.
            </span>
          </div>
          <button
            onClick={onTableQrClick}
            className="text-xs text-[#E07A5F] hover:underline whitespace-nowrap"
          >
            Change Table
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[#2C241E] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E07A5F] mb-1">
            <span>Specialty Roasts & Rooftop Fare</span>
            <span aria-hidden="true" className="text-[#4E3F34]">·</span>
            <span>Upper Lake Bhopal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2]">
            Interactive Rooftop Menu
          </h2>
          <p className="mt-2 text-sm text-[#A89C90] max-w-xl">
            Sourced beans, slow-fermented woodfired crusts, and seasonal lake sunset spritzers. Every dish is crafted to order with local Malwa nuance.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8A7C70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pour-overs, pizzas..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-[#1A1512] border border-[#332821] text-[#EDE7E1] placeholder-[#7A6C61] focus:outline-none focus:border-[#D96B43] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7C70] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Segmented Tabs (Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#D96B43] text-white font-semibold shadow-sm'
              : 'bg-[#1C1613] text-[#A89C90] border border-[#2E241E] hover:text-[#EDE7E1]'
          }`}
        >
          All Items ({menuItems.length})
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#D96B43] text-white font-semibold shadow-sm'
                : 'bg-[#1C1613] text-[#A89C90] border border-[#2E241E] hover:text-[#EDE7E1]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dietary & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs text-[#A89C90]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[#D1C7BD] mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E07A5F]" />
            Filters:
          </span>

          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
              filterVegOnly
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-medium'
                : 'border-[#332821] bg-[#191512] text-[#A89C90] hover:border-[#4B3B30]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Vegetarian
          </button>

          <button
            onClick={() => setFilterVeganOnly(!filterVeganOnly)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filterVeganOnly
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-medium'
                : 'border-[#332821] bg-[#191512] text-[#A89C90] hover:border-[#4B3B30]'
            }`}
          >
            Vegan
          </button>

          <button
            onClick={() => setFilterChefSpecial(!filterChefSpecial)}
            className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
              filterChefSpecial
                ? 'border-[#D4AF37] bg-[#2E2614] text-[#FDE68A] font-medium'
                : 'border-[#332821] bg-[#191512] text-[#A89C90] hover:border-[#4B3B30]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Chef's Special
          </button>
        </div>

        <div>
          <span>Showing {filteredItems.length} dishes</span>
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#161311] rounded-2xl border border-[#2B221B] p-8">
          <p className="text-sm text-[#A89C90]">No dishes found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterVegOnly(false);
              setFilterVeganOnly(false);
              setFilterChefSpecial(false);
            }}
            className="mt-4 text-xs font-semibold text-[#D96B43] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group flex flex-col justify-between p-5 rounded-2xl bg-[#191412] border transition-all duration-200 ${
                !item.isAvailable
                  ? 'opacity-60 border-[#261E1A]'
                  : 'border-[#2F251E] hover:border-[#4E3B30] hover:shadow-lg hover:shadow-black/40'
              }`}
            >
              <div>
                {/* Clean Unboxed Metadata Line (Zero-pill discipline) */}
                <div className="flex items-center justify-between text-xs text-[#8F8175] mb-2.5">
                  <div className="flex items-center gap-2">
                    {/* Dietary badge */}
                    <span
                      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${
                        item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                      title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </span>

                    {item.isVegan && <span>Vegan</span>}
                    {item.isVegan && <span aria-hidden="true">·</span>}

                    {item.isChefSpecial && (
                      <span className="text-[#D4AF37] flex items-center gap-1 font-medium">
                        <Sparkles className="w-2.5 h-2.5" />
                        Chef's Choice
                      </span>
                    )}
                    {item.isChefSpecial && <span aria-hidden="true">·</span>}

                    <span>{item.prepTimeMin} min prep</span>
                  </div>

                  {!item.isAvailable && (
                    <span className="text-rose-400 font-mono text-[11px] font-semibold">
                      86'D (Sold Out)
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-semibold text-[#FAF7F2] group-hover:text-[#E07A5F] transition-colors leading-snug">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-[#A89C90] leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Customization hints */}
                {item.customOptions && Object.keys(item.customOptions).length > 0 && (
                  <div className="mt-3 text-[11px] text-[#7E7064] flex items-center gap-1.5">
                    <span>Customizable:</span>
                    {item.customOptions.milkChoices && <span>Milk</span>}
                    {item.customOptions.sweetness && <span>· Sweetness</span>}
                    {item.customOptions.spiceLevel && <span>· Spice</span>}
                    {item.customOptions.crust && <span>· Sourdough Crust</span>}
                  </div>
                )}
              </div>

              {/* Card Footer: Price & Add Button */}
              <div className="mt-6 pt-4 border-t border-[#261E1A] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A6C61]">Price</span>
                  <p className="font-mono text-base font-bold text-[#EDE7E1] tabular-nums">
                    ₹{item.price}
                  </p>
                </div>

                {item.isAvailable ? (
                  <button
                    onClick={() => setCustomizingItem(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] active:scale-95 transition-all rounded-xl shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <span className="text-xs text-[#706257] font-mono px-3 py-1.5 bg-[#171310] rounded-lg border border-[#2B211A]">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Customization Modal */}
      {customizingItem && (
        <ItemCustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </section>
  );
};
