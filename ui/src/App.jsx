import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './helpers/PrivateRoute';
import Menu from './components/Menu/Menu';
import GDPR from './components/GDPR/GDPR';
import Footer from './components/Footer/Footer';
import './App.css';

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Register/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const ChatPage = lazy(() => import('./pages/Chat/ChatPage'));
const NotificationsPage = lazy(() =>
  import('./pages/Notifications/NotificationsPage')
);
const Jobs = lazy(() => import('./pages/Jobs/Jobs'));
const JobApplications = lazy(() =>
  import('./pages/JobApplications/JobApplications')
);
const TermsOfUse = lazy(() => import('./pages/TermsOfService/TermsOfUse'));
const PrivacyPolicy = lazy(() =>
  import('./pages/TermsOfService/PrivacyPolicy')
);
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showGDPR, setShowGDPR] = useState(false);

  useEffect(() => {
    authenticationService.currentUser.subscribe((x) => {
      setCurrentUser(x);
    });
  });

  const logout = () => {
    authenticationService.logout();
    navigate('/login');
  };

  return (
    <Container>
      <GDPR showGDPR={showGDPR} setShowGDPR={setShowGDPR} />
      <Row>
        <Col>
          <Menu currentUser={currentUser} logout={logout} />
        </Col>
      </Row>
      <Container className="medium" role="main">
        <Suspense fallback="Loading...">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              }
            />
            <Route
              path="/job-applications"
              element={
                <PrivateRoute>
                  <JobApplications />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy showGDPR={setShowGDPR} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Container>
      <Footer />
    </Container>
  );
}

export default App;
