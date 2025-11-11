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
import Favourites from './pages/Favourites.jsx';
import SEO from './components/SEO.jsx';
import Guidelines from './components/innerpages/Guidelines.jsx';
import Disclaimer from './components/innerpages/Disclaimer.jsx';
import Cookies from './components/innerpages/Cookies.jsx';
import RefundPolicy from './components/innerpages/RefundPolicy.jsx';
import EarningsDisclaimer from './components/innerpages/EarningsDisclaimer.jsx';
import DMCA from './components/innerpages/DMCA.jsx';
import Safety from './components/innerpages/Safety.jsx';
import DataPolicy from './components/innerpages/DataPolicy.jsx';
import About from './components/innerpages/About.jsx';
import HowItWorks from './components/innerpages/HowItWorks.jsx';
import FAQs from './components/innerpages/FAQ.jsx';






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
          <Route path='favourites' element={<Favourites />} />
          <Route path="/theme-preview" element={<ThemePreview />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/earnings-disclaimer" element={<EarningsDisclaimer />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/data-policy" element={<DataPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<FAQs />} />
        </Route>
      </Routes>
    </Router>
  );
}
