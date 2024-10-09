import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginPage.css'; // Ensure this file exists

const LoginPage = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/signup', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, role: formData.role }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/login'); 
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/login', { // Adjust the URL as needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store the JWT token
  
        // Redirect based on user role
        if (data.role === 'owner') {
          navigate('/ownerHome'); // Redirect to owner home
        } else if (data.role === 'user') {
          navigate('/userHome'); // Redirect to user home
        }
      } else {
        setMessage(data.msg || 'Login failed.'); // Use msg from response
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      setMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h2>Create Account</h2>
          {message && <p className="message">{message}</p>}
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignIn}>
          <h2>Sign in</h2>
          {message && <p className="message">{message}</p>}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay for Animation */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us, please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
