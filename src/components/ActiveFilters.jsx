import { filterCategories } from '../config';

export default function ActiveFilters({ activeFilters, onRemoveFilter }) {
    const hasActiveFilter = Object.values(activeFilters).some(filterSet => filterSet.size > 0);

    if (!hasActiveFilter) {
        return null;
    }

    const getCategoryName = (id) => {
        const category = filterCategories.find(cat => cat.id === id);
        return category ? category.name : 'Filtro';
    }

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(activeFilters).map(([category, filterSet]) => (
                Array.from(filterSet).map(filterValue => (
                    <div key={`${category}-${filterValue}`} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full dark:bg-gray-600 dark:text-gray-200">
                        <span>{getCategoryName(category)}: {filterValue}</span>
                        <button onClick={() => onRemoveFilter(category, filterValue)} className="ml-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white" title="Eliminar filtro">&times;</button>
                    </div>
                ))
            ))}
        </div>
    );
}