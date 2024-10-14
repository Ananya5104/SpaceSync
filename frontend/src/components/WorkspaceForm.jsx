import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Forms.css';
import {jwtDecode} from "jwt-decode";

const WorkspaceForm = () => {
  const ownerId = jwtDecode(localStorage.getItem('token')).id;
  const [workspaceData, setWorkspaceData] = useState({
    name: '',
    location: '',
    address: '',
    capacity: '',
    pricing: '',
    description: '',
    amenities: '',
    owner: ownerId,
  });

  const [images, setImages] = useState([]);  // For handling multiple images
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkspaceData({
      ...workspaceData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!workspaceData.name) newErrors.name = "Workspace name is required.";
    if (!workspaceData.location) newErrors.location = "Location is required.";
    if (!workspaceData.address) newErrors.address = "Address is required.";
    if (workspaceData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0.";
    if (!workspaceData.pricing) newErrors.pricing = "Pricing is required.";
    if (!workspaceData.description) newErrors.description = "Description is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update this function to handle image selection correctly
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    // Append form data fields
    Object.keys(workspaceData).forEach(key => {
      formData.append(key, workspaceData[key]);
    });
    
    // Append multiple image files
    images.forEach((image, index) => {
      formData.append('images', image);  // Ensure the field name is 'images' to match the backend
    });

    try {
      const response = await fetch('http://localhost:5000/workspaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Include JWT token for authentication
        },
        body: formData,  // Send FormData directly
      });

      const data = await response.json();
      if (response.ok) {
        setWorkspaceData({
          name: '',
          location: '',
          address: '',
          capacity: '',
          pricing: '',
          description: '',
          amenities: '',
          owner: ownerId,
      });
      setImages([]);
      console.log("Package created successfully!");
        navigate('/ownerHome');
      } else {
        alert(data.message || 'Failed to create workspace.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error("Error creating workspace:", error);
    }
  };

  return (
    <div className="container">
      <h2>Create a New Workspace</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={workspaceData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={workspaceData.location}
            onChange={handleChange}
            required
          />
          {errors.location && <p className="error-message">{errors.location}</p>}
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={workspaceData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
        </div>

        <div>
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={workspaceData.capacity}
            onChange={handleChange}
            required
          />
          {errors.capacity && <p className="error-message">{errors.capacity}</p>}
        </div>

        <div>
          <label>Pricing:</label>
          <input
            type="number"
            name="pricing"
            value={workspaceData.pricing}
            onChange={handleChange}
            required
          />
          {errors.pricing && <p className="error-message">{errors.pricing}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={workspaceData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <div>
          <label>Amenities (comma-separated):</label>
          <input
            type="text"
            name="amenities"
            value={workspaceData.amenities}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Images :</label>
          <input
            type="file"
            name="images"
            multiple  
            onChange={handleImageChange}
          />
        </div>

        <button className='workspacebutton' type="submit">Create Workspace</button>
      </form>
    </div>
  );
};

export default WorkspaceForm;
