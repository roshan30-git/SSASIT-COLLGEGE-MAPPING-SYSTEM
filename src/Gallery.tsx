import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Map as MapIcon, Globe, Maximize2 } from 'lucide-react';

const galleryItems = [
  {
    title: "Outside Schematic",
    description: "Enhanced digital schematic of the campus layout",
    image: "https://i.postimg.cc/NMD2ZdLw/Chat-GPT-Image-May-2-2026-11-55-58-PM.png",
    type: "Digital"
  },
  {
    title: "Original Signage",
    description: "Physical map as seen on campus grounds",
    image: "https://i.postimg.cc/J0hH8jHS/IMG-20260501-160533-jpg.jpg",
    type: "Photo"
  },
  {
    title: "Floor 1: Engineering Hub",
    description: "Engineering & Mechanical department layout",
    type: "Layout",
    color: "bg-blue-50"
  },
  {
    title: "Floor 2: CS & Environment",
    description: "Computer Science and Environmental Science labs",
    type: "Layout",
    color: "bg-purple-50"
  },
  {
    title: "Floor 4: Advanced Research",
    description: "Project rooms and high-tech labs",
    type: "Layout",
    color: "bg-amber-50"
  }
];

export default function Gallery() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 pb-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <ImageIcon className="w-10 h-10 text-blue-600" />
          Canvas Gallery
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl">
          A collection of digital schematics, architectural layouts, and physical signage artifacts from the campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className={`aspect-[4/3] w-full ${item.color || 'bg-slate-100'} relative overflow-hidden`}>
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapIcon className="w-16 h-16 text-slate-300" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                  {item.type}
                </span>
              </div>
              
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                <button className="bg-white text-slate-900 p-4 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 font-bold flex items-center gap-3">
                  <Maximize2 size={18} /> View Large
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
