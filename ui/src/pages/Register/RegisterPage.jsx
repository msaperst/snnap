import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

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
      setIsSubmitting(true);
      authenticationService
        .register(
          formData['First name'],
          formData['Last name'],
          formData.Username,
          formData.Email,
          formData['Phone number'],
          formData.Password,
          formData.City,
          formData.State,
          formData.Zip
        )
        .then(
          () => {
            navigate('/');
          },
          (error) => {
            setIsSubmitting(false);
            setStatus(error);
          }
        );
    }
    setValidated(true);
  };

  const updateForm = (key, value) => {
    formData[key] = value;
    setFormData(formData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>Register</h2>
      <Row className="mb-3">
        <SnnapFormInput size={4} name="First name" onChange={updateForm} />
        <SnnapFormInput size={4} name="Last name" onChange={updateForm} />
        <SnnapFormInput
          size={4}
          name="Username"
          before="@"
          onChange={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={4}
          name="Email"
          type="email"
          onChange={updateForm}
        />
        <SnnapFormInput
          size={4}
          name="Phone number"
          type="tel"
          onChange={updateForm}
        />
        <SnnapFormInput
          size={4}
          name="Password"
          type="password"
          onChange={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput size={6} name="City" onChange={updateForm} />
        <SnnapFormInput size={3} name="State" onChange={updateForm} />
        <SnnapFormInput size={3} name="Zip" onChange={updateForm} />
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
        <Form.Group as={Col} md={1}>
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
            )}
            Register
          </Button>
        </Form.Group>
        <Col>
          {status && (
            <Alert variant="danger" dismissible onClose={() => setStatus(null)}>
              {status}
            </Alert>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default RegisterPage;
