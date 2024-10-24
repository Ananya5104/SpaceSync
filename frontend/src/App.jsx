import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'; 
import LandingPage from './pages/LandingPage';
import OwnerHome from './pages/OwnerHome';
import UserHome from './pages/UserHome';
import CreateWorkspace from './pages/CreateWorkspace';
import ViewPostOwner from './pages/ViewPostOwner';
import OwnerProfile from './pages/OwnerProfile'
import UserProfile from './pages/UserProfile';
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
          <Route path = '/viewpostOwner/:id' element= {<ViewPostOwner/>} />
          <Route path='/ownerProfile' element={<OwnerProfile/>} />
          <Route path='/userProfile' element={<UserProfile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
