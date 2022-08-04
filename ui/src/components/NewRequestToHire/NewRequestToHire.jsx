import React from 'react';
import { Form, Modal, Row } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { jobService } from '../../services/job.service';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import SnnapFormPrice from '../SnnapForms/SnnapFormPrice';
import SnnapFormMultiSelect from '../SnnapForms/SnnapFormMultiSelect';
import SnnapFormLocationInput from '../SnnapForms/SnnapFormLocationInput';
import SnnapFormSelect from '../SnnapForms/SnnapFormSelect';
import SnnapFormDuration from '../SnnapForms/SnnapFormDuration';
import Submit from '../Submit/Submit';
import { commonFormComponents } from '../CommonFormComponents';

class NewRequestToHire extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      status: null,
      update: null,
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
          formData.DurationRange,
          formData.Date,
          formData.Time,
          formData['Equipment Needed'],
          formData['Skills Needed']
        )
        .then(
          () => {
            commonFormComponents.setRedrawSuccess(
              (state) => this.setState(state),
              'New Request to Hire Submitted'
            );
          },
          (error) => {
            this.setState({
              status: error.toString(),
              update: null,
              isSubmitting: false,
            });
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
      update,
      validated,
      isSubmitting,
      jobTypes,
      equipment,
      skills,
    } = this.state;
    return (
      <>
        <div>
          <NavDropdown.Item
            id="openNewRequestToHireButton"
            onClick={() => this.setState({ validated: false, show: true })}
          >
            New Request to Hire
          </NavDropdown.Item>
        </div>
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
                  size={8}
                  onChange={this.updateForm}
                />
                <SnnapFormInput
                  size={4}
                  name="Date"
                  type="date"
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
                <SnnapFormDuration
                  size={6}
                  type="number"
                  name="Duration"
                  options={['Minutes', 'Hours', 'Days']}
                  onChange={this.updateForm}
                />
                <SnnapFormPrice
                  size={6}
                  name="Pay"
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
              <Submit
                buttonText="Create New Request"
                isSubmitting={isSubmitting}
                error={status}
                updateError={() => this.setState({ status: null })}
                success={update}
                updateSuccess={() => this.setState({ update: null })}
              />
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default NewRequestToHire;
