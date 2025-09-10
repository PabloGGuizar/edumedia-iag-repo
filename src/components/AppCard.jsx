import { useState } from 'react';
import { getResourceStyle } from '../utils';
import { useFavorites } from '../context/FavoritesContext';

export default function AppCard({ app }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const fullDescription = app.descripcion_app || 'No hay descripción.';
  const canTruncate = fullDescription.length > 350;
  const shortDescription = canTruncate ? fullDescription.substring(0, 350).trim() + '...' : fullDescription;

  const isFav = isFavorite(app.key);
  const favClass = isFav ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500';

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(app.key);
    } else {
      addFavorite(app.key); // Adds to 'General' category by default
    }
  };

  return (
    <div className={`card rounded-lg shadow-sm overflow-hidden flex flex-col ${getResourceStyle(app.tipo_recurso)}`}>
      <div className="p-5 flex-grow flex flex-col relative">
        <button onClick={handleFavoriteClick} className="favorite-btn absolute top-3 right-3 p-1 rounded-full bg-surface/50 hover:bg-surface/90 focus:outline-none focus:ring-2 focus:ring-red-400 /50 " title="Gestionar favorito" data-key={app.key}>
          <svg className={`w-6 h-6 transition-colors duration-200 ${favClass}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
          </svg>
        </button>
        <p className="text-sm font-semibold text-muted mb-3 pr-8">{app.plataforma || 'Sin plataforma'}</p>
        <h3 className="text-xl font-bold text-primary mb-2">{app.titulo_app}</h3>
        <div className="text-sm text-muted mb-3 ">por {app.nombre_autor}</div>
        <div className="mb-4 text-sm">
          <strong>Nivel:</strong> {app.nivel_educativo}<br />
          <strong>Área:</strong> {app.area_conocimiento}
        </div>
        
        <div className="description-container text-muted  text-sm mb-4 flex-grow">
            <p>{showFullDescription ? fullDescription : shortDescription}</p>
            {canTruncate && (
                <a href="#" onClick={(e) => { e.preventDefault(); setShowFullDescription(!showFullDescription); }} className="font-semibold text-[var(--link)] hover:text-[var(--link-hover)] hover:underline  ">
                    {showFullDescription ? 'menos' : 'más'}
                </a>
            )}
        </div>

        <div className="mb-4 text-xs">
          {app.palabras_clave ? app.palabras_clave.split(',').map(kw => (
            <span key={kw} className="keyword-tag inline-block rounded-full px-3 py-1 font-semibold mr-2 mb-2" data-keyword={kw.trim()}>
              {kw.trim()}
            </span>
          )) : ''}
        </div>
      </div>
      <div className="p-5 bg-surface /50 mt-auto">
        <a href={app.url_app} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-primary-dark text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] dark:focus:ring-[var(--accent-dark)]">Visitar recurso</a>
      </div>
    </div>
  );
}




