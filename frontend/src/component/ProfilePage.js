import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './design/HomePage.css';

function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/v1/user/profile?email=${encodeURIComponent(user.email)}`);
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.email]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) return <div className="centered-container"><div className="login-container"><p>Loading profile...</p></div></div>;

  if (error) return <div className="centered-container"><div className="login-container"><p style={{ color: 'red' }}>{error}</p></div></div>;

  return (
    <div className="home-page">
      <nav className="navbar">
        <span className="navbar-brand">Sorim System</span>
        <span>Profile</span>
        <div className="nav-icons">
          <FaArrowLeft className="user-icon" onClick={handleBack} />
        </div>
      </nav>
      <header>
        <h1>Profile Information</h1>
      </header>
      <main>
        <div className="profile-card">
          <div className="profile-avatar">
            {profile.firstname?.charAt(0).toUpperCase()}{profile.lastname?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <div className="profile-row">
              <span className="profile-label">First Name</span>
              <span className="profile-value">{profile.firstname}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Last Name</span>
              <span className="profile-value">{profile.lastname}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{profile.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Date of Birth</span>
              <span className="profile-value">{profile.dob || 'Not set'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Age</span>
              <span className="profile-value">{profile.age != null ? profile.age : 'N/A'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Phone</span>
              <span className="profile-value">{profile.phone || 'Not set'}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Address</span>
              <span className="profile-value">{profile.address || 'Not set'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
