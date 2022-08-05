import { Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import EditAvatar from '../EditAvatar/EditAvatar';
import { userService } from '../../../services/user.service';
import Submit from '../../Submit/Submit';
import { commonFormComponents } from '../../CommonFormComponents';

function AccountInformation(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState(null);
  const { user } = props;

  useEffect(() => {
    if (user) {
      setFormData({ Email: user.email, Number: user.number });
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
        .updateAccountInformation(formData.Email, formData.Number)
        .then(
          () => {
            commonFormComponents.setBasicSuccess(
              setIsSubmitting,
              setStatus,
              setUpdate,
              setValidated,
              'Account Information Updated'
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
      <h3>Account Information</h3>
      <Row className="mb-3">
        <EditAvatar user={user} />
        <SnnapFormInput
          name="Username"
          size={10}
          disabled
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
      <Submit
        buttonText="Save Account Information"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default AccountInformation;
