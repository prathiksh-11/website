import { useEffect } from 'react';
import { MapPin, Phone, Clock, ChevronLeft, Dumbbell, Activity, Utensils, ShowerHead, Lock, ThermometerSun, Map, Users } from 'lucide-react';

interface BranchDetailProps {
  branchId: string;
  onBack: () => void;
}

const branchData: Record<string, {
  name: string;
  location: string;
  address: string;
  phone: string;
  tagline: string;
  hours: { day: string; time: string }[];
  team: { name: string; role: string; image: string }[];
  programs: { category: string; items: string[] }[];
  facilities: { name: string; icon: any }[];
  gallery: string[];
  mapUrl: string;
}> = {
  'arekere': {
    name: 'GAME ON FITNESS AREKERE',
    location: 'Arekere, Bengaluru',
    address: 'Above Poorvika Mobiles, near Sai Baba temple, Arekere, Bengaluru - 560076',
    phone: '+91 8861737392',
    tagline: "IT'S ALL ABOUT WHAT YOU CAN ACHIVE EMPOWER YOURSELF TO MAKE THE CHANGE YOU NEED TO MAKE",
    hours: [
      { day: 'Monday', time: '5:00 AM – 11:00 PM' },
      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },
      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },
      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },
      { day: 'Friday', time: '5:00 AM – 11:00 PM' },
      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },
      { day: 'Sunday', time: '7:00 AM – 09:00 PM' },
    ],
    team: [
      { name: 'Rajesh Kumar', role: 'Head Trainer', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Priya Sharma', role: 'Yoga Instructor', image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Amit Patel', role: 'Strength Coach', image: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Sneha Reddy', role: 'Zumba Instructor', image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
    ],
    programs: [
      {
        category: 'Fitness Gym',
        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training', 'Kettel Bell', 'Battel Rope'],
      },
      {
        category: 'Group Classes',
        items: ['Zumba', 'Pilates', 'Latin Bolly', 'HIIT', 'Dance Fit', 'Yoga', 'Power Yoga', 'Bolly-Beats', 'Tae Bo', 'Tabata', 'Bootcamp', 'Crossfit', 'Circuit Training', 'ABT', 'Dance Fitness'],
      },
    ],
    facilities: [
      { name: 'BMI Check Up', icon: Activity },
      { name: 'Workout Plan', icon: Dumbbell },
      { name: 'Diet Plan', icon: Utensils },
      { name: 'Showers', icon: ShowerHead },
      { name: 'Lockers', icon: Lock },
      { name: 'Steam', icon: ThermometerSun },
    ],
    gallery: [
      'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1534438/pexels-photo-1534438.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3253499/pexels-photo-3253499.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    ],
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.59!3d12.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzEyLjAiTiA3N8KwMzUnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890',
  },
  'wilson-garden': {
    name: 'GAME ON FITNESS WILSON GARDEN',
    location: 'Wilson Garden, Bengaluru',
    address: 'Opp to Traffic Police Station, Vinayaka Nagar, Wilson Garden, Bengaluru - 560027',
    phone: '+91 9663995409',
    tagline: 'LET THE GAINS BEGIN!',
    hours: [
      { day: 'Monday', time: '5:00 AM – 11:00 PM' },
      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },
      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },
      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },
      { day: 'Friday', time: '5:00 AM – 11:00 PM' },
      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },
      { day: 'Sunday', time: '7:00 AM – 09:00 PM' },
    ],
    team: [
      { name: 'Rajesh Kumar', role: 'Head Trainer', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Priya Sharma', role: 'Yoga Instructor', image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Amit Patel', role: 'Strength Coach', image: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
      { name: 'Sneha Reddy', role: 'Zumba Instructor', image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop' },
    ],
    programs: [
      {
        category: 'Fitness Gym',
        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength Training', 'Viper Training', 'Kettle Bell', 'Battle Rope'],
      },
    ],
    facilities: [
      { name: 'BMI Check Up', icon: Activity },
      { name: 'Workout Plan', icon: Dumbbell },
      { name: 'Diet Plan', icon: Utensils },
      { name: 'Showers', icon: ShowerHead },
      { name: 'Lockers', icon: Lock },
      { name: 'Steam', icon: ThermometerSun },
    ],
    gallery: [
      'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1534438/pexels-photo-1534438.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3253499/pexels-photo-3253499.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    ],
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.58!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU3JzAwLjAiTiA3N8KwMzQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',
  },
};

export default function BranchDetail({ branchId, onBack }: BranchDetailProps) {
  const branch = branchData[branchId] || branchData['wilson-garden']; 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!branch) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Branch Not Found</h2>
          <button onClick={onBack} className="bg-orange-500 text-black font-bold px-6 py-3 rounded-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Hero Header Section */}
      <div className="relative h-[65vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={branch.gallery[0]}
          alt={branch.name}
          className="w-full h-full object-cover scale-105 filter brightness-[0.85] transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        
        {/* Absolute Floating Navigation Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 md:left-12 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-white/20 text-white transition-all group z-20 shadow-xl"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Hero Meta Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-orange-500 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-md mb-4 shadow-lg shadow-orange-500/20">
              Premium Facility
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase max-w-4xl">
              {branch.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-gray-300">
                <MapPin size={18} className="text-orange-500 shrink-0" />
                <span className="text-sm font-medium">{branch.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <a href={`tel:${branch.phone}`} className="text-sm font-medium hover:text-orange-400 transition-colors">
                  {branch.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Call to Action Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 -mt-8 relative z-20 mb-16">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl grid md:grid-cols-2 gap-4">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold py-4 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 transform hover:-translate-y-0.5 active:translate-y-0">
            Book Your Free Trial Now
          </button>
          <a
            href={`tel:${branch.phone}`}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Phone size={16} className="text-orange-500" />
            Call Front Desk
          </a>
        </div>
      </div>

      {/* Main Structural Layout Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-24">
        
        {/* Dynamic Typography Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-4xl block text-orange-500/30 font-serif mb-2">“</span>
          <p className="text-lg md:text-2xl font-semibold text-gray-100 tracking-wide italic leading-relaxed">
            {branch.tagline}
          </p>
          <div className="w-12 h-[2px] bg-orange-500/50 mx-auto mt-6" />
        </div>

        {/* Dynamic 12-Column Modern Grid Dashboard Template layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column Section Pane (Occupies 7 Columns out of 12) */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Our Training & Custom Programs Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase">Our Training</h2>
              </div>

              {branch.programs.map((program, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <h3 className="text-sm font-bold tracking-widest text-orange-400 uppercase mb-4 flex items-center gap-2">
                    <Dumbbell size={14} />
                    {program.category}
                  </h3>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                    <div className="space-y-2.5">
                      {program.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 group-hover:scale-125 transition-transform"></div>
                          <p className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Structured Fluid Grid Photo Gallery Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase">Gallery</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {branch.gallery.map((imgUrl, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-xl border border-white/5 bg-white/5 group relative">
                    <img
                      src={imgUrl}
                      alt="Gym Interior"
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-110 group-hover:brightness-100 transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Our Team Roster Component */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase">Our Team</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {branch.team.map((member, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-colors">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-14 h-14 rounded-lg object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300 shadow-md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">{member.name}</h4>
                      <p className="text-xs text-orange-400 font-medium mt-0.5">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Sticky Panel Pane (Occupies 5 Columns out of 12) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            
            {/* Hours Operations Widget Panel */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-2.5 text-white mb-5 pb-3 border-b border-white/5">
                <Clock size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase">Operating Hours</h3>
              </div>
              <div className="space-y-3">
                {branch.hours.map((h, i) => {
                  const isSunday = h.day === "Sunday";
                  return (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className={`font-medium ${isSunday ? 'text-gray-500' : 'text-gray-400'}`}>{h.day}</span>
                      <span className={`font-mono tracking-tight ${isSunday ? 'text-orange-500/80 font-medium' : 'text-gray-300'}`}>{h.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included Club Premium Facilities Layout */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-2.5 text-white mb-5 pb-3 border-b border-white/5">
                <Users size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase">Club Facilities</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {branch.facilities.map((facility, i) => {
                  const IconComponent = facility.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                        <IconComponent size={14} />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 tracking-wide">{facility.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Physical Location Map Mock Component Container */}
            <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-2.5 text-white mb-4 pb-3 border-b border-white/5">
                <Map size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase">Location Details</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {branch.address}
              </p>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                <iframe
                  src={branch.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter grayscale-[0.3] contrast-110"
                  title="Branch Location Map"
                ></iframe>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 t font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Map size={14} />
                Get Directions
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}