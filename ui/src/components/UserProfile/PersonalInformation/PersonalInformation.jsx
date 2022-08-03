import { Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import { userService } from '../../../services/user.service';
import Submit from '../../Submit/Submit';
import { commonFormComponents } from '../../CommonFormComponents';

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
            commonFormComponents.setBasicSuccess(
              setIsSubmitting,
              setStatus,
              setUpdate,
              setValidated,
              'Personal Information Updated'
            );
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
      <Submit
        buttonText="Save Personal Information"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default PersonalInformation;
