import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import { userService } from '../../services/user.service';
import SnnapFormInput from '../../components/SnnapForms/SnnapFormInput';
import './AccountInformation.css';

function AccountInformation(props) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const { user } = props;

  const avatarUpload = React.useRef(null);

  const uploadClick = () => {
    avatarUpload.current.click();
  };

  const uploadFile = (event) => {
    userService.uploadAvatar(event.target.files[0]).then((result) => {
      console.log('Success:', result);
    });
  };

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

  let avatar = '';
  if (user && user.firstName) {
    avatar = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Account Information</h3>
      <Row className="mb-3">
        <Col md={2}>
          <Image roundedCircle id="avatar" onClick={uploadClick} />
          <span
            id="initials"
            onClick={uploadClick}
            onKeyPress={uploadClick}
            role="button"
            tabIndex="0"
          >
            {avatar}
          </span>
          <Form.Control
            ref={avatarUpload}
            type="file"
            hidden
            onChange={uploadFile}
          />
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
