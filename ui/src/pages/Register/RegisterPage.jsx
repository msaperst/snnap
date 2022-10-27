import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import Register from '../../components/Register/Register';

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticationService.currentUserValue) {
      navigate('/profile', { replace: true });
    }
  });

  return (
    <Container className="skinny">
      <Register />
    </Container>
  );
}

export default RegisterPage;
