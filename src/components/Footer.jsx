
export default function Footer() {
  return (
    <footer className="text-center pt-8 pb-4 mt-12 border-t border-gray-200 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <p>Una iniciativa del grupo <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold dark:text-blue-400 dark:hover:text-blue-300">EduMedia-IAG</a>. Versión 1.3</p>
      <p className="mt-4">
        <a href="https://github.com/Vibe-Coding-Educativo/app_edu/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600 font-semibold inline-flex items-center dark:text-gray-400 dark:hover:text-blue-400">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          GitHub del proyecto
        </a>
      </p>
      <p className="mt-4">
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noreferrer" className="hover:underline px-2 font-semibold text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300">
          Licencia Creative Commons BY-SA
        </a>
      </p>
    </footer>
  );
}
