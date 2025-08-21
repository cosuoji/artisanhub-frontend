import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import DirectoryPage from './pages/DirectoryPage.jsx';
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
import SingleArtisanPage from './pages/SingleArtisanPage.jsx';
import CookieConsentBanner from './components/CookieConsentBanner.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Favourites from './pages/Favourites.jsx';
import SEO from './components/SEO.jsx';


export default function App() {
  const init = useAuthStore((state) => state.init);
  const { user } = useAuthStore();


  useEffect(() => {
    init();
  }, []);

  return (
    <Router>
      <CookieConsentBanner />
       <SEO />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/artisans/:id" element={<SingleArtisanPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path='favourites' element={<Favourites />} />
          <Route path="/theme-preview" element={<ThemePreview />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}
