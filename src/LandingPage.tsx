import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import cn from 'clsx';
import { 
  Map as LucideMap, Grid, Calendar, Bookmark, Menu, Bell, Search, Mic, 
  ChevronLeft, ChevronRight, Navigation, MapPin, X, CheckCircle2, 
  Cpu, Building2, FlaskConical, Construction, Utensils, Box, 
  Accessibility, ArrowUp, Footprints, Info, Zap, Plus, Minus, 
  ArrowRight, GraduationCap, Target, Award, Phone, Mail, History, 
  Compass, ChevronDown, ExternalLink, BookOpen, AlertTriangle, 
  Lightbulb, Layers, ArrowDown, Users, Clock, Eye, Smartphone, 
  Rocket, ClipboardCheck, FileText, Maximize2, RotateCw
} from 'lucide-react';

// --- OFFICIAL THEME COLORS ---
const THEME = {
  blue: '#004a80', 
  maroon: '#880000', 
  gold: '#facc15', 
  lightBlue: '#e0f2fe'
};

// --- OFFICIAL ASSET LINKS ---
const ASSETS = {
  logo: 'https://ssasit.ac.in/onlinefee/Images/ssasitlogo.png',
  heroImage: 'https://ssasit.ac.in/wp-content/uploads/2019/08/SSASITBUILDING1NEW-1.jpg',
  swamiji: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGHi1onEPTAW40T0ByCH8oAX3e2-BU-dqit2DWYYxYTw&s',
  campusBackdrop: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000' 
};

// --- UPDATED CANVAS DATA WITH ORIENTATION & ROTATION FIXES ---
const CANVAS_ARTIFACTS = [
  { 
    title: "AEIOU Summary", 
    icon: Eye, 
    img: "https://i.postimg.cc/13cdfVG2/aeiou.jpg",
    desc: "Field research observing Students, Faculty, and Visitors in the campus.",
    isVertical: false,
    rotate: -90 
  },
  { 
    title: "Mind Mapping", 
    icon: Layers, 
    img: "https://i.postimg.cc/CxH2znGP/mindmap.jpg",
    desc: "Radial exploration of SSASIT departments and facility hubs.",
    isVertical: false,
    rotate: -90 
  },
  { 
    title: "Storyboard Canvas", 
    icon: Smartphone, 
    img: "https://i.postimg.cc/VkcTfWCx/observation.jpg",
    desc: "Capturing 'Sad' vs 'Happy' user journey scenarios.",
    isVertical: true, 
    rotate: -90 
  },
  { 
    title: "Ideation Canvas", 
    icon: Lightbulb, 
    img: "https://i.postimg.cc/y8z51yR4/ideation.jpg",
    desc: "Synthesizing solutions for digital campus mapping.",
    isVertical: false, 
    rotate: -90 
  },
  { 
    title: "Product Canvas", 
    icon: Rocket, 
    img: "https://i.postimg.cc/mgGqLy9G/productdev.jpg",
    desc: "Centralized platform blueprint for fees and virtual maps.",
    isVertical: false,
    rotate: 180 
  },
  { 
    title: "Learning Matrix", 
    icon: ClipboardCheck, 
    img: "https://i.postimg.cc/vZdjYtVP/LNM.jpg",
    desc: "Technical skills mapped across all Bachelor Stages.",
    isVertical: false,
    rotate: -90 
  },
];

const StorySection = ({ children, className = "", isVisibleDefault = false, id }: { children: React.ReactNode, className?: string, isVisibleDefault?: boolean, id?: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(isVisibleDefault);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id={id}
      ref={ref}
      className={`relative py-24 px-6 transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.98]'}`}
    >
      {children}
    </section>
  );
};

