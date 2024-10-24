import React from 'react'
import { Link } from 'react-router-dom'

const userNavBar = () => {
  return (
    <div>
      <Link to='/userHome'>Home</Link>
      <Link>Search</Link>
      <Link to='/userProfile'>Profile</Link>
    </div>
  )
}

export default userNavBar