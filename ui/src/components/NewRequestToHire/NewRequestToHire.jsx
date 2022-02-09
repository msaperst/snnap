import React, { useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForm/SnnapFormInput';
import { jobService } from '../../services/job.service';
import SnnapFormPrice from '../SnnapForm/SnnapFormPrice';
import SnnapFormInputWithDropdown from '../SnnapForm/SnnapFormInputWithDropdown';
import SnnapFormMultiSelect from '../SnnapForm/SnnapFormMultiSelect';
import SnnapFormLocationInput from '../SnnapForm/SnnapFormLocationInput';

function NewRequestToHire() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    const form = document.querySelector('form');
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      jobService
        .newRequestToHire(
          formData['Job Type'],
          formData.Location,
          formData['Job Details'],
          formData.Pay,
          formData.Duration,
          formData.Date,
          formData.Time,
          formData['Equipment Needed'],
          formData['Skills Needed']
        )
        .then(
          () => {
            handleClose();
          },
          (error) => {
            setIsSubmitting(false);
            setStatus(error.toString());
          }
        );
    }
    setValidated(true);
  };

  const updateForm = (key, value) => {
    const data = formData;
    data[key] = value;
    setFormData(data);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        New Request To Hire
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new request to hire</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Form
            id="newRequestToHireForm"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Row className="mb-3">
              <SnnapFormInput name="Job Type" onChange={updateForm} />
            </Row>
            <Row className="mb-3">
              <SnnapFormLocationInput
                name="Location"
                type="text"
                onChange={updateForm}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormInput
                name="Job Details"
                type="textarea"
                onChange={updateForm}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormPrice size={6} name="Pay" onChange={updateForm} />
              <SnnapFormInputWithDropdown
                size={6}
                name="Duration"
                options={['Minutes', 'Hours', 'Days']}
                onChange={updateForm}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormInput
                size={6}
                name="Date"
                type="date"
                onChange={updateForm}
              />
              <SnnapFormInput
                size={6}
                name="Time"
                type="time"
                onChange={updateForm}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormMultiSelect
                size={6}
                name="Equipment Needed"
                onChange={updateForm}
                options={['Camera', 'Flash', 'Lights']}
              />
              <SnnapFormMultiSelect
                size={6}
                name="Skills Needed"
                onChange={updateForm}
                options={[
                  'Photography',
                  'Retouch',
                  'Lighting',
                  'Posing',
                  'Pets',
                  'Children',
                ]}
              />
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md={6}>
                <Button
                  id="newRequestToHireButton"
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
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
                  Create New Request
                </Button>
              </Form.Group>
              <Col md={6}>
                {status && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setStatus(null)}
                  >
                    {status}
                  </Alert>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewRequestToHire;
