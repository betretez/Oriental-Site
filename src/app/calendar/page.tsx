'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface FastingPeriod {
  id: string;
  name: string;
  amharicName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  type: 'major' | 'weekly' | 'special';
  duration: number;
  color: string;
  rules: string[];
}

// EOTC Fasting Calendar based on the document
const FASTING_PERIODS_2025: FastingPeriod[] = [
  {
    id: 'nineveh',
    name: 'Tsome Nenewe',
    amharicName: 'ጾመ ነነዌ',
    startDate: new Date(2025, 1, 10), // Feb 10 (Monday)
    endDate: new Date(2025, 1, 12), // Feb 12 (Wednesday)
    description: 'Three days fast (Monday, Tuesday, Wednesday) commemorating how the people of Nineveh were saved from God\'s wrath through prayer and fasting when Prophet Jonah warned them',
    type: 'special',
    duration: 3,
    color: 'bg-purple-600',
    rules: ['Complete fast until evening', 'Prayer and repentance like Nineveh', 'Seek God\'s mercy and forgiveness']
  },
  {
    id: 'great-lent',
    name: 'Abiyi Tsomi',
    amharicName: 'አብይ ጾም',
    startDate: new Date(2026, 1, 16), // Feb 16, 2026 (Monday)
    endDate: new Date(2026, 3, 11), // Apr 11, 2026 (Saturday)
    description: 'The Great Fast that Our Lord Jesus Christ fasted for 40 days and nights after His baptism. Called "great" because it is the Lord\'s fast and through it satan\'s temptations are overcome.',
    type: 'major',
    duration: 55,
    color: 'bg-red-600',
    rules: ['No food or drink until 3 PM', 'Abstain from all animal products', 'Intensive prayer and prostration', 'Read Gibrehimamat during Passion Week', 'Follow the 8 Sunday hymn cycle by St. Yared']
  },
  {
    id: 'apostles',
    name: 'Tsome Hawariyati',
    amharicName: 'ጾመ ሐዋርያት',
    startDate: new Date(2025, 5, 16), // June 16 (after Pentecost)
    endDate: new Date(2025, 6, 12), // July 12 (Hamle 5)
    description: 'Fast observed by the Apostles after receiving the Holy Spirit and before proclaiming the Gospel. Duration varies (30-40+ days) depending on Easter date. Observed to express thanks for the Apostles\' endurance of persecution',
    type: 'major',
    duration: 27,
    color: 'bg-blue-600',
    rules: ['Vegan diet only', 'No food until 3 PM', 'Prayer for apostolic blessing', 'Gratitude for Gospel ministry']
  },
  {
    id: 'assumption',
    name: 'Tsome Filiseta',
    amharicName: 'ጾመ ፍልሰታ',
    startDate: new Date(2025, 7, 7), // Aug 7 (1 Nehassie)
    endDate: new Date(2025, 7, 21), // Aug 21 (15 Nehassie)
    description: 'Two weeks fast commemorating when the Apostles fasted and prayed after St. John told them about Virgin Mary\'s body being taken to paradise. Angels brought her body on the 14th day, and her Assumption occurred on the 16th of Nehase',
    type: 'major',
    duration: 15,
    color: 'bg-indigo-600',
    rules: ['Vegan diet only', 'Intensive prayer to St. Mary', 'Many retreat eating only cereals and water', 'All Orthodox Christians including children observe']
  },
  {
    id: 'prophets',
    name: 'Tsome Nebiyati',
    amharicName: 'ጾመ ነብያት',
    startDate: new Date(2025, 10, 24), // Nov 24 (Hidar 15)
    endDate: new Date(2026, 0, 6), // Jan 6 (Tahisas 28)
    description: 'Advent fast following the example of the prophets who fasted and prayed longing for the coming of Christ. Observed before Christmas as mandated in the Law of Kings Article 15',
    type: 'major',
    duration: 44,
    color: 'bg-green-600',
    rules: ['Vegan diet only', 'Preparation for Christmas celebration', 'Following prophets\' example of longing', 'No food until 3 PM']
  }
];

