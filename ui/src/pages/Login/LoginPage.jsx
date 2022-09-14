import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticationService.currentUserValue) {
      navigate('/', { replace: true });
    }
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const location = useLocation();

  let from = '/';
  if (location.state && location.state.from && location.state.from.pathname) {
    from = location.state.from.pathname;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      const data = event.target;
      authenticationService
        .login(data[0].value, data[1].value, data[2].checked)
        .then(
          () => {
            navigate(from, { replace: true });
          },
          (error) => {
            setIsSubmitting(false);
            setStatus(error.toString());
          }
        );
    }
    setValidated(true);
  };

  return (
    <Container className="skinny">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Row className="mb-3">
          <SnnapFormInput name="Username" />
        </Row>
        <Row className="mb-3">
          <SnnapFormInput name="Password" type="password" />
        </Row>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Check id="rememberMe" label="Remember Me" defaultChecked />
          </Col>
          <Col md={7} className="text-md-end">
            <Link to="/passwordReset">Forgot Password</Link>
          </Col>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Button
              id="loginButton"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}{' '}
              Login
            </Button>
          </Form.Group>
          <Col md={8}>
            {status && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setStatus(null)}
              >
                {status}
              </Alert>
            )}
          </Col>
        </Row>
        <Row className="mt-md-5 text-center">
          <Col>
            Don&apos;t have an account, <Link to="/register">Sign Up</Link>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginPage;
