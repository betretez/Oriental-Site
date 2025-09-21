'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MessageCircle, Clock } from 'lucide-react';
import { Circle } from 'lucide-react';

interface FastingStatus {
  isFasting: boolean;
  fastType: 'major' | 'weekly' | 'special' | 'none';
  fastName: string;
  description: string;
  dayOfFast?: number;
  totalDays?: number;
  daysRemaining?: number;
  rules: string[];
  backgroundColor: string;
  textColor: string;
}

// Simple fasting calculation - you'll expand this with proper Ethiopian calendar logic
function getTodaysFastingStatus(): FastingStatus {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Example logic - replace with actual EOTC calendar calculations
  const isWednesday = dayOfWeek === 3;
  const isFriday = dayOfWeek === 5;
  const isSaturday = dayOfWeek === 6;
  
  // Check for major fasting periods (simplified - you'll add proper dates)
  const month = today.getMonth() + 1;
  const date = today.getDate();
  
  // Example: Tsome Dhahania (Assumption Fast) - August 7-22
  if (month === 8 && date >= 7 && date <= 22) {
    const dayOfFast = date - 6;
    return {
      isFasting: true,
      fastType: 'major',
      fastName: 'Tsome Filiseta',
      description: 'ጾመ ፍልሰታ - Assumption of Mary Fast',
      dayOfFast,
      totalDays: 16,
      daysRemaining: 23 - date,
      rules: [
        'No food or drink until 3 PM',
        'Vegan diet only (no animal products)',
        'Prayer and spiritual reflection'
      ],
      backgroundColor: 'bg-amber-800',
      textColor: 'text-amber-50'
    };
  }
  
  // Weekly fasting
  if (isWednesday || isFriday) {
    return {
      isFasting: true,
      fastType: 'weekly',
      fastName: isWednesday ? 'Wed' : 'Fri',
      description: 'ጾመ ድህነት - Tsome Dihineti',
      rules: [
        'No food until 3 PM',
        'Vegan diet only',
        isWednesday ? 'Remember Christ\'s betrayal' : 'Remember Christ\'s crucifixion'
      ],
      backgroundColor: 'bg-red-800',
      textColor: 'text-red-50'
    };
  }
  
  // No fasting
  return {
    isFasting: false,
    fastType: 'none',
    fastName: 'No Fast',
    description: 'መብል ዘእጊ - Regular eating day',
    rules: [
      'Normal eating allowed',
      'Continue daily prayers'
    ],
    backgroundColor: 'bg-amber-800',
    textColor: 'text-green-50'
  };
}

