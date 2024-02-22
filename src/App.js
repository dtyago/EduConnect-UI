import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);

  useEffect(() => {
    // Update token storage in sessionStorage when it changes
    document.title = 'EduConnect';
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [token]);

  const handleLoginSuccess = (data) => {
    const { access_token, name, user_id, role } = data; // Destructure the new details from the response
    
    // Store each piece of information in session storage
    sessionStorage.setItem('token', access_token);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('emailId', user_id);
    sessionStorage.setItem('role', role);
  
    setToken(access_token); // Update state
  };
  

  const handleLogout = async () => {
    // Attempt to notify the backend of logout
    try {
      await axios.post('https://bitbasher-educonnect.hf.space/user/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear the token from state and session storage regardless of POST /user/logout outcome
      setToken(null);
      sessionStorage.removeItem('token');
      // Optionally, clear other user-related information from session storage
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('emailId');
      sessionStorage.removeItem('role');
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
