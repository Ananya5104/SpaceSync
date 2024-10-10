import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'; 
import LandingPage from './pages/LandingPage';
import OwnerHome from './pages/OwnerHome';
import UserHome from './pages/UserHome';
import CreateWorkspace from './pages/CreateWorkspace';
import OwnerProfile from './pages/OwnerProfile'
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
          <Route path='/createWorkspace' element={<CreateWorkspace/>}  />
          <Route path='/ownerProfile' element={<OwnerProfile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
