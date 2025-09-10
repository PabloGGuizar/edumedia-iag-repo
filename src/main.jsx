import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'

import HomePage from './pages/HomePage'

import './index.css'
import './estilos.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter basename="/edumedia-iag-repo/">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/** Estadísticas deshabilitadas */}
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
