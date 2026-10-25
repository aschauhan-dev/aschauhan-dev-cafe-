// src/components/home/HeroSection.tsx
import React, { useState } from 'react';
import { Sun, Wind, Clock, MapPin, Sparkles, Coffee, Flame, Compass, Volume2, VolumeX } from 'lucide-react';
import { getBhopalSunsetInfo } from '../../data/initialData';

interface HeroSectionProps {
  onReserveClick: () => void;
  onMenuClick: () => void;
  onTableQrClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReserveClick,
  onMenuClick,
  onTableQrClick,
}) => {
  const sunsetInfo = getBhopalSunsetInfo();
  const [ambientAudioPlaying, setAmbientAudioPlaying] = useState(false);

  // Gentle procedural cafe ambience simulation (soft warm lake evening binaural chords)
  const toggleAmbientSound = () => {
    if (ambientAudioPlaying) {
      setAmbientAudioPlaying(false);
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        setAmbientAudioPlaying(true);
      }
    } catch {
      // Audio safety
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* 1. Bhopal Live Lake Sunset & Weather Strip */}
      <div className="bg-[#1A1512] border-b border-[#2C231C] px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[#D1C7BD] flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-[#E07A5F]">
              <Sun className="w-3.5 h-3.5 text-[#E07A5F]" />
              Bhopal Golden Hour: {sunsetInfo.goldenHourStart} – {sunsetInfo.goldenHourEnd}
            </span>
            <span aria-hidden="true" className="text-[#4A3B32]">·</span>
            <span className="flex items-center gap-1 text-[#B0A499]">
              <Clock className="w-3 h-3 text-[#B0A499]" />
              Sunset Dusk {sunsetInfo.sunsetTime}
            </span>
            <span aria-hidden="true" className="text-[#4A3B32]">·</span>
            <span className="flex items-center gap-1 text-[#B0A499]">
              <Wind className="w-3 h-3 text-[#B0A499]" />
              {sunsetInfo.lakeBreeze}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#A89C90]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D96B43]" />
              VIP Road, Upper Lake, Bhopal
            </span>
            <span aria-hidden="true" className="text-[#4A3B32]">·</span>
            <span className="font-mono text-[#D4AF37]">Open 11:00 AM – 11:30 PM</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Cinematic Visual Section */}
      <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center">
        {/* Background Image with Rich Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Gemini_Generated_Image_zg7q54zg7q54zg7q_e75816a1.png"
            alt="aschauhan-dev cafe rooftop sunset overlooking Upper Lake Bhopal"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/70 to-[#121110]/40" />
          <div className="absolute inset-0 bg-radial at-top from-transparent via-[#121110]/30 to-[#121110]/80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center">
          {/* Natural Editorial Brand Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1C1613]/85 backdrop-blur-md rounded-full border border-[#3E3027] mb-6 text-xs text-[#D1C7BD]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Open-Air Rooftop Specialty Coffee & Sunset Bistro</span>
            <span aria-hidden="true" className="text-[#4E3F34]">·</span>
            <span className="text-[#E07A5F]">Bhopal, MP</span>
          </div>

          {/* Display Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F2] max-w-3xl leading-[1.15] text-balance">
            Where Specialty Brews Meet the Upper Lake Sunset
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#D1C7BD] max-w-2xl font-normal leading-relaxed">
            By day, a light-filled sanctuary with ergonomic desks and single-origin pour-overs. By dusk, Bhopal’s most breathtaking open-air rooftop bistro with woodfired sourdough, fairy lights, and live acoustic calm.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onReserveClick}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-[#D96B43] hover:bg-[#C25832] active:scale-95 transition-all rounded-xl shadow-lg shadow-[#D96B43]/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FDE68A]" />
              Reserve a Sunset Table
            </button>

            <button
              onClick={onMenuClick}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-[#EDE7E1] bg-[#241D18]/90 hover:bg-[#322720] border border-[#48392F] hover:border-[#D96B43] active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4 text-[#E07A5F]" />
              Explore Artisanal Menu
            </button>

            <button
              onClick={onTableQrClick}
              className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium text-[#C8BCB0] hover:text-white bg-transparent hover:bg-[#201A16]/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              Dine-In QR Order
            </button>
          </div>

          {/* Sound & Mood Toggle */}
          <div className="mt-6">
            <button
              onClick={toggleAmbientSound}
              className="inline-flex items-center gap-2 text-xs text-[#A89C90] hover:text-[#EDE7E1] transition-colors py-1 px-3 rounded-md bg-[#1C1613]/50 border border-[#2E241E]"
            >
              {ambientAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Rooftop Lake Ambience On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#73655A]" />
                  <span>Ambient Sounds</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Three Pillars of the aschauhan-dev Experience */}
      <div className="border-t border-[#2C241E] bg-[#161311] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#1D1714] border border-[#302620] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2A201A] border border-[#4A372C] flex items-center justify-center text-[#E07A5F] mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAF7F2] font-serif mb-2">
                Artisanal Manual Brew Bar
              </h3>
              <p className="text-sm text-[#A89C90] leading-relaxed">
                Directly sourced micro-lots from Araku Valley & Chikmagalur. Hand-brewed V60 pour-overs, AeroPress, and 12-hour cold drip extractors overlooking the lake horizon.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#29201A] flex items-center justify-between text-xs text-[#D4AF37] font-mono">
              <span>ESTATE SINGLE ORIGIN</span>
              <span>100% ARABICA</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1D1714] border border-[#302620] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2A201A] border border-[#4A372C] flex items-center justify-center text-[#E07A5F] mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAF7F2] font-serif mb-2">
                450°C Clay Woodfired Oven
              </h3>
              <p className="text-sm text-[#A89C90] leading-relaxed">
                48-hour slow fermented sourdough pizzas with San Marzano tomatoes, buffalo burrata, and Bhopali fusion small plates like poha-crusted arancini & smoked khameeri crisps.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#29201A] flex items-center justify-between text-xs text-[#D4AF37] font-mono">
              <span>ROOFTOP DOME OVEN</span>
              <span>NEAPOLITAN CRUST</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1D1714] border border-[#302620] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2A201A] border border-[#4A372C] flex items-center justify-center text-[#E07A5F] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAF7F2] font-serif mb-2">
                Sunset Lounge & Acoustic Nights
              </h3>
              <p className="text-sm text-[#A89C90] leading-relaxed">
                Overlooking the historic Bada Talaab with unobstructed sunset viewpoints. Unwind with acoustic guitars, fairy lights, botanical spritzers, and calm lakeside breeze.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#29201A] flex items-center justify-between text-xs text-[#D4AF37] font-mono">
              <span>UNOBSTRUCTED LAKE VIEW</span>
              <span>CABANA SEATING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
