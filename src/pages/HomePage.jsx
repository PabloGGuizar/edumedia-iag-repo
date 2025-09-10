import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppCard from '../components/AppCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import HelpModal from '../components/HelpModal';
import ActiveFilters from '../components/ActiveFilters';
import { filterCategories } from '../config';
import { useFavorites } from '../context/FavoritesContext';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuzC6iDCGInzgTXLn7ODu_i3XlHqqVUxpd0jJ42ZmrkVb89l59zi_UXEK0MGRWv4CkoDurlGGdF9qv/pub?output=csv';
// Requerimos correo para validar ediciones/borrados por autor
const REQUIRED_FIELDS = ['correo_autor', 'nombre_autor', 'titulo_app', 'url_app'];

const COLUMN_NAME_MAP = {
    'Marca temporal': 'timestamp',
    'Dirección de correo electrónico': 'correo_autor',
    '¿QUIERES ELIMINAR UN REGISTRO?\nMarca la casilla y escribe más abajo la URL que tiene tu recurso. En el resto de campos, escribe cualquier cosa y envía el formulario.\nIMPORTANTE: Si solo quieres rectificar un registro, no marques esta casilla, haz lo que se  indica a continuación': 'eliminar_registro',
    'Tu nombre (Autor/a de la aplicación)\nIndica tu nombre o el alias con el que quieres que se te reconozca. Este nombre será público y aparecerá junto a tu aplicación. Si hay más de un autor o autora, sepáralos por comas': 'nombre_autor',
    'Título del recurso multimedia\nEl nombre que verán los usuarios en el repositorio.': 'titulo_app',
    'Enlace (URL) al recurso\nPega aquí el enlace completo y público. Es muy importante que verifiques que funciona correctamente para cualquier persona.': 'url_app',
    'Descripción breve\n¿Qué problema resuelve? ¿Qué se aprende con ella? ¿Cómo se usa? Aporta los detalles necesarios para que otra persona entienda su valor y su propósito educativo.': 'descripcion_app',
    'Herramientas usadas\nSelecciona las herramientas que usaste para crear la aplicación.': 'plataforma',
    'Tipo de recurso\n¿Qué formato tiene el recurso? Esto ayuda a filtrar por tipo de actividad. ': 'tipo_recurso',
    'Nivel o niveles educativos\nMarca todos los niveles para los que consideres que tu recurso es adecuado. Puedes seleccionar más de uno.': 'nivel_educativo',
    'Área o áreas de conocimiento\nElige las áreas temáticas que cubre tu recurso. Puedes marcar varias opciones.': 'area_conocimiento',
    'Palabras clave (opcional)\nEscribe un máximo de 10 palabras clave separadas por comas (ej: sistema solar, planetas, astronomía). Esto mejora mucho las búsquedas.': 'palabras_clave',
    'Licencia de uso\nIndica los permisos que otorgas sobre tu obra. Si no estás seguro, Creative Commons BY-SA es una buena opción para compartir en educación.': 'licencia',
};


