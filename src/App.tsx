// src/App.tsx
import React, { useState } from 'react';
import Login from './pages/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isLoggedIn ? (
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Admin Dashboard</h1>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
