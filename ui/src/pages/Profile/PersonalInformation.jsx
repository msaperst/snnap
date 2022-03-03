import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';

function PersonalInformation(props) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const { user } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setSubmitting(true);
      console.log('submitted personal information');
      setSubmitting(false);
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Personal Information</h3>
      <Row className="mb-3">
        <SnnapFormInput name="First Name" size={6} value={user.firstName} />
        <SnnapFormInput name="Last Name" size={6} value={user.lastName} />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput name="City" size={5} value={user.city} />
        <SnnapFormInput name="State" size={3} value={user.state} />
        <SnnapFormInput name="Zip" size={4} value={user.zip} />
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
      </Row>
    </Form>
  );
}

export default PersonalInformation;
