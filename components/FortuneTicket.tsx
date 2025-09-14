
import React, { useEffect, useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface FortuneTicketProps {
  fortuneText: string;
  onReset: () => void;
  isVisible: boolean;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const FortuneTicket: React.FC<FortuneTicketProps> = ({ fortuneText, onReset, isVisible }) => {
  const { t } = useI18n();
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!shouldRender) return null;

  return (
    <div 
      className={`bg-amber-50 border-2 border-dashed border-amber-600 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto text-slate-800 transform transition-all duration-500 ease-out origin-top
                  ${isVisible ? 'opacity-100 rotate-x-0 translate-y-0' : 'opacity-0 -rotate-x-45 -translate-y-10'}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex justify-between items-center mb-4">
        <StarIcon className="w-6 h-6 text-amber-500" />
        <h2 className="font-cinzel text-2xl font-bold text-red-700">{t('fortuneTicket.title')}</h2>
        <StarIcon className="w-6 h-6 text-amber-500" />
      </div>
      
      <p className="text-center text-lg leading-relaxed mb-6 min-h-[60px]">
        {fortuneText}
      </p>
      
      <div className="border-t-2 border-dashed border-amber-400 pt-4">
        <button
          onClick={onReset}
          className="w-full bg-red-600 hover:bg-red-700 text-amber-50 font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {t('fortuneTicket.buttonSeekAnother')}
        </button>
      </div>
      <style>{`
        .rotate-x-0 { transform: rotateX(0deg); }
        .-rotate-x-45 { transform: rotateX(-45deg); }
      `}</style>
    </div>
  );
};
