import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock, ChevronLeft, Dumbbell, Activity, Utensils, ShowerHead, Lock, ThermometerSun, Map, Users, } from 'lucide-react';
import { IMAGES } from './image_constant';

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

    tagline: 'IT\'S ALL ABOUT WHAT YOU CAN ACHIVE EMPOWER YOURSELF TO MAKE THE CHANGE YOU NEED TO MAKE',

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

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.Arekere.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.Arekere.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.Arekere.trainer3 },

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

      IMAGES.Arekere.img1,

      IMAGES.Arekere.img2,

      IMAGES.Arekere.img4,

      IMAGES.Arekere.img5,

      IMAGES.Arekere.img7,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.59!3d12.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzEyLjAiTiA3N8KwMzUnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'vijaya-bank-layout': {

    name: 'GAME ON FITNESS VIJAYA BANK LAYOUT',

    location: 'Vijaya Bank Layout, Bengaluru',

    address: '3rd floor, Vijaya Bank Layout circle, near Indian Oil petrol bunk, Bilekahalli, Bengaluru - 560076',

    phone: '+91 9035279516',

    tagline: 'Game On Fitness is dedicated to covering the full fitness landscape, regularly introducing fans to new trends in training, nutrition, gear and technology',

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

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.VijayaBankLayout.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.VijayaBankLayout.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.VijayaBankLayout.trainer3 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training'],

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

      IMAGES.VijayaBankLayout.img5,

      IMAGES.VijayaBankLayout.img6,

      IMAGES.VijayaBankLayout.img7,

      IMAGES.VijayaBankLayout.img9,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.60!3d12.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzQ4LjAiTiA3N8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'btm-layout-1': {

    name: 'GAME ON FITNESS BTM LAYOUT - 1',

    location: 'BTM Layout, Bengaluru',

    address: 'Opp to Canara Bank, 18th Main Road BTM 2nd Stage, Bengaluru - 560076',

    phone: '+91 8722299457',

    tagline: 'WE TRAIN YOU SMARTER, NOT HARDER!',

    hours: [

      { day: 'Monday', time: '5:30 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:30 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:30 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:30 AM – 11:00 PM' },

      { day: 'Friday', time: '5:30 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:30 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.BTM1.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.BTM1.trainer2 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Kettel Bell', 'Battel Rope'],

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

      IMAGES.BTM1.img1,

      IMAGES.BTM1.img3,

      IMAGES.BTM1.img4,

      IMAGES.BTM1.img6,

      IMAGES.BTM1.img7,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.61!3d12.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUzJzI0LjAiTiA3N8KwMzYnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'btm-layout-2': {

    name: 'GAME ON FITNESS BTM LAYOUT - 2',

    location: 'BTM Layout, Bengaluru',

    address: 'Above Indian Bank, 7th Main Road BTM 2nd Stage, Bengaluru - 560076',

    phone: '+91 8951028839',

    tagline: 'DAY 1 OR 1 DAY YOU DECIDE!',

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

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.BTM2.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.BTM2.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.BTM2.trainer3 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training', 'Kettel Bell', 'Battel Rope'],

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

      IMAGES.BTM2.img3,

      IMAGES.BTM2.img4,

      IMAGES.BTM2.img6,

      IMAGES.BTM2.img7,

      IMAGES.BTM2.img8,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.62!3d12.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

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

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.WilsonGarden.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.WilsonGarden.trainer3 },

      { name: 'Trainer 4', role: 'Head Trainer', image: IMAGES.WilsonGarden.trainer4 },

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

    gallery: [],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.58!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU3JzAwLjAiTiA3N8KwMzQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'jp-nagar': {

    name: 'GAME ON FITNESS JP NAGAR',

    location: 'JP Nagar, Bengaluru',

    address: 'Above Poorvika Mobiles, Opp to RBI Layout Bus Stop, JP Nagar 7th phase, Bengaluru - 560078',

    phone: '+91 9980615580',

    tagline: 'IT\'S NEVER TOO LATE AND YOU ARE NEVER TOO OLD TO BECOME BETTER!',

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

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.JPNagar.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.JPNagar.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.JPNagar.trainer3 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training', 'Kettle Bell', 'Battle Rope'],

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

      IMAGES.JPNagar.img3,

      IMAGES.JPNagar.img4,

      IMAGES.JPNagar.img5,

      IMAGES.JPNagar.img6,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.57!3d12.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUxJzM2LjAiTiA3N8KwMzQnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'akshayanagar': {

    name: 'GAME ON FITNESS AKSHAYANAGAR',

    location: 'Akshayanagar, Bengaluru',

    address: 'Above Reliance Smart, near DLF, Akshayanagar, Bengaluru - 560068',

    phone: '+91 8431198114',

    tagline: 'EMPOWER YOURSELF TO MAKE THE CHANGE YOU NEED TO MAKE',

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

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.Akshayanagar.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.Akshayanagar.trainer2 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength Training', 'Viper Training', 'Kettle Bell', 'Battle Rope'],

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

      IMAGES.Akshayanagar.img1,

      IMAGES.Akshayanagar.img11,

      IMAGES.Akshayanagar.img4,

      IMAGES.Akshayanagar.img8,

      IMAGES.Akshayanagar.img9,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.63!3d12.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUxJzAwLjAiTiA3N8KwMzcnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

  'sarjapur-road': {

    name: 'GAME ON FITNESS SARJAPUR ROAD',

    location: 'Sarjapur Road, Bengaluru',

    address: '3rd floor above Baby Store, opp to Divyasree Elan, next to More Mega Store, Bellandur gate, Sarjapur Main Road, Bengaluru - 560035',

    phone: '+91 8618086458',

    tagline: 'YOUR FITNESS JOURNEY STARTS HERE',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '7:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Trainer 1', role: 'Head Trainer', image: IMAGES.SarjapurRoad.trainer1 },

      { name: 'Trainer 2', role: 'Fitness Instructor', image: IMAGES.SarjapurRoad.trainer2 },

      { name: 'Trainer 3', role: 'Strength Coach', image: IMAGES.SarjapurRoad.trainer3 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Kettel Bell', 'Battel Rope'],

      },

      {

        category: 'Group Classes',

        items: ['Zumba', 'Yoga', 'Power Yoga', 'Bolly-Dance', 'Tae Bo', 'Tabata', 'Body Combat', 'CrossFit', 'Circuit Training', 'ABT', 'Dance Fitness'],

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

      IMAGES.SarjapurRoad.img1,

      IMAGES.SarjapurRoad.img4,

      IMAGES.SarjapurRoad.img5,

      IMAGES.SarjapurRoad.img7,

      IMAGES.SarjapurRoad.img8,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.66!3d12.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzknMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

  },

};

export default function BranchDetail({ branchId, onBack }: BranchDetailProps) {
  const branch = branchData[branchId];
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState(0);
  const [currentGallery, setCurrentGallery] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsVisible(true);
  }, []);

  // Auto-rotate trainers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrainer((prev) => (prev + 1) % branch.team.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [branch.team.length]);

  // Auto-rotate gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGallery((prev) => (prev + 1) % branch.gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [branch.gallery.length]);

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
      <div className={`relative h-[65vh] min-h-[480px] w-full overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute inset-0 transition-transform duration-[20s] ease-linear ${isVisible ? 'scale-100' : 'scale-110'}`}>
          <img
            src={branch.gallery[0] || IMAGES.Arekere.img1}
            alt={branch.name}
            className="w-full h-full object-cover filter brightness-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        
        {/* Absolute Floating Navigation Back Button */}
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 md:left-12 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-white/20 text-white transition-all group z-20 shadow-xl hover:scale-110 hover:rotate-12 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        {/* Hero Meta Information Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block px-3 py-1 bg-orange-500 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-md mb-4 shadow-lg shadow-orange-500/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Premium Facility
            </span>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase max-w-4xl transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {branch.name}
            </h1>
        
            <div className={`flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group">
                <MapPin size={18} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{branch.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors group">
                <Phone size={18} className="text-orange-500 shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                <a href={`tel:${branch.phone}`} className="text-sm font-medium hover:text-orange-400 transition-colors">
                  {branch.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Call to Action Bar */}
      <div className={`max-w-7xl mx-auto px-4 md:px-12 lg:px-16 -mt-8 relative z-20 mb-16 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
        <div className="text-center max-w-3xl mx-auto mb-20 group">
          <span className="text-4xl block text-orange-500/30 font-serif mb-2 group-hover:text-orange-500/50 transition-colors duration-500 animate-pulse">"</span>
          <p className="text-lg md:text-2xl font-semibold text-gray-100 tracking-wide italic leading-relaxed group-hover:text-white transition-colors duration-500">
            {branch.tagline}
          </p>
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-6 group-hover:w-24 transition-all duration-700" />
        </div>
      
        {/* Dynamic 12-Column Modern Grid Dashboard Template layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column Section Pane (Occupies 7 Columns out of 12) */}
          <div className="lg:col-span-7 space-y-12">
          
            {/* Our Training & Custom Programs Section - Compact */}
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full group-hover:h-8 transition-all duration-300" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase group-hover:text-orange-400 transition-colors duration-300">Our Training</h2>
              </div>
          
              <div className="space-y-4">
                {branch.programs.map((program, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1">
                    <h3 className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-3 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <Dumbbell size={14} className="group-hover:rotate-12 transition-transform duration-300" />
                      {program.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {program.items.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-300 font-medium hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-300 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column Sticky Panel Pane (Occupies 5 Columns out of 12) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">

            {/* Hours Operations Widget Panel */}
            <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
              <div className="flex items-center gap-2.5 text-white mb-5 pb-3 border-b border-white/5">
                <Clock size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase">Operating Hours</h3>
              </div>
              <div className="space-y-3">
                {branch.hours.map((h, i) => {
                  const isSunday = h.day === "Sunday";
                  return (
                    <div key={i} className="flex justify-between items-center text-xs group">
                      <span className={`font-medium ${isSunday ? 'text-gray-500' : 'text-gray-400 group-hover:text-white'} transition-colors`}>{h.day}</span>
                      <span className={`font-mono tracking-tight ${isSunday ? 'text-orange-500/80 font-medium' : 'text-gray-300 group-hover:text-orange-400'} transition-colors`}>{h.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included Club Premium Facilities Layout */}
            <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
              <div className="flex items-center gap-2.5 text-white mb-5 pb-3 border-b border-white/5">
                <Users size={16} className="text-orange-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase">Club Facilities</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {branch.facilities.map((facility, i) => {
                  const IconComponent = facility.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-orange-500/5 hover:border-orange-500/20 transition-all duration-200 group">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
                        <IconComponent size={14} />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 tracking-wide group-hover:text-white transition-colors">{facility.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Gallery - FULL SCREEN WIDTH */}
        <div className="mt-20 group">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full group-hover:h-10 transition-all duration-500" />
            <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white uppercase group-hover:text-orange-400 transition-colors duration-300">Gallery</h2>
          </div>
          <div className="relative w-full aspect-[16/9] max-h-[800px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 group/gallery hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
            {branch.gallery.map((imgUrl, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentGallery ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={imgUrl}
                  alt="Gym Interior"
                  className="w-full h-full object-cover group-hover/gallery:scale-105 transition-transform duration-[2s] ease-out"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {branch.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGallery(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentGallery ? 'bg-orange-500 w-12 shadow-lg shadow-orange-500/50' : 'bg-white/40 hover:bg-white hover:w-6'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-white border border-white/10 group-hover/gallery:border-orange-500/30 transition-all duration-300">
              {currentGallery + 1} / {branch.gallery.length}
            </div>
          </div>
        </div>

        {/* Our Team - FULL SCREEN WIDTH */}
        <div className="mt-20 group">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full group-hover:h-10 transition-all duration-500" />
            <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white uppercase group-hover:text-orange-400 transition-colors duration-300">Meet Our Trainers</h2>
          </div>
          <div className="relative w-full aspect-[16/9] max-h-[800px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] group/team hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
            {branch.team.map((member, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentTrainer ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover/team:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12 transform transition-all duration-700 group-hover/team:pb-16">
                  <h4 className="text-5xl font-black text-white tracking-wide mb-3 group-hover/team:text-orange-400 transition-colors duration-500">{member.name}</h4>
                  <p className="text-2xl text-orange-400 font-bold group-hover/team:text-white transition-colors duration-500">{member.role}</p>
                </div>
              </div>
            ))}
                    
            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {branch.team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTrainer(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentTrainer ? 'bg-orange-500 w-12 shadow-lg shadow-orange-500/50 animate-pulse' : 'bg-white/40 hover:bg-white hover:w-6'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-white border border-white/10 group-hover/team:border-orange-500/30 transition-all duration-300">
              {currentTrainer + 1} / {branch.team.length}
            </div>
          </div>
        </div>

        {/* Location Map Section - Full Screen Big */}
        <div className="mt-20 pt-20 border-t border-white/5 group">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full group-hover:h-10 transition-all duration-500" />
                <h2 className="text-2xl md:text-3xl font-black tracking-wider text-white uppercase group-hover:text-orange-400 transition-colors duration-300">Visit Us</h2>
              </div>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
                {branch.address}
              </p>
            </div>
            
            <div className="relative w-full aspect-video max-h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:border-orange-500/40 transition-all duration-700 hover:shadow-2xl hover:shadow-orange-500/20 group/map">
              <iframe
                src={branch.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter grayscale group-hover/map:grayscale-0 transition-all duration-[2s] ease-out"
                title="Branch Location Map"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover/map:border-orange-500/30 rounded-3xl transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover/map:opacity-100 transition-opacity duration-700" />
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                target="_blank"
                rel="noreferrer"
                className="group/btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-5 px-8 rounded-2xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/60 transform hover:-translate-y-2 active:translate-y-0"
              >
                <Map size={20} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="group-hover/btn:tracking-widest transition-all duration-300">Get Directions on Google Maps</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}