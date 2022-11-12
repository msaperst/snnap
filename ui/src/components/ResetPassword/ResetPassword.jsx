import React, { useEffect, useState } from 'react';
import { Form, Modal, Row } from 'react-bootstrap';

import { useLocation, useNavigate } from 'react-router-dom';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import Submit from '../Submit/Submit';
import { authenticationService } from '../../services/authentication.service';
import SnnapFormPassword from '../SnnapForms/SnnapFormPassword';

function ResetPassword(props) {
  const navigate = useNavigate();

  const { display, email } = props;

  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setShow(display);
    setFormData({ Email: email });
  }, [display, email]);

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
        .reset(formData.Email, formData.Code, formData['New Password'])
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

  return (
    <Modal
      size="md"
      show={show}
      onHide={() => setShow(false)}
      data-testid="resetPasswordModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Form
          id="newJobForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Row className="mb-3">
            <SnnapFormInput
              name="Email"
              type="email"
              value={email}
              onChange={updateForm}
            />
          </Row>
          <Row className="mb-3">
            <SnnapFormInput name="Code" onChange={updateForm} />
          </Row>
          <Row className="mb-3">
            <SnnapFormPassword name="New Password" onChange={updateForm} />
          </Row>
          <Submit
            buttonText="Reset Password"
            isSubmitting={isSubmitting}
            error={status}
            updateError={setStatus}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ResetPassword;
