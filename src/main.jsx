import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css';
import HomePage from './Components/HomePage.jsx';
import IndexPage from './IndexPage.jsx';
import GallerySelectionPage from './Components/GallerySelectionPage.jsx';
import GalleryViewPage from './Components/GalleryViewPage.jsx';
import GalleryViewAuthPage from './Components/GalleryViewAuthPage.jsx';
import GallerySelectionAuthPage from './Components/GallerySelectionAuthPage.jsx';
import ProtectedRoute from './protectedroute.jsx'
import ProtectedRouteSelection from './protectedSelection.jsx';

const router = createBrowserRouter([
  { path: "/", element: <IndexPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/authpage", element: <GalleryViewAuthPage /> },
  { path: "/authpageselection", element: <GallerySelectionAuthPage /> },
  {
    path: "/selection/:event_id",
    element: (
      <ProtectedRouteSelection>
        <GallerySelectionPage />
      </ProtectedRouteSelection>
    ),
  },
  {
    path: "/gallery/:event_id",
    element: (
      <ProtectedRoute>
        <GalleryViewPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