// Weekly fasting (Wednesdays and Fridays) - computed dynamically
function isWeeklyFast(date: Date): boolean {
  const day = date.getDay();
  // Exclude 50 days between Easter and Pentecost, Christmas, Epiphany
  const isEasterSeason = false; // Simplified - would need proper calculation
  const isChristmas = date.getMonth() === 0 && date.getDate() === 7; // Jan 7
  const isEpiphany = date.getMonth() === 0 && date.getDate() === 19; // Jan 19
  
  return (day === 3 || day === 5) && !isEasterSeason && !isChristmas && !isEpiphany;
}

function getGreatLentSundayInfo(date: Date): { name: string; description: string } | null {
  const greatLent = FASTING_PERIODS_2025.find(f => f.id === 'great-lent');
  if (!greatLent || date < greatLent.startDate || date > greatLent.endDate) {
    return null;
  }
  
  // Check if it's a Sunday
  if (date.getDay() !== 0) {
    return null;
  }
  
  // Calculate which Sunday of Great Lent this is
  const diffTime = date.getTime() - greatLent.startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  const sundayNames = [
    {
      name: 'Zewerede (ዘወረደ)',
      description: 'Zewerede – means the one who descends from the above – on this Sunday, the descent, incarnation and crucifixion of our Lord Jesus Christ is preached (John 3:13).'
    },
    {
      name: 'Kidist (ቅድስት)',
      description: 'Kidist – means Holy and it tells the Holiness of Sunday'
    },
    {
      name: 'Mikurab (ምኩራብ)',
      description: 'Mikurab – the word stands for the synagogue – It reminds us that our Lord Jesus Christ taught in the synagogue during his ministry'
    },
    {
      name: 'Metsague (መጻጉእ)',
      description: 'Metsague – means a person who is in poor health (infirm) – A hymn for the healing of the sick and giving sight to the blind by the Lord is sung on this day'
    },
    {
      name: 'Debre Zeit (ደብረ ዘይት)',
      description: 'Debre Zeit – the Geez word for Mount of Olive – on this Sunday, our Lord taught about the second coming on Mount of Olives'
    },
    {
      name: 'Gebrhel/Good Servant (ገብርሄል)',
      description: 'Gebrhel/Good Servant – The story of the good servant who received five talents and made a profit of five more talents is told on this day (Matthew 25:14-30).'
    },
    {
      name: 'Nicodemus (ኒቆዲሞስ)',
      description: 'Nicodemus (ኒቆዲሞስ) – A hymn commemorating the coming of Nicodemus to our Lord during the night is sung'
    },
    {
      name: 'Palm Sunday (ሆሣና)',
      description: 'Palm Sunday – It is a commemorative day on which our Lord entered the temple in triumph and during which the people sung "Hosanna in the highest".'
    }
  ];
  
  if (weekNumber >= 1 && weekNumber <= 8) {
    return sundayNames[weekNumber - 1];
  }
  
  return null;
}

function isInFastingPeriod(date: Date): FastingPeriod | null {
  for (const period of FASTING_PERIODS_2025) {
    if (date >= period.startDate && date <= period.endDate) {
      return period;
    }
  }
  return null;
}

