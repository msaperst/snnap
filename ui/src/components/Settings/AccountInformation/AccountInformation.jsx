import { Col, Form, Row } from 'react-bootstrap';
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
      setFormData({ Email: user.email });
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
      userService.updateAccountInformation(formData.Email).then(
        () => {
          commonFormComponents.setBasicSuccess(
            setIsSubmitting,
            setStatus,
            setUpdate,
            setValidated,
            'Account Information Updated'
          );
          // update email in localstorage
          const storage = JSON.parse(localStorage.getItem('currentUser'));
          storage.email = formData.Email;
          localStorage.setItem('currentUser', JSON.stringify(storage));
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
      <h2 className="h3">Account Information</h2>
      <Row className="mb-3">
        <EditAvatar user={user} />
        <Col md={9}>
          <Row className="mb-3">
            <SnnapFormInput name="Username" disabled value={user.username} />
          </Row>
          <Row>
            <SnnapFormInput
              name="Email"
              value={user.email}
              onChange={updateForm}
            />
          </Row>
        </Col>
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
