import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Simple local authentication (in-memory storage)
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isSignUp) {
      if (users[username]) {
        setError('Username already exists');
        return;
      }
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      setError('');
    } else {
      if (!users[username] || users[username] !== password) {
        setError('Invalid username or password');
        return;
      }
    }

    // Store current user session
    localStorage.setItem('currentUser', username);
    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🧠 AI Quiz Master</h1>
        <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
