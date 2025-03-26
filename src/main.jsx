import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css';
import HomePage from './Components/Homepage.jsx';
import IndexPage from './IndexPage.jsx';
import Gallerys from './Components/Gallerys.jsx';
import Photogallery from './Components/Photogallery.jsx';
import AuthPage from './Components/Authpage.jsx';
import AuthpageSelection from './Components/AuthpageSelection.jsx';
import ProtectedRoute from './protectedroute.jsx'
import ProtectedRouteSelection from './protectedSelection.jsx';

const router = createBrowserRouter([
  { path: "/", element: <IndexPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/authpage", element: <AuthPage /> },
  { path: "/authpageselection", element: <AuthpageSelection /> },
  {
    path: "/selection/:event_id",
    element: (
      <ProtectedRouteSelection>
        <Gallerys />
      </ProtectedRouteSelection>
    ),
  },
  {
    path: "/gallery/:event_id",
    element: (
      <ProtectedRoute>
        <Photogallery />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
