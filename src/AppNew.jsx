import { useState, useEffect } from 'react';
import Login from './Login';
import Quiz from './Quiz';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Quiz username={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}
