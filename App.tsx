
import React, { useState, useCallback, useEffect } from 'react';
import { ZoltarMachine } from './components/ZoltarMachine';
import { FortuneTicket } from './components/FortuneTicket';
import { getFortuneFromOpenRouter } from './services/openRouterService'; // Updated import
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useI18n } from './hooks/useI18n';

const App: React.FC = () => {
  const { t, language, translations } = useI18n();
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState<boolean>(false);

  const handleGetFortune = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFortune(null);
    setShowTicket(false);

    try {
      if (Object.keys(translations).length === 0) {
        console.warn("Translations not yet loaded, retrying fortune fetch shortly.");
        setTimeout(handleGetFortune, 300);
        return;
      }
      const fortunePromptKey = 'prompts.getFortune';
      const systemPromptContent = t(fortunePromptKey);
      
      if (systemPromptContent === fortunePromptKey) { // Key fallback
          console.error("Fortune prompt translation not found for key:", fortunePromptKey);
          setError(t('errors.default')); // Or a specific "prompt missing" error
          setIsLoading(false);
          return;
      }

      // Pass system prompt and language to the service
      const newFortune = await getFortuneFromOpenRouter(systemPromptContent, language);
      setFortune(newFortune);
      setTimeout(() => {
        if (newFortune) setShowTicket(true);
      }, 300);
    } catch (err) {
      console.error("Error getting fortune:", err);
      if (err instanceof Error) {
        const translatedError = t(err.message); // err.message should be an error key like "errors.api.keyInvalid"
         // If translation is same as key, and it's not clearly one of our keys, use default.
        if (translatedError === err.message && !err.message.startsWith("errors.api.")) {
            setError(t('errors.default'));
        } else {
            setError(translatedError);
        }
      } else {
        setError(t('errors.default'));
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [t, language, translations]);

  const handleReset = () => {
    setShowTicket(false);
    setTimeout(() => {
      setFortune(null);
      setError(null);
    }, 500);
  };
  
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 text-white selection:bg-yellow-500 selection:text-purple-900 overflow-x-hidden">
      <LanguageSwitcher />
      <header className="text-center mb-8">
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
          {t('appName')}
        </h1>
        <p className="text-amber-200 text-lg mt-2 italic">{t('appSubtitle')}</p>
      </header>

      <main className="relative flex flex-col items-center w-full px-2">
        <ZoltarMachine onGetFortune={handleGetFortune} isLoading={isLoading} />

        {error && !isLoading && (
          <div className="mt-6 p-4 bg-red-700 border border-red-500 rounded-md shadow-lg text-yellow-200 text-center w-full max-w-md"
               role="alert" aria-live="assertive">
            <p className="font-semibold">{t('errors.zoltarPerplexed')}</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="absolute top-full mt-4 w-full max-w-md perspective">
          {fortune && showTicket && (
            <FortuneTicket fortuneText={fortune} onReset={handleReset} isVisible={showTicket} />
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-slate-400">
        <p>{t('footerCopyright', { year: new Date().getFullYear() })}</p>
        <p>{t('footerPoweredBy')}</p>
      </footer>
      <style>{`
        .perspective {
          perspective: 1000px;
        }
        @keyframes zoltarFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.03);
          }
        }
        .zoltar-avatar-animate {
          animation: zoltarFloat 4s ease-in-out infinite;
        }

        /* Smoke Animations */
        @keyframes smokePuff {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.5);
          }
          50% {
            opacity: 0.4; /* Max opacity for smoke */
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
          }
        }
        .smoke-particle {
          position: absolute;
          background-color: rgba(200, 200, 220, 0.1); /* Lighter smoke color */
          border-radius: 50%;
          filter: blur(10px);
          animation-name: smokePuff;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
