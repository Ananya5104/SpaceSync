import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'; 
import LandingPage from './pages/LandingPage';
import OwnerHome from './pages/OwnerHome';
import UserHome from './pages/UserHome';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/ownerHome' element={<OwnerHome/>}/>
          <Route path='userHome' element={<UserHome/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