export default function Home() {
  const [fastingStatus, setFastingStatus] = useState<FastingStatus | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFastingStatus(getTodaysFastingStatus());
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  if (!fastingStatus) {
    return <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="text-xl text-amber-900">Loading...</div>
    </div>;
  }

  const timeUntil3PM = () => {
    const now = new Date();
    const threePM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0);
    
    if (now > threePM) return null;
    
    const diff = threePM.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m until 3 PM`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Traditional Header */}
      <header className="bg-amber-900 text-amber-50 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            {/* Orthodox Cross Symbol */}
            <div className="text-6xl mb-2 font-light">☩</div>
            <h1 className="text-2xl font-light tracking-wide">Ethiopian Orthodox Tewahedo Church</h1>
            <p className="text-amber-200 text-sm mt-1">የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን</p>
            <div className="mt-3 text-amber-200 text-xs">
              Fasting Guide & Spiritual Calendar
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Today's Fasting Status - Main Focus */}
        <div className={`${fastingStatus.backgroundColor} ${fastingStatus.textColor} rounded-3xl shadow-2xl p-10 mb-12 text-center border-4 border-amber-200 relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-8 left-8 text-8xl">☩</div>
            <div className="absolute bottom-8 right-8 text-8xl">☩</div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <div className="text-lg mb-3 opacity-90 font-light">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <h2 className="text-5xl font-light mb-4 tracking-wide">Today's Fasting Status</h2>
            </div>

            <div className="mb-10">
              <div className="text-8xl font-light mb-6 drop-shadow-lg">
<Circle 
  className={`h-20 w-20 transition-all duration-500 ${
    fastingStatus.isFasting ? 
    'text-red-200 fill-current animate-pulse' : 
    'text-green-200'
  }`} 
/>              </div>
              <h3 className="text-4xl font-light mb-4 tracking-wide">
                {fastingStatus.isFasting ? 'FASTING' : 'NOT FASTING'}
              </h3>
              <div className="max-w-2xl mx-auto">
                <p className="text-2xl opacity-95 mb-2 font-light">{fastingStatus.fastName}</p>
                <p className="text-lg opacity-90">{fastingStatus.description}</p>
              </div>
            </div>

            {/* Fast Progress */}
            {fastingStatus.dayOfFast && fastingStatus.totalDays && (
              <div className="mb-10 bg-white bg-opacity-20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex justify-between text-xl mb-4 font-light">
                  <span>Day {fastingStatus.dayOfFast} of {fastingStatus.totalDays}</span>
                  <span>{fastingStatus.daysRemaining} days remaining</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-4 shadow-inner">
                  <div 
                    className="bg-white h-4 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${(fastingStatus.dayOfFast / fastingStatus.totalDays) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Time Counter */}
            {fastingStatus.isFasting && timeUntil3PM() && (
              <div className="bg-white bg-opacity-25 rounded-2xl p-6 mb-10 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4">
                  <Clock className="h-8 w-8" />
                  <span className="text-2xl font-light">{timeUntil3PM()}</span>
                </div>
              </div>
            )}

            {/* Enhanced Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
              <Link href="/calendar" className="group relative overflow-hidden bg-amber-900 bg-opacity-20 hover:bg-opacity-30 px-10 py-5 rounded-2xl font-light transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-white border-opacity-40 hover:border-opacity-60 backdrop-blur-sm">
                <Calendar className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="text-lg font-medium">View Calendar</span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
              
              <Link href="/chat" className="group relative overflow-hidden bg-amber-900 bg-opacity-20 hover:bg-opacity-30 px-10 py-5 rounded-2xl font-light transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-white border-opacity-40 hover:border-opacity-60 backdrop-blur-sm">
                <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="text-lg font-medium">Ask Questions</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Fasting Rules - Enhanced */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border-2 border-amber-100 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100 to-transparent opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4 text-amber-700">☩</div>
              <h3 className="text-3xl font-light text-amber-900 mb-2">Today's Spiritual Guidance</h3>
              <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full"></div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {fastingStatus.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-6 mb-6 group hover:bg-amber-50 p-4 rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-amber-800 text-lg font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-gray-700 text-lg leading-relaxed font-light">{rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seven Fasting Periods - Enhanced */}
        <div className="bg-gradient-to-br from-amber-900 via-red-900 to-amber-800 text-amber-50 rounded-3xl shadow-2xl p-10 relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-6 text-6xl rotate-12">☩</div>
            <div className="absolute top-20 right-12 text-4xl -rotate-12">☩</div>
            <div className="absolute bottom-16 left-16 text-5xl rotate-45">☩</div>
            <div className="absolute bottom-6 right-6 text-6xl -rotate-12">☩</div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-4xl font-light mb-4">Seven Sacred Fasting Periods</h3>
              <div className="w-32 h-1 bg-amber-300 mx-auto rounded-full mb-4"></div>
              <p className="text-lg opacity-90 font-light max-w-2xl mx-auto">
                Following ancient tradition established over 1600 years ago
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-amber-900 bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20 group-hover:bg-opacity-20">
                  <div className="text-4xl font-light mb-2">55</div>
                  <div className="text-sm opacity-80 font-light">Great Lent Days</div>
                  <div className="text-xs opacity-60 mt-1">8 Sacred Sundays</div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-amber-900 bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20 group-hover:bg-opacity-20">
                  <div className="text-4xl font-light mb-2">104</div>
                  <div className="text-sm opacity-80 font-light">Weekly Fast Days</div>
                  <div className="text-xs opacity-60 mt-1">Wednesdays & Fridays</div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-amber-900 bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20 group-hover:bg-opacity-20">
                  <div className="text-4xl font-light mb-2">250+</div>
                  <div className="text-sm opacity-80 font-light">Total Fasting Days</div>
                  <div className="text-xs opacity-60 mt-1">Per Year</div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="bg-amber-900 bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20 group-hover:bg-opacity-20">
                  <div className="text-4xl font-light mb-2">1600+</div>
                  <div className="text-sm opacity-80 font-light">Years of Tradition</div>
                  <div className="text-xs opacity-60 mt-1">Ancient Heritage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-amber-900 text-amber-200 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-3xl mb-3">☩</div>
          <p className="text-sm mb-2">
            Ethiopian Orthodox Tewahedo Church Fasting Guide
          </p>
          <p className="text-xs opacity-60">
            In the name of the Father, Son, and Holy Spirit
          </p>
        </div>
      </footer>
    </div>
  );
}