function processData(data) {
    const normalizeString = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    const normalizeHeader = (str) => normalizeString(String(str))
        .replace(/^\uFEFF/, '') // quita BOM si existe
        .replace(/\s+/g, ' ')
        .trim();

    // Lookup exact normalized header -> target key
    const headerLookup = new Map(
        Object.entries(COLUMN_NAME_MAP).map(([k, v]) => [normalizeHeader(k), v])
    );

    // Heuristic token-based mapping by includes
    const inferKeyFromHeader = (h) => {
        // order matters: use more specific checks first
        if (h.includes('eliminar') && h.includes('registro')) return 'eliminar_registro';
        if ((h.includes('marca') && h.includes('temporal')) || h === 'timestamp') return 'timestamp';
        if ((h.includes('correo') || h.includes('email') || h.includes('electr'))) return 'correo_autor';
        if ((h.includes('tu nombre') || (h.includes('autor') && h.includes('aplicacion')) || (h.includes('autor') && h.includes('recurso')))) return 'nombre_autor';
        if (h.includes('titulo') && (h.includes('recurso') || h.includes('multimedia'))) return 'titulo_app';
        if ((h.includes('enlace') || h.includes('url')) && (h.includes('recurso') || h.includes('aplicacion'))) return 'url_app';
        // campo opcional: URL de imagen de la tarjeta
        if ((h.includes('imagen') || h.includes('image')) && (h.includes('enlace') || h.includes('url'))) return 'imagen_url';
        if (h.includes('descripcion') && h.includes('breve')) return 'descripcion_app';
        if (h.includes('herramientas') || h.includes('plataforma')) return 'plataforma';
        if (h.includes('tipo') && h.includes('recurso')) return 'tipo_recurso';
        if (h.includes('nivel') && h.includes('educativ')) return 'nivel_educativo';
        if (h.includes('area') && h.includes('conocimiento')) return 'area_conocimiento';
        if (h.includes('palabras') && h.includes('clave')) return 'palabras_clave';
        if (h.includes('licencia')) return 'licencia';
        return undefined;
    };

    const targetKeys = new Set(Object.values(COLUMN_NAME_MAP));

    const mappedData = data.map((row, idx) => {
        const newRow = {};
        targetKeys.forEach(k => { newRow[k] = ''; });

        Object.entries(row).forEach(([oldKey, value]) => {
            const nh = normalizeHeader(oldKey);
            let mappedKey = headerLookup.get(nh);
            if (!mappedKey) mappedKey = inferKeyFromHeader(nh);
            if (mappedKey) {
                newRow[mappedKey] = value ? String(value).trim() : '';
            }
        });

        // Log for first few rows if nothing mapped (debug aid)
        // No logging in production build
        return newRow;
    });

    // Determinar el correo del autor "propietario" (primer alta no marcado como eliminación) por URL
    const ownerByUrl = new Map(); // url -> { ts, email }
    mappedData.forEach(app => {
        if (!app.url_app) return;
        if (normalizeString(app.eliminar_registro) === 'si') return;
        const url = app.url_app.trim();
        const ts = new Date(app.timestamp).getTime();
        const emailNorm = normalizeString(app.correo_autor || '');
        if (!emailNorm) return; // solo considerar altas con correo válido
        const prev = ownerByUrl.get(url);
        if (!prev || ts < prev.ts) {
            ownerByUrl.set(url, { ts, email: emailNorm });
        }
    });

    // Cortes de borrado validados por coincidencia de correo con el propietario
    const deleteCutoff = new Map();

    mappedData.forEach(app => {
        if (normalizeString(app.eliminar_registro) === 'si' && app.url_app) {
            const url = app.url_app.trim();
            const owner = ownerByUrl.get(url);
            if (!owner) return; // no hay alta previa, ignorar petición de borrado
            const delEmail = normalizeString(app.correo_autor || '');
            if (!delEmail || delEmail !== owner.email) return; // correo no coincide con el propietario vigente
            const ts = new Date(app.timestamp).getTime();
            const prev = deleteCutoff.get(url) ?? -Infinity;
            if (ts > prev) deleteCutoff.set(url, ts);
        }
    });

    // Aceptar solo versiones (altas/ediciones) del propietario y posteriores a un borrado válido
    const appsWithoutDeleted = mappedData.filter(app => {
        if (!app.url_app) return false;
        const url = app.url_app.trim();
        // Nunca consideramos filas de borrado para mostrar
        if (normalizeString(app.eliminar_registro) === 'si') return false;
        const owner = ownerByUrl.get(url);
        if (!owner) return false;
        const emailNorm = normalizeString(app.correo_autor || '');
        if (!emailNorm || emailNorm !== owner.email) return false;
        const cut = deleteCutoff.get(url);
        if (cut !== undefined && new Date(app.timestamp).getTime() <= cut) return false;
        return true;
    });

    const validApps = appsWithoutDeleted.filter(app => {
        if (REQUIRED_FIELDS.some(field => !app[field])) return false;
        try {
            new URL(app.url_app);
            return true;
        } catch (_) {
            return false;
        }
    });

    const seenUrls = new Set();
    const finalData = [];
    for (let i = validApps.length - 1; i >= 0; i--) {
        const app = validApps[i];
        const url = app.url_app.trim();
        if (!seenUrls.has(url)) {
            seenUrls.add(url);
            app.key = url;
            finalData.push(app);
        }
    }
    return finalData;
}

