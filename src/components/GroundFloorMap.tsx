import React from 'react';
import { POI, pois } from '../data';
import clsx from 'clsx';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function GroundFloorMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  return (
    <div className="ground-floor-map-wrapper w-full h-full bg-[#f0f4f8]">
      <style>{`
        .ground-floor-map-wrapper {
            --admin-pink: #ff66cc;
            --academic-blue: #a3c2f2;
            --lab-purple: #dcbcf0;
            --corridor-bg: #0d47a1;
            --corridor-glow: rgba(55, 139, 242, 0.8);
            --border-dark: #000000;
            --bg-color: #ffffff;
        }

        .ground-floor-map-wrapper .dashboard {
            width: 100%;
            height: 100%;
            background: var(--bg-color);
            padding: 40px;
            display: flex;
            flex-direction: column;
        }

        .ground-floor-map-wrapper .header-title {
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            font-weight: 500;
            color: #111;
            text-align: center;
            margin-bottom: 30px;
            letter-spacing: 0.5px;
        }

        .ground-floor-map-wrapper .content-wrapper {
            display: flex;
            flex-direction: row;
            gap: 40px;
            align-items: flex-start;
            flex: 1;
            min-height: 0;
        }

        /* --- MAP CONTAINER --- */
        .ground-floor-map-wrapper .map-container {
            flex: 1;
            position: relative;
            width: 100%;
            height: 100%;
        }

        .ground-floor-map-wrapper svg {
            width: 100%;
            height: auto;
            display: block;
        }

        /* SVG Element Styling */
        .ground-floor-map-wrapper .room-pink { fill: var(--admin-pink); stroke: var(--border-dark); stroke-width: 2.5; cursor: pointer; transition: opacity 0.2s; }
        .ground-floor-map-wrapper .room-blue { fill: var(--academic-blue); stroke: var(--border-dark); stroke-width: 2.5; cursor: pointer; transition: opacity 0.2s; }
        .ground-floor-map-wrapper .room-purple { fill: var(--lab-purple); stroke: var(--border-dark); stroke-width: 2.5; cursor: pointer; transition: opacity 0.2s; }
        .ground-floor-map-wrapper .room-white { fill: #ffffff; stroke: var(--border-dark); stroke-width: 2.5; }
        .ground-floor-map-wrapper .room-toilet { fill: #1e3a8a; stroke: var(--border-dark); stroke-width: 2.5; }
        
        .ground-floor-map-wrapper .room-pink:hover, 
        .ground-floor-map-wrapper .room-blue:hover, 
        .ground-floor-map-wrapper .room-purple:hover { opacity: 0.8; }

        .ground-floor-map-wrapper .selected-room {
            stroke: #2563eb !important;
            stroke-width: 5 !important;
            filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.5));
        }

        .ground-floor-map-wrapper .corridor { 
            fill: var(--corridor-bg); 
            stroke: #4fa0ff; 
            stroke-width: 2; 
            filter: drop-shadow(0 0 12px var(--corridor-glow)); 
        }

        /* HTML Overlay Styling inside SVG */
        .ground-floor-map-wrapper .f-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 100%;
            height: 100%;
            padding: 4px;
            color: #000;
            pointer-events: none;
        }

        .ground-floor-map-wrapper .r-num { 
            font-size: clamp(0.9rem, 1.3vw, 1.1rem); 
            font-weight: 600;
            margin-bottom: 2px; 
            line-height: 1.1;
        }
        
        .ground-floor-map-wrapper .r-name { 
            font-size: clamp(0.7rem, 1vw, 0.9rem); 
            line-height: 1.2; 
            font-weight: 400; 
        }

        .ground-floor-map-wrapper .lift-icon {
            display: inline-block;
            width: 12px; height: 12px;
            background: #fff;
            border: 1px solid #000;
            position: relative;
        }
        .ground-floor-map-wrapper .lift-icon::after {
            content: ''; position: absolute; top: 1px; bottom: 1px; left: 5px; width: 1px; background: #000;
        }

        /* --- LEGEND PANEL --- */
        .ground-floor-map-wrapper .legend-panel {
            width: 200px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 40px;
            padding-top: 20px;
        }

        .ground-floor-map-wrapper .legend-section h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 15px;
            color: #111;
        }

        .ground-floor-map-wrapper .lift-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 0.95rem;
            font-weight: 500;
        }
        .ground-floor-map-wrapper .lift-item { display: flex; align-items: center; gap: 10px; }

        .ground-floor-map-wrapper .node-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 0.9rem;
        }
        .ground-floor-map-wrapper .node-item { display: flex; align-items: center; gap: 10px; }
        .ground-floor-map-wrapper .n-box { width: 18px; height: 18px; border: 1px solid #000; }

        /* Compass & Scale */
        .ground-floor-map-wrapper .compass-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: auto;
            align-self: flex-end;
        }
        .ground-floor-map-wrapper .compass {
            width: 40px; height: 40px;
            border: 2px solid #000;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            position: relative;
            margin-bottom: 20px;
        }
        .ground-floor-map-wrapper .compass::before {
            content: '▲'; position: absolute; top: -14px; font-size: 1rem;
        }

        .ground-floor-map-wrapper .scale-bar-wrapper {
            width: 100%;
            margin-top: 10px;
        }
        .ground-floor-map-wrapper .scale-graphic {
            height: 6px;
            background: linear-gradient(to right, #000 50%, #fff 50%);
            border: 1px solid #000;
            margin-bottom: 4px;
        }
        .ground-floor-map-wrapper .scale-nums {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            font-weight: 600;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .ground-floor-map-wrapper .dashboard {
                padding: 10px;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .ground-floor-map-wrapper .content-wrapper {
                flex-direction: column;
                gap: 15px;
                flex: 1;
                min-height: 0;
            }
            .ground-floor-map-wrapper .map-container {
                flex: 1.5; /* Give more space to the map */
                min-height: 350px;
                height: auto;
            }
            .ground-floor-map-wrapper .legend-panel {
                width: 100%;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 15px;
                padding: 10px;
                background: #f8fafc;
                border-radius: 12px;
                justify-content: space-around;
                flex: 0 0 auto;
            }
            .ground-floor-map-wrapper .legend-section {
                flex: 1;
                min-width: 120px;
                margin-bottom: 5px;
            }
            .ground-floor-map-wrapper .legend-section h3 {
                font-size: 0.9rem;
                margin-bottom: 8px;
            }
            .ground-floor-map-wrapper .compass-container {
                display: none; /* Hide compass on small mobile to save space */
            }
            .ground-floor-map-wrapper .header-title {
                font-size: 1.2rem;
                margin-bottom: 10px;
            }
            .ground-floor-map-wrapper .f-text {
                padding: 2px;
            }
            .ground-floor-map-wrapper .r-num { font-size: 0.7rem; }
            .ground-floor-map-wrapper .r-name { font-size: 0.5rem; }
        }

    `}</style>

    <div className="dashboard">
        <h1 className="header-title">Floor 0: Administration & Heavy Engineering</h1>
        
        <div className="content-wrapper">
            <div className="map-container overflow-hidden rounded-xl border border-slate-200">
              <TransformWrapper
                initialScale={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.35 : 0.8}
                minScale={0.2}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2">
                      <button onClick={() => zoomIn()} className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all font-bold">+</button>
                      <button onClick={() => zoomOut()} className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all font-bold">-</button>
                      <button onClick={() => resetTransform()} className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">↺</button>
                    </div>
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                      <div style={{ width: '1000px', height: '1000px', background: '#fff' }}>
                        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
                            
                            {/* Left Wing Administrative Suite */}
                            <rect x="120" y="120" width="70" height="80" className={clsx("room-pink", selectedPOI?.id === 'admin-003' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-003') || { id: 'admin-003', name: 'Pantry', floor: 'Ground', type: 'facility' } as POI)} />
                            <rect x="120" y="200" width="70" height="80" className={clsx("room-pink", selectedPOI?.id === 'admin-002' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-002') || { id: 'admin-002', name: 'Principal Office', floor: 'Ground', type: 'office' } as POI)} />
                            <rect x="120" y="280" width="70" height="80" className={clsx("room-pink", selectedPOI?.id === 'admin-001' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-001') || { id: 'admin-001', name: 'Trust Office', floor: 'Ground', type: 'office' } as POI)} />
                            
                            {/* Top Wing Row */}
                            <rect x="190" y="120" width="80" height="160" className={clsx("room-blue", selectedPOI?.id === 'admin-004' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-004') || { id: 'admin-004', name: 'Conference Room', floor: 'Ground', type: 'facility' } as POI)} />
                            <rect x="270" y="120" width="180" height="160" className={clsx("room-pink", selectedPOI?.id === 'admin-005' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-005') || { id: 'admin-005', name: 'Administration Office', floor: 'Ground', type: 'office' } as POI)} />
                            <rect x="450" y="120" width="100" height="160" className="room-white" />
                            <rect x="550" y="120" width="160" height="160" className={clsx("room-purple", selectedPOI?.id === 'admin-006' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-006') || { id: 'admin-006', name: 'EEE, M/C & Project Lab', floor: 'Ground', type: 'lab' } as POI)} />
                            <rect x="710" y="120" width="110" height="160" className={clsx("room-purple", selectedPOI?.id === 'admin-007' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-007') || { id: 'admin-007', name: 'EME Lab', floor: 'Ground', type: 'lab' } as POI)} />
                            <rect x="820" y="120" width="70" height="160" className="room-toilet" />

                            {/* Eastern Wing (Workshop) */}
                            <rect x="710" y="360" width="180" height="520" className={clsx("room-purple", selectedPOI?.id === 'admin-008' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-008') || { id: 'admin-008', name: 'Workshop', floor: 'Ground', type: 'lab' } as POI)} />

                            {/* Southern Wing Labs */}
                            <rect x="80" y="550" width="110" height="330" className={clsx("room-purple", selectedPOI?.id === 'admin-010' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-010') || { id: 'admin-010', name: 'Transportation & CT Lab', floor: 'Ground', type: 'lab' } as POI)} />
                            
                            {/* Circulation Core (Stairs & Lifts) */}
                            <rect x="190" y="720" width="60" height="160" className="room-white" />
                            <g stroke="#000" strokeWidth="1.5">
                                <line x1="190" y1="740" x2="250" y2="740"/> <line x1="190" y1="760" x2="250" y2="760"/>
                                <line x1="190" y1="780" x2="250" y2="780"/> <line x1="190" y1="800" x2="250" y2="800"/>
                                <line x1="190" y1="820" x2="250" y2="820"/> <line x1="190" y1="840" x2="250" y2="840"/>
                                <line x1="190" y1="860" x2="250" y2="860"/>
                            </g>
                            
                            <rect x="250" y="720" width="390" height="160" className={clsx("room-purple", selectedPOI?.id === 'admin-009' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-009') || { id: 'admin-009', name: 'Fluid Mechanics & Fluid Power Lab', floor: 'Ground', type: 'lab' } as POI)} />

                            <rect x="190" y="880" width="60" height="50" className="room-white" />

                            <polygon points="250,360 640,360 640,640 250,640" fill="#ffffff" stroke="#000" strokeWidth="2" />

                            <path className="corridor" fillRule="evenodd" d="
                                M 190 280 
                                L 890 280 
                                L 890 360 
                                L 710 360 
                                L 710 720 
                                L 190 720 
                                L 190 550 
                                L 100 550 
                                L 100 450 
                                L 190 450 
                                Z 
                                M 250 360 
                                L 250 640 
                                L 640 640 
                                L 640 360 
                                Z" 
                            />

                            <g stroke="#000" strokeWidth="1.5" fill="none">
                                <rect x="520" y="360" width="80" height="40" fill="#f8fafc" strokeWidth="2" />
                                <line x1="530" y1="360" x2="530" y2="400"/>
                                <line x1="540" y1="360" x2="540" y2="400"/>
                                <line x1="550" y1="360" x2="550" y2="400"/>
                                <line x1="560" y1="360" x2="560" y2="400"/>
                                <line x1="570" y1="360" x2="570" y2="400"/>
                                <line x1="580" y1="360" x2="580" y2="400"/>
                                <line x1="590" y1="360" x2="590" y2="400"/>
                                <rect x="600" y="400" width="40" height="80" fill="#f8fafc" strokeWidth="2" />
                                <line x1="600" y1="410" x2="640" y2="410"/>
                                <line x1="600" y1="420" x2="640" y2="420"/>
                                <line x1="600" y1="430" x2="640" y2="430"/>
                                <line x1="600" y1="440" x2="640" y2="440"/>
                                <line x1="600" y1="450" x2="640" y2="450"/>
                                <line x1="600" y1="460" x2="640" y2="460"/>
                                <line x1="600" y1="470" x2="640" y2="470"/>
                                <rect x="600" y="360" width="40" height="40" fill="#e2e8f0" strokeWidth="2" />
                            </g>
                            
                            <g stroke="#000" strokeWidth="1.5" fill="none">
                                <rect x="290" y="600" width="80" height="40" fill="#f8fafc" strokeWidth="2" />
                                <line x1="300" y1="600" x2="300" y2="640"/>
                                <line x1="310" y1="600" x2="310" y2="640"/>
                                <line x1="320" y1="600" x2="320" y2="640"/>
                                <line x1="330" y1="600" x2="330" y2="640"/>
                                <line x1="340" y1="600" x2="340" y2="640"/>
                                <line x1="350" y1="600" x2="350" y2="640"/>
                                <line x1="360" y1="600" x2="360" y2="640"/>
                                <rect x="250" y="520" width="40" height="80" fill="#f8fafc" strokeWidth="2" />
                                <line x1="250" y1="530" x2="290" y2="530"/>
                                <line x1="250" y1="540" x2="290" y2="540"/>
                                <line x1="250" y1="550" x2="290" y2="550"/>
                                <line x1="250" y1="540" x2="290" y2="540" stroke="#000" />
                                <line x1="250" y1="550" x2="290" y2="550" stroke="#000" />
                                <line x1="250" y1="560" x2="290" y2="560"/>
                                <line x1="250" y1="570" x2="290" y2="570"/>
                                <line x1="250" y1="580" x2="290" y2="580"/>
                                <line x1="250" y1="590" x2="290" y2="590"/>
                                <rect x="250" y="600" width="40" height="40" fill="#e2e8f0" strokeWidth="2" />
                            </g>

                            <rect x="460" y="360" width="60" height="40" className={clsx("room-pink", selectedPOI?.id === 'admin-012' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-012') || { id: 'admin-012', name: 'Stationery', floor: 'Ground', type: 'facility' } as POI)} />
                            <rect x="370" y="600" width="60" height="40" className={clsx("room-pink", selectedPOI?.id === 'admin-011' && "selected-room")} onClick={() => onSelectPOI(pois.find(p => p.id === 'admin-011') || { id: 'admin-011', name: 'Security', floor: 'Ground', type: 'facility' } as POI)} />

                            <g fill="#ffffff" stroke="#000" strokeWidth="1.5">
                                <rect x="187" y="150" width="6" height="20" /> {/* 003 */}
                                <rect x="187" y="230" width="6" height="20" /> {/* 002 */}
                                <rect x="187" y="310" width="6" height="20" /> {/* 001 */}
                                <rect x="187" y="600" width="6" height="20" /> {/* 010 */}
                                
                                <rect x="230" y="277" width="20" height="6" /> {/* 004 */}
                                <rect x="350" y="277" width="20" height="6" /> {/* 005 */}
                                <rect x="610" y="277" width="20" height="6" /> {/* 006 */}
                                <rect x="750" y="277" width="20" height="6" /> {/* 007 */}
                                <rect x="850" y="277" width="20" height="6" />
                                
                                <rect x="707" y="520" width="6" height="20" />
                                <rect x="440" y="717" width="20" height="6" />

                                <rect x="480" y="357" width="20" height="6" />
                                <rect x="390" y="637" width="20" height="6" />
                            </g>

                            <foreignObject x="0" y="450" width="100" height="100">
                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', height:'100%', paddingRight:'10px', fontSize:'1.3rem', fontWeight:'600', color:'#000'}}>
                                    Entry &#9654;
                                </div>
                            </foreignObject>

                            <foreignObject x="120" y="120" width="70" height="80">
                                <div className="f-text">
                                    <span className="r-num">003</span><span className="r-name">Pantry</span>
                                </div>
                            </foreignObject>
                            <foreignObject x="120" y="200" width="70" height="80">
                                <div className="f-text">
                                    <span className="r-num">002</span><span className="r-name">Principal<br/>Office</span>
                                </div>
                            </foreignObject>
                            <foreignObject x="120" y="280" width="70" height="80">
                                <div className="f-text">
                                    <span className="r-num">001</span><span className="r-name">Trust<br/>Office</span>
                                </div>
                            </foreignObject>

                            <foreignObject x="190" y="120" width="80" height="160">
                                <div className="f-text">
                                    <span className="r-num">004</span><span className="r-name">Conference<br/>Room</span>
                                </div>
                            </foreignObject>
                            <foreignObject x="270" y="120" width="180" height="160">
                                <div className="f-text">
                                    <span className="r-num">005</span><span className="r-name">Administration<br/>Office</span>
                                </div>
                            </foreignObject>
                            
                            <foreignObject x="450" y="120" width="100" height="160">
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100%', padding:'10px'}}>
                                    <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap:'5px', fontSize:'0.6rem', fontWeight:'700', width:'100%', textAlign:'center'}}>
                                        <span>L6</span><span>L5</span><span>L3</span>
                                        <span><span className="lift-icon"></span></span><span><span className="lift-icon"></span></span><span><span className="lift-icon"></span></span>
                                        <span style={{marginTop:'5px'}}>L4</span><span style={{marginTop:'5px'}}>L3</span><span style={{marginTop:'5px'}}>L1</span>
                                        <span><span className="lift-icon"></span></span><span><span className="lift-icon"></span></span><span><span className="lift-icon"></span></span>
                                    </div>
                                    <div style={{fontSize:'0.6rem', marginTop:'8px', fontWeight:'600'}}>Main Lift Battery</div>
                                </div>
                            </foreignObject>

                            <foreignObject x="550" y="120" width="160" height="160">
                                <div className="f-text">
                                    <span className="r-num">006</span><span className="r-name">EEE, M/C &amp;<br/>Project Lab</span>
                                </div>
                            </foreignObject>
                            <foreignObject x="710" y="120" width="110" height="160">
                                <div className="f-text">
                                    <span className="r-num">007</span><span className="r-name">EME Lab</span>
                                </div>
                            </foreignObject>
                            
                            <foreignObject x="820" y="120" width="70" height="160">
                                <div style={{display:'flex', justifyContent:'space-evenly', alignItems:'center', height:'100%', color:'#fff', fontSize:'1.6rem'}}>
                                    <span>&#128697;</span><span>&#128698;</span>
                                </div>
                            </foreignObject>

                            <foreignObject x="710" y="360" width="180" height="520">
                                <div className="f-text">
                                    <span className="r-num">008</span><span className="r-name">Workshop</span>
                                </div>
                            </foreignObject>

                            <foreignObject x="80" y="550" width="110" height="330">
                                <div className="f-text">
                                    <span className="r-num">010</span><span className="r-name">Transportation<br/>&amp; CT Lab</span>
                                </div>
                            </foreignObject>

                            <foreignObject x="250" y="720" width="390" height="160">
                                <div className="f-text">
                                    <span className="r-num">009</span><span className="r-name">Fluid Mechanics &amp; Fluid Power Lab</span>
                                </div>
                            </foreignObject>

                            <foreignObject x="190" y="880" width="60" height="50">
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100%'}}>
                                    <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:'2px', fontSize:'0.55rem', fontWeight:'700', textAlign:'center'}}>
                                        <span>L6 <span className="lift-icon" style={{width:'8px', height:'8px'}}></span></span><span>L5 <span className="lift-icon" style={{width:'8px', height:'8px'}}></span></span>
                                        <span>L4 <span className="lift-icon" style={{width:'8px', height:'8px'}}></span></span><span>L1 <span className="lift-icon" style={{width:'8px', height:'8px'}}></span></span>
                                    </div>
                                    <div style={{fontSize:'0.45rem', marginTop:'4px'}}>Main Lift Battery</div>
                                </div>
                            </foreignObject>

                            <foreignObject x="370" y="600" width="60" height="40">
                                <div className="f-text" style={{padding:'2px'}}>
                                    <span className="r-num" style={{fontSize:'0.6rem', marginBottom:'0'}}>011</span>
                                    <span className="r-name" style={{fontSize:'0.45rem', lineHeight:'1'}}>Security</span>
                                </div>
                            </foreignObject>
                            
                            <foreignObject x="460" y="360" width="60" height="40">
                                <div className="f-text" style={{padding:'2px'}}>
                                    <span className="r-num" style={{fontSize:'0.6rem', marginBottom:'0'}}>012</span>
                                    <span className="r-name" style={{fontSize:'0.45rem', lineHeight:'1'}}>Stationery</span>
                                </div>
                            </foreignObject>

                        </svg>
                      </div>
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            </div>

            <div className="legend-panel">
                
                <div className="legend-section">
                    <h3>Lifts</h3>
                    <div className="lift-list">
                        <div className="lift-item">L1 <span className="lift-icon"></span> 1</div>
                        <div className="lift-item">L2 <span className="lift-icon"></span> 1</div>
                        <div className="lift-item">L3 <span className="lift-icon"></span> 1</div>
                        <div className="lift-item">L4 <span className="lift-icon"></span> 1</div>
                        <div className="lift-item">L5 <span className="lift-icon"></span> 1</div>
                        <div className="lift-item">L6 <span className="lift-icon"></span> 1</div>
                    </div>
                </div>

                <div className="legend-section">
                    <h3>Nodes</h3>
                    <div className="node-list">
                        <div className="node-item"><div className="n-box" style={{background: 'var(--academic-blue)'}}></div> Academic = 1</div>
                        <div className="node-item"><div className="n-box" style={{background: 'var(--lab-purple)'}}></div> Labs = 1</div>
                        <div className="node-item"><div className="n-box" style={{background: 'var(--admin-pink)'}}></div> Admin/Office = 1</div>
                    </div>
                </div>

                <div className="compass-container">
                    <div className="compass">N</div>
                    <div className="scale-bar-wrapper">
                        <div className="scale-graphic"></div>
                        <div className="scale-nums">
                            <span>0</span>
                            <span>2.5</span>
                            <span>50</span>
                            <span>10m</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
    </div>
  );
}
