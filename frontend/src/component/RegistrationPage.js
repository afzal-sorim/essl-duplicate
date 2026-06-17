import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function RegistrationPage() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegistration = async () => {
    try {
      const userData = {
        firstname,
        lastname,
        email,
        dob,
        password,
        phone,
        address
      };

      await axios.post('http://localhost:9090/api/v1/user/add', userData);
      setRegistrationSuccess(true);
      setError('');
    } catch (error) {
      setError('Registration failed. Email may already be taken.');
      console.error('Registration error:', error);
    }
  };

  if (registrationSuccess) {
    return (
      <div className='centered-container'>
        <div className="login-container">
          <h1>Registration Successful!</h1>
          <div className="registration-link">
            <p>To access your new account <a href="/">Login here</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <div className="login-container">
        <h2>Registration</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <div className="input-container">
          <input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="text" placeholder="Lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="date" placeholder="Birthdate" value={dob} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="input-container">
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button className="login-button" onClick={handleRegistration}>Register</button>
        <div className="login-link">
          <p className='registration-link'>Already have an account? <a href="/">Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
