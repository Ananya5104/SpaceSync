import React, { useState } from 'react';
import NavBarUser from '../components/NavBarUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserProfile = () => {
  const [editing, setEditing] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [user, setUser] = useState({ name: '', phno: '', email: '', role: 'User' }); // Example initial state
  const [workspaces, setWorkspaces] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setError] = useState({});
  const token = localStorage.getItem('token');
  const id = token ? jwtDecode(token).id : null;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token for authorization
          },
        });
        setUser(response.data);
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workspaces/user/${id}`, {
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
    if (id){
      fetchUser();
      fetchWorkspaces();
    } 
  }, [id, token]);
  const validateForm = () => {
    let formErrors = {};

    // Name validation: Should not contain special characters or numbers
    if (!/^[a-zA-Z\s]+$/.test(user.name)) {
      formErrors.name = 'Name should only contain letters and spaces.';
    }

    // Phone Number: 10 digits only
    if (!/^\d{10}$/.test(user.phno)) {
      formErrors.phno = 'Phone number should be a 10-digit number.';
    }

    // Email: Valid email pattern
    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
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

    setError(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleEditToggle = () => setEditing(!editing);
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleUpdateUser = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/users/${id}`, user);
      alert('User details updated successfully');
      setEditing(false);
      navigate('/userProfile');
    } catch (error) {
      alert('Error occurred while updating user details');
      console.log(error);
    }
  };
  const handleUpdatePassword = () => {
    // Logic to handle password update
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="update-container">
      <NavBarUser />
      <h1 className="title">Edit User Details</h1>
      <div className="user-profile">
        <div className="user-image-logout">
          <img
            src={'./assets/default-profile.jpg'}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
          <p className="logout-btn" onClick={handleLogout}>
            Logout
          </p>
        </div>
        <div className="user-info">
          <div className="heading-profile">
            <h2>User Profile</h2>
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
                value={user.name || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
              <label>Phone Number</label>
              <input
                type="text"
                name="phno"
                value={user.phno || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.phno && <p className="error-message">{errors.phno}</p>}
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={user.email || ''}
                onChange={handleChange}
                className="input-field"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
              <button onClick={handleUpdateUser} className="save-button">
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              {['name', 'phno', 'email'].map((field) => (
                <div className="profile-item" key={field}>
                  <span className="label">{field}:</span>
                  <span>{user[field] || 'N/A'}</span>
                </div>
              ))}
              {/* <div className="profile-item">
                <span className="label">Role:</span>
                <span>{user.role || 'User'}</span>
              </div> */}
              <div className="profile-item">
                <span className="label">Subscribed Workspaces:</span>
                <ul>
                  {workspaces && workspaces.length > 0 ? (
                    workspaces.map((workspace) => (
                      <li key={workspace._id}>{workspace.name}</li>
                    ))
                  ) : (
                    <li>No workspaces subscribed</li>
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

export default UserProfile;
