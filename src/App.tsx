import { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Compass, Search, MapPin, Clock, Info, UserRound, ArrowRight, Menu, 
  Navigation2, Globe, Map as MapIcon, QrCode, BookOpen, Filter, X, Loader2, Volume2, Building2,
  Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FloorName, POI, Faculty, floors, pois, facultyList, CAMPUS_CENTER } from './data';
import cn from 'clsx'; 

// Lazy load heavy components
const OutsideView = lazy(() => import('./OutsideView'));
const SVGMap = lazy(() => import('./components/MapComponents').then(m => ({ default: m.SVGMap })));
const ThirdFloorSVGMap = lazy(() => import('./components/MapComponents').then(m => ({ default: m.ThirdFloorSVGMap })));
const SecondFloorHTMLMap = lazy(() => import('./components/Floor2Map').then(m => ({ default: m.SecondFloorHTMLMap })));
const FourthFloorHTMLMap = lazy(() => import('./components/Floor4Map').then(m => ({ default: m.FourthFloorHTMLMap })));
const FirstFloorHTMLMap = lazy(() => import('./components/Floor1Map').then(m => ({ default: m.FirstFloorHTMLMap })));
const GroundFloorMap = lazy(() => import('./components/GroundFloorMap').then(m => ({ default: m.GroundFloorMap })));
const LandingPage = lazy(() => import('./LandingPage'));
const Gallery = lazy(() => import('./Gallery'));

