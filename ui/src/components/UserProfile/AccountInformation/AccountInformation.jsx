import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import Avatar from '../Avatar/Avatar';
import { userService } from '../../../services/user.service';

function AccountInformation(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const { user } = props;

  if (user === undefined) {
    return null;
  }

  const formData = { Email: user.email, Number: user.number };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      userService
        .updateAccountInformation(formData.Email, formData.Number)
        .then(
          () => {
            setIsSubmitting(false);
            setUpdate('Account Information Updated');
            setTimeout(() => {
              setUpdate(null);
              setValidated(false);
            }, 5000);
          },
          (error) => {
            setIsSubmitting(false);
            setStatus(error.toString());
          }
        );
    }
  };

  const updateForm = (key, value) => {
    formData[key] = value;
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Account Information</h3>
      <Row className="mb-3">
        <Avatar user={user} />
        <SnnapFormInput
          name="Username"
          size={10}
          readOnly
          value={user.username}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          name="Email"
          size={6}
          value={user.email}
          onChange={updateForm}
        />
        <SnnapFormInput
          name="Number"
          size={6}
          value={user.number}
          onChange={updateForm}
        />
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
        <Col>
          {status && (
            <Alert variant="danger" dismissible onClose={() => setStatus(null)}>
              {status}
            </Alert>
          )}
          {update && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setUpdate(null)}
            >
              {update}
            </Alert>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default AccountInformation;
