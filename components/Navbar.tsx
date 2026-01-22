
import React, { useState } from 'react';
import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onOpenInquiry: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onOpenInquiry }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'blog', label: '아트온톡' },
    { id: 'coaching', label: '아트코칭' },
    { id: 'club', label: '스피드부자 독서클럽' },
  ];

  const allItems = currentView === 'admin' 
    ? [...navItems, { id: 'admin', label: '관리자 대시보드' }]
    : navItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView('home')}>
            <span className="text-2xl font-black text-white tracking-tighter">
              ART ON <span className="text-purple-500">TOK</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-6 mr-6">
              {allItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as ViewType)}
                  className={`px-3 py-2 rounded-md text-xs font-black tracking-widest transition-all uppercase ${
                    currentView === item.id 
                      ? 'text-purple-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button 
              onClick={onOpenInquiry}
              className="px-5 py-2 bg-purple-600 text-[11px] font-black tracking-widest rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95 uppercase"
            >
              Consulting
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-purple-900/30 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {allItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewType);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentView === item.id 
                    ? 'text-purple-400 bg-purple-900/10' 
                    : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => {
                onOpenInquiry();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-3 bg-purple-600 text-white rounded-xl text-base font-bold"
            >
              상담 신청하기
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
