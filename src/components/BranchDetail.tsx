import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, ChevronLeft, Dumbbell, Activity, ShowerHead, Lock, ThermometerSun, Map, Users, IndianRupee, Compass, MessageCircle } from 'lucide-react';
import { IMAGES } from './image_constant';

const WHATSAPP_NUMBER = '919148974009';

function getWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface BranchDetailProps {
  branchId: string;
  onBack: () => void;
}

export const branchData: Record<string, {

  name: string;

  location: string;

  address: string;

  phone: string;

  comfort: string;

  tagline: string;

  hours: { day: string; time: string }[];

  team: { name: string; role: string; image: string }[];

  programs: { category: string; items: string[] }[];

  facilities: { name: string; icon: any }[];

  gallery: string[];

  pricing?: { duration: string; price: string }[];

  mapUrl: string;

  mapsLink: string;

}> = {

  'arekere': {

    name: 'Game On Fitness - Arekere',

    location: 'Arekere, Bengaluru',

    address: 'No.97,1st & 2nd floor, Saibaba Temple road, 2nd Main, Royal Residency Layout BTM 4th Stage, 80, Feet Rd, near Arekere, Bengaluru, Karnataka 560076',

    phone: '+91 8861737392',

    comfort: 'Normal',

    tagline: 'IT\'S ALL ABOUT WHAT YOU CAN ACHIVE EMPOWER YOURSELF TO MAKE THE CHANGE YOU NEED TO MAKE',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Chethan Kumar', role: 'Personal Trainer', image: IMAGES.Arekere.trainer1 },

      { name: 'Vinod', role: 'Personal Trainer', image: IMAGES.Arekere.trainer2 },

      { name: 'Abhi', role: 'Personal Trainer & General Trainer', image: IMAGES.Arekere.trainer3 },

      { name: 'Samhitaa', role: 'Personal Trainer & General Trainer', image: IMAGES.Arekere.trainer4 },

      { name: 'Shakir Ahmed', role: 'Personal Trainer', image: IMAGES.Arekere.trainer5 },

      { name: 'Abhishek', role: 'Personal Trainer', image: IMAGES.Arekere.trainer6 },

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

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

      { name: 'Group Classes', icon: Users },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,000' },

      { duration: '3 Months', price: '₹6,000' },

      { duration: '6 Months', price: '₹7,500' },

      { duration: '12 Months', price: '₹9,500' },

    ],

    gallery: [

      IMAGES.Arekere.img1,

      IMAGES.Arekere.img2,

      IMAGES.Arekere.img4,

      IMAGES.Arekere.img5,

      IMAGES.Arekere.img7,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.59!3d12.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzEyLjAiTiA3N8KwMzUnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/XKryGG1gFoAJpgUL7?g_st=ac',

  },

  'vijaya-bank-layout': {

    name: 'Game On Fitness Premium Club - Vijaya Bank Layout',

    location: 'Vijaya Bank Layout, Bengaluru',

    address: '3rd floor, 8883 886, Bannerghatta Rd, Vijaya Bank Layout, Bilekahalli, Bengaluru, Karnataka 560076',

    phone: '+91 9035279516',

    comfort: 'Premium',

    tagline: 'Game On Fitness is dedicated to covering the full fitness landscape, regularly introducing fans to new trends in training, nutrition, gear and technology',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Shivam', role: 'Personal Trainer', image: IMAGES.VijayaBankLayout.trainer1 },

      { name: 'Nithul', role: 'Personal Trainer', image: IMAGES.VijayaBankLayout.trainer2 },

      { name: 'Jeevan', role: 'Personal Trainer', image: IMAGES.VijayaBankLayout.trainer3 },

      { name: 'Kabir', role: 'Personal Trainer', image: IMAGES.VijayaBankLayout.trainer4 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training'],

      },

      {

        category: 'Group Classes',

        items: ['Zumba', 'Yoga', 'Power Yoga', 'HIIT', 'Dance Fitness', 'Tabata', 'Circuit Training', 'ABT'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

      { name: 'Transformation', icon: Activity },

      { name: 'GX Studio', icon: Users },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,000' },

      { duration: '3 Months', price: '₹5,500' },

      { duration: '6 Months', price: '₹7,000' },

      { duration: '12 Months', price: '₹9,000' },

    ],

    gallery: [

      IMAGES.VijayaBankLayout.img5,

      IMAGES.VijayaBankLayout.img6,

      IMAGES.VijayaBankLayout.img7,

      IMAGES.VijayaBankLayout.img9,

      IMAGES.VijayaBankLayout.imgMirror,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.60!3d12.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzQ4LjAiTiA3N8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/U9SGXjKByrrZr3EN7?g_st=ac',

  },

  'btm-layout-1': {
    name: 'Game On Fitness Premium Club - BTM 1st Stage',

    location: 'BTM 1st Stage, Bengaluru',

    address: 'Gangotri Bar And Restaurant, Ground, 8th Cross Rd, Old Madiwala, Maruti Nagar, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka 560068',

    phone: '+91 9036054799',

    comfort: 'Premium',

tagline: 'WE TRAIN YOU SMARTER, NOT HARDER!',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Basith', role: 'Personal Trainer', image: IMAGES.BTM1.trainer1 },

      { name: 'Santhosh', role: 'Personal Trainer', image: IMAGES.BTM1.trainer2 },

      { name: 'Preetam', role: 'Personal trainer', image: IMAGES.BTM1.trainer3 },

      { name: 'Thilak', role: 'Personal Trainer', image: IMAGES.BTM1.trainer4 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Kettel Bell', 'Battel Rope'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Functional Training', icon: Activity },

      { name: 'Group Classes', icon: Users },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,000' },

      { duration: '3 Months', price: '₹5,500' },

      { duration: '6 Months', price: '₹7,000' },

      { duration: '12 Months', price: '₹9,500' },

    ],

    gallery: [

      IMAGES.BTM1.img1,

      IMAGES.BTM1.img3,

      IMAGES.BTM1.img4,

      IMAGES.BTM1.img6,

      IMAGES.BTM1.img7,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.61!3d12.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUzJzI0LjAiTiA3N8KwMzYnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/12ugVxTwMYAHkgrZA?g_st=ac',

  },

  'btm-layout-2': {

    name: 'Game On Fitness Premium Club - BTM 2nd Stage',

    location: 'BTM 2nd Stage, Bengaluru',

    address: '689-670 2nd floor , 7th main, 7th Cross Rd, BTM Layout 2nd Stage, Bengaluru, Karnataka 560076',

    phone: '+91 8951028839',

    comfort: 'Premium',

    tagline: 'DAY 1 OR 1 DAY YOU DECIDE!',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Monalisa', role: 'Personal Trainer', image: IMAGES.BTM2.trainer1 },

      { name: 'Deekshith', role: 'Personal Trainer', image: IMAGES.BTM2.trainer2 },

      { name: 'Mohan Raj', role: 'Personal Trainer', image: IMAGES.BTM2.trainer3 },

      { name: 'Vikram', role: 'Fitness Manager', image: IMAGES.BTM2.trainer4 },

      { name: 'Nidhin', role: 'Personal Trainer', image: IMAGES.BTM2.trainer5 },

      { name: 'Deelip', role: 'Personal Trainer', image: IMAGES.BTM2.trainer6 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training', 'Kettel Bell', 'Battel Rope'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,500' },

      { duration: '3 Months', price: '₹6,000' },

      { duration: '6 Months', price: '₹7,500' },

      { duration: '12 Months', price: '₹10,000' },

    ],

    gallery: [

      IMAGES.BTM2.img3,

      IMAGES.BTM2.img4,

      IMAGES.BTM2.img6,

      IMAGES.BTM2.img7,

      IMAGES.BTM2.img8,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.62!3d12.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/oHZDcSENCPx86TMJ7?g_st=ac',

  },

  'wilson-garden': {

    name: 'Game On Fitness - Wilson Garden',

    location: 'Wilson Garden, Bengaluru',

    address: 'No.376, 21, 6th Cross Rd, opp. to traffic police station, Vinayaka Nagar, NGO Colony, Wilson Garden, Bengaluru, Karnataka 560027',

    phone: '+91 9663995409',

    comfort: 'Normal',

    tagline: 'LET THE GAINS BEGIN!',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Puneeth', role: 'General Trainer', image: IMAGES.WilsonGarden.trainer1 },

      { name: 'Ajay', role: 'Personal Trainer', image: IMAGES.WilsonGarden.trainer2 },

      { name: 'Sanjay', role: 'Personal Trainer', image: IMAGES.WilsonGarden.trainer3 },

      { name: 'Bharath', role: 'Personal Trainer', image: IMAGES.WilsonGarden.trainer4 },

      { name: 'Ravi', role: 'Personal Trainer', image: IMAGES.WilsonGarden.trainer5 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength Training', 'Viper Training', 'Kettle Bell', 'Battle Rope'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,000' },

      { duration: '3 Months', price: '₹6,000' },

      { duration: '6 Months', price: '₹7,500' },

      { duration: '12 Months', price: '₹9,000' },

    ],

    gallery: [

      IMAGES.WilsonGarden.bgImg,

      IMAGES.WilsonGarden.img1,

      IMAGES.WilsonGarden.img2,

      IMAGES.WilsonGarden.img3,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.58!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU3JzAwLjAiTiA3N8KwMzQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/6yza43p2DJmX9stb7',

  },

  'vijayanagar': {

    name: 'Game On Fitness Premium Club - Vijayanagar',

    location: 'Vijayanagar, Bengaluru',

    address: '119, 1st Floor 6th Main, 8th Cross Rd, next to BGS Stadium, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040',

    phone: '+91 9008589955',

    comfort: 'Premium',

    tagline: 'IT\'S NEVER TOO LATE AND YOU ARE NEVER TOO OLD TO BECOME BETTER!',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Trainer 1', role: 'Personal Trainer', image: IMAGES.Vijayanagar.trainer1 },

      { name: 'Trainer 2', role: 'General Trainer & Personal Trainer', image: IMAGES.Vijayanagar.trainer2 },

      { name: 'Trainer 3', role: 'Personal Trainer', image: IMAGES.Vijayanagar.trainer3 },

      { name: 'Trainer 4', role: 'Personal Trainer', image: IMAGES.Vijayanagar.trainer4 },

      { name: 'Trainer 5', role: 'Personal Trainer', image: IMAGES.Vijayanagar.trainer5 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Viper Training', 'Kettle Bell', 'Battle Rope'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Group Classes', icon: Users },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,500' },

      { duration: '3 Months', price: '₹6,000' },

      { duration: '6 Months', price: '₹8,500' },

      { duration: '12 Months', price: '₹10,000' },

    ],

    gallery: [

      IMAGES.JPNagar.img3,

      IMAGES.JPNagar.img4,

      IMAGES.JPNagar.img5,

      IMAGES.JPNagar.img6,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.57!3d12.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUxJzM2LjAiTiA3N8KwMzQnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/PHcJbpHfeF8nPHZAA?g_st=ac',

  },

  'akshayanagar': {

    name: 'Game On Fitness Luxury Club - Akshayanagar',

    location: 'Akshayanagar, Bengaluru',

    address: '2nd Floor, near, above Reliance Smart, Bhagyalakshmi Avenue, DLF Newtown, Akshayanagar, Bengaluru, Karnataka 560114',

    phone: '+91 8431198114',

    comfort: 'Luxury',

    tagline: 'EMPOWER YOURSELF TO MAKE THE CHANGE YOU NEED TO MAKE',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Akshay', role: 'Personal Trainer', image: IMAGES.Akshayanagar.trainer1 },

      { name: 'Ayush', role: 'Personal Trainer', image: IMAGES.Akshayanagar.trainer2 },

      { name: 'Nagendra', role: 'Personal Trainer', image: IMAGES.Akshayanagar.trainer3 },

      { name: 'Rahid', role: 'Fitness Manager', image: IMAGES.Akshayanagar.trainer4 },

      { name: 'Chandu', role: 'Personal Trainer', image: IMAGES.Akshayanagar.trainer5 },

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

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

      { name: 'Transformation', icon: Activity },

      { name: 'GX Studio', icon: Users },

    ],

    pricing: [

      { duration: '1 Month', price: '₹4,000' },

      { duration: '3 Months', price: '₹7,000' },

      { duration: '6 Months', price: '₹8,000' },

      { duration: '12 Months', price: '₹11,000' },

    ],

    gallery: [

      IMAGES.Akshayanagar.img1,

      IMAGES.Akshayanagar.img11,

      IMAGES.Akshayanagar.img4,

      IMAGES.Akshayanagar.img8,

      IMAGES.Akshayanagar.img9,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.63!3d12.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUxJzAwLjAiTiA3N8KwMzcnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/SfTTMEdjzdjsesRU9?g_st=ac',

  },

  'sarjapur-road': {

    name: 'Game On Fitness Premium Club - Sarjapur Road (Bellandur gate)',

    location: 'Sarjapur Road, Bengaluru',

    address: 'No 648 E 3rd floor, next to more mega store, Marathahalli - Sarjapur Main rd, gate, Bellandur, Bengaluru, Karnataka 560035',

    phone: '+91 8618086458',

    comfort: 'Premium',

    tagline: 'YOUR FITNESS JOURNEY STARTS HERE',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'Monika', role: 'Membership Coordinator', image: IMAGES.SarjapurRoad.trainer1 },

      { name: 'Shivam', role: 'Personal Trainer', image: IMAGES.SarjapurRoad.trainer2 },

      { name: 'Gowtham', role: 'General Trainer', image: IMAGES.SarjapurRoad.trainer3 },

      { name: 'Arun', role: 'Personal Trainer', image: IMAGES.SarjapurRoad.trainer4 },

      { name: 'Arun Kittu', role: 'Fitness Manager & Personal Trainer', image: IMAGES.SarjapurRoad.trainer5 },

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

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

    ],

    pricing: [

      { duration: '1 Month', price: '₹3,500' },

      { duration: '3 Months', price: '₹7,000' },

      { duration: '6 Months', price: '₹8,500' },

      { duration: '12 Months', price: '₹10,500' },

    ],

    gallery: [

      IMAGES.SarjapurRoad.img1,

      IMAGES.SarjapurRoad.img4,

      IMAGES.SarjapurRoad.img5,

      IMAGES.SarjapurRoad.img7,

      IMAGES.SarjapurRoad.img8,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.66!3d12.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzknMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/aqFxt3q8RMwPYbmH7?g_st=ac',

  },

  'kasavanahalli': {

    name: 'Game On Fitness Luxury Club - Kasavanahalli',

    location: 'Kasavanahalli, Bengaluru',

    address: '3rd Floor, Hosa Rd, next to Vishal Mega Mart, Kasavanahalli, Bengaluru, Karnataka 560035',

    phone: '+91 7259348811',

    comfort: 'Luxury',

    tagline: 'YOUR FITNESS JOURNEY STARTS HERE',

    hours: [

      { day: 'Monday', time: '5:00 AM – 11:00 PM' },

      { day: 'Tuesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Wednesday', time: '5:00 AM – 11:00 PM' },

      { day: 'Thursday', time: '5:00 AM – 11:00 PM' },

      { day: 'Friday', time: '5:00 AM – 11:00 PM' },

      { day: 'Saturday', time: '5:00 AM – 11:00 PM' },

      { day: 'Sunday', time: '6:00 AM – 10:00 PM' },

    ],

    team: [

      { name: 'R Sunil', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer1 },

      { name: 'Vishal Manjunath', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer2 },

      { name: 'BS Chandra', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer3 },

      { name: 'Avinash', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer4 },

      { name: 'Samrat Singh', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer5 },

      { name: 'Girish', role: 'Personal Trainer', image: IMAGES.Kasavanahalli.trainer6 },

    ],

    programs: [

      {

        category: 'Fitness Gym',

        items: ['Weight Loss Program', 'Weight Gain Program', 'Body Toning', 'Cardio', 'Weight & Strength', 'Kettel Bell', 'Battel Rope'],

      },

      {

        category: 'Group Classes',

        items: ['Zumba', 'Yoga', 'Power Yoga', 'HIIT', 'Dance Fitness', 'Tabata', 'Circuit Training', 'ABT'],

      },

    ],

    facilities: [

      { name: 'Weight Training & Cardio', icon: Dumbbell },

      { name: 'BMI Report', icon: Activity },

      { name: 'Gym Orientation', icon: Compass },

      { name: 'Locker Facility', icon: Lock },

      { name: 'General Training', icon: Dumbbell },

      { name: 'Personal Training', icon: Users },

      { name: 'Changing Room & Rest Room', icon: ShowerHead },

      { name: 'Steam and Shower Facilities', icon: ThermometerSun },

      { name: 'Functional Training', icon: Activity },

      { name: 'Group Classes', icon: Users },

    ],

    pricing: [

      { duration: '1 Month', price: '₹4,000' },

      { duration: '3 Months', price: '₹8,500' },

      { duration: '6 Months', price: '₹11,000' },

      { duration: '12 Months', price: '₹16,000' },

    ],

    gallery: [

      IMAGES.Kasavanahalli.bgImg,

      IMAGES.Kasavanahalli.img1,

      IMAGES.Kasavanahalli.img2,

      IMAGES.Kasavanahalli.img3,

      IMAGES.Kasavanahalli.img4,

      IMAGES.Kasavanahalli.img5,

    ],

    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.67!3d12.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzA1LjAiTiA3N8KwNDAnMjEuMCJF!5e0!3m2!1sen!2sin!4v1234567890',

    mapsLink: 'https://maps.app.goo.gl/V4mjLpWDW9zsA6FZ7?g_st=ac',

  },

};

export default function BranchDetail({ branchId, onBack }: BranchDetailProps) {
  const branch = branchData[branchId];
  const [isVisible, setIsVisible] = useState(true);
  const [currentGallery, setCurrentGallery] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsVisible(true);
    setCurrentGallery(0);
  }, [branchId]);

  useEffect(() => {
    if (!branch?.gallery?.length) return;
    const interval = setInterval(() => {
      setCurrentGallery((prev) => (prev + 1) % branch.gallery.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [branchId, branch?.gallery?.length]);

  if (!branch) {
    return (
      <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#16181f] mb-4">Branch Not Found</h2>
          <button onClick={onBack} className="bg-[#16181f] text-white font-bold px-6 py-3 rounded-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#3a3f4b] font-sans selection:bg-[#e07a72]/25 selection:text-[#16181f]">
  
      {/* Hero Header Section */}
      <div className={`relative h-[75vh] min-h-[520px] w-full overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute inset-0 transition-transform duration-[25s] ease-linear ${isVisible ? 'scale-100' : 'scale-110'}`}>
          <img
            src={branch.gallery[0] || IMAGES.Arekere.img1}
            alt={branch.name}
            className="w-full h-full object-cover filter brightness-[0.9]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f8fb] via-[#16181f]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16181f]/30 via-transparent to-transparent" />
        
        {/* Floating Navigation Back Button */}
        <button
          onClick={onBack}
          className={`absolute top-8 left-8 md:left-12 p-4 rounded-full bg-white/90 border border-white/40 text-[#16181f] hover:bg-white hover:border-[#e07a72] transition-all group z-20 shadow-xl hover:shadow-2xl hover:scale-110 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        
        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block px-4 py-1.5 bg-[#e07a72] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-5 shadow-lg shadow-[#e07a72]/25 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {branch.comfort} Club
            </span>
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight uppercase max-w-4xl drop-shadow-lg transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {branch.name}
            </h1>
        
            <div className={`flex flex-wrap items-center gap-8 mt-8 pt-8 border-t border-white/25 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="p-2 bg-white/90 rounded-lg border border-white/40">
                  <MapPin size={18} className="text-[#e07a72] shrink-0 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-semibold max-w-md drop-shadow">{branch.address}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="p-2 bg-white/90 rounded-lg border border-white/40">
                  <Phone size={18} className="text-[#e07a72] shrink-0 group-hover:rotate-12 transition-transform" />
                </div>
                <a href={`tel:${branch.phone}`} className="text-sm font-semibold text-white/90 hover:text-white transition-colors">
                  {branch.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Call to Action Bar */}
      <div className={`max-w-7xl mx-auto px-4 md:px-12 lg:px-16 -mt-10 relative z-20 mb-12 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white  border border-[rgba(18,20,26,0.08)] rounded-3xl p-6 md:p-8 shadow-2xl grid md:grid-cols-3 gap-4">
          <button className="w-full bg-[#16181f] hover:bg-[#1c1f28] text-white font-bold py-5 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#e07a72]/20 hover:shadow-[#e07a72]/40 transform hover:-translate-y-1 active:translate-y-0">
            Start Your Fitness Journey
          </button>
          <a
            href={`tel:${branch.phone}`}
            className="w-full bg-white hover:bg-white border-2 border-[rgba(18,20,26,0.08)] hover:border-[#e07a72]/50 text-[#16181f] font-bold py-5 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
          >
            <Phone size={16} className="text-[#e07a72]" />
            Call Front Desk
          </a>
          <a
            href={getWhatsAppLink(
              `Hi, I'd like to reach out about ${branch.name}. Please share more details.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-5 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#25D366]/20 hover:shadow-[#25D366]/40 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
          >
            <MessageCircle size={16} />
            Reach Out on WhatsApp
          </a>
        </div>
      </div>
      
      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-24">

        {/* Gallery - shown early so banner is visible */}
        {branch.gallery.length > 0 && (
        <div className="mb-16 group">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#e07a72] to-[#c45f58] rounded-full group-hover:h-12 transition-all duration-500 shadow-lg shadow-[#e07a72]/20" />
            <h2 className="text-2xl md:text-3xl font-black tracking-wider text-[#16181f] uppercase group-hover:text-[#e07a72] transition-colors duration-300">Gallery</h2>
          </div>
          <div className="relative w-full aspect-[21/9] max-h-[450px] rounded-3xl overflow-hidden border border-[rgba(18,20,26,0.08)] bg-white group/gallery hover:border-[#e07a72]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#e07a72]/20">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/65 via-[#16181f]/20 to-transparent" />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
              {branch.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGallery(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentGallery ? 'bg-[#e07a72] w-12 shadow-lg shadow-[#e07a72]/50' : 'bg-[#d4d7de] hover:bg-[#e07a72] hover:w-6'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-6 right-6 bg-[#16181f]/70 px-5 py-2.5 rounded-full text-sm font-bold text-white border border-[rgba(18,20,26,0.08)] group-hover/gallery:border-[#e07a72]/30 transition-all duration-300">
              {currentGallery + 1} / {branch.gallery.length}
            </div>
          </div>
        </div>
        )}
      
        {/* Dynamic Typography Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-16 group">
          <span className="text-5xl block text-[#e07a72]/30 font-serif mb-3 group-hover:text-[#e07a72]/50 transition-colors duration-500">"</span>
          <p className="text-xl md:text-3xl font-semibold text-[#3a3f4b] tracking-wide italic leading-relaxed group-hover:text-[#16181f] transition-colors duration-500">
            {branch.tagline}
          </p>
          <div className="w-16 h-[3px] bg-gradient-to-r from-transparent via-[#e07a72] to-transparent mx-auto mt-8 group-hover:w-32 transition-all duration-700 rounded-full" />
        </div>
      
        {/* Modern Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Left Column (7 Columns) */}
          <div className="lg:col-span-7 space-y-10">
          
            {/* Training Programs Section */}
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <div className="flex items-center gap-4 mb-8 group">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#e07a72] to-[#c45f58] rounded-full group-hover:h-10 transition-all duration-300 shadow-lg shadow-[#e07a72]/20" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-[#16181f] uppercase group-hover:text-[#e07a72] transition-colors duration-300">Our Training</h2>
              </div>
          
              <div className="space-y-5">
                {branch.programs.map((program, idx) => (
                  <div key={idx} className="bg-white border border-[rgba(18,20,26,0.08)] rounded-2xl p-6 hover:border-[#e07a72]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#e07a72]/10 hover:-translate-y-1">
                    <h3 className="text-xs font-bold tracking-widest text-[#e07a72] uppercase mb-4 flex items-center gap-2">
                      <Dumbbell size={14} />
                      {program.category}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {program.items.map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-[#f7f8fb] border border-[rgba(18,20,26,0.08)] rounded-xl text-xs text-[#6f7685] font-semibold hover:bg-[#e07a72]/10 hover:border-[#e07a72]/30 hover:text-[#e07a72] hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Facilities Section - Moved here for layout balance */}
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <div className="flex items-center gap-4 mb-8 group">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#e07a72] to-[#c45f58] rounded-full group-hover:h-10 transition-all duration-300 shadow-lg shadow-[#e07a72]/20" />
                <h2 className="text-xl md:text-2xl font-black tracking-wider text-[#16181f] uppercase group-hover:text-[#e07a72] transition-colors duration-300">Club Facilities</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {branch.facilities.map((facility, i) => {
                  const IconComponent = facility.icon;
                  return (
                    <div key={i} className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-white border border-[rgba(18,20,26,0.08)] hover:bg-[#e07a72]/10 hover:border-[#e07a72]/30 transition-all duration-300 group">
                      <div className="p-3 rounded-xl bg-[#e07a72]/10 text-[#e07a72] group-hover:bg-[#e07a72]/15 group-hover:scale-110 transition-all">
                        <IconComponent size={20} />
                      </div>
                      <span className="text-xs font-bold text-[#6f7685] tracking-wider uppercase group-hover:text-[#16181f] transition-colors">{facility.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Sticky Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">

            {/* Operating Hours Widget */}
            <div className="bg-white  border border-[rgba(18,20,26,0.08)] p-8 rounded-3xl hover:border-[#e07a72]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#e07a72]/10">
              <div className="flex items-center gap-3 text-[#16181f] mb-6 pb-4 border-b border-[rgba(18,20,26,0.08)]">
                <div className="p-2 bg-[#16181f]/10 rounded-lg">
                  <Clock size={18} className="text-[#e07a72]" />
                </div>
                <h3 className="text-sm font-bold tracking-wider uppercase">Operating Hours</h3>
              </div>
              <div className="space-y-4">
                {branch.hours.map((h, i) => {
                  const isSunday = h.day === "Sunday";
                  return (
                    <div key={i} className="flex justify-between items-center text-sm group">
                      <span className={`font-semibold ${isSunday ? 'text-[#9aa0ab]' : 'text-[#6f7685] group-hover:text-[#16181f]'} transition-colors`}>{h.day}</span>
                      <span className={`font-mono tracking-tight ${isSunday ? 'text-[#e07a72] font-semibold' : 'text-[#6f7685] group-hover:text-[#e07a72]'} transition-colors`}>{h.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscription Plans Widget */}
            {branch.pricing && (
              <div className="bg-white  border border-[rgba(18,20,26,0.08)] p-5 rounded-3xl hover:border-[#e07a72]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#e07a72]/10">
                <div className="flex items-center gap-3 mb-4 text-[#16181f]">
                  <div className="p-2 bg-[#16181f]/10 rounded-lg">
                    <IndianRupee size={18} className="text-[#e07a72]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase">Membership Plans</h3>
                    <p className="text-xs text-[#6f7685]">Choose the best duration for you.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {branch.pricing.map((plan, i) => {
                    const isBest = plan.duration === '12 Months';
                    return (
                      <div
                        key={i}
                        className={`rounded-[28px] border p-4 transition-all duration-300 ${
                          isBest
                            ? 'bg-[#e07a72]/10 border-[#e07a72]/30 shadow-lg shadow-[#e07a72]/10'
                            : 'bg-[#f7f8fb] border-[rgba(18,20,26,0.08)] hover:bg-white hover:border-[#e07a72]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isBest ? 'text-[#e07a72]' : 'text-[#6f7685]'}`}>
                              {plan.duration}
                            </p>
                            <p className="mt-1 text-[11px] text-[#6f7685]">Perfect for steady progress</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-[#16181f]">{plan.price}</p>
                            {isBest && (
                              <span className="inline-flex items-center justify-center mt-2 rounded-full bg-[#e07a72]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e07a72] border border-[#e07a72]/30">
                                Best Value
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Our Team - Trainer Cards */}
       <div className="mt-20">
  {/* Section Title */}
  <div className="flex items-center justify-center gap-3 mb-12">
    <div className="w-1.5 h-10 bg-[#e07a72] rounded-full" />
    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-[#16181f]">
      Meet Our Trainers
    </h2>
  </div>

  {/* Trainer Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
    {branch.team.map((member, index) => (
      <div
        key={index}
        className="bg-white border border-[rgba(18,20,26,0.08)] rounded-3xl overflow-hidden hover:border-[#e07a72]/40 transition-all duration-300 hover:-translate-y-2"
      >
        {/* Trainer Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f8fb]">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#16181f]/20 to-transparent pointer-events-none" />
        </div>

        {/* Trainer Details */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-white">
            {member.name}
          </h3>

          <p className="mt-2 text-[#e07a72] uppercase tracking-widest text-sm">
            {member.role}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Location Map Section - Full Screen Big */}
        <div className="mt-20 pt-16 border-t border-white/5 group">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-gradient-to-b from-[#e07a72] to-[#c45f58] rounded-full group-hover:h-12 transition-all duration-500 shadow-lg shadow-[#e07a72]/20" />
                <h2 className="text-2xl md:text-3xl font-black tracking-wider text-[#16181f] uppercase group-hover:text-[#e07a72] transition-colors duration-300">Visit Us</h2>
              </div>
              <p className="text-base text-[#6f7685] max-w-2xl mx-auto group-hover:text-[#6f7685] transition-colors duration-300">
                {branch.address}
              </p>
            </div>
            
            <div className="relative w-full aspect-video max-h-[600px] rounded-3xl overflow-hidden border border-[rgba(18,20,26,0.08)] bg-white hover:border-[#e07a72]/40 transition-all duration-700 hover:shadow-2xl hover:shadow-[#e07a72]/20 group/map">
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
              <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover/map:border-[#e07a72]/30 rounded-3xl transition-all duration-700" />
            </div>

            <div className="mt-10 max-w-2xl mx-auto">
              <a
                href={branch.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="group/btn w-full bg-[#16181f] hover:bg-[#1c1f28] text-white font-bold py-6 px-10 rounded-2xl text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#e07a72]/30 hover:shadow-[#e07a72]/60 transform hover:-translate-y-2 active:translate-y-0"
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