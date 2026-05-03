import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, MapPin, Navigation, Car, Share2, Maximize2, Sparkles, Image as ImageIcon, Globe, Map as MapIcon } from 'lucide-react';
import { campusBuildings } from './campusData';
import { FloorName, POI, pois, CAMPUS_CENTER } from './data';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
          loading="lazy"
          decoding="async"
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
            loading="lazy"
            decoding="async"
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

function MapController({ selectedPOI, center }: { selectedPOI: POI | null, center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    
    // Invalidate size in case of hidden/shown map container giving NaNs
    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {}
    }, 100);

    try {
      const isValidCoord = (c: any) => typeof c === 'number' && !Number.isNaN(c) && isFinite(c);
      const size = map.getSize();
      const canAnimate = size.x > 0 && size.y > 0;

      if (selectedPOI && isValidCoord(selectedPOI.lat) && isValidCoord(selectedPOI.lng)) {
        if (canAnimate) {
            map.flyTo([selectedPOI.lat, selectedPOI.lng], 20, { animate: true, duration: 0.8 });
        } else {
            map.setView([selectedPOI.lat, selectedPOI.lng], 20, { animate: false });
        }
      } else if (center && isValidCoord(center[0]) && isValidCoord(center[1])) {
        if (canAnimate) {
            map.flyTo(center, 18, { animate: true, duration: 0.8 });
        } else {
            map.setView(center, 18, { animate: false });
        }
      }
    } catch (e) {
      console.error("MapController Error", e);
    }
  }, [selectedPOI, map, center]);
  return null;
}

function POIMarker({ poi, isSelected, onClick }: { key?: string | number, poi: POI, isSelected: boolean, onClick: () => void }) {
  let bgColorClass = "bg-slate-900/80 backdrop-blur-md";
  let textColorClass = "text-white";
  if (poi.type === 'entrance') bgColorClass = "bg-emerald-600/80 backdrop-blur-md";
  if (poi.type === 'facility') bgColorClass = "bg-amber-500/80 backdrop-blur-md";
  if (poi.type === 'office') bgColorClass = "bg-purple-600/80 backdrop-blur-md";
  if (poi.type === 'lab') bgColorClass = "bg-blue-600/80 backdrop-blur-md";

  if (isSelected) {
    bgColorClass = "bg-blue-600/90 backdrop-blur-md ring-4 ring-blue-600/30";
    textColorClass = "text-white scale-110";
  }

  const iconHtml = `
    <div class="relative flex flex-col items-center justify-center transition-all duration-300 transform -translate-y-1/2">
      <div class="px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 border-2 border-white ${bgColorClass} ${textColorClass}">
        ${poi.name}
      </div>
      <div class="w-1.5 h-1.5 rounded-full bg-white shadow-sm absolute -bottom-1 z-10 hidden"></div>
      <div class="w-0.5 h-4 bg-white/80 absolute -bottom-4 shadow-sm z-0"></div>
      <div class="w-2 h-2 rounded-full ${bgColorClass} absolute -bottom-4 z-10 border border-white"></div>
    </div>
  `;

  const customIcon = L.divIcon({
    html: iconHtml,
    className: 'custom-poi-marker bg-transparent',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  if (typeof poi.lat !== 'number' || typeof poi.lng !== 'number' || !isFinite(poi.lat) || !isFinite(poi.lng)) {
    console.error("Invalid POI coordinates: ", poi);
    return null;
  }

  return (
    <Marker 
      position={[poi.lat, poi.lng]} 
      icon={customIcon}
      eventHandlers={{ click: onClick }}
    />
  );
}

export function LeafletMap({ floor, selectedPOI, onSelectPOI }: { floor: FloorName, selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  const floorPOIs = pois.filter(p => p.floor === floor);

  return (
    <div className="w-full h-full relative isolate rounded-3xl overflow-hidden" style={{ minHeight: '400px' }}>
      <MapContainer 
        center={CAMPUS_CENTER} 
        zoom={18} 
        scrollWheelZoom={true}
        className="w-full h-full z-0 font-sans"
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={22}
        />
        <MapController selectedPOI={selectedPOI} center={CAMPUS_CENTER} />
        {floorPOIs.map(poi => (
          <POIMarker 
            key={poi.id} 
            poi={poi} 
            isSelected={selectedPOI?.id === poi.id} 
            onClick={() => onSelectPOI(poi)} 
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default function OutsideView({ floor, selectedPOI, onSelectPOI, isFullscreen }: { floor: FloorName, selectedPOI: POI | null, onSelectPOI: (poi: POI) => void, isFullscreen?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'schematic' | 'satellite'>('satellite');
  const filteredBuildings = campusBuildings.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={cn("flex flex-col gap-6 animate-in fade-in duration-500", isFullscreen ? "h-full" : "")}>
      
      {/* Map Container */}
      <div className={cn(
        "relative bg-white overflow-hidden shadow-xl border border-slate-100 isolate transition-all duration-300",
        isFullscreen ? "flex-1 rounded-2xl h-full" : "min-h-[500px] aspect-[4/5] md:min-h-0 md:aspect-video rounded-3xl"
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
              <LeafletMap floor={floor} selectedPOI={selectedPOI} onSelectPOI={onSelectPOI} />
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
              <ActionCard icon={<MapIcon className="w-4 h-4"/>} color="bg-blue-500" title="Campus Map" sub="Campus layout" />
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
