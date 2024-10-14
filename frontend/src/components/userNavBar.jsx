import React from 'react'
import { Link } from 'react-router-dom'

const userNavBar = () => {
  return (
    <div>
      <Link>Home</Link>
      <Link>Search</Link>
      <Link>Profile</Link>
    </div>
  )
}

export default userNavBar