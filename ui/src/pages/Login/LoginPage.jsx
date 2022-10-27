import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import Login from '../../components/Login/Login';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticationService.currentUserValue) {
      navigate('/', { replace: true });
    }
  });

  return (
    <Container className="skinny">
      <Login />
      <Row className="mt-md-5 text-center">
        <Col>
          Don&apos;t have an account, <Link to="/register">Sign Up</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
