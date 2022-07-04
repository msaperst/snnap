import React from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import { jobService } from '../../services/job.service';
import { companyService } from '../../services/company.service';
import SnnapFormMultiSelect from '../SnnapForms/SnnapFormMultiSelect';
import PortfolioItems from '../UserProfile/Portfolio/PortfolioItems/PortfolioItems';
import './ApplyToRequestToHire.css';

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
  }

  componentDidMount() {
    const { hireRequest } = this.state;
    companyService.get().then((company) => {
      this.setState({ company });
      this.setState({ formData: company });
    });
    jobService.getHireRequest(hireRequest.id).then((hireRequest) => {
      this.setState({ hireRequest });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { hireRequest } = this.state;
    const form = document.querySelector('#ApplyToRequestToHireForm');
    if (form.checkValidity() === true) {
      const { formData } = this.state;
      this.setState({ isSubmitting: true });
      // TODO split out formData - still need skills, equipment and portfolio
      jobService
        .applyToHireRequest(
          hireRequest.id,
          formData.user,
          formData.id,
          formData.Name,
          formData.Company || formData.name,
          formData.Website || formData.website,
          formData['Facebook Link'] || formData.fb,
          formData['Instagram Link'] || formData.insta,
          formData.Experience || formData.experience,
          formData
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
        <Button onClick={() => this.setState({ show: true })}>
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
                id="ApplyToRequestToHireForm"
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
                    name="Duration"
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
                <PortfolioItems
                  company={company}
                  getPortfolioItems={this.updatePortfolioItems}
                />
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Button
                      id="ApplyToRequestToHireButton"
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
                      Apply to Request to Hire
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
                    {update && (
                      <Alert
                        variant="success"
                        dismissible
                        onClose={() => this.setState({ update: null })}
                      >
                        {update}
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

export default ApplyToRequestToHire;
