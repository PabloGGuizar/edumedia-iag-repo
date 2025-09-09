import { useMemo } from 'react';

export default function FilterPanel({ categories, allApps, activeFilters, onFilterChange, onClearFilters }) {

  const filterOptions = useMemo(() => {
    const options = {};
    categories.forEach(cat => {
      const values = new Set(allApps.flatMap(app => app[cat.id]?.split(',') || []).map(v => v.trim()).filter(Boolean));
      if (values.size > 0) {
        options[cat.id] = Array.from(values).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
      }
    });
    return options;
  }, [categories, allApps]);

  return (
    <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-sm mb-8 border border-muted  ">
      <div className="space-y-4">
        {categories.map(cat => {
          if (!filterOptions[cat.id]) return null;
          return (
            <details key={cat.id} className="group" open>
              <summary className="flex items-center gap-2 font-semibold text-lg cursor-pointer text-primary">
                <span dangerouslySetInnerHTML={{ __html: cat.icon }}></span>
                {cat.name}
                <span className="ml-auto transition-transform duration-200 transform group-open:rotate-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </summary>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pt-3">
                {filterOptions[cat.id].map(option => {
                  const isActive = activeFilters[cat.id]?.has(option);
                  return (
                    <button 
                      key={option} 
                      onClick={() => onFilterChange(cat.id, option)}
                      className={`filter-btn text-sm text-left p-2 rounded-md ${isActive ? 'active' : ''}`}>
                      {option}
                    </button>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
      <div className="mt-6 border-t border-muted pt-4 flex justify-end ">
        <button onClick={onClearFilters} className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition dark:bg-slate-500 dark:hover:bg-slate-400">Limpiar Filtros</button>
      </div>
    </div>
  );
}
