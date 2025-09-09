export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative w-full md:flex-grow">
      <label htmlFor="search-input" className="sr-only">Búsqueda libre</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
      </div>
      <input 
        type="text" 
        id="search-input" 
        placeholder="Buscar por todos los campos..." 
        className="themed-input w-full p-2 pl-10 pr-10 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]" 
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <button onClick={() => onQueryChange('')} title="Limpiar búsqueda" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 focus:outline-none  dark:hover:text-slate-200">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}
