import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBarUser from '../components/NavBarUser';
import '../assets/css/home.css'

const UserHome = () => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch('http://localhost:5000/workspaces', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workspace');
        }

        const data = await response.json();
        console.log('Fetched workspaces:', data); // Ensure you're getting the correct data
        setWorkspaces(data.data);
      } catch (error) {
        console.error('Error fetching workspace:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div>
      <NavBarUser />
      <h1>Available Workspaces</h1>
      <div className='all-ws'>
      {workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <div className="workspace-card" key={workspace._id}>
            <h2 className="workspace-name">{workspace.name}</h2>

            {/* Check if images exist and render accordingly */}
            {workspace.images && workspace.images.length > 0 ? (
              <img
                src={`http://localhost:5000${workspace.images}`} // Assuming images is an array
                alt={`${workspace.name} workspace`} 
                className="workspace-image"
                style={{ width: '100%', height: 'auto' }}
              />
            ) : (
              <p>No image available</p>
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

export default UserHome;
