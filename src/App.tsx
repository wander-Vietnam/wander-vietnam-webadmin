import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Nhập component Dashboard

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isLoggedIn ? (
        <Dashboard /> 
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
