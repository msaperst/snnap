import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

function AccountInformation(props) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const { user } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setSubmitting(true);
      console.log('submitted account information');
      setSubmitting(false);
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Account Information</h3>
      <Row className="mb-3">
        <Col md={2}>
          {/* https://plugins.krajee.com/file-avatar-upload-demo */}
          <input id="avatar-1" name="avatar-1" type="file" required />
        </Col>
        <SnnapFormInput
          name="Username"
          size={10}
          readOnly
          value={user.username}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput name="Email" size={6} value={user.email} />
        <SnnapFormInput name="Number" size={6} value={user.number} />
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Button
            id="saveAccountInformationButton"
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
            Save Account Information
          </Button>
        </Form.Group>
      </Row>
    </Form>
  );
}

export default AccountInformation;
