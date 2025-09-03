import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const FavoritesContext = createContext();

export function useFavorites() {
    return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useLocalStorage('educationalAppsFavorites', { General: [] });

    const addFavorite = (appKey, category = 'General') => {
        setFavorites(prev => {
            const newFavs = { ...prev };
            // Remove from any other category first
            for (const cat in newFavs) {
                newFavs[cat] = newFavs[cat].filter(key => key !== appKey);
            }
            // Add to the new category
            if (!newFavs[category]) {
                newFavs[category] = [];
            }
            newFavs[category].push(appKey);
            return newFavs;
        });
    };

    const removeFavorite = (appKey) => {
        setFavorites(prev => {
            const newFavs = { ...prev };
            for (const cat in newFavs) {
                newFavs[cat] = newFavs[cat].filter(key => key !== appKey);
            }
            return newFavs;
        });
    };

    const isFavorite = (appKey) => {
        return Object.values(favorites).some(arr => arr.includes(appKey));
    };

    const value = {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}
