import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { useAuth } from '../../AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const signIn = async (e) => {

    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');  // Redirect to dashboard after login
    } catch (error) {
      console.error('Failed to login', error);
      alert('Sign in failed: ' + error.message);
    }

  }

  return (
    <div className="container">
      <img src={require('../../assets/images/logo.png')} alt="logo" />
      <h1>Hello Again!</h1>
      <h2>Welcome back you've been missed!</h2>
      <div>
        <form onSubmit={signIn}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
    </div>
    <div>
      <span>
        Not a member?{' '}
        <button onClick={() => navigate('/signup')}>
          Register now
        </button>
      </span>
    </div>
    </div>
  );
};

export default Login;
