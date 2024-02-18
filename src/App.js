import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null); // Reset token to null on logout
  };

  return (
    <div>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Chat token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;

