import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/Homepage.jsx';
import IndexPage from './IndexPage.jsx';
import Gallerys from './Components/Gallerys.jsx';
import Photogallery from './Components/Photogallery.jsx';
import AuthPage from './Components/Authpage.jsx';
import AuthpageSelection from './Components/AuthpageSelection.jsx';
import ProtectedRoute from './protectedroute.jsx'
import ProtectedRouteSelection from './protectedSelection.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/authpage' element={<AuthPage />} />
        <Route path='/authpageselection' element={<AuthpageSelection />} />
        
      
        <Route
          path='/selection/:event_uuid'
          element={
            <ProtectedRouteSelection >
              <Gallerys />
            </ProtectedRouteSelection>
          }
        />
        <Route
          path='/gallery/:event_uuid'
          element={
            <ProtectedRoute>
              <Photogallery />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
