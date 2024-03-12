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
    <Container>
      <Row>
        <Col className="col-12 col-lg-4">
          <h4 id="tagline" className="mt-lg-3">
            Photography help in a <i>snap</i>
          </h4>
          <p>
            Snnap is a community for photophiles; connecting photographers,
            editors, assistants, and all involved in helping to capture moments.
            Come here to find jobs others are posting, or to create your own
            request for assistance.
          </p>
        </Col>
        <Col className="col-lg-1 d-none d-lg-block" />
        <Col className="col-12 col-lg-7">
          <Login />
        </Col>
      </Row>
      <Row className="mt-md-5 text-center">
        <Col>
          Don&apos;t have an account, <Link to="/register">Sign Up</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
