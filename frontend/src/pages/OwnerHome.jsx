import React, { useEffect, useState } from 'react';
import NavBarOwner from '../components/NavBarOwner';
import { jwtDecode } from 'jwt-decode';

const OwnerHome = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const ownerId = jwtDecode(localStorage.getItem('token')).id; // Get owner ID from token

  // Fetch workspaces for the logged-in owner
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workspaces/owner/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token for authentication
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch workspaces');
        }
        
        const data = await response.json();
        setWorkspaces(data); // Set the fetched workspaces to state
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };

    fetchWorkspaces();
  }, [ownerId]); // Dependency array ensures this runs when ownerId changes

  return (
    <div>
      <NavBarOwner />
      <h1>Your Workspaces</h1>
      {workspaces.length > 0 ? (
        <ul>
          {workspaces.map((workspace) => (
            <li key={workspace._id}>
              <h2>{workspace.name}</h2>
              <p>{workspace.description}</p>
              <p>Location: {workspace.location}</p>
              <p>Capacity: {workspace.capacity}</p>
              <p>Pricing: {workspace.pricing}</p>
              <img src={workspace.image} alt={workspace.name} style={{ width: '100px', height: '100px' }} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No workspaces found.</p>
      )}
    </div>
  );
};

export default OwnerHome;
