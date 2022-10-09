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

class NewJob extends React.Component {
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
    const form = document.querySelector('#newJobForm');
    if (form.checkValidity() === true) {
      const { formData } = this.state;
      if (
        formData.City &&
        formData.City.properties &&
        formData.City.properties.formatted
      ) {
        this.setState({ isSubmitting: true });
        jobService
          .newJob(
            formData['Job Type'],
            {
              lat: formData.City.properties.lat,
              lon: formData.City.properties.lon,
              loc: formData.City.properties.formatted,
            },
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
                'New Job Submitted'
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
      } else {
        this.setState({ status: 'Please provide a valid city.' });
      }
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
            id="openNewJobButton"
            onClick={() => this.setState({ validated: false, show: true })}
          >
            Create New Job
          </NavDropdown.Item>
        </div>
        <Modal
          size="lg"
          show={show}
          onHide={() => this.setState({ show: false })}
          data-testid="newJobModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a new job</Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Form
              id="newJobForm"
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
                  name="City"
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

export default NewJob;
