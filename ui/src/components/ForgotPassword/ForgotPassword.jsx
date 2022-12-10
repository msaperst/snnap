import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import Submit from '../Submit/Submit';
import { authenticationService } from '../../services/authentication.service';
import ResetPassword from '../ResetPassword/ResetPassword';

function ForgotPassword() {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState({ rememberMe: true });
  const isMountedVal = useRef(true);

  useEffect(() => {
    isMountedVal.current = true;
    return () => {
      isMountedVal.current = false;
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      setEmail(formData.Email);
      authenticationService.forgot(formData.Email).then(
        () => {
          setIsSubmitting(false);
          setUpdate(
            'A reset code was sent to your email. This code is only valid for 10 minutes.'
          );
          setTimeout(() => {
            if (isMountedVal.current) {
              setUpdate(null);
              setStatus(null);
              setShow(false);
              setShowReset(true);
            }
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
            setStatus(null);
            setUpdate(null);
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
        aria-label="Password Reset"
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
            <Row className="mb-3">
              <Col>
                A reset code will be sent to the above email address if it has
                an account registered to it
              </Col>
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
      <ResetPassword display={showReset} email={email} />
    </>
  );
}

export default ForgotPassword;
