export interface CampusBuilding {
  id: number;
  name: string;
  color: string;
  textColor?: string;
}

export const campusBuildings: CampusBuilding[] = [
  { id: 1, name: "Shree Tapi Brahmcharyashram Sabha Sanchalit Balbhawan", color: "bg-[#1e3a8a]", textColor: "text-white" },
  { id: 2, name: "Surat Sahkari Spinning Mills Primary School", color: "bg-[#1e3a8a]", textColor: "text-white" },
  { id: 3, name: "Dr. K.S. Thakar Girls Primary School", color: "bg-[#f43f5e]", textColor: "text-white" },
  { id: 4, name: "Surat Diamond Association Secondary & Higher Secondary School", color: "bg-[#e11d48]", textColor: "text-white" },
  { id: 5, name: "Tapi School", color: "bg-[#ea580c]", textColor: "text-white" },
  { id: 6, name: "M.N.J. Patel Secondary & Higher Secondary School", color: "bg-[#c2410c]", textColor: "text-white" },
  { id: 7, name: "Storage Building", color: "bg-[#475569]", textColor: "text-white" },
  { id: 8, name: "Shree J.D. Gabani Commerce College & Shree Swami Atmanand Saraswati College of Management", color: "bg-[#facc15]", textColor: "text-slate-900" },
  { id: 9, name: "Shree J.B. Dharukawala Mahila Arts College", color: "bg-[#f59e0b]", textColor: "text-white" },
  { id: 10, name: "Atmanand Saraswati Science College (ASSC)", color: "bg-[#0ea5e9]", textColor: "text-white" },
  { id: 11, name: "Multi Purpose Building & STBS Material Testing Cell (MTC)", color: "bg-[#1e40af]", textColor: "text-white" },
  { id: 12, name: "Tapi Diploma Engineering College (TDEC) & Workshop", color: "bg-[#78350f]", textColor: "text-white" },
  { id: 13, name: "Workshop Tapi Diploma Engineering College Auditorium", color: "bg-[#7e22ce]", textColor: "text-white" },
  { id: 14, name: "Canteen", color: "bg-[#facc15]", textColor: "text-slate-900" },
  { id: 15, name: "Shree Swami Atmanand Saraswati Institute of Technology (SSASIT)", color: "bg-[#dc2626]", textColor: "text-white" },
];
