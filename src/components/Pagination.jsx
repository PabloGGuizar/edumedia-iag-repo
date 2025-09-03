export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  if (itemsPerPage === 'all') return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Página {currentPage} de {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>
  );
}