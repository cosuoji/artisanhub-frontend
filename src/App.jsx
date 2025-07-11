import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Directory from './pages/Directory.jsx';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ThemePreview from './pages/ThemePreview.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import ResendVerification from './pages/ResendVerification.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { Navigate, useLocation } from 'react-router-dom';






export default function App() {

  const init = useAuthStore((state) => state.init);
  const {user} = useAuthStore()

  useEffect(() => {
    init();
  }, []);


  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/theme-preview" element={<ThemePreview />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resend-verification" element={<ResendVerification /> } />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard"/> } />
          <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/dashboard"/> } />

        </Route>
      </Routes>
    </Router>
  );

}