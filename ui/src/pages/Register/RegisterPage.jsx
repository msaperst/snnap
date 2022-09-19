import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import SnnapFormLocationInput from '../../components/SnnapForms/SnnapFormLocationInput';

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticationService.currentUserValue) {
      navigate('/profile', { replace: true });
    }
  });

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      if (
        formData.City &&
        formData.City.properties &&
        formData.City.properties.formatted
      ) {
        setIsSubmitting(true);
        authenticationService
          .register(
            formData['First name'],
            formData['Last name'],
            {
              lat: formData.City.properties.lat,
              lon: formData.City.properties.lon,
              loc: formData.City.properties.formatted,
            },
            formData.Email,
            formData.Username,
            formData.Password
          )
          .then(
            () => {
              navigate('/');
            },
            (error) => {
              setIsSubmitting(false);
              setStatus(error.toString());
            }
          );
      } else {
        setStatus('Please provide a valid city.');
      }
    }
    setValidated(true);
  };

  const updateForm = (key, value) => {
    formData[key] = value;
    setFormData(formData);
  };

  return (
    <Container className="skinny">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h2>Register</h2>
        <Row className="mb-3">
          <SnnapFormInput size={6} name="First name" onChange={updateForm} />
          <SnnapFormInput size={6} name="Last name" onChange={updateForm} />
        </Row>
        <Row className="mb-3">
          <SnnapFormLocationInput name="City" onChange={updateForm} />
        </Row>
        <Row className="mb-3">
          <SnnapFormInput name="Email" type="email" onChange={updateForm} />
        </Row>
        <Row className="mb-3" />
        <Row className="mb-3">
          <SnnapFormInput name="Username" onChange={updateForm} />
        </Row>
        <Row className="mb-3">
          <SnnapFormInput
            name="Password"
            type="password"
            onChange={updateForm}
          />
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            id="agreeToTerms"
            label="Agree to terms and conditions"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Button
              id="registerButton"
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
              Create Account
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
      </Form>
    </Container>
  );
}

export default RegisterPage;
