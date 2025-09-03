import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className="relative text-center mb-4 p-6 rounded-xl bg-gradient-to-b from-blue-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <button onClick={() => setTheme('light')} title="Modo Claro" className={`theme-btn ${theme === 'light' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
        <button onClick={() => setTheme('dark')} title="Modo Oscuro" className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        <button onClick={() => setTheme('system')} title="Preferencias del sistema" className={`theme-btn ${theme === 'system' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        </button>
      </div>

      <div className="flex justify-center items-center gap-4">
        <img src="/logo.png" alt="Logo del Repositorio" className="h-16 md:h-20" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Repositorio de aplicaciones educativas</h1>
      </div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Una colección de aplicaciones y recursos educativos creados por la comunidad
        <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold dark:text-blue-400 dark:hover:text-blue-300">EduMedia-IAG</a>.
      </p>
    </header>
  );
}