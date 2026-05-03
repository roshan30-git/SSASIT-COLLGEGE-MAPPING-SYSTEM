import { MapPin, Search, Compass, Clock, Info, Navigation2, ChevronUp } from "lucide-react";

export type FloorName = "Ground" | "1st Floor" | "2nd Floor" | "3rd Floor" | "4th Floor";

export interface POI {
  id: string;
  name: string;
  floor: FloorName;
  type: "classroom" | "lab" | "office" | "facility" | "entrance" | "bathroom" | "library" | "stairs" | "lift";
  labType?: "computer" | "mech" | "be" | "bee" | "chemistry" | "it-ai";
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  description?: string;
  timing?: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  officeId: string;
}

export const floors: FloorName[] = ["Ground", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];

// Center of SSASIT Campus
export const CAMPUS_CENTER: [number, number] = [21.222985, 72.878831];

export const pois: POI[] = [
  // Ground Floor (New Schematic)
  { id: "admin-001", name: "Trust Office", floor: "Ground", type: "office", lat: 21.2231, lng: 72.8789, description: "Office of the building trust." },
  { id: "admin-002", name: "Principal Office", floor: "Ground", type: "office", lat: 21.2231, lng: 72.8789, description: "Office of the Principal of SSASIT." },
  { id: "admin-003", name: "Pantry", floor: "Ground", type: "facility", lat: 21.2231, lng: 72.8789 },
  { id: "admin-004", name: "Conference Room", floor: "Ground", type: "facility", lat: 21.2231, lng: 72.8789, description: "Primary conference hall for administrative meetings." },
  { id: "admin-005", name: "Administration Office", floor: "Ground", type: "office", lat: 21.2231, lng: 72.8789, description: "General administration and student services." },
  { id: "admin-006", name: "EEE, M/C & Project Lab", floor: "Ground", type: "lab", lat: 21.2231, lng: 72.8789 },
  { id: "admin-007", name: "EME Lab", floor: "Ground", type: "lab", lat: 21.2231, lng: 72.8789 },
  { id: "admin-008", name: "Workshop", floor: "Ground", type: "lab", lat: 21.2231, lng: 72.8789, description: "Heavy engineering workshop." },
  { id: "admin-009", name: "Fluid Mechanics & Fluid Power Lab", floor: "Ground", type: "lab", lat: 21.2231, lng: 72.8789 },
  { id: "admin-010", name: "Transportation & CT Lab", floor: "Ground", type: "lab", lat: 21.2231, lng: 72.8789 },
  { id: "admin-011", name: "Security", floor: "Ground", type: "facility", lat: 21.2231, lng: 72.8789 },
  { id: "admin-012", name: "Stationery", floor: "Ground", type: "facility", lat: 21.2231, lng: 72.8789 },

  // Legacy Ground Floor
  { id: "maingate", name: "Campus Entrance", floor: "Ground", type: "entrance", lat: 21.222985, lng: 72.878831, x: 400, y: 780, width: 200, height: 80, description: "Main entry to the campus." },
  { id: "ssasit_marker", name: "SSASIT", floor: "Ground", type: "facility", lat: 21.2230, lng: 72.8790, description: "Shree Swami Atmanand Saraswati Institute of Technology" },
  { id: "admin", name: "Admin Office", floor: "Ground", type: "office", lat: 21.2231, lng: 72.8789, x: 100, y: 350, width: 300, height: 250, description: "Administrative inquiries, fees, and forms.", timing: "10:00 AM - 4:00 PM" },
  { id: "reception", name: "Reception", floor: "Ground", type: "office", lat: 21.2231, lng: 72.8789, x: 100, y: 600, width: 300, height: 150, description: "Visitor check-in and general inquiries." },
  { id: "canteen", name: "Canteen", floor: "Ground", type: "facility", lat: 21.2228, lng: 72.8787, x: 600, y: 550, width: 300, height: 200, description: "Food & Beverages. Peak hours: 12PM - 2PM." },
  { id: "lab_mech", name: "Mech Lab", floor: "Ground", type: "lab", labType: "mech", lat: 21.2232, lng: 72.8791, x: 100, y: 100, width: 400, height: 250, description: "Mechanical Engineering Workshop." },
  { id: "lab_be", name: "BE Lab", floor: "Ground", type: "lab", labType: "be", lat: 21.2230, lng: 72.8786, x: 500, y: 100, width: 400, height: 250 },
  { id: "bath_g", name: "Washroom", floor: "Ground", type: "bathroom", lat: 21.2228, lng: 72.8787, x: 800, y: 350, width: 100, height: 200 },
  { id: "stairs_1", name: "Stairs / Elevator", floor: "Ground", type: "facility", lat: 21.2228, lng: 72.8787, x: 400, y: 350, width: 150, height: 150 },

  // 1st Floor
  { id: "101", name: "Seminar Room", floor: "1st Floor", type: "classroom", lat: 21.2231, lng: 72.8789, description: "Main seminar hall for events." },
  { id: "102", name: "Drawing Hall (Mechanical)", floor: "1st Floor", type: "classroom", lat: 21.2231, lng: 72.8790, description: "Drawing hall for mechanical engineering." },
  { id: "103", name: "H.O.D. Office", floor: "1st Floor", type: "office", lat: 21.2230, lng: 72.8788 },
  { id: "104", name: "Classroom 104", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "105", name: "Classroom 105", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "106", name: "Classroom 106", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "107", name: "Classroom 107", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "108", name: "Refrig. A.C. Lab", floor: "1st Floor", type: "lab", lat: 21.2228, lng: 72.8787 },
  { id: "109", name: "IT-Programming Lab", floor: "1st Floor", type: "lab", lat: 21.2228, lng: 72.8787 },
  { id: "110a", name: "Central Library", floor: "1st Floor", type: "library", lat: 21.2230, lng: 72.8788, description: "Quiet zone. Student ID required.", timing: "8:00 AM - 6:00 PM" },
  { id: "110b", name: "Reading Room", floor: "1st Floor", type: "library", lat: 21.2230, lng: 72.8788 },
  { id: "111", name: "Classroom 111", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "112", name: "Classroom 112", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "113", name: "Classroom 113", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "114", name: "Classroom 114", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "115", name: "H.O.D. Office", floor: "1st Floor", type: "office", lat: 21.2228, lng: 72.8787 },
  { id: "116", name: "IT-Hardware Lab", floor: "1st Floor", type: "lab", lat: 21.2228, lng: 72.8787 },
  { id: "117", name: "Classroom 117", floor: "1st Floor", type: "classroom", lat: 21.2228, lng: 72.8787 },
  { id: "bath_1", name: "Washroom", floor: "1st Floor", type: "bathroom", lat: 21.2228, lng: 72.8787 },
  { id: "lift_1L", name: "Lift Left", floor: "1st Floor", type: "lift", lat: 21.2228, lng: 72.8787 },
  { id: "lift_1R", name: "Lift Right", floor: "1st Floor", type: "lift", lat: 21.2228, lng: 72.8787 },

  // 2nd Floor
  { id: "lab_comp1", name: "Computer Lab 1", floor: "2nd Floor", type: "lab", labType: "computer", lat: 21.2231, lng: 72.8789, x: 100, y: 100, width: 350, height: 250 },
  { id: "lab_comp2", name: "Computer Lab 2", floor: "2nd Floor", type: "lab", labType: "computer", lat: 21.2231, lng: 72.8790, x: 500, y: 100, width: 400, height: 250 },
  { id: "class201", name: "Classroom 201", floor: "2nd Floor", type: "classroom", lat: 21.2228, lng: 72.8787, x: 100, y: 400, width: 250, height: 200 },
  { id: "class202", name: "Classroom 202", floor: "2nd Floor", type: "classroom", lat: 21.2228, lng: 72.8787, x: 400, y: 400, width: 250, height: 200 },
  { id: "hod", name: "HOD Office", floor: "2nd Floor", type: "office", lat: 21.2228, lng: 72.8787, x: 100, y: 650, width: 300, height: 150, timing: "11:00 AM - 3:00 PM" },
  { id: "bath_2", name: "Washroom", floor: "2nd Floor", type: "bathroom", lat: 21.2229, lng: 72.8788, x: 700, y: 400, width: 150, height: 150 },

  // 3rd Floor
  { id: "auditorium", name: "Main Auditorium", floor: "3rd Floor", type: "facility", lat: 21.2231, lng: 72.8789, x: 100, y: 100, width: 800, height: 350 },
  { id: "lab_bee", name: "BEE Lab", floor: "3rd Floor", type: "lab", labType: "bee", lat: 21.2228, lng: 72.8787, x: 100, y: 500, width: 350, height: 250 },
  { id: "seminar", name: "Seminar Hall", floor: "3rd Floor", type: "facility", lat: 21.2231, lng: 72.8790, x: 500, y: 500, width: 250, height: 250 },
  { id: "bath_3", name: "Washroom", floor: "3rd Floor", type: "bathroom", lat: 21.2228, lng: 72.8787, x: 800, y: 500, width: 100, height: 200 },

  // 4th Floor
  { id: "401", name: "IT-IOT / AI & Data Science Lab", floor: "4th Floor", type: "lab", labType: "it-ai", lat: 21.2231, lng: 72.8789, x: 20, y: 460, width: 180, height: 300 },
  { id: "402", name: "Classroom 402", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 20, y: 210, width: 180, height: 240 },
  { id: "403", name: "Classroom 403", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 20, y: 20, width: 180, height: 180 },
  { id: "404", name: "H.O.D Office E.C.", floor: "4th Floor", type: "office", lat: 21.2231, lng: 72.8789, x: 340, y: 145, width: 110, height: 85 },
  { id: "405", name: "Room 405", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 340, y: 20, width: 130, height: 110 },
  { id: "406", name: "Room 406", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 490, y: 20, width: 140, height: 210 },
  { id: "407", name: "Room 407", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 650, y: 20, width: 110, height: 110 },
  { id: "408", name: "Room 408", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 650, y: 145, width: 90, height: 85 },
  { id: "409", name: "Room 409", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 850, y: 20, width: 210, height: 210 },
  { id: "410", name: "Room 410", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 850, y: 320, width: 210, height: 410 },
  { id: "411", name: "Room 411", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 850, y: 770, width: 230, height: 220 },
  { id: "412", name: "Room 412", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 740, y: 770, width: 110, height: 120 },
  { id: "413", name: "Room 413", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 610, y: 930, width: 100, height: 60 },
  { id: "414", name: "Room 414", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 480, y: 900, width: 100, height: 90 },
  { id: "415", name: "Room 415", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 340, y: 870, width: 110, height: 120 },
  { id: "416", name: "Room 416", floor: "4th Floor", type: "office", lat: 21.2231, lng: 72.8789, x: 340, y: 770, width: 110, height: 85 },
  { id: "417", name: "Room 417", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 20, y: 910, width: 180, height: 80 },
  { id: "418", name: "Room 418", floor: "4th Floor", type: "classroom", lat: 21.2231, lng: 72.8789, x: 20, y: 770, width: 120, height: 130 },
  { id: "toilet4", name: "Toilet", floor: "4th Floor", type: "bathroom", lat: 21.2231, lng: 72.8789, x: 1080, y: 20, width: 80, height: 210 },
  { id: "lift4L", name: "Lift Left", floor: "4th Floor", type: "lift", lat: 21.2231, lng: 72.8789, x: 250, y: 145, width: 75, height: 85 },
  { id: "lift4R", name: "Lift Right", floor: "4th Floor", type: "lift", lat: 21.2231, lng: 72.8789, x: 755, y: 145, width: 75, height: 85 },
  { id: "stairs4T", name: "Stairs Top", floor: "4th Floor", type: "stairs", lat: 21.2231, lng: 72.8789, x: 415, y: 330, width: 110, height: 90 },
  { id: "stairs4B", name: "Stairs Bottom", floor: "4th Floor", type: "stairs", lat: 21.2231, lng: 72.8789, x: 635, y: 540, width: 110, height: 90 }
];

export const facultyList: Faculty[] = [
  { id: "f1", name: "Prof. A. Sharma", department: "Computer", officeId: "hod" },
  { id: "f2", name: "Prof. R. Verma", department: "Mechanical", officeId: "staffA" },
  { id: "f3", name: "Prof. K. Patel", department: "Electrical", officeId: "staffB" },
  { id: "f4", name: "Dr. N. Desai", department: "Civil", officeId: "admin" }
];
