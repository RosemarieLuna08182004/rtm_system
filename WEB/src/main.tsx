import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './AppRouter';
import './styles/GlobalStyles.css';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={ AppRouter } />
    </AuthProvider>
  </StrictMode>,
);
