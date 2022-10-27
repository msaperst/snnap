import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import Submit from '../Submit/Submit';

function Login() {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({ rememberMe: true });

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
      authenticationService
        .login(formData.Username, formData.Password, formData.rememberMe)
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

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const setRemembered = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Row className="mb-3">
        <SnnapFormInput name="Username" onChange={updateForm} />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput name="Password" type="password" onChange={updateForm} />
      </Row>
      <Row className="mb-3">
        <Col xs={5}>
          <Form.Check
            id="rememberMe"
            label="Remember Me"
            onClick={setRemembered}
            defaultChecked
          />
        </Col>
        <Col xs={7} className="text-end">
          <Link to="/passwordReset">Forgot Password</Link>
        </Col>
      </Row>
      <Submit
        buttonText="Login"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
      />
    </Form>
  );
}

export default Login;
