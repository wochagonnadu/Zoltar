// PATH: components/ZoltarMachine.tsx
// WHAT: Renders the main Zoltar machine UI, including the animated character and the button to get a fortune.
// WHY:  This is the central interactive component for the user. It manages the visual state (idle animation vs. loading).
// RELEVANT: App.tsx, hooks/useI18n.ts, components/LoadingIcon.tsx

import React, { useState, useEffect, useRef } from 'react';
import { LoadingIcon } from './LoadingIcon';
import { useI18n } from '../hooks/useI18n';

interface ZoltarMachineProps {
  onGetFortune: () => void;
  isLoading: boolean;
}

// Use Vite base URL so paths work on GitHub Pages and locally.
const BASE = import.meta.env.BASE_URL || '/';
const ZOLTAR_ANIMATION_SEQUENCE = [
  `${BASE}images/front.png`,
  `${BASE}images/left.png`,
  `${BASE}images/front.png`,
  `${BASE}images/right.png`,
];
const ZOLTAR_FRONT_IMAGE = `${BASE}images/front.png`;
const ANIMATION_INTERVAL_MS = 1500;

export const ZoltarMachine: React.FC<ZoltarMachineProps> = ({ onGetFortune, isLoading }) => {
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // This effect manages the Zoltar animation based on the loading state.
  useEffect(() => {
    // When loading, stop the animation and show the front-facing image.
    if (isLoading) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const frontIndex = ZOLTAR_ANIMATION_SEQUENCE.indexOf(ZOLTAR_FRONT_IMAGE);
      setCurrentImageIndex(frontIndex !== -1 ? frontIndex : 0);
    }
    // When not loading, start the idle animation if it's not already running.
    else if (!intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ZOLTAR_ANIMATION_SEQUENCE.length);
      }, ANIMATION_INTERVAL_MS);
    }

    // Cleanup: clear the interval when the component unmounts or `isLoading` changes.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading]);

  const currentImageSrc = isLoading
    ? ZOLTAR_FRONT_IMAGE
    : ZOLTAR_ANIMATION_SEQUENCE[currentImageIndex];

  return (
    <div className="relative bg-gradient-to-b from-red-700 via-red-800 to-red-900 p-6 border-4 border-yellow-400 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-yellow-500/50">
      {/* Decorative Top */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-400 rounded-t-lg border-x-4 border-t-4 border-yellow-500"></div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-500 rounded-t-md border-x-2 border-t-2 border-yellow-600"></div>

      {/* Zoltar Window */}
      <div className="relative bg-black bg-opacity-70 backdrop-blur-sm p-4 rounded-lg shadow-inner mb-6 h-64 flex items-center justify-center overflow-hidden border-2 border-yellow-600">

        {/* Background Smoke Elements */}
        <div className="smoke-particle" style={{ width: '100px', height: '100px', bottom: '10%', left: '15%', animationDuration: '8s', animationDelay: '0s', zIndex: 1 }}></div>
        <div className="smoke-particle" style={{ width: '120px', height: '120px', bottom: '5%', left: '50%', transform: 'translateX(-50%)', animationDuration: '10s', animationDelay: '2s', zIndex: 1 }}></div>
        <div className="smoke-particle" style={{ width: '90px', height: '90px', bottom: '12%', right: '10%', animationDuration: '9s', animationDelay: '1s', zIndex: 1 }}></div>

        <img
          src={currentImageSrc}
          alt={t('zoltarMachine.zoltarImageAlt')}
          className={`max-h-full max-w-full object-contain transition-all duration-300 ease-in-out z-10
                      ${isLoading ? 'opacity-60 scale-95 brightness-75' : 'opacity-100 scale-100 brightness-100 zoltar-avatar-animate'}`}
          aria-live="polite"
        />

        {/* Foreground Smoke Elements (at the bottom) */}
        <div className="smoke-particle" style={{ width: '80px', height: '40px', bottom: '-10px', left: '25%', animationDuration: '7s', animationDelay: '0.5s', zIndex: 11, opacity: 0.2 }}></div>
        <div className="smoke-particle" style={{ width: '100px', height: '50px', bottom: '-15px', left: '60%', animationDuration: '8s', animationDelay: '1.5s', zIndex: 11, opacity: 0.25 }}></div>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <LoadingIcon className="w-12 h-12 text-yellow-400" />
            <p className="mt-3 text-yellow-300 font-cinzel tracking-wider text-lg">{t('zoltarMachine.ponders')}</p>
          </div>
        )}

        {/* Decorative Lights */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className={`absolute top-2 left-2 w-3 h-3 rounded-full bg-yellow-500 ${isLoading ? 'animate-ping opacity-75' : 'opacity-50'}`}></div>
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 ${isLoading ? 'animate-ping delay-150 opacity-75' : 'opacity-50'}`}></div>
          <div className={`absolute bottom-2 left-2 w-3 h-3 rounded-full bg-purple-500 ${isLoading ? 'animate-ping delay-300 opacity-75' : 'opacity-50'}`}></div>
          <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full bg-yellow-500 ${isLoading ? 'animate-ping delay-450 opacity-75' : 'opacity-50'}`}></div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-md shadow-md border border-slate-700">
        <button
          onClick={onGetFortune}
          disabled={isLoading}
          aria-label={isLoading ? t('zoltarMachine.buttonConsultingSpirits') : t('zoltarMachine.buttonRevealFortune')}
          className={`w-full font-cinzel text-xl font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out
                      ${isLoading
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-red-900 hover:shadow-yellow-500/70 transform hover:scale-105 active:scale-95'
                      }`}
        >
          {isLoading
            ? t('zoltarMachine.buttonConsultingSpirits')
            : t('zoltarMachine.buttonRevealFortune')
          }
        </button>
      </div>

      <div className="h-3 w-3/4 mx-auto mt-5 bg-slate-700 rounded-sm shadow-inner border border-slate-600">
        <div className="h-full w-full bg-black bg-opacity-50"></div>
      </div>
    </div>
  );
};
