import { POI, FloorName, pois } from '../data';
import clsx from 'clsx';
import { BookOpen, User, Users, Cpu, FileText, FlaskConical as Flask, Monitor, MonitorUp, Accessibility, ChevronDown, ArrowUp, Plus, Minus, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function SVGMap({ floor, selectedPOI, onSelectPOI }: { floor: FloorName, selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  const floorPOIs = pois.filter(p => p.floor === floor);
  
  return (
    <div className="w-full h-full overflow-hidden relative touch-none bg-slate-50">
      <TransformWrapper
        initialScale={typeof window !== 'undefined' && window.innerWidth < 640 ? 0.35 : 0.9}
        minScale={0.1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: false }}
        panning={{ velocityDisabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls overlay */}
            <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
              <button 
                onClick={() => zoomIn()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom In"
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={() => zoomOut()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom Out"
              >
                <Minus size={20} />
              </button>
              <button 
                onClick={() => resetTransform()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Reset View"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
              <svg 
                viewBox="0 0 1000 1000" 
                preserveAspectRatio="xMidYMid meet" 
                className="w-[1000px] h-[1000px] text-slate-800 drop-shadow-sm bg-white"
              >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            </pattern>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.15" />
            </filter>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          
          {/* Background with gradient and grid */}
          <rect width="100%" height="100%" fill="url(#bgGradient)" rx="24" />
          <rect width="100%" height="100%" fill="url(#grid)" rx="24" />
          
          {/* Background outline representing building structure abstractly */}
          <rect x="50" y="50" width="900" height="850" rx="32" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="6" />
          <rect x="50" y="50" width="900" height="850" rx="32" fill="white" fillOpacity="0.1" className="pointer-events-none backdrop-blur-sm" />
    
          {floorPOIs.map(poi => {
            const isSelected = selectedPOI?.id === poi.id;
            let colorClass = "fill-slate-100/60 stroke-slate-300"; // Base glassmorphism
            
            // Define base colors based on type
            if (poi.type === 'entrance') colorClass = "fill-emerald-400/40 stroke-emerald-400/80";
            if (poi.type === 'facility') colorClass = "fill-amber-400/40 stroke-amber-400/80";
            if (poi.type === 'office') colorClass = "fill-purple-400/40 stroke-purple-400/80";
            if (poi.type === 'classroom') colorClass = "fill-slate-300/40 stroke-slate-400/80";
            if (poi.type === 'bathroom') colorClass = "fill-cyan-400/40 stroke-cyan-400/80";
            if (poi.type === 'library') colorClass = "fill-indigo-400/40 stroke-indigo-400/80 text-indigo-900";
            
            // Detailed Lab Colors
            if (poi.type === 'lab') {
              if (poi.labType === 'computer') colorClass = "fill-blue-500/40 stroke-blue-500/80";
              else if (poi.labType === 'mech') colorClass = "fill-orange-500/40 stroke-orange-500/80";
              else if (poi.labType === 'be') colorClass = "fill-teal-500/40 stroke-teal-500/80";
              else if (poi.labType === 'bee') colorClass = "fill-yellow-400/40 stroke-yellow-500/80";
              else colorClass = "fill-blue-400/40 stroke-blue-400/80";
            }
    
            if (isSelected) {
              colorClass = "fill-blue-600/60 stroke-blue-600";
            }
    
            return (
              <g 
                key={poi.id} 
                className="cursor-pointer transition-all duration-300 origin-center"
                onClick={() => onSelectPOI(poi)}
              >
                {/* Drop shadow for 3D raised effect */}
                <rect 
                  x={poi.x} 
                  y={poi.y} 
                  width={poi.width} 
                  height={poi.height} 
                  rx="12"
                  fill="black"
                  fillOpacity="0.05"
                  transform="translate(4, 6)"
                  className="transition-all duration-300 pointer-events-none"
                />
                {/* Main glass rectangle */}
                <rect 
                  x={poi.x} 
                  y={poi.y} 
                  width={poi.width} 
                  height={poi.height} 
                  rx="12"
                  className={clsx(
                    "transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 hover:-translate-x-1",
                    colorClass,
                    isSelected ? "filter-shadow scale-[1.02]" : ""
                  )}
                  style={{ ...isSelected ? { filter: 'url(#shadow)' } : {} }}
                  strokeWidth={isSelected ? "3" : "1.5"}
                />
                {/* Subtle inner highlight to enhance glass effect */}
                <rect 
                  x={(poi.x || 0) + 1.5} 
                  y={(poi.y || 0) + 1.5} 
                  width={(poi.width || 0) - 3} 
                  height={(poi.height || 0) - 3} 
                  rx="10.5"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  className={clsx(
                    "pointer-events-none transition-all duration-300",
                    isSelected ? "scale-[1.02]" : "hover:-translate-y-1 hover:-translate-x-1"
                  )}
                />
                <text 
                  x={(poi.x || 0) + (poi.width || 0) / 2} 
                  y={(poi.y || 0) + (poi.height || 0) / 2} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className={clsx(
                    "font-bold tracking-tight selection:bg-none pointer-events-none transition-all duration-300",
                    isSelected ? "fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] scale-[1.02]" : "fill-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
                  )}
                  style={{ fontSize: poi.type === 'bathroom' ? '18px' : '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {poi.name}
                </text>
                
                {/* Draw a Pin indicator if selected */}
                {isSelected && (
                  <circle cx={(poi.x || 0) + (poi.width || 0) / 2} cy={(poi.y || 0) + (poi.height || 0) / 2 - 40} r="10" fill="white" className="animate-pulse" />
                )}
              </g>
            );
          })}
        </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export function ThirdFloorSVGMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  const rooms = [
    { id: '303', top: 2, left: 1.2, width: 22.5, height: 15.5, label: 'Class Room', sublabel: 'CE Department', color: 'blue', icon: Users },
    { id: '305', top: 2, left: 76.3, width: 22.5, height: 15.5, label: 'Class Room', sublabel: 'CE Department', color: 'blue', icon: Users },
    
    { id: '301', top: 19.5, left: 1.2, width: 14.8, height: 28.5, label: 'Laboratory', sublabel: 'Programming Lab', color: 'purple', tall: true, icon: Monitor },
    { id: '302', top: 19.5, left: 17.5, width: 12.2, height: 13.2, label: 'Office', sublabel: '', color: 'green', icon: User },
    { id: '304', top: 19.5, left: 31.2, width: 12.2, height: 13.2, label: 'Class Room', sublabel: '', color: 'blue', icon: Users },
    { id: '306', top: 19.5, left: 56.5, width: 12.2, height: 13.2, label: 'Class Room', sublabel: '', color: 'blue', icon: Users },
    { id: '307', top: 19.5, left: 84, width: 14.8, height: 28.5, label: 'Laboratory', sublabel: 'Hardware Lab', color: 'purple', tall: true, icon: Monitor },
    
    { id: '315', top: 50, left: 1.2, width: 14.8, height: 30, label: 'Laboratory', sublabel: 'Project Lab', color: 'purple', tall: true, icon: Monitor },
    { id: '316', top: 50, left: 17.5, width: 12.2, height: 13.2, label: 'HOD Office', sublabel: '', color: 'green', icon: User },
    
    { id: '314', top: 82, left: 17.5, width: 12.2, height: 15.8, label: 'Office', sublabel: 'Staff Room', color: 'green', icon: User },
    { id: '312', top: 82, left: 31.2, width: 12.2, height: 15.8, label: 'Class Room', sublabel: '', color: 'blue', icon: Users },
    { id: '313', top: 82, left: 44.9, width: 12.2, height: 15.8, label: 'Class Room', sublabel: '', color: 'blue', icon: Users },
    { id: '310', top: 82, left: 58.6, width: 9.8, height: 15.8, label: 'Class', sublabel: '', color: 'blue', icon: Users },
    { id: '311', top: 82, left: 69.9, width: 9.8, height: 15.8, label: 'Class', sublabel: '', color: 'blue', icon: Users },
    
    { id: '309', top: 66.2, left: 70.8, width: 11.8, height: 24.5, label: 'Computer Lab', sublabel: 'Lab - II', color: 'purple', icon: Monitor },
    
    { id: '308-A', top: 61.2, left: 84, width: 14.8, height: 11, label: 'Dept. Library', sublabel: '', color: 'purple', icon: BookOpen },
    { id: '308-B', top: 73.8, left: 84, width: 14.8, height: 11, label: 'Reading Room', sublabel: '', color: 'purple', icon: BookOpen }
  ];

  return (
    <div className="w-full h-full bg-[#0b1220] flex flex-col overflow-hidden">
      <style>{`
        .room-html {
          position: absolute;
          border-radius: 16px;
          cursor: pointer;
          user-select: none;
          background: rgba(17,24,39,0.75);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 10px 30px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.07),
            inset 0 -1px 0 rgba(0,0,0,0.4);
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
          isolation: isolate;
        }
        
        .room-html::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), transparent 30%);
          opacity: 0; transition: opacity 0.3s;
        }
        .room-html::after {
          content: ''; position: absolute; inset: -1px;
          border-radius: 16px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.25), transparent 40%, rgba(255,255,255,0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-in; mask-composite: exclude;
          opacity: 0.5; transition: opacity 0.3s;
        }
        
        .room-html:hover, .room-html-selected { transform: scale(1.03) translateY(-3px); z-index: 30; }
        .room-html:hover::before, .room-html-selected::before { opacity: 1; }
        .room-html:hover::after, .room-html-selected::after { opacity: 1; }

        .room-html.blue {
          background: linear-gradient(165deg, rgba(30,58,95,0.92) 0%, rgba(15,32,56,0.88) 100%);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 28px rgba(56,189,248,0.22), 0 0 0 1px rgba(125,211,252,0.12) inset;
        }
        .room-html.blue:hover, .room-html.blue.room-html-selected {
          box-shadow: 0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 45px rgba(56,189,248,0.42), 0 0 0 1px rgba(125,211,252,0.25) inset;
        }

        .room-html.purple {
          background: linear-gradient(165deg, rgba(61,42,95,0.92) 0%, rgba(35,24,58,0.88) 100%);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 28px rgba(139,92,246,0.22), 0 0 0 1px rgba(196,181,253,0.12) inset;
        }
        .room-html.purple:hover, .room-html.purple.room-html-selected {
          box-shadow: 0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 45px rgba(139,92,246,0.42), 0 0 0 1px rgba(196,181,253,0.25) inset;
        }

        .room-html.green {
          background: linear-gradient(165deg, rgba(30,74,58,0.92) 0%, rgba(16,44,34,0.88) 100%);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 28px rgba(16,185,129,0.2), 0 0 0 1px rgba(110,231,183,0.12) inset;
        }
        .room-html.green:hover, .room-html.green.room-html-selected {
          box-shadow: 0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 45px rgba(16,185,129,0.38), 0 0 0 1px rgba(110,231,183,0.25) inset;
        }

        .lift-station {
          background: linear-gradient(165deg, rgba(251,191,36,0.22), rgba(180,83,9,0.18));
          border: 1px solid rgba(251,191,36,0.5);
          box-shadow: 0 0 30px rgba(251,191,36,0.35), inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.4);
          display: grid; place-items: center; 
          border-radius: 14px;
        }
        
        .stair-area {
          background: linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,12,20,0.95));
          border: 1.5px solid rgba(148,163,184,0.18);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.4);
          display: grid; place-items: center; border-radius: 22px;
          overflow: hidden;
        }
        .stair-area::before {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(255,255,255,0.03) 11px, rgba(255,255,255,0.03) 12px);
        }

        .toilet-zone {
          background: linear-gradient(165deg, rgba(127,29,29,0.65), rgba(69,10,10,0.7));
          border: 1px solid rgba(248,113,113,0.4);
          box-shadow: 0 8px 24px rgba(0,0,0,0.45), 0 0 22px rgba(239,68,68,0.22), inset 0 1px 0 rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-evenly; padding: 10px; gap: 8px;
        }
        
        .dashed-path {
          fill: none; stroke: #ef4444; stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 14 12;
          filter: drop-shadow(0 0 8px rgba(239,68,68,0.85)) drop-shadow(0 0 16px rgba(239,68,68,0.5));
          animation: dashMove 20s linear infinite;
        }
        @keyframes dashMove { to { stroke-dashoffset: -520; } }
      `}</style>
      
      {/* Header */}
      <div className="flex-none p-4 sm:p-6 pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-700/50 shadow-lg backdrop-blur-md relative z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/30 shrink-0">
              <span className="font-bold text-xl text-white">03</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">SSASIT Floor 3</h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide uppercase mt-1">Computer Engineering Department</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-4 opacity-80 text-xs font-semibold uppercase tracking-widest mt-4 sm:mt-0">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Class Room</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Lab</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Office</div>
          </div>
        </div>
      </div>

      {/* Zoomable Map Container */}
      <div className="flex-1 overflow-hidden relative w-full touch-none">
        <TransformWrapper
          initialScale={typeof window !== 'undefined' && window.innerWidth < 640 ? 0.35 : 0.8}
          minScale={0.1}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
          panning={{ velocityDisabled: false }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls overlay */}
              <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => zoomIn()}
                  className="w-10 h-10 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl flex items-center justify-center text-white hover:bg-slate-700 active:scale-95 transition-all backdrop-blur-md"
                  title="Zoom In"
                >
                  <Plus size={20} />
                </button>
                <button 
                  onClick={() => zoomOut()}
                  className="w-10 h-10 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl flex items-center justify-center text-white hover:bg-slate-700 active:scale-95 transition-all backdrop-blur-md"
                  title="Zoom Out"
                >
                  <Minus size={20} />
                </button>
                <button 
                  onClick={() => resetTransform()}
                  className="w-10 h-10 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl flex items-center justify-center text-white hover:bg-slate-700 active:scale-95 transition-all backdrop-blur-md"
                  title="Reset View"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <div className="relative bg-[rgba(2,6,16,0.6)] rounded-[28px] border border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] overflow-hidden w-[1000px] h-[700px]">
              
              {/* Path Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
              </marker>
            </defs>
            <path className="fill-none stroke-red-500/15 stroke-[8px] blur-[4px]" d="M 125 105 H 875 M 875 125 V 320 M 875 320 H 510 M 510 320 V 520 M 510 520 H 225 M 225 520 V 630 M 225 630 H 145 M 145 630 V 250 M 145 250 H 225 M 225 250 V 140 M 225 140 H 125 V 105" />
            <path className="dashed-path" markerMid="url(#arrow)" d="M 125 105 H 875 M 875 125 V 320 M 875 320 H 510 M 510 320 V 520 M 510 520 H 225 M 225 520 V 630 M 225 630 H 145 M 145 630 V 250 M 145 250 H 225 M 225 250 V 140 M 225 140 H 125 V 105" />
          </svg>

          <div className="absolute z-20 text-[10px] font-bold tracking-[1.5px] text-slate-400/40 uppercase pointer-events-none select-none" style={{ top: '32%', left: '44%' }}>MAIN CORRIDOR</div>
          <div className="absolute z-20 text-[10px] font-bold tracking-[1.5px] text-slate-400/40 uppercase pointer-events-none select-none" style={{ top: '72%', left: '44%' }}>WAY TO EXIT</div>

          {/* Rooms Map */}
          {rooms.map(room => {
            const isSelected = selectedPOI?.id === room.id;
            const Icon = room.icon;
            return (
              <div 
                key={room.id}
                className={`room-html ${room.color} ${isSelected ? 'room-html-selected' : ''}`}
                style={{ left: `${room.left}%`, top: `${room.top}%`, width: `${room.width}%`, height: `${room.height}%` }}
                onClick={() => onSelectPOI({ id: room.id, name: room.id, floor: '3rd Floor', type: 'classroom', lat: 21.22, lng: 72.87 })}
              >
                <div className="relative w-full h-full p-3 sm:p-4 flex flex-col z-10 transition-transform">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`font-extrabold leading-none text-white tracking-tight drop-shadow-md ${room.tall ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl lg:text-3xl'}`}>
                      {room.id}
                    </span>
                    <Icon className={`text-white/85 shrink-0 drop-shadow-lg ${room.tall ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
                  </div>
                  <div className="mt-auto">
                      <div className="text-[9px] sm:text-[11px] lg:text-[12px] font-bold tracking-wide uppercase text-slate-200/90 drop-shadow-sm line-clamp-1">{room.label}</div>
                      {room.sublabel && <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-300/70 mt-1 font-medium tracking-wide line-clamp-1">{room.sublabel}</div>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Lifts */}
          <div className="absolute lift-station z-30" style={{ top: '34.5%', left: '70.2%', width: '5.5%', height: '12%' }}>
            <div className="text-center p-1">
              <Accessibility className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] mx-auto" />
              <span className="block text-[8px] sm:text-[10px] font-extrabold tracking-widest text-amber-200 mt-2 drop-shadow-md">LIFT</span>
            </div>
          </div>
          <div className="absolute lift-station z-30" style={{ top: '66.5%', left: '24.5%', width: '5.5%', height: '12%' }}>
            <div className="text-center p-1">
              <Accessibility className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] mx-auto" />
              <span className="block text-[8px] sm:text-[10px] font-extrabold tracking-widest text-amber-200 mt-2 drop-shadow-md">LIFT</span>
            </div>
          </div>

          {/* Central Staircase */}
          <div className="absolute stair-area z-20" style={{ top: '36.5%', left: '35.2%', width: '27.5%', height: '28%' }}>
            <div className="text-center relative z-10 p-2">
              <div className="animate-bounce">
                <ArrowUp className="w-10 h-10 sm:w-14 sm:h-14 text-slate-400 mx-auto mb-3 drop-shadow-lg" />
              </div>
              <div className="text-sm sm:text-base font-extrabold tracking-widest text-slate-200 drop-shadow-lg">STAIR CASE</div>
              <div className="text-[9px] sm:text-[11px] text-slate-400 font-bold tracking-wider mt-1.5">UP • DOWN</div>
            </div>
          </div>

          {/* Toilets */}
          <div className="absolute toilet-zone rounded-xl z-20" style={{ top: '50%', left: '84%', width: '14.8%', height: '9.5%' }}>
             <div className="text-center flex-1">
               <span className="block text-[8px] sm:text-[10px] font-bold tracking-[0.6px] text-red-200">LADIES</span>
             </div>
             <div className="w-px h-full bg-gradient-to-b from-transparent via-red-400/40 to-transparent"></div>
             <div className="text-center flex-1">
               <span className="block text-[8px] sm:text-[10px] font-bold tracking-[0.6px] text-red-200">GENTS</span>
             </div>
          </div>
          </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  </div>
</div>
  );
}

export function FourthFloorSVGMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  const floorPOIs = pois.filter(p => p.floor === "4th Floor");
  
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden font-sans">
      <style>{`
        .room-4 {
          cursor: pointer;
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.18s ease, filter 0.18s ease;
        }
        .room-4 rect {
          stroke: #000000;
          stroke-width: 2.5;
          transition: stroke-width 0.18s ease;
        }
        .room-4:hover {
          transform: scale(1.04);
          filter: drop-shadow(0 12px 18px rgba(0,0,0,0.18));
        }
        .room-4:hover rect {
          stroke-width: 3;
        }
        .selected-room-4 rect {
          stroke: #1d4ed8 !important;
          stroke-width: 4 !important;
          fill: #eff6ff !important;
        }
        .walk-path-4 {
          fill: none;
          stroke: #ffffff;
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 12 14;
          animation: dash4 2.2s linear infinite;
          opacity: 0.95;
          pointer-events: none;
        }
        @keyframes dash4 {
          to { stroke-dashoffset: -52; }
        }
        .door-4 {
          fill: #ffffff;
          stroke: #000000;
          stroke-width: 1.8;
          pointer-events: none;
        }
      `}</style>

      {/* Header Info */}
      <div className="flex-none p-4 sm:p-6 border-b border-slate-100 flex justify-between items-end">
        <div>
           <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 m-0">Floor 4</h1>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1">Project & Advanced Research</p>
        </div>
        <div className="hidden sm:flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#c8b6e6] border border-black/20"></span> Lab/Class</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#a8d0f0] border border-black/20"></span> Facility</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#f5b6cd] border border-black/20"></span> Office</div>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden w-full touch-none">
        <TransformWrapper
          initialScale={0.8}
          minScale={0.1}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
          panning={{ velocityDisabled: false }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Zoom Controls overlay */}
              <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
                <button 
                  onClick={() => zoomIn()}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  title="Zoom In"
                >
                  <Plus size={20} />
                </button>
                <button 
                  onClick={() => zoomOut()}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  title="Zoom Out"
                >
                  <Minus size={20} />
                </button>
                <button 
                  onClick={() => resetTransform()}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  title="Reset View"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <svg id="map" viewBox="0 0 1200 1000" className="w-[1200px] h-[1000px] bg-white">
                {/* LAYER 1: BLUE CORRIDOR */}
                <path d="M220 160 H1100 V300 H880 V730 H220 V160 Z M380 300 H780 V660 H380 V300 Z" 
                      fill="#1d4ed8" fillRule="evenodd"/>
                
                {/* LAYER 2: WHITE CENTER WITH STAIRS */}
                <rect x="390" y="310" width="380" height="340" fill="white" stroke="#1d4ed8" strokeWidth="3" rx="6"/>
                
                {/* Staircase Top */}
                <g>
                    <rect x="415" y="330" width="110" height="90" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="5"/>
                    <g fill="#9ca3af">
                        <rect x="420" y="335" width="100" height="8" rx="2"/>
                        <rect x="420" y="348" width="100" height="8" rx="2"/>
                        <rect x="420" y="361" width="100" height="8" rx="2"/>
                        <rect x="420" y="374" width="100" height="8" rx="2"/>
                        <rect x="420" y="387" width="100" height="8" rx="2"/>
                        <rect x="420" y="400" width="100" height="8" rx="2"/>
                    </g>
                    <text x="470" y="435" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4b5563">STAIRS</text>
                </g>
                
                {/* Staircase Bottom */}
                <g>
                    <rect x="635" y="540" width="110" height="90" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" rx="5"/>
                    <g fill="#9ca3af">
                        <rect x="640" y="545" width="100" height="8" rx="2"/>
                        <rect x="640" y="558" width="100" height="8" rx="2"/>
                        <rect x="640" y="571" width="100" height="8" rx="2"/>
                        <rect x="640" y="584" width="100" height="8" rx="2"/>
                        <rect x="640" y="597" width="100" height="8" rx="2"/>
                        <rect x="640" y="610" width="100" height="8" rx="2"/>
                    </g>
                    <text x="690" y="645" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4b5563">STAIRS</text>
                </g>

                {/* LAYER 3: ROOMS */}
                {/* Left Column */}
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '403')!)} className={clsx("room-4", selectedPOI?.id === '403' && "selected-room-4")}>
                    <rect x="20" y="20" width="180" height="180" fill="#c8b6e6" rx="4"/>
                    <text x="110" y="110" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill="#000">403</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '402')!)} className={clsx("room-4", selectedPOI?.id === '402' && "selected-room-4")}>
                    <rect x="20" y="210" width="180" height="240" fill="#c8b6e6" rx="4"/>
                    <text x="110" y="330" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill="#000">402</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '401')!)} className={clsx("room-4", selectedPOI?.id === '401' && "selected-room-4")}>
                    <rect x="20" y="460" width="180" height="300" fill="#c8b6e6" rx="4"/>
                    <g transform="rotate(-15 110 610)">
                        <text x="110" y="580" textAnchor="middle" fontSize="30" fontWeight="800" fill="#000">401</text>
                        <text x="110" y="616" textAnchor="middle" fontSize="15" fontWeight="700" fill="#000">IT-IOT / AI &</text>
                        <text x="110" y="638" textAnchor="middle" fontSize="15" fontWeight="700" fill="#000">Data Science Lab</text>
                    </g>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '418')!)} className={clsx("room-4", selectedPOI?.id === '418' && "selected-room-4")}>
                    <rect x="20" y="770" width="120" height="130" fill="#c8b6e6" rx="4"/>
                    <text x="80" y="835" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">418</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '417')!)} className={clsx("room-4", selectedPOI?.id === '417' && "selected-room-4")}>
                    <rect x="20" y="910" width="180" height="80" fill="#c8b6e6" rx="4"/>
                    <text x="110" y="950" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">417</text>
                </g>

                {/* Top Row */}
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '405')!)} className={clsx("room-4", selectedPOI?.id === '405' && "selected-room-4")}>
                    <rect x="340" y="20" width="130" height="110" fill="#a8d0f0" rx="4"/>
                    <text x="405" y="75" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">405</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '404')!)} className={clsx("room-4", selectedPOI?.id === '404' && "selected-room-4")}>
                    <rect x="340" y="145" width="110" height="85" fill="#f5b6cd" rx="4"/>
                    <text x="395" y="171" textAnchor="middle" fontSize="26" fontWeight="800" fill="#000">404</text>
                    <text x="395" y="197" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#000">H.O.D Office</text>
                    <text x="395" y="214" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#000">E.C.</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === 'lift4L')!)} className={clsx("room-4", selectedPOI?.id === 'lift4L' && "selected-room-4")}>
                    <rect x="250" y="145" width="75" height="85" fill="#6b7280" rx="4"/>
                    <text x="287.5" y="187.5" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill="white">LIFT</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '406')!)} className={clsx("room-4", selectedPOI?.id === '406' && "selected-room-4")}>
                    <rect x="490" y="20" width="140" height="210" fill="#a8d0f0" rx="4"/>
                    <text x="560" y="125" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">406</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '407')!)} className={clsx("room-4", selectedPOI?.id === '407' && "selected-room-4")}>
                    <rect x="650" y="20" width="110" height="110" fill="#a8d0f0" rx="4"/>
                    <text x="705" y="75" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">407</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '408')!)} className={clsx("room-4", selectedPOI?.id === '408' && "selected-room-4")}>
                    <rect x="650" y="145" width="90" height="85" fill="#a8d0f0" rx="4"/>
                    <text x="695" y="187.5" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill="#000">408</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === 'lift4R')!)} className={clsx("room-4", selectedPOI?.id === 'lift4R' && "selected-room-4")}>
                    <rect x="755" y="145" width="75" height="85" fill="#6b7280" rx="4"/>
                    <text x="792.5" y="187.5" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="800" fill="white">LIFT</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '409')!)} className={clsx("room-4", selectedPOI?.id === '409' && "selected-room-4")}>
                    <rect x="850" y="20" width="210" height="210" fill="#c8b6e6" rx="4"/>
                    <text x="955" y="125" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill="#000">409</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === 'toilet4')!)} className={clsx("room-4", selectedPOI?.id === 'toilet4' && "selected-room-4")}>
                    <rect x="1080" y="20" width="80" height="210" fill="#a8d0f0" rx="4"/>
                    <g transform="rotate(-90 1120 125)">
                        <text x="1120" y="130" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="800" fill="#000">TOILET</text>
                    </g>
                </g>

                {/* Right Column */}
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '410')!)} className={clsx("room-4", selectedPOI?.id === '410' && "selected-room-4")}>
                    <rect x="850" y="320" width="210" height="410" fill="#a8d0f0" rx="4"/>
                    <text x="955" y="525" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill="#000">410</text>
                </g>

                {/* Bottom Row */}
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '416')!)} className={clsx("room-4", selectedPOI?.id === '416' && "selected-room-4")}>
                    <rect x="340" y="770" width="110" height="85" fill="#f5b6cd" rx="4"/>
                    <text x="395" y="812.5" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill="#000">416</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '415')!)} className={clsx("room-4", selectedPOI?.id === '415' && "selected-room-4")}>
                    <rect x="340" y="870" width="110" height="120" fill="#a8d0f0" rx="4"/>
                    <text x="395" y="930" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="800" fill="#000">415</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '414')!)} className={clsx("room-4", selectedPOI?.id === '414' && "selected-room-4")}>
                    <rect x="480" y="900" width="100" height="90" fill="#a8d0f0" rx="4"/>
                    <text x="530" y="945" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill="#000">414</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '413')!)} className={clsx("room-4", selectedPOI?.id === '413' && "selected-room-4")}>
                    <rect x="610" y="930" width="100" height="60" fill="#a8d0f0" rx="4"/>
                    <text x="660" y="960" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="800" fill="#000">413</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '412')!)} className={clsx("room-4", selectedPOI?.id === '412' && "selected-room-4")}>
                    <rect x="740" y="770" width="110" height="120" fill="#a8d0f0" rx="4"/>
                    <text x="795" y="830" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill="#000">412</text>
                </g>
                
                <g onClick={() => onSelectPOI(floorPOIs.find(p => p.id === '411')!)} className={clsx("room-4", selectedPOI?.id === '411' && "selected-room-4")}>
                    <rect x="850" y="770" width="230" height="220" fill="#c8b6e6" rx="4"/>
                    <text x="965" y="880" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="800" fill="#000">411</text>
                </g>

                {/* LAYER 4: WALKING PATH */}
                <path className="walk-path-4" d="M300 230 H990 V265 H830 V695 H300 V230"/>
                
                {/* Direction Arrows */}
                <g fill="white" opacity="0.98">
                    <polygon points="650,218 674,230 650,242"/>
                    <polygon points="818,470 830,494 842,470"/>
                    <polygon points="570,683 546,695 570,707"/>
                    <polygon points="288,470 300,446 312,470"/>
                </g>
                
                {/* Corridor Labels */}
                <text x="550" y="260" textAnchor="middle" fontSize="21" fontWeight="800" fill="white" letterSpacing="0.5">Inner Loop Corridor</text>
                <text x="550" y="660" textAnchor="middle" fontSize="21" fontWeight="800" fill="white" letterSpacing="0.5">Inner Loop Corridor</text>

                {/* LAYER 5: DOORS */}
                <rect className="door-4" x="188" y="100" width="12" height="28" rx="2"/>
                <rect className="door-4" x="188" y="316" width="12" height="28" rx="2"/>
                <rect className="door-4" x="188" y="596" width="12" height="28" rx="2"/>
                <rect className="door-4" x="66" y="770" width="28" height="12" rx="2"/>
                <rect className="door-4" x="96" y="910" width="28" height="12" rx="2"/>
                <rect className="door-4" x="391" y="118" width="28" height="12" rx="2"/>
                <rect className="door-4" x="381" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="273" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="546" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="691" y="118" width="28" height="12" rx="2"/>
                <rect className="door-4" x="681" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="778" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="941" y="218" width="28" height="12" rx="2"/>
                <rect className="door-4" x="1080" y="111" width="12" height="28" rx="2"/>
                <rect className="door-4" x="850" y="511" width="12" height="28" rx="2"/>
                <rect className="door-4" x="381" y="770" width="28" height="12" rx="2"/>
                <rect className="door-4" x="381" y="870" width="28" height="12" rx="2"/>
                <rect className="door-4" x="516" y="900" width="28" height="12" rx="2"/>
                <rect className="door-4" x="646" y="930" width="28" height="12" rx="2"/>
                <rect className="door-4" x="781" y="770" width="28" height="12" rx="2"/>
                <rect className="door-4" x="850" y="866" width="12" height="28" rx="2"/>
            </svg>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  </div>
</div>
  );
}