function getFastingStatus(date: Date): { 
  isFasting: boolean; 
  type: string; 
  name: string; 
  shortName: string;
  color: string; 
  description: string;
  amharicName: string;
} {
  const majorFast = isInFastingPeriod(date);
  if (majorFast) {
    // Check if this is a Sunday during Great Lent
    const sundayInfo = getGreatLentSundayInfo(date);
    if (sundayInfo && majorFast.id === 'great-lent') {
      return {
        isFasting: true,
        type: majorFast.type,
        name: sundayInfo.name,
        shortName: sundayInfo.name.split(' ')[0],
        color: majorFast.color,
        description: sundayInfo.description,
        amharicName: majorFast.amharicName
      };
    }
    
    // Create shorter names for calendar display
    const shortNames: { [key: string]: string } = {
      'Abiyi Tsomi': 'Abiyi Tsomi',
      'Tsome Hawariyati': 'Tsome Hawariyati', 
      'Tsome Filiseta': 'Tsome Filiseta',
      'Tsome Nebiyati': 'Tsome Nebiyati',
      'Tsome Nenewe': 'Tsome Nenewe'
    };
    
    return {
      isFasting: true,
      type: majorFast.type,
      name: majorFast.name,
      shortName: shortNames[majorFast.name] || majorFast.name,
      color: majorFast.color,
      description: majorFast.description,
      amharicName: majorFast.amharicName
    };
  }
  
  if (isWeeklyFast(date)) {
    const dayName = date.getDay() === 3 ? 'Wednesday' : 'Friday';
    const amharicName = 'ጾመ ድህነት (Tsome Dihineti)';
    const description = date.getDay() === 3 ? 
      'Day when the Jewish Council made consultation to crucify Our Lord Jesus Christ on Friday (John 11:46-53). Christians fast remembering the death sentence made against the Saviour of the World' : 
      'Blessed day on which Our Lord was crucified in His flesh and the long-awaited redemption was fulfilled (John 19:17-30). Day of Christ\'s sacrifice for mankind\'s salvation';
    
    return {
      isFasting: true,
      type: 'weekly',
      name: `${dayName} Fast`,
      shortName: dayName.slice(0, 3),
      color: 'bg-amber-500',
      description,
      amharicName
    };
  }
  
  return { 
    isFasting: false, 
    type: 'none', 
    name: 'No Fasting', 
    shortName: 'No Fast',
    color: 'bg-green-500',
    description: 'Regular eating day - continue daily prayers',
    amharicName: 'መብል ዘእጊ'
  };
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFast, setSelectedFast] = useState<FastingPeriod | null>(null);
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
    calendarDays.push({ date: prevDate, isCurrentMonth: false });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Next month's leading days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(year, month + 1, day);
    calendarDays.push({ date: nextDate, isCurrentMonth: false });
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Traditional Header */}
      <header className="bg-amber-900 text-amber-50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">☩</div>
              <div>
                <h1 className="text-xl font-light">EOTC Fasting Calendar</h1>
                <p className="text-amber-200 text-sm">የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="hover:text-amber-200 transition-colors flex items-center space-x-1 text-sm">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="/chat" className="hover:text-amber-200 transition-colors text-sm">Ask Questions</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Calendar Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-amber-100">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-3 hover:bg-amber-50 rounded-xl transition-colors border border-amber-200"
            >
              <ChevronLeft className="h-6 w-6 text-amber-800" />
            </button>
            
            <h2 className="text-4xl font-light text-amber-900">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-3 hover:bg-amber-50 rounded-xl transition-colors border border-amber-200"
            >
              <ChevronRight className="h-6 w-6 text-amber-800" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-light text-amber-800 bg-amber-50 rounded-lg">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((dayInfo, index) => {
              const { date, isCurrentMonth } = dayInfo;
              const fastingStatus = getFastingStatus(date);
              const isToday = date.toDateString() === today.toDateString();
              
              return (
                <div
                  key={index}
                  className={`p-2 h-24 border-2 border-amber-100 transition-all hover:shadow-md relative group rounded-lg ${
                    !isCurrentMonth ? 'bg-amber-25 text-gray-400' : 'bg-white'
                  } ${isToday ? 'ring-2 ring-amber-400 bg-amber-50' : ''}`}
                  title={isCurrentMonth && fastingStatus.isFasting ? 
                    `${fastingStatus.name} (${fastingStatus.amharicName}): ${fastingStatus.description}` : 
                    undefined
                  }
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-light mb-1 ${isToday ? 'text-amber-800 font-medium' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </span>
                    
                    {fastingStatus.isFasting && isCurrentMonth && (
                      <>
                        <div className={`flex-1 rounded-lg text-xs text-white p-1 ${fastingStatus.color}`}>
                          <div className="font-light leading-tight">
                            <div className="text-xs">{fastingStatus.shortName}</div>
                            <div className="text-xs opacity-90 mt-1">
                              {fastingStatus.type === 'weekly' ? 'Tsome Dihineti' : 
                               fastingStatus.amharicName.split('(')[0].trim()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover Tooltip */}
                        <div className="absolute top-full left-0 mt-2 z-10 bg-amber-900 text-amber-50 text-xs rounded-xl p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none min-w-80 max-w-96 border border-amber-700">
                          <div className="font-medium text-sm">{fastingStatus.name}</div>
                          <div className="text-amber-200 mb-3 text-sm">{fastingStatus.amharicName}</div>
                          <div className="text-amber-100 mb-3 leading-relaxed">{fastingStatus.description}</div>
                          <div className="text-amber-300 text-xs border-t border-amber-700 pt-3">
                            {fastingStatus.type === 'weekly' ? 
                              'No food until 3 PM • Vegan diet only • Weekly observance' :
                              `Duration: ${fastingStatus.type === 'major' ? 
                                FASTING_PERIODS_2025.find(f => f.name === fastingStatus.name)?.duration + ' days' : 
                                '3 days'} • No animal products`
                            }
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend and Today's Status */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-100">
            <h3 className="text-xl font-light text-amber-900 mb-4">Fasting Periods</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-gray-700 font-light">Major Fasting Periods</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-gray-700 font-light">Weekly Fasting (Wed/Fri)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="text-gray-700 font-light">Special Fasting Days</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700 font-light">No Fasting</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-100">
            <h3 className="text-xl font-light text-amber-900 mb-4">Today's Status</h3>
            <div className={`p-4 rounded-xl text-white ${getFastingStatus(today).color}`}>
              <div className="text-lg font-light">
                {getFastingStatus(today).isFasting ? '◉ FASTING TODAY' : '○ NO FASTING TODAY'}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {getFastingStatus(today).name}
              </div>
            </div>
          </div>
        </div>

        {/* Seven Fasting Periods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-100">
          <h3 className="text-2xl font-light text-amber-900 mb-8 text-center">Seven Fasting Periods of EOTC</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FASTING_PERIODS_2025.map((fast) => (
              <div
                key={fast.id}
                className="border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-amber-200"
                onClick={() => setSelectedFast(fast)}
              >
                <div className={`w-full h-3 ${fast.color} rounded-lg mb-4`}></div>
                <h4 className="font-light text-amber-900 text-lg mb-2">{fast.name}</h4>
                <p className="text-sm text-amber-700 mb-3">{fast.amharicName}</p>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{fast.description}</p>
                <div className="text-xs text-gray-500">
                  <div className="mb-1">{fast.startDate.toLocaleDateString()} - {fast.endDate.toLocaleDateString()}</div>
                  <div className="font-light">{fast.duration} days</div>
                </div>
              </div>
            ))}
            
            {/* Weekly Fasting Card */}
            <div className="border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-3 bg-amber-500 rounded-lg mb-4"></div>
              <h4 className="font-light text-amber-900 text-lg mb-2">Wednesdays & Fridays</h4>
              <p className="text-sm text-amber-700 mb-3">ጾመ ድህነት (Tsome Dihineti)</p>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">Weekly fasting throughout the year except during feast periods</p>
              <div className="text-xs text-gray-500">
                <div className="mb-1">Every week (with exceptions)</div>
                <div className="font-light">~104 days/year</div>
              </div>
            </div>
            
            {/* Gehad Card */}
            <div className="border-2 border-amber-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-full h-3 bg-gray-500 rounded-lg mb-4"></div>
              <h4 className="font-light text-amber-900 text-lg mb-2">Gehad</h4>
              <p className="text-sm text-amber-700 mb-3">ጾመ ገኃድ</p>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">Eves of Christmas & Epiphany when they fall on Wednesday or Friday</p>
              <div className="text-xs text-gray-500">
                <div className="mb-1">Variable timing</div>
                <div className="font-light">Special observance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fast Details Modal */}
        {selectedFast && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border-4 border-amber-200">
              <div className={`p-8 text-white ${selectedFast.color} rounded-t-2xl`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl mb-2">☩</div>
                    <h3 className="text-2xl font-light">{selectedFast.name}</h3>
                    <p className="text-lg opacity-90 mt-1">{selectedFast.amharicName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFast(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-xl text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-light text-amber-900 text-lg mb-3">Duration</h4>
                  <p className="text-gray-700 mb-2">
                    {selectedFast.startDate.toLocaleDateString()} - {selectedFast.endDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">{selectedFast.duration} days</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-light text-amber-900 text-lg mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedFast.description}</p>
                </div>
                
                <div>
                  <h4 className="font-light text-amber-900 text-lg mb-3">Fasting Rules</h4>
                  <ul className="space-y-3">
                    {selectedFast.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-amber-600 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Traditional Footer */}
      <footer className="bg-amber-900 text-amber-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">☩</div>
          <p className="text-sm mb-2 font-light">
            Ethiopian Orthodox Tewahedo Church Fasting Calendar
          </p>
          <p className="text-xs opacity-60">
            In the name of the Father, Son, and Holy Spirit
          </p>
        </div>
      </footer>
    </div>
  );
}