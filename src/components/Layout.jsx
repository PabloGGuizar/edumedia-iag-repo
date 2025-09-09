import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
