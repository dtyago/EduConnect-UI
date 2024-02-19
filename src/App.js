import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);

  useEffect(() => {
    // Update token storage in sessionStorage when it changes
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [token]);

  const handleLoginSuccess = (data) => {
    const authToken = data.access_token; // Adjust based on actual structure
    setToken(authToken);
    sessionStorage.setItem('token', authToken); // Use sessionStorage for persistence
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://bitbasher-educonnect.hf.space/user/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setToken(null); // Reset token to null on successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      {!token ? (
        <Login onLogin={handleLoginSuccess} />
      ) : (
        <Chat token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
