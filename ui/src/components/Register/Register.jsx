import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import SnnapFormLocationInput from '../SnnapForms/SnnapFormLocationInput';
import SnnapFormPassword from '../SnnapForms/SnnapFormPassword';
import Submit from '../Submit/Submit';

function Register() {
  const alphaNumRegEx = /^\w+$/;
  const alphabeticalRegEx = /[a-zA-Z]+/;
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({});

  const checkUsername = (username) => {
    if (!alphaNumRegEx.test(formData.Username)) {
      setStatus(
        'Username can only contain alpha numeric characters and underscores.'
      );
      username.setCustomValidity('Invalid field.');
      return false;
    }
    if (!alphabeticalRegEx.test(formData.Username)) {
      setStatus('Username must contain at least one alphabetical character.');
      username.setCustomValidity('Invalid field.');
      return false;
    }
    return true;
  };

  const checkPassword = (password) => {
    if (formData.Password.length < 6) {
      setStatus('Password must be 6 or more characters.');
      password.setCustomValidity('Invalid field.');
      return false;
    }
    return true;
  };

  const checkLocation = (city) => {
    if (
      !(
        formData.City &&
        formData.City.properties &&
        formData.City.properties.formatted
      )
    ) {
      setStatus('Please select a valid city from the drop down.');
      city.setCustomValidity('Invalid field.');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const city = document.querySelector('#formCity');
    const email = document.querySelector('#formEmail');
    const username = document.querySelector('#formUsername');
    const password = document.querySelector('#formPassword');
    city.setCustomValidity('');
    email.setCustomValidity('');
    username.setCustomValidity('');
    password.setCustomValidity('');
    setValidated(true);
    // actually check and submit the form
    if (form.checkValidity() === true) {
      // custom checks - should match API checks
      let isValid = true;
      isValid = checkUsername(username) && isValid;
      isValid = checkPassword(password) && isValid;
      isValid = checkLocation(city) && isValid;
      if (!isValid) {
        return;
      }
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
            if (
              error.toString() ===
              'This email is already in our system. Try resetting your password.'
            ) {
              email.setCustomValidity('Invalid field.');
            }
            if (
              error.toString() === 'Sorry, that username is already in use.'
            ) {
              username.setCustomValidity('Invalid field.');
            }
          }
        );
    }
  };

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2>Register</h2>
      <Row className="mb-3">
        <SnnapFormInput size={5} name="First name" onChange={updateForm} />
        <SnnapFormInput size={7} name="Last name" onChange={updateForm} />
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
        <SnnapFormPassword name="Password" onChange={updateForm} />
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
      <Submit
        buttonText="Create Account"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
      />
    </Form>
  );
}

export default Register;
