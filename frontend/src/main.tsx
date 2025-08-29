import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css';
import AuthPage from './pages/AuthPage';
import NotesPage from './pages/NotesPage';

const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  { path: '/notes', element: <NotesPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
