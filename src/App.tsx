import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { setAccessToken, loginSuccess } from './redux/authSlice'; 
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setAccessToken(token));
      dispatch(loginSuccess()); // Gọi action loginSuccess để cập nhật trạng thái
    }
  }, [dispatch]);

  return (
    <Router> {/* Wrap your app with Router to enable routing context */}
      <div className="min-h-screen bg-gray-100 p-6">
        {isLoggedIn ? (
          <Dashboard /> // Show the Dashboard if logged in
        ) : (
          <Login /> // Show the Login page if not logged in
        )}
      </div>
    </Router>
  );
};

export default App;
