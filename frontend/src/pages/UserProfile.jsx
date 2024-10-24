import React from 'react'
import { jwtDecode } from 'jwt-decode'


const UserProfile = () => {
    const token = localStorage.getItem('token');
    const id = token ? jwtDecode(token).id : null;
  return (
    <div>

    </div>
  )
}

export default UserProfile