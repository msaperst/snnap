import { Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import { userService } from '../../../services/user.service';
import Submit from '../../Submit/Submit';
import { common } from '../Common';

function Password() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      userService
        .updatePassword(formData['Current Password'], formData['New Password'])
        .then(
          () => {
            common.setSuccess(
              setIsSubmitting,
              setStatus,
              setUpdate,
              setValidated,
              'Password Updated'
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
      <h3>Password</h3>
      <Row className="mb-3">
        <SnnapFormInput
          name="Current Password"
          type="password"
          onChange={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          name="New Password"
          type="password"
          onChange={updateForm}
        />
      </Row>
      <Submit
        buttonText="Update Password"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default Password;
