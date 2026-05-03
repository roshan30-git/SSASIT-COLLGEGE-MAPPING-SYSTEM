import React from 'react';
import { POI, pois } from '../data';
import clsx from 'clsx';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function SecondFloorHTMLMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  return (
    <div className="floor-2-map-wrapper w-full h-full bg-[#f0f2f5]">
      <style>{`
        .floor-2-map-wrapper {
            --purple-bg: #d0aae6;
            --blue-bg: #b3d9f2;
            --pink-bg: #f55ebd;
            --dark-blue-bg: #2d5a9e;
            --corridor-bg: #1c5fd1;
            --border-color: #1a1a1a;
        }

        .floor-2-map-wrapper .map-wrapper {
            width: 100%;
            height: 100%;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .floor-2-map-wrapper .map-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
        }
        .floor-2-map-wrapper .floor-title { 
            font-size: clamp(1.5rem, 3vw, 2.2rem); 
            font-weight: 800; 
            color: #111;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .floor-2-map-wrapper .compass {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-weight: bold;
            font-size: 1.2rem;
        }
        .floor-2-map-wrapper .compass-arrow {
            width: 0; 
            height: 0; 
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 15px solid black;
            margin-bottom: 2px;
        }

        .floor-2-map-wrapper .map-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1.4 / 1;
            background: #ffffff;
            border: 3px solid var(--border-color);
            overflow: hidden;
            border-radius: 4px;
        }

        .floor-2-map-wrapper .c-tile {
            position: absolute;
            background-color: var(--corridor-bg);
            top: 20%; 
            left: 18%; 
            width: 64%; 
            height: 58%;
            z-index: 1;
            box-shadow: inset 0 0 25px rgba(255,255,255,0.2);
        }

        .floor-2-map-wrapper .atrium {
            position: absolute;
            top: 28%; 
            left: 26%;
            width: 48%; 
            height: 42%;
            background-color: #ffffff;
            border: 3px solid var(--border-color);
            z-index: 2;
            box-sizing: border-box;
        }

        .floor-2-map-wrapper .atrium-stairs {
            position: absolute;
            width: 20%;
            height: 40%;
            background: repeating-linear-gradient(to bottom, #cfcfcf, #cfcfcf 4px, #ffffff 4px, #ffffff 8px);
            border: 1.5px solid var(--border-color);
        }
        .floor-2-map-wrapper .stair-tr { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0); }
        .floor-2-map-wrapper .stair-bl { bottom: 0; left: 0; clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0); }

        .floor-2-map-wrapper .lift {
            position: absolute;
            width: 4.5%;
            height: 7.5%;
            background-color: transparent;
            border: 2px solid #fff;
            z-index: 3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: clamp(0.5rem, 0.8vw, 0.9rem);
            font-weight: bold;
        }
        .floor-2-map-wrapper .lift-l { top: 20%; left: 18%; border-top: none; border-left: none; border-bottom: 2px solid #fff; border-right: 2px solid #fff; }
        .floor-2-map-wrapper .lift-r { top: 20%; right: 18%; border-top: none; border-right: none; border-bottom: 2px solid #fff; border-left: 2px solid #fff; }

        .floor-2-map-wrapper .room {
            position: absolute;
            border: 2px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 4px;
            box-sizing: border-box;
            z-index: 5;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .floor-2-map-wrapper .room:hover {
            transform: scale(1.02);
            z-index: 20;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .floor-2-map-wrapper .room.selected {
            border-color: #2d5a9e;
            border-width: 3px;
            box-shadow: 0 0 0 4px rgba(45,90,158,0.3);
            z-index: 21;
        }

        .floor-2-map-wrapper .purple { background-color: var(--purple-bg); }
        .floor-2-map-wrapper .blue { background-color: var(--blue-bg); }
        .floor-2-map-wrapper .pink { background-color: var(--pink-bg); }
        .floor-2-map-wrapper .dark-blue { background-color: var(--dark-blue-bg); color: white; }

        .floor-2-map-wrapper .r-num { 
            font-size: clamp(0.9rem, 1.4vw, 1.5rem); 
            font-weight: 800;
            margin-bottom: 3px; 
            color: #000; 
            line-height: 1;
        }
        .floor-2-map-wrapper .dark-blue .r-num { color: white; margin-bottom: 0; font-size: 1.1rem; }
        
        .floor-2-map-wrapper .r-desc { 
            font-size: clamp(0.6rem, 0.85vw, 1rem); 
            line-height: 1.2; 
            font-weight: 600; 
            max-width: 95%;
            color: #111;
        }
        .floor-2-map-wrapper .dark-blue .r-desc { color: white; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }

        .floor-2-map-wrapper .room.r203 { top: 0%; left: 0%; width: 18%; height: 20%; }
        .floor-2-map-wrapper .room.r202 { top: 20%; left: 0%; width: 18%; height: 29%; }
        .floor-2-map-wrapper .room.r201 { top: 49%; left: 0%; width: 18%; height: 29%; }
        .floor-2-map-wrapper .room.r217 { top: 78%; left: 0%; width: 18%; height: 22%; }

        .floor-2-map-wrapper .room.r204 { top: 0%; left: 18%; width: 12.8%; height: 20%; }
        .floor-2-map-wrapper .room.r205 { top: 0%; left: 30.8%; width: 12.8%; height: 20%; }
        .floor-2-map-wrapper .room.r206 { top: 0%; left: 43.6%; width: 12.8%; height: 20%; }
        .floor-2-map-wrapper .room.r207 { top: 0%; left: 56.4%; width: 12.8%; height: 20%; }
        .floor-2-map-wrapper .room.r208 { top: 0%; left: 69.2%; width: 12.8%; height: 20%; }

        .floor-2-map-wrapper .room.r209 { top: 0%; left: 82%; width: 18%; height: 28%; padding-top: 5%; justify-content: center; }
        
        .floor-2-map-wrapper .room.washroom { 
            top: 0%; 
            right: 0%; 
            width: 7%; 
            height: 12%; 
            z-index: 10; 
            border-top: none; 
            border-right: none;
            padding: 2px;
        }

        .floor-2-map-wrapper .room.r210 { top: 28%; left: 82%; width: 18%; height: 50%; }
        .floor-2-map-wrapper .room.r211 { top: 78%; left: 82%; width: 18%; height: 22%; }

        .floor-2-map-wrapper .room.r216 { top: 78%; left: 18%; width: 24%; height: 22%; }
        .floor-2-map-wrapper .room.r215 { top: 78%; left: 42%; width: 10%; height: 22%; }
        .floor-2-map-wrapper .room.r214 { top: 78%; left: 52%; width: 10%; height: 22%; }
        .floor-2-map-wrapper .room.r212 { top: 78%; left: 62%; width: 10%; height: 22%; }
        .floor-2-map-wrapper .room.r213 { top: 78%; left: 72%; width: 10%; height: 22%; }
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
            {/* Zoom Controls overlay */}
            <div className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2">
              <button 
                onClick={() => zoomIn()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom In"
              >
                +
              </button>
              <button 
                onClick={() => zoomOut()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom Out"
              >
                -
              </button>
              <button 
                onClick={() => resetTransform()}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                title="Reset View"
              >
                ↺
              </button>
            </div>
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div className="map-wrapper" style={{ width: '1200px', height: '800px' }}>
              <div className="map-header">
                  <div className="floor-title">Floor 2: Computer & Environment Science</div>
                  <div className="compass">
                      <div className="compass-arrow"></div>
                      N
                  </div>
              </div>

          <div className="map-container">
              <div className="c-tile"></div>

              <div className="lift lift-l">🛗</div>
              <div className="lift lift-r">🛗</div>

              <div className="atrium">
                  <div className="atrium-stairs stair-tr"></div>
                  <div className="atrium-stairs stair-bl"></div>
              </div>

              {[
                { id: '203', classes: 'room blue r203', num: '203', desc: 'Tutorial Room' },
                { id: '202', classes: 'room purple r202', num: '202', desc: 'Environment Engg. Lab' },
                { id: '201', classes: 'room purple r201', num: '201', desc: 'MSCIT Lab' },
                { id: '217', classes: 'room purple r217', num: '217', desc: 'Computer Center' },
                { id: '204', classes: 'room pink r204', num: '204', desc: 'H.O.D. Office' },
                { id: '205', classes: 'room blue r205', num: '205', desc: 'class room' },
                { id: '206', classes: 'room blue r206', num: '206', desc: 'class room' },
                { id: '207', classes: 'room blue r207', num: '207', desc: 'class room' },
                { id: '208', classes: 'room blue r208', num: '208', desc: 'class room' },
                { id: '209', classes: 'room purple r209', num: '209', desc: 'BBA Seminar Hall' },
                { id: 'washroom-2', classes: 'room dark-blue washroom', extra: <><span className="r-desc">Washroom</span><span className="r-num">🚻</span><span className="r-desc">Toilet</span></> },
                { id: '210', classes: 'room purple r210', num: '210', desc: 'Computer Center' },
                { id: '211', classes: 'room purple r211', num: '211', desc: 'BCA Seminar Hall' },
                { id: '216', classes: 'room purple r216', num: '216', desc: 'ETC Lab' },
                { id: '215', classes: 'room blue r215', num: '215', desc: 'class room' },
                { id: '214', classes: 'room blue r214', num: '214', desc: 'class room' },
                { id: '212', classes: 'room blue r212', num: '212', desc: 'class room' },
                { id: '213', classes: 'room blue r213', num: '213', desc: 'class room' }
              ].map(room => {
                const actualPOI = pois.find(p => p.id === room.id) || { 
                  id: room.id, 
                  name: room.desc || room.num || 'Facility', 
                  type: 'classroom', 
                  floor: '2nd Floor', 
                  lat: 21.22, 
                  lng: 72.87 
                };
                
                return (
                  <div 
                    key={room.id}
                    className={clsx(room.classes, selectedPOI?.id === room.id && 'selected')}
                    onClick={() => onSelectPOI(actualPOI)}
                  >
                    {room.extra ? room.extra : (
                        <>
                            <span className="r-num">{room.num}</span>
                            <span className="r-desc">{room.desc}</span>
                        </>
                    )}
                  </div>
                );
              })}
          </div>
          </div>
        </TransformComponent>
        </>
        )}
      </TransformWrapper>
    </div>
  );
}
