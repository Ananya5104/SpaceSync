import React, { useEffect, useState } from 'react'
import NavBarOwner from '../components/NavBarOwner'
import ViewWorkspace from '../components/ViewWorkspace'
import NavBarUser from '../components/NavBarUser'
import OwnerWSactions from '../components/OwnerWSactions'
import UserWSactions from '../components/UserWSactions'
import { jwtDecode } from 'jwt-decode'

const ViewPostOwner = () => {
  const token = localStorage.getItem('token');
  const id = token ? jwtDecode(token).id : null;
  const decoded = jwtDecode(token)
  const [role, setRole] = useState('')
  useEffect(()=>{
    if(token){
      setRole(decoded.role)
    }
  },[])
  const renderNavBar = () => {
    if (role === 'owner') {
      return <NavBarOwner />;
    } else if (role === 'user') {
      return <NavBarUser />;
    } else {
      return null; // Or a default navbar
    }
  };
  const renderActions = () =>{
    if (role === 'owner') {
      return <OwnerWSactions/>;
    } else if (role === 'user') {
      return <UserWSactions/>;
    } else {
      return null; // Or a default navbar
    }
  };
  return (
    <div>
      {renderNavBar()}
      <ViewWorkspace/>
      {renderActions()}
    </div>
  )
}

export default ViewPostOwner