const paramMapping = { subject: 'area_conocimiento', level: 'nivel_educativo', type: 'tipo_recurso', platform: 'plataforma', author: 'nombre_autor', keyword: 'palabras_clave', search: 'search' };
const reverseMapping = Object.fromEntries(Object.entries(paramMapping).map(a => a.reverse()));

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allApps, setAllApps] = useState([]);
  const [appsToDisplay, setAppsToDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState(() => {
    const initialState = {};
    filterCategories.forEach(cat => initialState[cat.id] = new Set());
    return initialState;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const { favorites } = useFavorites();

  // Data fetching and URL param handling effect
  useEffect(() => {
    Papa.parse(CSV_URL, {
        download: true, header: true, skipEmptyLines: true,
        complete: (results) => {
            try {
                // Logs eliminados
                const processedApps = processData(results.data);
                setAllApps(processedApps);
                // Logs eliminados
                // Apply filters from URL after data is loaded
                const params = new URLSearchParams(window.location.search);
                const newFilters = { ...activeFilters };
                let hasUrlFilters = false;
                params.forEach((value, key) => {
                    const category = paramMapping[key.toLowerCase()];
                    if (category === 'search') {
                        setSearchQuery(value);
                    } else if (newFilters[category]) {
                        value.split(',').forEach(v => newFilters[category].add(v));
                        hasUrlFilters = true;
                    }
                });
                if(hasUrlFilters) setActiveFilters(newFilters);

                setLoading(false);
            } catch (e) {
                setError('No se pudieron procesar los datos.');
                setLoading(false);
            }
        },
        error: (error) => {
            setError('No se pudieron cargar los datos del repositorio.');
            setLoading(false);
        }
    });
  }, []);

  // Filtering effect
  useEffect(() => {
    const normalizeString = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    const lowercasedQuery = normalizeString(searchQuery);

    let sourceApps = allApps;
    if (showFavoritesOnly) {
        const favoriteKeys = new Set(Object.values(favorites).flat());
        sourceApps = allApps.filter(app => favoriteKeys.has(app.key));
    }

    const filtered = sourceApps.filter(app => {
      if (lowercasedQuery && !normalizeString(Object.values(app).join(' ')).includes(lowercasedQuery)) {
        return false;
      }
      for (const category in activeFilters) {
        const selectedFilters = activeFilters[category];
        if (selectedFilters.size === 0) continue;
        const appValuesRaw = app[category] || '';
        if (!appValuesRaw) return false;
        const appValues = appValuesRaw.split(',').map(v => v.trim());
        const hasMatch = appValues.some(appVal => [...selectedFilters].some(filterVal => normalizeString(appVal) === normalizeString(filterVal)));
        if (!hasMatch) return false;
      }
      return true;
    });
    setAppsToDisplay(filtered);
    setCurrentPage(1);
  }, [searchQuery, activeFilters, allApps, showFavoritesOnly, favorites]);

  const handleFilterChange = (category, filterValue) => {
    setActiveFilters(prevFilters => {
        const newFilters = new Set(prevFilters[category]);
        if (newFilters.has(filterValue)) {
            newFilters.delete(filterValue);
        } else {
            newFilters.add(filterValue);
        }
        return { ...prevFilters, [category]: newFilters };
    });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveFilters(() => {
        const initialState = {};
        filterCategories.forEach(cat => initialState[cat.id] = new Set());
        return initialState;
    });
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    for (const category in activeFilters) {
        if (activeFilters[category].size > 0) {
            const paramName = reverseMapping[category];
            if (paramName) params.set(paramName, [...activeFilters[category]].join(','));
        }
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
        setShowCopyConfirm(true);
        setTimeout(() => setShowCopyConfirm(false), 2000);
    });
  };

  // Pagination logic
  const lastAppIndex = currentPage * itemsPerPage;
  const firstAppIndex = lastAppIndex - itemsPerPage;
  const currentApps = itemsPerPage === 'all' ? appsToDisplay : appsToDisplay.slice(firstAppIndex, lastAppIndex);

  return (
    <Layout>
      <Header />
      <main>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            <div className="flex-shrink-0 flex gap-2 w-full md:w-auto">
                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} title="Mostrar solo favoritos" className={`action-btn flex flex-grow justify-center items-center gap-2 bg-surface text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-surface shadow-sm border border-muted     ${showFavoritesOnly ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span className="hidden sm:inline">Favoritos</span>
                </button>
                <button onClick={() => setShowFilterPanel(!showFilterPanel)} title="Mostrar/ocultar filtros" className={`action-btn flex flex-grow justify-center items-center gap-2 bg-surface text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-surface shadow-sm border border-muted     ${showFilterPanel ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    <span>Filtros</span>
                </button>
                <button onClick={() => setIsHelpModalOpen(true)} title="Ayuda" className="flex-shrink-0 flex justify-center items-center bg-slate-500 text-white font-semibold p-2.5 rounded-lg hover:bg-slate-600 transition shadow-sm  dark:hover:bg-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </button>
            </div>
        </div>

        {showFilterPanel && 
            <FilterPanel 
                categories={filterCategories} 
                allApps={allApps} 
                activeFilters={activeFilters} 
                onFilterChange={handleFilterChange} 
                onClearFilters={resetAllFilters}
            />
        }

        <ActiveFilters activeFilters={activeFilters} onRemoveFilter={handleFilterChange} />

        <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-500 font-medium ">
                Mostrando {appsToDisplay.length} de {allApps.length} aplicaciones.
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={handleShare} className="text-sm font-semibold flex items-center gap-1 text-[var(--accent)] hover:text-[var(--accent-dark)]  ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                    Compartir Filtros
                </button>
                <label htmlFor="items-per-page-selector" className="text-sm font-medium text-muted ml-4">Mostrar:</label>
                <select id="items-per-page-selector" value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="text-sm rounded-lg border-muted shadow-sm focus:border-[var(--link)] focus:ring-[var(--link)] py-1   ">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value="all">Todas</option>
                </select>
            </div>
        </div>

        {loading && <div id="loading-message" className="text-center p-10">Cargando aplicaciones...</div>}
        {error && <div id="error-message" className="text-center p-10 text-red-500">{error}</div>}
        
        {!loading && !error && (
            <>
                <div id="apps-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentApps.map(app => (
                        <AppCard key={app.key} app={app} />
                    ))}
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalItems={appsToDisplay.length} 
                    itemsPerPage={itemsPerPage} 
                    onPageChange={setCurrentPage} 
                />
            </>
        )}
      </main>
      <Footer />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      {showCopyConfirm && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm py-2 px-4 rounded-full dark:bg-gray-200 dark:text-gray-800">
            ¡URL copiada al portapapeles!
        </div>
      )}
    </Layout>
  );
}
