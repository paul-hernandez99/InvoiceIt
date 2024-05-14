import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { useAuth } from '../../AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from '../../axios';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigate = useNavigate();
  const { currentUser, setUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');  // Redirect to the dashboard or another protected route
    }
  }, [currentUser, navigate]);

  const SignUp = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password, name, surname, birthday }
      await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      await axios.post('/user', userData);
      setUser(userData)
      navigate('/');  // Redirect to dashboard after successful signup
    } catch (error) {
      console.error('Failed to create an account', error);
      alert('Sign up failed: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={SignUp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="surname"
            value={surname}
            onChange={e => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="birthday"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;