// Optimized loading component
const MapLoader = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm rounded-3xl gap-4">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <Compass className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <div className="flex flex-col items-center text-center">
      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Loading Digital Twin</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Calibrating campus schematic...</p>
    </div>
  </div>
);

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeFloor, setActiveFloor] = useState<FloorName>('Ground');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [viewMode, setViewMode] = useState<'inside' | 'outside' | 'gallery'>('outside');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check URL params for "start" location (e.g. ?start=maingate)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startId = params.get('start');
    if (startId) {
      const poi = pois.find(p => p.id === startId);
      if (poi) {
        setActiveFloor(poi.floor);
        setSelectedPOI(poi);
      }
    }
  }, []);

  const filteredPOIs = pois.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.labType && p.labType.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredFaculty = facultyList.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectPOI = (poi: POI) => {
    setActiveFloor(poi.floor);
    setSelectedPOI(poi);
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleSelectFaculty = (faculty: Faculty) => {
    const office = pois.find(p => p.id === faculty.officeId);
    if (office) {
      handleSelectPOI(office);
    }
  };

  // Determine if Admin office is open (10 AM to 4 PM, Mon-Fri)
  const isAdminOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 10 && hour < 16;
  };

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <Suspense fallback={<MapLoader />}>
            <LandingPage onExplore={() => setShowLanding(false)} />
          </Suspense>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-slate-50 min-h-[100dvh] flex flex-col items-center relative font-sans text-slate-900"
        >
          <div className="w-full max-w-7xl flex flex-col flex-1 relative md:pb-8">
            {/* Header */}
            <header className="px-5 py-4 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-600/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-[15px] leading-tight tracking-tight text-slate-900">College Mapping System</h1>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5 max-w-[250px] leading-tight pr-2">Interactive Digital Campus Map &bull; Where is what?</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchActive(true)}
            className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700"
          >
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 gap-6 mt-2 md:mt-4">
        <div className="w-full max-w-md mx-auto md:max-w-none">
          <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl -mt-2 mb-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60 sticky top-20 z-30">
            <button onClick={() => setViewMode('inside')} className={cn("flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all", viewMode === 'inside' ? "bg-white text-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100" : "text-slate-500 hover:text-slate-700 hover:bg-white/40")}>
              <Building2 className="w-4 h-4" /> Inside Map
            </button>
            <button onClick={() => setViewMode('outside')} className={cn("flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all", viewMode === 'outside' ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]" : "text-slate-500 hover:text-slate-700 hover:bg-white/40")}>
              <MapIcon className="w-4 h-4" /> Outside Map
            </button>
          </div>
        </div>

        <div className="flex-1 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          <div className={cn(
            "flex flex-col gap-6 order-2 lg:order-1 transition-all duration-300",
            isFullscreen 
              ? "fixed inset-0 z-50 bg-slate-50 p-2 sm:p-4 lg:p-6 !m-0" 
              : "lg:col-span-7 xl:col-span-8"
          )}>
            {viewMode === 'gallery' ? (
              <div className="flex-1 overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="h-full overflow-y-auto">
                  <Suspense fallback={<MapLoader />}>
                    <Gallery />
                  </Suspense>
                </div>
              </div>
            ) : viewMode === 'inside' ? (
            <div className="flex flex-col h-full w-full gap-4">
            {/* Floor Selector */}
            <div className="relative group/floors">
              <div 
                className={cn(
                  "flex gap-2 flex-wrap pb-2", 
                  isFullscreen ? "" : ""
                )}
              >
                {floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => {
                      setActiveFloor(floor);
                      if (selectedPOI && selectedPOI.floor !== floor) {
                        setSelectedPOI(null);
                      }
                    }}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 snap-center shrink-0 border-2",
                      activeFloor === floor 
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/25 border-blue-500 scale-105 z-10" 
                        : "bg-white text-slate-600 border-white shadow-sm hover:border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("w-4 h-4 shrink-0 transition-colors", activeFloor === floor ? "text-white" : "text-slate-400")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
                    </div>
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Area */}
            <div className={cn(
              "relative w-full bg-white overflow-hidden shadow-sm border border-slate-100/60 p-2 transition-all flex-1",
              isFullscreen ? "rounded-2xl h-full flex flex-col" : "min-h-[500px] aspect-[4/5] md:min-h-0 md:aspect-video lg:aspect-[16/10] rounded-3xl"
            )}>
              {/* Floating labels inside map */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-2 border border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  You are here
                </div>
              </div>
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-white/95 backdrop-blur-md p-2 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-1.5 border border-slate-100 hover:bg-slate-50 transition-colors hidden sm:flex">
                  <Menu className="w-3.5 h-3.5" />
                  Legend
                </button>
              </div>

              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#f8fafc] isolate relative flex-1 min-h-0">
                <Suspense fallback={<MapLoader />}>
                {activeFloor === '3rd Floor' ? (
                  <ThirdFloorSVGMap selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                ) : activeFloor === '4th Floor' ? (
                  <FourthFloorHTMLMap selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                ) : activeFloor === '2nd Floor' ? (
                  <SecondFloorHTMLMap selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                ) : activeFloor === '1st Floor' ? (
                  <FirstFloorHTMLMap selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                ) : activeFloor === 'Ground' ? (
                  <GroundFloorMap selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                ) : (
                  <SVGMap floor={activeFloor} selectedPOI={selectedPOI} onSelectPOI={setSelectedPOI} />
                )}
                </Suspense>
              </div>
            </div>
            </div>
            ) : (
              <div className="flex flex-col h-full w-full gap-4 relative">
                <div className="absolute top-4 right-4 z-[9999] flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-white/95 backdrop-blur-md p-2 rounded-full shadow-md border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className={cn("w-full transition-all flex-1 min-h-[400px]", isFullscreen ? "h-full rounded-2xl overflow-hidden" : "")}>
                  <Suspense fallback={<MapLoader />}>
                    <OutsideView 
                      floor="Ground" 
                      selectedPOI={selectedPOI} 
                      onSelectPOI={setSelectedPOI} 
                      isFullscreen={isFullscreen} 
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 hide-scrollbar">
            {/* Search and Navigation Panel (Desktop Sidebar) */}
            <div className="flex flex-col gap-6">
              {/* Quick Access */}
              <div className={cn(viewMode === 'outside' && "lg:hidden")}>
                <h3 className="font-bold text-slate-900 mb-3 ml-1 text-sm tracking-tight text-left">Quick Access</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                  <button onClick={() => setSearchQuery('Admin')} className="flex flex-col items-center justify-center p-3.5 bg-[#eef4ff] rounded-2xl gap-2.5 hover:-translate-y-1 transition-transform border border-blue-100/50 text-left">
                    <div className="bg-blue-500 rounded-full p-2.5 text-white shadow-sm shadow-blue-500/20">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">Admin Office</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">Ground Floor</div>
                    </div>
                  </button>
                  <button onClick={() => setSearchQuery('Canteen')} className="flex flex-col items-center justify-center p-3.5 bg-[#ecfdf3] rounded-2xl gap-2.5 hover:-translate-y-1 transition-transform border border-emerald-100/50 text-left">
                    <div className="bg-emerald-500 rounded-full p-2.5 text-white shadow-sm shadow-emerald-500/20">
                      <Clock className="w-5 h-5" /> 
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">Canteen</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">Ground Floor</div>
                    </div>
                  </button>
                  <button onClick={() => setSearchQuery('Library')} className="flex flex-col items-center justify-center p-3.5 bg-[#fff6ed] rounded-2xl gap-2.5 hover:-translate-y-1 transition-transform border border-orange-100/50 text-left">
                    <div className="bg-orange-500 rounded-full p-2.5 text-white shadow-sm shadow-orange-500/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">Library</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">1st Floor</div>
                    </div>
                  </button>
                  <button onClick={() => setIsSearchActive(true)} className="flex flex-col items-center justify-center p-3.5 bg-[#f5f0ff] rounded-2xl gap-2.5 hover:-translate-y-1 transition-transform border border-purple-100/50 text-left">
                    <div className="bg-purple-500 rounded-full p-2.5 text-white shadow-sm shadow-purple-500/20">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <div className="text-center w-full">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">Faculty</div>
                      <div className="text-[9px] text-slate-500 font-medium truncate">Search</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Inline Search Bar */}
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search rooms, faculty or places..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                    onClick={() => setIsSearchActive(true)}
                    readOnly
                  />
                </div>
                <button className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors w-[52px] h-[52px] flex items-center justify-center shrink-0">
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Recent Searches */}
              <div className="pb-6">
                <div className="flex items-center justify-between mb-3 ml-1">
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight text-left">Recent Searches</h3>
                  <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700">View all</button>
                </div>
                <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible hide-scrollbar pb-2 -mx-5 px-5 lg:mx-0 lg:px-0">
                  {[
                    { title: 'Lab 102', sub: '1st Floor' },
                    { title: 'Prof. Mehta', sub: 'Room 205' },
                    { title: 'Admin Office', sub: 'Ground Floor' },
                    { title: 'Library', sub: '1st Floor' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-3 min-w-[150px] lg:min-w-0 shadow-sm shrink-0">
                      <div className="text-left w-full">
                        <div className="text-xs font-bold text-slate-800">{item.title}</div>
                        <div className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">{item.sub}</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-full text-slate-400 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 flex justify-center z-40 pointer-events-none">
        <nav className="w-full max-w-[600px] bg-white/90 backdrop-blur-xl border border-slate-100/80 px-4 py-2 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between pointer-events-auto gap-1">
          <button 
            onClick={() => { setShowLanding(true); setSelectedPOI(null); }} 
            className={cn("flex flex-col items-center gap-1 p-2 transition-colors", showLanding ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900')}
          >
            <Compass className={cn("w-[22px] h-[22px]", showLanding && 'fill-current')} />
            <span className="text-[10px] font-bold md:hidden">Home</span>
          </button>
          
          <button 
            onClick={() => { setShowLanding(false); setViewMode('outside'); setSelectedPOI(null); }} 
            className={cn("flex flex-col items-center gap-1 p-2 transition-colors", (!showLanding && viewMode === 'outside') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900')}
          >
            <Globe className={cn("w-[22px] h-[22px]", (!showLanding && viewMode === 'outside') && 'fill-current')} />
            <span className="text-[10px] font-bold md:hidden">Earth Map</span>
          </button>

          <button 
            onClick={() => { setShowLanding(false); setViewMode('inside'); }} 
            className={cn("flex flex-col items-center gap-1 p-2 transition-colors", (!showLanding && viewMode === 'inside') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900')}
          >
            <Building2 className={cn("w-[22px] h-[22px]", (!showLanding && viewMode === 'inside') && 'fill-current')} />
            <span className="text-[10px] font-bold md:hidden">Inside Map</span>
          </button>
          
          <div className="relative -top-6 mx-2">
            <button 
              onClick={() => setShowQRScanner(true)} 
              className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center hover:-translate-y-1 transition-transform border-[6px] border-slate-50 ring-1 ring-black/5"
            >
              <QrCode className="w-7 h-7" />
            </button>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 whitespace-nowrap">Scan QR</span>
          </div>

          <button 
            onClick={() => { setViewMode('gallery'); setShowLanding(false); }} 
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all",
              (!showLanding && viewMode === 'gallery') ? "text-blue-600" : "text-slate-400 hover:text-slate-900"
            )}
          >
            <BookOpen className={cn("w-[22px] h-[22px]", (!showLanding && viewMode === 'gallery') && "fill-current")} />
            <span className="text-[10px] font-black md:hidden uppercase tracking-widest">Gallery</span>
          </button>
          
          <button 
            onClick={() => setIsSearchActive(true)} 
            className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <Search className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-bold md:hidden">Search</span>
          </button>
        </nav>
      </div>

      {/* POI Info Slide-up / Side Panel */}
      <AnimatePresence>
        {selectedPOI && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center lg:items-center lg:justify-end lg:pr-12">
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="w-full max-w-[500px] bg-white pointer-events-auto rounded-t-3xl lg:rounded-3xl flex flex-col max-h-[85vh] lg:max-h-[80vh] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border border-slate-100 text-left overflow-hidden"
            >
            <div className="p-6 flex flex-col gap-4 overflow-y-auto w-full pb-[calc(24px+env(safe-area-inset-bottom))]">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 shrink-0"></div>
              
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold mb-1 text-slate-900">{selectedPOI.name}</h2>
                  <button 
                    onClick={() => setSelectedPOI(null)}
                    className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {selectedPOI.floor}
                </p>
              </div>

              <div className="h-px bg-slate-100" />

              {selectedPOI.description && (
                <div className="flex gap-3 text-slate-600">
                  <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{selectedPOI.description}</p>
                </div>
              )}

              {selectedPOI.timing && (
                <div className="flex gap-3 text-slate-600">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{selectedPOI.timing}</p>
                </div>
              )}

              {selectedPOI.id === 'admin' && (
                <div className={cn(
                  "mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border w-fit shadow-sm",
                  isAdminOpen() 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", isAdminOpen() ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                  {isAdminOpen() ? 'Currently Open' : 'Currently Closed'}
                </div>
              )}

              {/* Show faculties if it's an office */}
              {pois.some(p => p.id === selectedPOI.id) && facultyList.some(f => f.officeId === selectedPOI.id) && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">Faculty in this room</h3>
                  <ul className="space-y-2">
                    {facultyList.filter(f => f.officeId === selectedPOI.id).map(faculty => (
                      <li key={faculty.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 shadow-sm rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          <UserRound className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{faculty.name}</p>
                          <p className="text-[11px] font-medium text-slate-500">{faculty.department} Dept.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedPOI(null)}
                  className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3.5 font-bold transition-colors flex justify-center items-center gap-2"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Scanner Overlay */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white"
          >
            <button 
              onClick={() => setShowQRScanner(false)}
              className="absolute top-8 right-8 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full max-w-sm aspect-square relative mb-12">
              {/* Camera Simulation Viewfinder */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-3xl overflow-hidden">
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-white/30 text-center px-8">
                    <Loader2 className="w-12 h-12 animate-spin-slow" />
                    <p className="text-sm font-bold uppercase tracking-widest">Accessing Wayfinding Interface...</p>
                  </div>
                </div>
              </div>

              {/* Scanned Corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 -translate-x-2 -translate-y-2 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 translate-x-2 -translate-y-2 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 -translate-x-2 translate-y-2 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 translate-x-2 translate-y-2 rounded-br-xl"></div>
              
              {/* Scanning Line Animation */}
              <motion.div 
                animate={{ top: ['10%', '90%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute left-4 right-4 h-1 bg-blue-500/50 blur-sm z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              ></motion.div>
            </div>

            <div className="text-center space-y-4 max-w-xs">
              <h3 className="text-2xl font-black tracking-tight">Wayfinding Scanner</h3>
              <p className="text-white/60 text-sm font-medium">Scan QR codes located in various departments to instantly locate yourself on the map.</p>
              
              <div className="pt-6 grid grid-cols-1 gap-3">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Simulate Scanning:</p>
                <button 
                  onClick={() => {
                    handleSelectPOI(pois.find(p => p.id === 'admin-005')!);
                    setShowQRScanner(false);
                    setViewMode('outside');
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all group"
                >
                  <QrCode className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-sm font-bold">Admin QR Code</p>
                    <p className="text-[10px] text-white/40 uppercase font-black">Locate: Admin Office</p>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    handleSelectPOI(pois.find(p => p.id === 'admin-008')!);
                    setShowQRScanner(false);
                    setViewMode('outside');
                  }}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all group"
                >
                  <QrCode className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-sm font-bold">Workshop QR Code</p>
                    <p className="text-[10px] text-white/40 uppercase font-black">Locate: Heavy Engineering</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-0 bg-white z-[70] flex flex-col font-sans max-w-7xl mx-auto text-left shadow-2xl"
            >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white shadow-sm pt-safe">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search rooms, labs, or faculty..."
                className="flex-1 bg-transparent border-none outline-none text-base font-medium p-1 text-slate-900 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchActive(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-2 flex-1 pb-safe">
              {searchQuery.length > 0 ? (
                <div className="py-2 px-2">
                  {filteredPOIs.length > 0 && (
                    <div className="mb-6">
                      <h4 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Locations</h4>
                      {filteredPOIs.map(poi => (
                        <button
                          key={poi.id}
                          onClick={() => handleSelectPOI(poi)}
                          className="w-full text-left px-3 py-3 rounded-2xl hover:bg-slate-50 flex items-center gap-4 transition-colors group border border-transparent hover:border-slate-100"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-100 shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-slate-800 text-sm truncate">{poi.name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{poi.floor}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {filteredFaculty.length > 0 && (
                    <div>
                      <h4 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Faculty</h4>
                      {filteredFaculty.map(fac => (
                        <button
                          key={fac.id}
                          onClick={() => handleSelectFaculty(fac)}
                          className="w-full text-left px-3 py-3 rounded-2xl hover:bg-slate-50 flex items-center gap-4 transition-colors group border border-transparent hover:border-slate-100"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-slate-100 shrink-0">
                            <UserRound className="w-5 h-5" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-slate-800 text-sm truncate">{fac.name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">{fac.department} Dept.</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredPOIs.length === 0 && filteredFaculty.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                    <Search className="w-12 h-12 mb-4 text-slate-200" />
                    <p className="font-medium">Type something to search...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}

