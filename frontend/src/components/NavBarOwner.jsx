import React from 'react'
import { Link } from 'react-router-dom'

const NavBarOwner = () => {
  return (
    <div>
        <Link to={'/ownerHome'}>Home</Link>
        <Link to={'/createWorkspace'}>Create</Link>
        <Link to={'/ownerProfile'}>Profile</Link>
    </div>
  )
}

export default NavBarOwner