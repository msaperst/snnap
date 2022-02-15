import React from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForm/SnnapFormInput';
import { jobService } from '../../services/job.service';
import SnnapFormPrice from '../SnnapForm/SnnapFormPrice';
import SnnapFormInputWithDropdown from '../SnnapForm/SnnapFormInputWithDropdown';
import SnnapFormMultiSelect from '../SnnapForm/SnnapFormMultiSelect';
import SnnapFormLocationInput from '../SnnapForm/SnnapFormLocationInput';
import SnnapFormSelect from '../SnnapForm/SnnapFormSelect';

class NewRequestToHire extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      status: false,
      validated: false,
      isSubmitting: false,
      formData: {},
      jobTypes: [],
      equipment: [],
      skills: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  componentDidMount() {
    jobService.getJobTypes().then((jobTypes) => {
      this.setState({ jobTypes });
    });
    jobService.getEquipment().then((equipment) => {
      this.setState({ equipment });
    });
    jobService.getSkills().then((skills) => {
      this.setState({ skills });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('#newRequestToHireForm');
    if (form.checkValidity() === true) {
      const { formData } = this.state;
      this.setState({ isSubmitting: true });
      jobService
        .newRequestToHire(
          formData['Job Type'],
          formData.Location,
          formData['Job Details'],
          formData.Pay,
          formData.Duration,
          formData.Units,
          formData.Date,
          formData.Time,
          formData['Equipment Needed'],
          formData['Skills Needed']
        )
        .then(
          () => {
            this.setState({ isSubmitting: false, status: null, show: false });
            // TODO - reload homepage items
          },
          (error) => {
            this.setState({ isSubmitting: false, status: error });
          }
        );
    }
    this.setState({ validated: true });
  }

  updateForm(key, value) {
    const { formData } = this.state;
    formData[key] = value;
    this.setState({ formData });
  }

  render() {
    const {
      show,
      status,
      validated,
      isSubmitting,
      jobTypes,
      equipment,
      skills,
    } = this.state;
    return (
      <>
        <Button
          variant="primary"
          onClick={() => this.setState({ validated: false, show: true })}
        >
          New Request To Hire
        </Button>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div // adding in this div due to issue https://github.com/react-bootstrap/react-bootstrap/issues/3105
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
        >
          <Modal
            size="lg"
            show={show}
            onHide={() => this.setState({ show: false })}
            data-testid="newRequestToHireModal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Create a new request to hire</Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Form
                id="newRequestToHireForm"
                noValidate
                validated={validated}
                onSubmit={this.handleSubmit}
              >
                <Row className="mb-3">
                  <SnnapFormSelect
                    name="Job Type"
                    onChange={this.updateForm}
                    options={jobTypes}
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormLocationInput
                    name="Location"
                    type="text"
                    onChange={this.updateForm}
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    name="Job Details"
                    type="textarea"
                    onChange={this.updateForm}
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormPrice
                    size={6}
                    name="Pay"
                    onChange={this.updateForm}
                  />
                  <SnnapFormInputWithDropdown
                    size={6}
                    type="number"
                    name="Duration"
                    options={['Minutes', 'Hours', 'Days']}
                    onChange={this.updateForm}
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    size={6}
                    name="Date"
                    type="date"
                    onChange={this.updateForm}
                  />
                  <SnnapFormInput
                    size={6}
                    name="Time"
                    type="time"
                    onChange={this.updateForm}
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormMultiSelect
                    size={6}
                    name="Equipment Needed"
                    onChange={this.updateForm}
                    options={equipment}
                  />
                  <SnnapFormMultiSelect
                    size={6}
                    name="Skills Needed"
                    onChange={this.updateForm}
                    options={skills}
                  />
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Button
                      id="newRequestToHireButton"
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      onClick={this.handleSubmit}
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
                        onClose={() => this.setState({ status: null })}
                      >
                        {status}
                      </Alert>
                    )}
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </>
    );
  }
}

export default NewRequestToHire;
