import React from 'react';
import { POI, pois } from '../data';
import clsx from 'clsx';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function FourthFloorHTMLMap({ selectedPOI, onSelectPOI }: { selectedPOI: POI | null, onSelectPOI: (poi: POI) => void }) {
  return (
    <div className="floor-4-map-wrapper w-full h-full bg-[#f0f2f5]">
      <style>{`
        .floor-4-map-wrapper {
            --purple-bg: #e8c6ff;
            --pink-bg: #ff99e6;
            --blue-bg: #b3e0ff;
            --gray-bg: #d3d3d3;
            --corridor-bg: #4a86e8;
            --border-color: #000000;
        }

        .floor-4-map-wrapper .map-wrapper {
            width: 100%;
            height: 100%;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .floor-4-map-wrapper .map-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1.3 / 1;
            background: #ffffff;
            border: 2px solid #111;
            overflow: hidden;
            border-radius: 4px;
        }

        .floor-4-map-wrapper .c-tile {
            position: absolute;
            background-color: var(--corridor-bg);
            z-index: 1;
        }
        
        .floor-4-map-wrapper .c-top { top: 20%; left: 18%; width: 55%; height: 8%; }
        .floor-4-map-wrapper .c-bottom { top: 62%; left: 18%; width: 55%; height: 8%; }
        .floor-4-map-wrapper .c-left { top: 28%; left: 18%; width: 7%; height: 34%; }
        .floor-4-map-wrapper .c-right { top: 28%; left: 63%; width: 10%; height: 34%; }
        
        .floor-4-map-wrapper .c-notch-418 { top: 70%; left: 12%; width: 13%; height: 15%; } 
        .floor-4-map-wrapper .c-notch-414 { top: 70%; left: 37%; width: 14%; height: 6%; }  

        .floor-4-map-wrapper .corridor-label {
            position: absolute;
            color: #05162b;
            font-weight: 900;
            font-size: clamp(0.7rem, 1.4vw, 1.2rem);
            z-index: 10; 
            pointer-events: none;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .floor-4-map-wrapper .label-top { top: 24%; left: 45.5%; transform: translate(-50%, -50%); }
        .floor-4-map-wrapper .label-bottom { top: 66%; left: 45.5%; transform: translate(-50%, -50%); }

        .floor-4-map-wrapper .atrium {
            position: absolute;
            top: 28%; left: 25%;
            width: 38%; height: 34%;
            background-color: #ffffff;
            border: 2.5px solid var(--border-color);
            z-index: 5;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.05);
        }

        .floor-4-map-wrapper .atrium-stairs {
            position: absolute;
            width: 35%;
            height: 35%;
            background: repeating-linear-gradient(to bottom, #d4d4d4, #d4d4d4 4px, #ffffff 4px, #ffffff 8px);
            border: 1.5px solid var(--border-color);
        }
        .floor-4-map-wrapper .stair-tr { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0); }
        .floor-4-map-wrapper .stair-bl { bottom: 0; left: 0; clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0); }

        .floor-4-map-wrapper .room {
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

        .floor-4-map-wrapper .room:hover {
            transform: scale(1.02);
            z-index: 20;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .floor-4-map-wrapper .room.selected {
            border-color: #1d4ed8;
            border-width: 3px;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
            z-index: 21;
        }

        .floor-4-map-wrapper .purple { background-color: var(--purple-bg); }
        .floor-4-map-wrapper .pink { background-color: var(--pink-bg); }
        .floor-4-map-wrapper .blue { background-color: var(--blue-bg); }
        .floor-4-map-wrapper .gray { background-color: var(--gray-bg); }

        .floor-4-map-wrapper .r-num { 
            font-size: clamp(0.9rem, 1.3vw, 1.4rem); 
            font-weight: 800;
            margin-bottom: 2px; 
            color: #000; 
            line-height: 1;
        }
        .floor-4-map-wrapper .r-desc { 
            font-size: clamp(0.55rem, 0.75vw, 0.85rem); 
            line-height: 1.2; 
            font-weight: 600; 
            max-width: 95%;
            color: #1a1a1a;
        }

        .floor-4-map-wrapper .tight .r-desc { font-size: clamp(0.45rem, 0.6vw, 0.75rem); }

        .floor-4-map-wrapper .room.r403 { top: 0%; left: 0%; width: 18%; height: 20%; }
        .floor-4-map-wrapper .room.r402 { top: 20%; left: 0%; width: 18%; height: 25%; }
        .floor-4-map-wrapper .room.r401 { top: 45%; left: 0%; width: 18%; height: 25%; }
        .floor-4-map-wrapper .room.r418 { top: 70%; left: 0%; width: 12%; height: 15%; } 
        .floor-4-map-wrapper .room.r417 { top: 85%; left: 0%; width: 18%; height: 15%; }

        .floor-4-map-wrapper .room.lift-l { top: 10%; left: 18%; width: 7%; height: 10%; }
        .floor-4-map-wrapper .room.r405 { top: 0%; left: 25%; width: 12%; height: 12%; }
        .floor-4-map-wrapper .room.r404 { top: 12%; left: 25%; width: 12%; height: 8%; }
        .floor-4-map-wrapper .room.r406 { top: 0%; left: 37%; width: 14%; height: 20%; }
        .floor-4-map-wrapper .room.r407 { top: 0%; left: 51%; width: 12%; height: 12%; }
        .floor-4-map-wrapper .room.r408 { top: 12%; left: 51%; width: 12%; height: 8%; }
        .floor-4-map-wrapper .room.lift-r { top: 10%; left: 63%; width: 10%; height: 10%; }

        .floor-4-map-wrapper .room.r409 { top: 0%; left: 73%; width: 17%; height: 20%; }
        .floor-4-map-wrapper .room.toilet { top: 0%; left: 90%; width: 10%; height: 20%; }
        .floor-4-map-wrapper .room.r410 { top: 20%; left: 73%; width: 27%; height: 50%; }
        .floor-4-map-wrapper .room.r411 { top: 70%; left: 73%; width: 27%; height: 30%; }

        .floor-4-map-wrapper .room.r416 { top: 70%; left: 25%; width: 12%; height: 8%; }
        .floor-4-map-wrapper .room.r415 { top: 78%; left: 25%; width: 12%; height: 22%; }
        .floor-4-map-wrapper .room.r414 { top: 76%; left: 37%; width: 14%; height: 24%; }
        .floor-4-map-wrapper .room.r412 { top: 70%; left: 51%; width: 12%; height: 8%; }
        .floor-4-map-wrapper .room.r413 { top: 78%; left: 51%; width: 12%; height: 22%; }

        .floor-4-map-wrapper .map-footer {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 0 10px;
        }
        .floor-4-map-wrapper .floor-num { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #111;}
        .floor-4-map-wrapper .floor-title { font-size: clamp(1.2rem, 2.5vw, 1.8rem); font-style: italic; font-weight: 600; color: #333; }
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
          <div className="map-wrapper" style={{ width: '1100px', height: '800px' }}>
              <div className="map-container">
              
              <div className="c-tile c-top"></div>
              <div className="c-tile c-bottom"></div>
              <div className="c-tile c-left"></div>
              <div className="c-tile c-right"></div>
              <div className="c-tile c-notch-418"></div>
              <div className="c-tile c-notch-414"></div>

              <div className="corridor-label label-top">Inner Loop Corridor</div>
              <div className="corridor-label label-bottom">Inner Loop Corridor</div>

              <div className="atrium">
                  <div className="atrium-stairs stair-tr"></div>
                  <div className="atrium-stairs stair-bl"></div>
              </div>

              {[
                { id: '403', classes: 'room purple r403', num: '403', label: 'Electronic Lab' },
                { id: '402', classes: 'room purple r402', num: '402', label: 'Communication Lab' },
                { id: '401', classes: 'room purple r401', num: '401', label: 'IT-IOT/AI & Data Science Lab' },
                { id: '418', classes: 'room purple r418 tight', num: '418', label: 'Project Room' },
                { id: '417', classes: 'room purple r417 tight', num: '417', label: 'Basic Computer & Hardware Lab' },
                { id: 'lift-4L', classes: 'room gray lift-l', num: '', label: 'Lift' },
                { id: '405', classes: 'room blue r405', num: '405', label: 'classroom' },
                { id: '404', classes: 'room pink r404 tight', num: '404', label: 'H.O.D. Office (E.C.)' },
                { id: '406', classes: 'room blue r406', num: '406', label: 'classroom' },
                { id: '407', classes: 'room blue r407', num: '407', label: 'classroom' },
                { id: '408', classes: 'room blue r408 tight', num: '408', label: 'classroom' },
                { id: 'lift-4R', classes: 'room gray lift-r', num: '', label: 'Lift' },
                { id: '409', classes: 'room purple r409 tight', num: '409', label: 'BCA/MCA Computer Center' },
                { id: 'toilet-4', classes: 'room blue toilet', num: '🚻', label: 'Toilet', style: {margin: 0} },
                { id: '410', classes: 'room blue r410', num: '410', label: 'Sports Room' },
                { id: '411', classes: 'room purple r411', num: '411', label: 'Physics Lab' },
                { id: '416', classes: 'room pink r416 tight', num: '416', label: 'H.O.D. Office (BBA/H&SS)' },
                { id: '415', classes: 'room blue r415', num: '415', label: 'classroom' },
                { id: '414', classes: 'room blue r414', num: '414', label: 'classroom' },
                { id: '412', classes: 'room blue r412 tight', num: '412', label: 'classroom' },
                { id: '413', classes: 'room blue r413', num: '413', label: 'classroom' }
              ].map(room => {
                const actualPOI = pois.find(p => p.id === room.id) || { 
                  id: room.id, 
                  name: room.label || room.num || 'Facility', 
                  type: 'classroom', 
                  floor: '4th Floor', 
                  lat: 21.22, 
                  lng: 72.87 
                };

                return (
                  <div 
                    key={room.id} 
                    className={clsx(room.classes, selectedPOI?.id === room.id && 'selected')}
                    onClick={() => onSelectPOI(actualPOI)}
                  >
                    {room.num && <span className="r-num" style={room.style}>{room.num}</span>}
                    <span className="r-desc">{room.label}</span>
                  </div>
                );
              })}
          </div>

          <div className="map-footer">
              <div className="floor-num">Floor 4</div>
              <div className="floor-title">'Project & Advanced Research'</div>
          </div>
          </div>
        </TransformComponent>
        </>
        )}
      </TransformWrapper>
    </div>
  );
}