export default function LandingPage({ onExplore }: { onExplore: () => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedCanvas, setSelectedCanvas] = useState<typeof CANVAS_ARTIFACTS[0] | null>(null);

  useEffect(() => {
    // Lock scroll when modal is open
    if (selectedCanvas) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCanvas]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExplore = () => {
    window.scrollTo(0, 0);
    onExplore();
  };

  return (
    <div className="bg-white text-slate-800 font-sans overflow-x-hidden">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100">
        <div 
          className="h-full transition-all duration-300" 
          style={{ width: `${scrollProgress}%`, backgroundColor: THEME.maroon }}
        ></div>
      </div>

      {/* Official Header */}
      <header className="fixed top-0 left-0 w-full z-[90] h-24 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-1">
              <img src={ASSETS.logo} alt="SSASIT Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-xl tracking-tight leading-none text-[#004a80]">SSASIT</h1>
              <p className="text-[10px] font-bold text-[#880000] uppercase tracking-widest mt-1">DT Project • Team 948876</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#" className="hover:text-[#004a80]">Home</a>
            <a href="#about" className="hover:text-[#004a80]">About</a>
            <a href="#canvases" className="hover:text-[#004a80]">Artifacts</a>
            <a href="#roadmap" className="hover:text-[#004a80]">Roadmap</a>
          </nav>

          <button 
            onClick={handleExplore}
            className="bg-[#004a80] hover:bg-[#003a66] text-white px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#004a80]/20 hover:scale-105"
          >
            Explore Map <LucideMap size={16} />
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION (RESTORED) */}
      <StorySection className="bg-slate-50 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
           <img src={ASSETS.heroImage} className="w-full h-full object-cover opacity-20" alt="SSASIT Building" />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4 mx-auto mt-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#880000]/10 border border-[#880000]/20 text-[#880000] text-xs font-black uppercase tracking-widest mb-6">
            <Target size={14}/> DT: College Mapping System
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
            A Legacy of <br/>
            <span className="text-[#004a80]">Innovation & Ethics.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Design Thinking Project (BE01R00071). Revolutionizing campus mapping through human-centered digital twins.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleExplore} 
              className="bg-[#880000] text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl shadow-[#880000]/20 hover:scale-105 hover:bg-[#a00000] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LucideMap size={20} /> LAUNCH THE MAP
            </button>
            <a href="#canvases" className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center">View 6 Canvases</a>
          </div>
        </div>
      </StorySection>

      {/* 2. FOUNDER'S VISION (RESTORED) */}
      <StorySection id="about">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
             <div className="absolute -inset-4 bg-[#004a80]/10 rounded-[4rem] blur-2xl group-hover:bg-[#004a80]/20 transition-all"></div>
             <div className="relative aspect-[4/5] bg-slate-200 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
               <img 
                src={ASSETS.swamiji} 
                alt="Swamiji" 
                className="w-full h-full object-cover" 
                loading="lazy"
                decoding="async"
               />
               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                 <p className="text-white font-black text-2xl tracking-tight">Shree Swami Atmanand Saraswati</p>
                 <p className="text-white/60 font-bold uppercase text-xs tracking-widest">Great Philosopher & Reformer</p>
               </div>
             </div>
          </div>
          <div className="flex flex-col">
            <History className="text-[#880000] mb-8" size={48} />
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-none tracking-tighter">The Vision of 1924.</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              In the vast area of 80,000 sq.mt., our project brings modern efficiency to a historic vision of technical excellence.
            </p>
            <div className="border-l-8 border-[#004a80] pl-8 py-4 bg-slate-50 rounded-r-2xl">
              <blockquote className="text-3xl font-extrabold italic text-[#004a80] leading-snug">
                "In this era of industrialized and innovative society, the engineer’s role is not just to design or manufacture, but to serve as a visionary technocrat who lightens the lamp of humanity in the global firmament."
              </blockquote>
            </div>
          </div>
        </div>
      </StorySection>

      {/* 3. ARTIFACT GALLERY (FIXED RATIO & ROTATION) */}
      <StorySection id="canvases" className="bg-slate-50 border-y border-slate-200">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <span className="font-black uppercase text-xs tracking-[0.4em] text-[#880000] mb-4 block">Artifact Gallery</span>
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">The 6 GTU Canvases.</h2>
               <p className="text-slate-500 font-bold max-w-xl mx-auto">Digitized project artifacts presented in A3 Landscape (Horizontal) and A3 Portrait (Vertical) formats.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-12">
               {CANVAS_ARTIFACTS.map((canvas, i) => (
                 <div key={i} className={`group ${canvas.isVertical ? 'w-[calc(50%-24px)] md:w-[380px]' : 'w-full md:w-[650px]'} flex flex-col`}>
                    {/* Frame Container */}
                    <div 
                      onClick={() => setSelectedCanvas(canvas)}
                      className={`relative cursor-pointer bg-white border border-slate-200 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden ${canvas.isVertical ? 'aspect-[0.707/1]' : 'aspect-[1.414/1]'}`}
                    >
                       
                       {/* CANVAS IMAGE - Simplified rotation logic */}
                       <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden p-4">
                         <img 
                           src={canvas.img} 
                           alt={canvas.title} 
                           className={cn(
                             "w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.05]",
                             // Use standard contain, only scale if it's a tight rotation fit
                             (canvas.rotate === 90 || canvas.rotate === -90) && !canvas.isVertical && "scale-[1.35]"
                           )}
                           style={{ transform: `rotate(${canvas.rotate}deg)` }}
                           loading="lazy"
                           decoding="async"
                         />
                       </div>
                       
                       {/* Label Overlay */}
                       <div className="absolute top-4 left-6 flex items-center gap-3">
                          <div className="bg-[#004a80] text-white w-10 h-10 rounded flex items-center justify-center font-black shadow-lg">
                             {i + 1}
                          </div>
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded border border-slate-100 shadow-sm">
                             <p className="font-black text-slate-400 text-[8px] uppercase tracking-widest leading-none">A3 {canvas.isVertical ? 'Vertical' : 'Horizontal'}</p>
                          </div>
                       </div>

                       {/* Quick View Hover */}
                       <div className="absolute inset-0 bg-[#004a80]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 text-white">
                          <Maximize2 size={44} className="animate-pulse" />
                          <h4 className="text-2xl font-black uppercase tracking-tighter">{canvas.title}</h4>
                          <span className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-70 text-center">Click to Inspect Artifact</span>
                       </div>
                    </div>
                    
                    {/* Description Area */}
                    <div className="mt-6">
                       <div className="flex items-center gap-3 mb-2">
                         <canvas.icon size={20} className="text-[#880000]" />
                         <h4 className="text-xl font-black text-[#004a80] uppercase tracking-tighter">{canvas.title}</h4>
                       </div>
                       <p className="text-slate-500 font-bold text-xs uppercase tracking-widest opacity-80 leading-relaxed">{canvas.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </StorySection>

      {/* 4. STORYBOARDING SCENARIOS (RESTORED) */}
      <StorySection>
         <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter text-shadow-sm">The Storyboard.</h3>
               <p className="text-slate-500 font-bold mb-10 text-lg">Identifying user pain points from our Design Thinking field research.</p>

               <div className="space-y-6">
                  {[
                    { type: "SAD", icon: <Clock />, t: "Office Timing Friction", d: "Arriving for documents only to find the admin office closed during official hours." },
                    { type: "SAD", icon: <AlertTriangle />, t: "Infrastructure Panic", d: "Sudden fear of getting stuck in Building 15 lifts without layout knowledge." },
                    { type: "HAPPY", icon: <Utensils />, t: "The Canteen Hub", d: "A well-organized landmark identified as a key wayfinding lighthouse." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-[#004a80] transition-colors">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${item.type === 'SAD' ? 'bg-[#880000]/10 text-[#880000]' : 'bg-emerald-100 text-emerald-700'}`}>
                         {item.icon}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-black text-lg text-slate-900 uppercase tracking-tight">{item.t}</h5>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${item.type === 'SAD' ? 'bg-[#880000] text-white' : 'bg-emerald-600 text-white'}`}>{item.type}</span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium">{item.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <div className="rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100 p-8 transform rotate-2">
                  <div className="text-center mb-6">
                     <LucideMap size={48} className="mx-auto text-[#004a80] mb-4" />
                     <h4 className="text-2xl font-black text-[#004a80] uppercase tracking-tighter">Virtual Twin</h4>
                     <p className="text-slate-500 font-bold text-sm mt-2">A unified interface to integrate college information and real-time mapping.</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-inner border border-slate-200">
                     <ul className="space-y-4 font-bold text-sm text-slate-600">
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={20}/> Virtual Floor-wise Maps</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={20}/> Course & Fee Details</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={20}/> Integrated Facility Information</li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </StorySection>

      {/* 5. FUTURE SCOPE (RESTORED) */}
      <StorySection id="roadmap" className="bg-[#004a80] text-white">
         <div className="max-w-6xl mx-auto text-center">
            <span className="font-black uppercase text-xs tracking-[0.4em] text-white/50 mb-4 block">Future Roadmap</span>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter">Mapping the Entire Sankul.</h3>
            <p className="text-white/80 font-medium max-w-2xl mx-auto mb-16 text-lg">Expansion encompasses a comprehensive digital twin for all educational wings.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { name: 'SSASIT Engg.', active: true, icon: Cpu },
                 { name: 'Diploma College', active: false, icon: Construction },
                 { name: 'M.N.J High School', active: false, icon: BookOpen },
                 { name: 'Primary School', active: false, icon: Target },
               ].map((scope, idx) => (
                 <div key={idx} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${scope.active ? 'bg-white border-white text-[#004a80] shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-white/50'}`}>
                    <scope.icon size={32} />
                    <span className="font-black text-sm uppercase tracking-widest">{scope.name}</span>
                    {scope.active && <span className="bg-[#880000] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest">V2.0 LIVE</span>}
                 </div>
               ))}
            </div>
         </div>
      </StorySection>

      {/* FINAL CTA (RESTORED) */}
      <StorySection className="bg-white text-center">
        <div className="max-w-4xl text-center px-4 mx-auto">
          <h3 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none text-[#004a80]">Ready to Navigate?</h3>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">Experience the interactive Campus Prototype mapped directly from the Design Thinking Ideation canvas.</p>
          <button 
            onClick={handleExplore} 
            className="bg-[#880000] text-white px-12 py-5 rounded-xl font-black text-2xl shadow-xl shadow-[#880000]/30 hover:scale-105 transition-transform flex items-center justify-center gap-4 mx-auto"
          >
            <LucideMap size={32} /> LAUNCH THE MAP
          </button>
        </div>
      </StorySection>

      {/* Footer (RESTORED) */}
      <footer className="py-20 bg-white border-t border-slate-100">
         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-left">
           <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-4 mb-6">
               <img src={ASSETS.logo} className="w-16 h-16 object-contain" alt="SSASIT Logo" />
               <div>
                 <h2 className="text-2xl font-black text-[#004a80]">SSASIT DT PROJECT</h2>
                 <p className="text-xs font-bold text-[#880000] uppercase tracking-widest">Team 948876 • College Mapping System</p>
               </div>
             </div>
             <p className="text-slate-500 max-w-md font-medium leading-relaxed">
               Design Thinking initiative under Gujarat Technological University. Mapping the way for technical excellence in Surat.
             </p>
           </div>
           <div className="space-y-6">
             <div className="flex items-center gap-4 group">
               <div className="w-12 h-12 bg-[#004a80]/10 rounded-xl flex items-center justify-center text-[#004a80] group-hover:bg-[#004a80] group-hover:text-white transition-colors"><Phone size={20} /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Contact</p>
                 <p className="font-bold text-slate-800">+91-261-2573552/53</p>
               </div>
             </div>
             <div className="flex items-center gap-4 group">
               <div className="w-12 h-12 bg-[#880000]/10 rounded-xl flex items-center justify-center text-[#880000] group-hover:bg-[#880000] group-hover:text-white transition-colors"><LucideMap size={20} /></div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Campus</p>
                 <p className="font-bold text-slate-800 text-sm">Varachha Road, Surat – 395006</p>
               </div>
             </div>
           </div>
         </div>
      </footer>

      {/* Artifact Inspector Modal */}
      <AnimatePresence>
        {selectedCanvas && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 bg-slate-950/95 backdrop-blur-md"
            onClick={() => setSelectedCanvas(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-7xl max-h-full flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Info */}
              <div className="w-full flex items-center justify-between text-white mb-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <selectedCanvas.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight">{selectedCanvas.title}</h2>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{selectedCanvas.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCanvas(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Main Image Container */}
              <div className="relative w-full flex-1 min-h-0 bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden p-4 sm:p-8 flex items-center justify-center">
                 <img 
                    src={selectedCanvas.img} 
                    alt={selectedCanvas.title}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                    style={{ 
                      transform: `rotate(${selectedCanvas.rotate}deg)`,
                      // Compensate scale for rotation if needed in modal too
                      width: (selectedCanvas.rotate === 90 || selectedCanvas.rotate === -90) ? 'auto' : '100%',
                      height: (selectedCanvas.rotate === 90 || selectedCanvas.rotate === -90) ? '100%' : 'auto'
                    }}
                 />
              </div>

              {/* Metadata Footer */}
              <div className="flex items-center gap-6 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2"><Maximize2 size={14}/> Resolution: HQ Print</div>
                <div className="flex items-center gap-2"><Target size={14}/> Format: A3 {selectedCanvas.isVertical ? 'Portrait' : 'Landscape'}</div>
                <div className="flex items-center gap-2"><RotateCw size={14}/> Rotation: {selectedCanvas.rotate}°</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
