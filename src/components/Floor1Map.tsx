import React from 'react';
import { POI, pois } from '../data';
import clsx from 'clsx';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function FirstFloorHTMLMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  return (
    <div className="floor-1-map-wrapper w-full h-full bg-[#f8fafc]">
      <style>{`
        .floor-1-map-wrapper {
            --purple-bg: #e2c1f0;
            --blue-bg: #b8d9f1;
            --pink-bg: #ff99d1;
            --gray-bg: #e0e0e0;
            --corridor-bg: #2a52be;
            --corridor-glow: #4a86e8;
            --border-color: #1a1a1a;
            --door-color: #ffffff;
        }

        .floor-1-map-wrapper .map-wrapper {
            width: 100%;
            height: 100%;
            background: #ffffff;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        .floor-1-map-wrapper .map-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
        }
        
        .floor-1-map-wrapper .floor-title { 
            font-size: clamp(1.5rem, 3vw, 2.2rem); 
            font-weight: 900; 
            color: #0f172a;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }

        .floor-1-map-wrapper .map-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1.3 / 1;
            background: #ffffff;
            border: 2px solid #e2e8f0;
            overflow: hidden;
            border-radius: 8px;
        }

        .floor-1-map-wrapper .corridor-tile {
            position: absolute;
            background: linear-gradient(135deg, var(--corridor-bg) 0%, var(--corridor-glow) 100%);
            z-index: 1;
            box-shadow: inset 0 0 15px rgba(255,255,255,0.2);
        }
        
        .floor-1-map-wrapper .c-main-loop {
            top: 22%; left: 21%; width: 58%; height: 48%;
            border-radius: 4px;
        }
        
        .floor-1-map-wrapper .c-branch-left { top: 66%; left: 15%; width: 6%; height: 7%; }
        .floor-1-map-wrapper .c-branch-right { top: 14%; left: 74%; width: 5%; height: 8%; }

        .floor-1-map-wrapper .corridor-label {
            position: absolute;
            color: #ffffff;
            font-weight: 800;
            font-size: clamp(0.6rem, 1.2vw, 0.9rem);
            z-index: 10;
            text-transform: uppercase;
            letter-spacing: 1px;
            pointer-events: none;
        }
        .floor-1-map-wrapper .label-t { top: 24%; left: 50%; transform: translateX(-50%); }
        .floor-1-map-wrapper .label-b { bottom: 31%; left: 50%; transform: translateX(-50%); }

        .floor-1-map-wrapper .door {
            position: absolute;
            background: var(--door-color);
            z-index: 11;
        }
        .floor-1-map-wrapper .door-v { width: 2px; height: 12px; }
        .floor-1-map-wrapper .door-h { height: 2px; width: 12px; }

        .floor-1-map-wrapper .atrium {
            position: absolute;
            top: 29%; left: 28%; width: 44%; height: 34%;
            background-color: #ffffff;
            border: 2px solid var(--border-color);
            z-index: 5;
            box-shadow: 0 0 30px rgba(74, 134, 232, 0.3);
        }

        .floor-1-map-wrapper .atrium-stairs {
            position: absolute;
            width: 25%; height: 35%;
            background: repeating-linear-gradient(135deg, #e2e8f0, #e2e8f0 4px, #ffffff 4px, #ffffff 8px);
            border: 1.5px solid var(--border-color);
        }
        .floor-1-map-wrapper .stair-tl { top: 0; left: 0; clip-path: polygon(0 0, 100% 0, 0 100%); }
        .floor-1-map-wrapper .stair-br { bottom: 0; right: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%); }

        .floor-1-map-wrapper .utility {
            position: absolute;
            background: var(--gray-bg);
            border: 2px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: 800;
            z-index: 6;
        }
        .floor-1-map-wrapper .lift { width: 5.5%; height: 8%; top: 14%; font-size: 0.7rem; }
        .floor-1-map-wrapper .lift-l { left: 21%; border-bottom: none; }
        .floor-1-map-wrapper .lift-r { left: 73.5%; border-bottom: none; }
        
        .floor-1-map-wrapper .restroom { 
            top: 3%; left: 64%; width: 9%; height: 11%; 
            background: var(--blue-bg);
            font-size: 1.4rem;
        }

        .floor-1-map-wrapper .room {
            position: absolute;
            border: 2px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 6px;
            box-sizing: border-box;
            z-index: 5;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .floor-1-map-wrapper .room:hover {
            transform: scale(1.02);
            z-index: 20;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .floor-1-map-wrapper .room.selected {
            border-color: #2a52be;
            border-width: 3px;
            box-shadow: 0 0 0 4px rgba(42,82,190,0.3);
            z-index: 21;
        }

        .floor-1-map-wrapper .purple { background-color: var(--purple-bg); }
        .floor-1-map-wrapper .blue { background-color: var(--blue-bg); }
        .floor-1-map-wrapper .pink { background-color: var(--pink-bg); }
        .floor-1-map-wrapper .gray { background-color: var(--gray-bg); }

        .floor-1-map-wrapper .r-num { 
            font-size: clamp(0.9rem, 1.3vw, 1.3rem); 
            font-weight: 900;
            line-height: 1;
            margin-bottom: 4px;
        }
        .floor-1-map-wrapper .r-desc { 
            font-size: clamp(0.6rem, 0.75vw, 0.9rem); 
            font-weight: 600;
            line-height: 1.2;
        }

        .floor-1-map-wrapper .r102 { top: 3%; left: 1%; width: 20%; height: 19%; }
        .floor-1-map-wrapper .r101 { top: 22%; left: 1%; width: 20%; height: 44%; }
        .floor-1-map-wrapper .r117 { top: 66%; left: 1%; width: 14%; height: 11%; }
        .floor-1-map-wrapper .r116 { top: 77%; left: 1%; width: 20%; height: 20%; }

        .floor-1-map-wrapper .r104 { top: 3%; left: 28%; width: 11%; height: 11%; }
        .floor-1-map-wrapper .r103 { top: 14%; left: 28%; width: 11%; height: 8%; }
        .floor-1-map-wrapper .r105 { top: 3%; left: 40%; width: 11%; height: 19%; }
        .floor-1-map-wrapper .r106 { top: 3%; left: 52%; width: 11%; height: 11%; }
        .floor-1-map-wrapper .r107 { top: 14%; left: 52%; width: 13%; height: 8%; }

        .floor-1-map-wrapper .r108 { top: 3%; left: 80%; width: 19%; height: 26%; }
        .floor-1-map-wrapper .r109 { top: 29%; left: 80%; width: 19%; height: 41%; }

        .floor-1-map-wrapper .r115 { top: 70%; left: 28%; width: 12%; height: 7%; }
        .floor-1-map-wrapper .r114 { top: 77%; left: 28%; width: 12%; height: 13%; }
        .floor-1-map-wrapper .r113 { top: 70%; left: 41%; width: 10%; height: 14%; }
        .floor-1-map-wrapper .r111 { top: 70%; left: 52%; width: 13%; height: 8%; }
        .floor-1-map-wrapper .r112 { top: 78%; left: 52%; width: 13%; height: 12%; }
        .floor-1-map-wrapper .r110a { top: 70%; left: 66%; width: 13%; height: 20%; }
        .floor-1-map-wrapper .r110b { top: 70%; left: 80%; width: 13%; height: 20%; }

        .floor-1-map-wrapper .map-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 30px;
            margin-top: 20px;
        }
        .floor-1-map-wrapper .compass { font-weight: 900; font-size: 1.2rem; display: flex; flex-direction: column; align-items: center; }
        .floor-1-map-wrapper .scale { width: 150px; text-align: right; font-size: 0.8rem; font-weight: 600; }
        .floor-1-map-wrapper .scale-bar { height: 6px; background: linear-gradient(to right, #000 50%, #fff 50%); border: 1px solid #000; margin-top: 4px; }
      `}</style>

      <TransformWrapper
        initialScale={typeof window !== 'undefined' && window.innerWidth < 1024 ? 0.4 : 0.8}
        minScale={0.2}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2">
              <button onClick={() => zoomIn()} className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all" title="Zoom In">+</button>
              <button onClick={() => zoomOut()} className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all" title="Zoom Out">-</button>
              <button onClick={() => resetTransform()} className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all" title="Reset View">↺</button>
            </div>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div className="map-wrapper" style={{ width: '1200px', height: '900px' }}>
                  <div className="map-header">
                      <div className="floor-title">Floor 1: Engineering & Mechanical Hub</div>
                  </div>

                  <div className="map-container">
                      <div className="corridor-tile c-main-loop"></div>
                      <div className="corridor-tile c-branch-left"></div>
                      <div className="corridor-tile c-branch-right"></div>

                      <div className="corridor-label label-t">Inner Loop Corridor</div>
                      <div className="corridor-label label-b">Inner Loop Corridor</div>

                      <div className="utility lift lift-l"><span>LIFT</span><span>🛗</span></div>
                      <div className="utility lift lift-r"><span>LIFT</span><span>🛗</span></div>
                      <div className="utility restroom"><span>🚹🚺</span></div>

                      <div className="atrium">
                          <div className="atrium-stairs stair-tl"></div>
                          <div className="atrium-stairs stair-br"></div>
                      </div>

                      <div className="door door-v" style={{top: '22%', left: '28%'}}></div>
                      <div className="door door-v" style={{top: '22%', left: '45%'}}></div>
                      <div className="door door-v" style={{top: '22%', left: '63%'}}></div>
                      <div className="door door-h" style={{top: '40%', left: '21%'}}></div>
                      <div className="door door-h" style={{top: '40%', right: '21%'}}></div>

                      {[
                        { id: '102', classes: 'room purple r102', num: '102', desc: 'Drawing Hall (Mechanical)' },
                        { id: '101', classes: 'room purple r101', num: '101', desc: 'Seminar Room' },
                        { id: '117', classes: 'room blue r117', num: '117', desc: 'Class Room' },
                        { id: '116', classes: 'room purple r116', num: '116', desc: 'IT-Hardware Lab' },
                        { id: '104', classes: 'room blue r104', num: '104', desc: 'Class Room' },
                        { id: '103', classes: 'room pink r103', num: '103', desc: 'H.O.D. Office' },
                        { id: '105', classes: 'room blue r105', num: '105', desc: 'Class Room' },
                        { id: '106', classes: 'room blue r106', num: '106', desc: 'Class Room' },
                        { id: '107', classes: 'room blue r107', num: '107', desc: 'Class Room' },
                        { id: '108', classes: 'room purple r108', num: '108', desc: 'Refrig. A.C. Lab' },
                        { id: '109', classes: 'room purple r109', num: '109', desc: 'IT-Programming Lab' },
                        { id: '115', classes: 'room pink r115', num: '115', desc: 'H.O.D. Office' },
                        { id: '114', classes: 'room blue r114', num: '114', desc: 'Class Room' },
                        { id: '113', classes: 'room blue r113', num: '113', desc: 'Class Room' },
                        { id: '111', classes: 'room blue r111', num: '111', desc: 'Class Room' },
                        { id: '112', classes: 'room blue r112', num: '112', desc: 'Class Room' },
                        { id: '110a', classes: 'room gray r110a', num: '110-A', desc: 'Library' },
                        { id: '110b', classes: 'room gray r110b', num: '110-B', desc: 'Reading Room' }
                      ].map(room => {
                        const actualPOI = pois.find(p => p.id === room.id) || { 
                          id: room.id, 
                          name: room.desc || room.num || 'Facility', 
                          type: 'classroom', 
                          floor: '1st Floor', 
                          lat: 21.22, 
                          lng: 72.87 
                        };
                        
                        return (
                          <div 
                            key={room.id}
                            className={clsx(room.classes, selectedPOI?.id === room.id && 'selected')}
                            onClick={() => onSelectPOI(actualPOI)}
                          >
                            <span className="r-num">{room.num}</span>
                            <span className="r-desc">{room.desc}</span>
                          </div>
                        );
                      })}
                  </div>

                  <div className="map-footer">
                      <div className="compass"><div>▲</div>N</div>
                      <div className="scale">
                          <span>0 1.5 2m 30m</span>
                          <div className="scale-bar"></div>
                      </div>
                  </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
