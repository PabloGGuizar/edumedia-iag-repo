import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
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

      <header className="text-center mb-4 p-6 rounded-xl bg-surface">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo del Repositorio" className="h-14 sm:h-16 md:h-20 flex-shrink-0 mb-2 sm:mb-0" />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">Repositorio de aplicaciones educativas</h1>
            <p className="mt-2 text-lg text-muted">
              Una colección de recursos multimedia educativos creados por la comunidad
              <a href="#" target="_blank" rel="noreferrer" className="ml-1 font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] hover:underline">EduMedia-IAG</a>.
            </p>
          </div>
        </div>
      </header>
    </>
  );
}


