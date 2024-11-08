import React, { useEffect, useState } from 'react';
import NavBarOwner from '../components/NavBarOwner';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../assets/css/home.css';

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
      <div className="workspace-container">
  {workspaces.length > 0 ? (
    workspaces.map((workspace) => (
      <div className="workspace-card" key={workspace._id}>
        <h2 className="workspace-name">{workspace.name}</h2>

        {/* Display the first image (if it exists) */}
        {workspace.images && workspace.images.length > 0 && (
          <img 
            src={`http://localhost:5000${workspace.images}`}
            alt={`${workspace.name} workspace`}
            className="workspace-image"
            style={{ width: '100%', height: 'auto' }} 
          />
        )}

        <p className="workspace-description">{workspace.description}</p>
        <p>Location: {workspace.location}</p>
        <p>Capacity: {workspace.capacity}</p>
        <p>Pricing: ${workspace.pricing}</p>
        <Link to={`/viewpostOwner/${workspace._id}`}><button>View</button></Link>
      </div>
    ))
  ) : (
    <p>No workspaces found.</p>
  )}
</div>

    </div>
  );
};

export default OwnerHome;
