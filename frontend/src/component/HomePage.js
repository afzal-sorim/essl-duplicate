import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import './design/HomePage.css';

function HomePage({ user, onLogout }) {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleProfile = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <span className="navbar-brand">Sorim System</span>
        <span>Welcome, {user.firstname}!</span>
        <div className="nav-icons">
          <FaUser className="user-icon" onClick={toggleUserMenu} />
          {isUserMenuOpen && (
            <div className="custom-menu">
              <ul>
                <li onClick={handleProfile}><FaInfoCircle style={{ marginRight: '8px' }} />Profile</li>
                <li onClick={handleLogout}><FaSignOutAlt style={{ marginRight: '8px' }} />Logout</li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <header>
        <h1>Welcome, {user.firstname} {user.lastname}!</h1>
        <p>You are successfully logged in.</p>
      </header>
      <main>
        <div className="dashboard-card">
          <h3>Dashboard</h3>
          <p>Email: {user.email}</p>
          <p>Member since: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
