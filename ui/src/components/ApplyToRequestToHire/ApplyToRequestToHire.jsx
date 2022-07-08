import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import { jobService } from '../../services/job.service';
import { companyService } from '../../services/company.service';
import SnnapFormMultiSelect from '../SnnapForms/SnnapFormMultiSelect';
import Gallery from '../UserProfile/Portfolio/Gallery/Gallery';
import './ApplyToRequestToHire.css';
import Submit from '../Submit/Submit';

class ApplyToRequestToHire extends React.Component {
  constructor(props) {
    super(props);

    const { hireRequest } = this.props;
    this.state = {
      hireRequest,
      show: false,
      status: null,
      update: null,
      validated: false,
      isSubmitting: false,
      formData: {},
      company: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.updatePortfolioItems = this.updatePortfolioItems.bind(this);
    this.clearUpdate = this.clearUpdate.bind(this);
    this.clearStatus = this.clearStatus.bind(this);
  }

  componentDidMount() {
    const { hireRequest } = this.state;
    companyService.get().then((company) => {
      this.setState({ company });
      this.setState({ formData: company });
    });
    jobService.getHireRequest(hireRequest.id).then((hr) => {
      this.setState({ hireRequest: hr });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('#applyToRequestToHireForm');
    if (form.checkValidity() === true) {
      const { hireRequest, formData } = this.state;
      const { user } = this.props;
      this.setState({ isSubmitting: true });
      const website = formData.Website || formData.website;
      const insta = formData['Instagram Link'] || formData.insta;
      const fb = formData['Facebook Link'] || formData.fb;
      jobService
        .applyToHireRequest(
          hireRequest.id, // hire request id
          formData.user, // user id
          formData.id, // company id
          formData.Name || `${user.first_name} ${user.last_name}`,
          formData.Company || formData.name,
          !website || website === '' ? undefined : website,
          !insta || insta === '' ? undefined : insta,
          !fb || fb === '' ? undefined : fb,
          formData.Experience || formData.experience,
          formData.Equipment || formData.equipment,
          formData.Skills || formData.skills,
          formData.portfolio
        )
        .then(
          () => {
            this.setState({
              status: null,
              update: 'Job Filing Submitted',
            });
            setTimeout(() => {
              this.setState({
                isSubmitting: false,
                show: false,
                update: null,
                validated: false,
              });
            }, 5000);
          },
          (error) => {
            this.setState({
              isSubmitting: false,
              status: error.toString(),
              update: null,
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

  updatePortfolioItems(items) {
    const { formData } = this.state;
    formData.portfolio = items;
    this.setState({ formData });
  }

  clearStatus() {
    this.setState({ status: null });
  }

  clearUpdate() {
    this.setState({ update: null });
  }

  render() {
    const {
      hireRequest,
      show,
      status,
      update,
      validated,
      isSubmitting,
      company,
    } = this.state;
    const { user, equipment, skills } = this.props;
    return (
      <>
        <Button
          id={`openApplyToRequestToHireButton-${hireRequest.id}`}
          onClick={() => this.setState({ show: true })}
        >
          Submit For Job
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
            data-testid={`applyToRequestToHireModal-${hireRequest.id}`}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Submit to work the {hireRequest.type} Session
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
              <Form
                id="applyToRequestToHireForm"
                noValidate
                validated={validated}
                onSubmit={this.handleSubmit}
              >
                <Row className="mb-3">
                  <h3>Job Information</h3>
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    size={4}
                    name="Job Type"
                    value={hireRequest.type}
                    readOnly
                  />
                  <SnnapFormInput
                    size={4}
                    name="Date"
                    value={new Intl.DateTimeFormat('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    }).format(new Date(hireRequest.date_time))}
                    readOnly
                  />
                  <SnnapFormInput
                    size={4}
                    name="Duration"
                    value={`${hireRequest.duration}${
                      hireRequest.durationMax
                        ? ` to ${hireRequest.durationMax}`
                        : ''
                    } hours`}
                    readOnly
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    size={8}
                    name="Location"
                    value={hireRequest.location.replace(
                      ', United States of America',
                      ''
                    )}
                    readOnly
                  />
                  <SnnapFormInput
                    size={4}
                    name="Pay"
                    value={`${hireRequest.pay} per hour`}
                    readOnly
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    name="Job Details"
                    value={hireRequest.details}
                    type="textarea"
                    readOnly
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    size={6}
                    name="Equipment"
                    value={
                      hireRequest.equipment
                        ? hireRequest.equipment
                            .map((option) => option.name)
                            .toString()
                        : ''
                    }
                    readOnly
                  />
                  <SnnapFormInput
                    size={6}
                    name="Skills"
                    value={
                      hireRequest.skills
                        ? hireRequest.skills
                            .map((option) => option.name)
                            .toString()
                        : ''
                    }
                    readOnly
                  />
                </Row>
                <Row className="mb-3">
                  <h3>Your Information</h3>
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    size={6}
                    name="Name"
                    value={`${user.first_name} ${user.last_name}`}
                    onChange={this.updateForm}
                  />
                  <SnnapFormInput
                    size={6}
                    name="Company"
                    value={company.name ? company.name : ''}
                    onChange={this.updateForm}
                    notRequired
                  />
                </Row>
                <Row className="mb-3">
                  <Col md={1}>
                    <Globe className="icon" />
                  </Col>
                  <SnnapFormInput
                    name="Website"
                    size={3}
                    value={company.website}
                    onChange={this.updateForm}
                    notRequired
                  />
                  <Col md={1}>
                    <Instagram className="icon" />
                  </Col>
                  <SnnapFormInput
                    name="Instagram Link"
                    size={3}
                    value={company.insta}
                    onChange={this.updateForm}
                    notRequired
                  />
                  <Col md={1}>
                    <Facebook className="icon" />
                  </Col>
                  <SnnapFormInput
                    name="Facebook Link"
                    size={3}
                    value={company.fb}
                    onChange={this.updateForm}
                    notRequired
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormInput
                    name="Experience"
                    value={company.experience}
                    onChange={this.updateForm}
                    type="textarea"
                    notRequired
                  />
                </Row>
                <Row className="mb-3">
                  <SnnapFormMultiSelect
                    size={6}
                    name="Equipment"
                    values={company.equipment}
                    onChange={this.updateForm}
                    options={equipment}
                  />
                  <SnnapFormMultiSelect
                    size={6}
                    name="Skills"
                    values={company.skills}
                    onChange={this.updateForm}
                    options={skills}
                  />
                </Row>
                <Gallery
                  company={company}
                  getPortfolioItems={this.updatePortfolioItems}
                />
                <Submit
                  buttonText="Apply to Request to Hire"
                  isSubmitting={isSubmitting}
                  error={status}
                  updateError={this.clearStatus}
                  success={update}
                  updateSuccess={this.clearUpdate}
                />
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </>
    );
  }
}

export default ApplyToRequestToHire;
