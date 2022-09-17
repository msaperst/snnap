import { Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import { userService } from '../../../services/user.service';
import Submit from '../../Submit/Submit';
import { commonFormComponents } from '../../CommonFormComponents';
import SnnapFormLocationInput from '../../SnnapForms/SnnapFormLocationInput';

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
        City: {
          properties: {
            lat: user.lat,
            lon: user.lon,
            formatted: user.loc,
          },
        },
      });
    }
  }, [user]);

  if (user === undefined) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      if (
        formData.City &&
        formData.City.properties &&
        formData.City.properties.lat &&
        formData.City.properties.lon
      ) {
        setIsSubmitting(true);
        userService
          .updatePersonalInformation(
            formData['First Name'],
            formData['Last Name'],
            {
              lat: formData.City.properties.lat,
              lon: formData.City.properties.lon,
              loc: formData.City.properties.formatted,
            }
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
      } else {
        setStatus('Please provide a valid city.');
      }
    }
    setValidated(true);
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
        <SnnapFormLocationInput
          name="City"
          value={user.loc}
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
