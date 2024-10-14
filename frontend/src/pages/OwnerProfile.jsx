import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../assets/css/ownerprofile.css';
import NavBarOwner from '../components/NavBarOwner';

const OwnerProfile = () => {
  const [owner, setOwner] = useState({});
  const [editing, setEditing] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [changePasswordModal, setChangePasswordModal] = useState(false); // For modal visibility
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');
  const id = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch owner details
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/owners/${id}`);
        setOwner(response.data);
      } catch (error) {
        alert('Error fetching owner details');
        console.log(error);
      }
    };
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workspaces/owner/${id}`, {
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

    if (id) {
      fetchOwner();
      fetchWorkspaces();
    }
  }, [id]);

  const validateForm = () => {
    let formErrors = {};

    // Name validation: Should not contain special characters or numbers
    if (!/^[a-zA-Z\s]+$/.test(owner.name)) {
      formErrors.name = 'Name should only contain letters and spaces.';
    }

    // Phone Number: 10 digits only
    if (!/^\d{10}$/.test(owner.phno)) {
      formErrors.phno = 'Phone number should be a 10-digit number.';
    }

    // Email: Valid email pattern
    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(owner.email)) {
      formErrors.email = 'Email is not valid.';
    }

    // Password validation if the user is changing it
    if (changePasswordModal) {
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newPassword)) {
        formErrors.newPassword = 'Password must be at least 6 characters long, include a number, a special character, and an uppercase letter.';
      }
      if (newPassword !== confirmPassword) {
        formErrors.confirmPassword = 'New password and confirmation password do not match.';
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwner((prevOwner) => ({ ...prevOwner, [name]: value }));
  };

  const handleUpdateOwner = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/owners/${id}`, owner);
      alert('Owner details updated successfully');
      setEditing(false);
      navigate('/ownerProfile');
    } catch (error) {
      alert('Error occurred while updating owner details');
      console.log(error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/owners/${id}/update-password`, {
        currentPassword,
        newPassword,
      });
      alert('Password updated successfully');
      setChangePasswordModal(false); // Close the modal on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('Error updating password. Please check the current password.');
      console.log(error);
    }
  };

  return (
    <div className="update-container">
      <NavBarOwner />
      <h1 className="title">Edit Owner Details</h1>
      <div className="owner-profile">
        <div className="owner-image-logout">
          <img
            src={'./images/default-profile.webp'}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
          <p className="logout-btn" onClick={handleLogout}>
            Logout
          </p>
        </div>
        <div className="owner-info">
          <div className="heading-profile">
            <h2>Owner Profile</h2>
            <button className="edit-profile-btn" onClick={handleEditToggle}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="edit-profile-btn" onClick={() => setChangePasswordModal(true)}>
              Change Password
            </button>
          </div>

          {editing ? (
            <div className="update-card">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={owner.name || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
              <label>Phone Number</label>
              <input
                type="text"
                name="phno"
                value={owner.phno || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.phno && <p className="error-message">{errors.phno}</p>}
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={owner.email || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
              <button onClick={handleUpdateOwner} className="save-button">
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              {['name', 'phno', 'email'].map((field) => (
                <div className="profile-item" key={field}>
                  <span className="label">{field}:</span>
                  <span>{owner[field] || 'N/A'}</span>
                </div>
              ))}
              <div className="profile-item">
                <span className="label">Revenue:</span>
                <span>{owner.revenue || 0}</span>
              </div>
              <div className="profile-item">
                <span className="label">Workspaces:</span>
                <ul>
                  {workspaces && workspaces.length > 0 ? (
                    workspaces.map((workspace) => (
                      <li key={workspace._id}>{workspace.name}</li>
                    ))
                  ) : (
                    <li>No workspaces added</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Change Password */}
      {changePasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Change Password</h2>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
            />
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
            />
            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            <div className="modal-buttons">
              <button onClick={handleUpdatePassword} className="save-button">
                Update Password
              </button>
              <button onClick={() => setChangePasswordModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProfile;
