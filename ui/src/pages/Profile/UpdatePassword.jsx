import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

function UpdatePassword() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setSubmitting(true);
      console.log('submitted password change');
      setSubmitting(false);
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Update Password</h3>
      <Row className="mb-3">
        <SnnapFormInput type="password" name="Current Password" />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput type="password" name="New Password" />
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Button
            id="updatePasswordButton"
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
            Update Password
          </Button>
        </Form.Group>
      </Row>
    </Form>
  );
}

export default UpdatePassword;
