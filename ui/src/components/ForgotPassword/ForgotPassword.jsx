import React, { useState } from 'react';
import { Button, Form, Modal, Row } from 'react-bootstrap';

import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import Submit from '../Submit/Submit';
import { authenticationService } from '../../services/authentication.service';
import ResetPassword from '../ResetPassword/ResetPassword';

function ForgotPassword() {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState({ rememberMe: true });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      authenticationService.forgot(formData.Email).then(
        () => {
          setIsSubmitting(false);
          setUpdate(
            'A reset code was sent to your email. This code is only valid for 10 minutes.'
          );
          setTimeout(() => {
            setUpdate(null);
            setShow(null);
            setShowReset(true);
          }, 5000);
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
    <>
      <div>
        <Button
          id="forgotPasswordLink"
          variant="link"
          onClick={() => {
            setValidated(false);
            setShow(true);
          }}
        >
          Forgot Password
        </Button>
      </div>
      <Modal
        size="md"
        show={show}
        onHide={() => setShow(false)}
        data-testid="forgotPasswordModal"
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
              <SnnapFormInput name="Email" type="email" onChange={updateForm} />
            </Row>
            <Submit
              buttonText="Request Reset Password"
              isSubmitting={isSubmitting}
              error={status}
              updateError={setStatus}
              success={update}
              updateSuccess={setUpdate}
            />
          </Form>
        </Modal.Body>
      </Modal>
      <ResetPassword display={showReset} />
    </>
  );
}

export default ForgotPassword;
