import { Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { userService } from '../../../services/user.service';
import Submit from '../../Submit/Submit';
import { commonFormComponents } from '../../CommonFormComponents';

function Notifications(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState(null);
  const { settings } = props;

  useEffect(() => {
    if (settings) {
      setFormData({
        emailNotifications: Boolean(settings.email_notifications),
        pushNotifications: Boolean(settings.push_notifications),
      });
    }
  }, [settings]);

  if (settings === undefined) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    // actually check and submit the form
    setIsSubmitting(true);
    userService
      .updateNotificationSettings(
        formData.emailNotifications,
        formData.pushNotifications
      )
      .then(
        () => {
          commonFormComponents.setBasicSuccess(
            setIsSubmitting,
            setStatus,
            setUpdate,
            setValidated,
            'Notification Settings Updated'
          );
        },
        (error) => {
          setIsSubmitting(false);
          setStatus(error.toString());
        }
      );
  };

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Notification Settings</h3>
      <Row className="mb-3">
        <Form.Check
          id="emailNotifications"
          label="Email Notifications"
          defaultChecked={settings.email_notifications}
          onClick={updateForm}
        />
      </Row>
      <Row className="mb-3">
        <Form.Check
          id="pushNotifications"
          label="Push Notifications"
          defaultChecked={settings.push_notifications}
          onClick={updateForm}
          disabled
        />
      </Row>
      <Submit
        buttonText="Save Notification Settings"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default Notifications;
