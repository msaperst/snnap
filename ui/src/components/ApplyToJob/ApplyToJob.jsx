import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import { jobService } from '../../services/job.service';
import { companyService } from '../../services/company.service';
import SnnapFormMultiSelect from '../SnnapForms/SnnapFormMultiSelect';
import Gallery from '../UserProfile/Portfolio/Gallery/Gallery';
import './ApplyToJob.css';
import Submit from '../Submit/Submit';
import EquipmentSelect from '../UserProfile/CompanyInformation/EquipmentSelect/EquipmentSelect';
import JobDetail from '../Job/JobDetail';
import { commonFormComponents } from '../CommonFormComponents';

class ApplyToJob extends React.Component {
  constructor(props) {
    super(props);

    const { job } = this.props;
    this.state = {
      job,
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
  }

  componentDidMount() {
    const { job } = this.state;
    companyService.get().then((company) => {
      this.setState({ company });
      this.setState({ formData: company });
    });
    jobService.getJob(job.id).then((hr) => {
      this.setState({ job: hr });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('#applyToJobForm');
    if (form.checkValidity() === true) {
      const { job, formData } = this.state;
      const { user } = this.props;
      this.setState({ isSubmitting: true });
      const website = formData.Website || formData.website;
      const insta = formData['Instagram Link'] || formData.insta;
      const fb = formData['Facebook Link'] || formData.fb;
      jobService
        .applyToJob(
          job.id, // job id
          formData.user, // user id
          formData.id, // company id
          formData.Name || `${user.firstName} ${user.lastName}`,
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
            commonFormComponents.setRedrawSuccess(
              (state) => this.setState(state),
              'Job Filing Submitted'
            );
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

  render() {
    const { job, show, status, update, validated, isSubmitting, company } =
      this.state;
    const { user, skills } = this.props;
    return (
      <>
        <div>
          <Button
            id={`openApplyToJobButton-${job.id}`}
            job={job.id}
            onClick={() => this.setState({ show: true })}
          >
            Submit For Job
          </Button>
        </div>
        <Modal
          size="lg"
          show={show}
          onHide={() => this.setState({ show: false })}
          data-testid={`applyToJobModal-${job.id}`}
        >
          <Modal.Header closeButton>
            <Modal.Title>Submit to work the {job.type} Session</Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Form
              id="applyToJobForm"
              noValidate
              validated={validated}
              onSubmit={this.handleSubmit}
            >
              <JobDetail job={job} />
              <Row className="mb-3">
                <h3>Your Information</h3>
              </Row>
              <Row className="mb-3">
                <SnnapFormInput
                  size={6}
                  name="Name"
                  value={`${user.firstName} ${user.lastName}`}
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
                <EquipmentSelect company={company} onChange={this.updateForm} />
                <SnnapFormMultiSelect
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
                buttonText="Apply to Job"
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

export default ApplyToJob;