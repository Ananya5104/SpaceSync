import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/css/ViewWorkspace.css'; // Import your CSS file for styling

const ViewWorkspace = () => {
    const [workspace, setWorkspace] = useState(null); // Initialize as null
    const { id } = useParams(); 

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await fetch(`http://localhost:5000/workspaces/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch workspace');
                }

                const data = await response.json();
                console.log('Fetched workspace data:', data); // Log the data for debugging
                setWorkspace(data);
            } catch (error) {
                console.error('Error fetching workspace:', error);
            }
        };

        fetchWorkspace();
    }, [id]);

    return (
        <div className="workspace-view-container">
            {workspace ? ( 
                <div className="workspace-details">
                    <h1 className="workspace-name">{workspace.name}</h1>
                    {workspace.images && workspace.images.length > 0 && (
                        <img 
                            src={`http://localhost:5000${workspace.images[0]}`} // Display the first image
                            alt={`${workspace.name} workspace`}
                            className="workspace-imagess"
                            style={{ width: '40%', height: 'auto' }}
                        />
                    )}
                    <p className="workspace-description">{workspace.description || 'No description available.'}</p>
                    <div className="workspace-information">
                        <h2>Workspace Information</h2>
                        <p><strong>Location:</strong> {workspace.location}</p>
                        <p><strong>Address:</strong> {workspace.address}</p>
                        <p><strong>Capacity:</strong> {workspace.capacity}</p>
                        <p><strong>Pricing:</strong> ${workspace.pricing}</p>
                        <p><strong>Amenities:</strong> {workspace.amenities.length > 0 ? workspace.amenities.join(', ') : 'No amenities available.'}</p>
                        <p><strong>Owner:</strong> {workspace.ownername || 'Unknown'}</p>
                        <p><strong>Available:</strong> {workspace.availability ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            ) : (
                <p>Loading workspace details...</p>
            )}
        </div>
    );
}

export default ViewWorkspace;
