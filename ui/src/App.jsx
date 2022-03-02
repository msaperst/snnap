import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Menu from './components/Menu/Menu';
import ProfilePage from './pages/Profile/ProfilePage';
import { PrivateRoute } from './helpers/PrivateRoute';
import './App.css';
import NotFound from './pages/NotFound/NotFound';
import { authenticationService } from './services/authentication.service';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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
    <div className="vertical-center">
      <Container>
        <Row>
          <Col>
            <Menu currentUser={currentUser} logout={logout} />
          </Col>
        </Row>
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
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
