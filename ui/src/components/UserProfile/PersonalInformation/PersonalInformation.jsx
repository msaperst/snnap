import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import { userService } from '../../../services/user.service';

function PersonalInformation(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState(null);
  const { user } = props;

  useEffect(() => {
    if (user) {
      setFormData({
        'First Name': user.firstName,
        'Last Name': user.lastName,
        City: user.city,
        State: user.state,
        Zip: user.zip,
      });
    }
  }, [user]);

  if (user === undefined) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      userService
        .updatePersonalInformation(
          formData['First Name'],
          formData['Last Name'],
          formData.City,
          formData.State,
          formData.Zip
        )
        .then(
          () => {
            setIsSubmitting(false);
            setStatus(null);
            setUpdate('Personal Information Updated');
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
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Personal Information</h3>
      <Row className="mb-3">
        <SnnapFormInput
          name="First Name"
          size={6}
          value={user.firstName}
          onChange={updateForm}
        />
        <SnnapFormInput
          name="Last Name"
          size={6}
          value={user.lastName}
          onChange={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          name="City"
          size={5}
          value={user.city}
          onChange={updateForm}
        />
        <SnnapFormInput
          name="State"
          size={3}
          value={user.state}
          onChange={updateForm}
        />
        <SnnapFormInput
          name="Zip"
          size={4}
          value={user.zip}
          onChange={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Button
            id="savePersonalInformationButton"
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
            Save Personal Information
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

export default PersonalInformation;
