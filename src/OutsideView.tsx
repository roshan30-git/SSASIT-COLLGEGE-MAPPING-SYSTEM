import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, MapPin, Navigation, Car, Share2, Maximize2, Sparkles, Image as ImageIcon, Globe, Map as MapIcon } from 'lucide-react';
import { campusBuildings } from './campusData';
import cn from 'clsx';

function ActionCard({ icon, color, title, sub }: any) {
  return (
    <button className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group w-full">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:-translate-y-0.5", color)}>
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-[11px] font-bold text-slate-900 truncate">{title}</div>
        <div className="text-[9px] text-slate-500 font-medium truncate mt-0.5">{sub}</div>
      </div>
    </button>
  );
}

function ComparisonMap({ isFullscreen }: { isFullscreen?: boolean }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isResizing) handleMove(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      className={cn(
        "relative bg-slate-950 overflow-hidden shadow-2xl border border-white/10 group cursor-col-resize select-none h-full w-full",
        isFullscreen ? "" : "rounded-3xl"
      )}
      ref={containerRef}
    >
      {/* "Before" Layer (Physical Board) - Bottom Layer */}
      <div className="absolute inset-0 w-full h-full bg-slate-900">
        <img 
          src="https://i.postimg.cc/J0hH8jHS/IMG-20260501-160533-jpg.jpg" 
          alt="Physical Campus Map"
          className="w-full h-full object-contain p-2 sm:p-4"
        />
        <div className="absolute bottom-6 left-6 z-10 px-4 py-2 bg-slate-950/80 backdrop-blur rounded-lg border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hidden sm:block">
          Original Photo
        </div>
      </div>

      {/* "After" Layer (Schematic Diagram) - Top Layer with Clip Path */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute inset-0 w-full h-full bg-slate-50">
          <img 
            src="https://i.postimg.cc/NMD2ZdLw/Chat-GPT-Image-May-2-2026-11-55-58-PM.png" 
            alt="Digital Schematic Map"
            className="w-full h-full object-contain p-2 sm:p-4"
          />
          <div className="absolute bottom-6 right-6 z-10 px-4 py-2 bg-blue-600/90 backdrop-blur rounded-lg border border-blue-400/30 text-white text-[10px] font-black uppercase tracking-widest hidden sm:block">
            New Schematic
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 z-40 w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-950 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
           <Maximize2 size={16} className="text-white rotate-45" />
        </div>
      </div>

      {/* Comparison Hints */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-none">
        <div className="px-3 py-1.5 bg-slate-950/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-wider">Map Comparison</span>
        </div>
      </div>
    </div>
  );
}

export default function OutsideView({ realMapNode, isFullscreen }: { realMapNode?: React.ReactNode, isFullscreen?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'schematic' | 'satellite'>('schematic');
  const filteredBuildings = campusBuildings.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={cn("flex flex-col gap-6 animate-in fade-in duration-500", isFullscreen ? "h-full" : "")}>
      
      {/* Map Container */}
      <div className={cn(
        "relative bg-white overflow-hidden shadow-xl border border-slate-100 isolate transition-all duration-300",
        isFullscreen ? "flex-1 rounded-2xl h-full" : "aspect-[4/3] md:aspect-video rounded-3xl"
      )}>
        {/* Toggle Controls Overlay */}
        <div className="absolute top-4 right-4 z-50 flex bg-white/90 backdrop-blur-xl shadow-lg p-1 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => setMapMode('schematic')} 
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", 
              mapMode === 'schematic' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            <MapIcon size={12} /> Schematic
          </button>
          <button 
            onClick={() => setMapMode('satellite')} 
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", 
              mapMode === 'satellite' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            <Globe size={12} /> Earth
          </button>
        </div>

        <div className="w-full h-full">
          {mapMode === 'schematic' ? (
            <ComparisonMap isFullscreen={isFullscreen} />
          ) : (
            <div className="w-full h-full bg-[#f8fafc] relative">
              {realMapNode || <div className="flex items-center justify-center h-full text-slate-400 font-bold">Earth Map Initializing...</div>}
              <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-end">
                <div className="inline-flex bg-slate-900/40 backdrop-blur p-2 rounded-lg text-[8px] text-white/60 font-medium">Real-time Satellite Data</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isFullscreen && (
        <>
          {/* Buildings Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight text-left">Map Directory</h3>
              <div className="relative w-48 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search map..."
                  className="w-full bg-white border border-slate-200 rounded-full py-2 pl-9 pr-3 text-[11px] font-medium placeholder:text-slate-400 shadow-sm outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredBuildings.map(b => (
                <div key={b.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-inner", b.color, b.textColor)}>
                    {b.id}
                  </div>
                  <div className="flex-1 text-[11px] font-bold text-slate-800 leading-tight">
                    {b.name}
                  </div>
                  <div className="text-slate-400 p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pb-8 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight text-left ml-1">Quick Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ActionCard icon={<Navigation className="w-4 h-4"/>} color="bg-blue-500" title="Directions" sub="Smart routing" />
              <ActionCard icon={<MapPin className="w-4 h-4"/>} color="bg-emerald-500" title="Nearby" sub="Discover points" />
              <ActionCard icon={<Car className="w-4 h-4"/>} color="bg-indigo-500" title="Parking" sub="Availability list" />
              <ActionCard icon={<Share2 className="w-4 h-4"/>} color="bg-orange-500" title="Share" sub="Send coordinates" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
