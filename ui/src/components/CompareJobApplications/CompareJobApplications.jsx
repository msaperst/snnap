import React from 'react';
import { Accordion, Button, Form, Row, Modal } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import Submit from '../Submit/Submit';
import JobDetail from '../Job/JobDetail';
import Profile from '../Profile/Profile';
import { commonFormComponents } from '../CommonFormComponents';
import './CompareJobApplications.css';

class CompareJobApplications extends React.Component {
  constructor(props) {
    super(props);

    const { job } = this.props;
    this.state = {
      job,
      jobApplications: [],
      jobApplication: null,
      show: false,
      status: null,
      update: null,
      validated: false,
      isSubmitting: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { job } = this.state;
    jobService.getJob(job.id).then((hr) => {
      this.setState({ job: hr });
    });
    jobService.getJobApplications(job.id).then((hra) => {
      this.setState({ jobApplications: hra });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { job, jobApplication } = this.state;
    if (jobApplication) {
      this.setState({ isSubmitting: true });
      jobService
        .chooseJobApplication(
          job.id, // job id
          jobApplication
        )
        .then(
          () => {
            commonFormComponents.setRedrawSuccess(
              (state) => this.setState(state),
              'Job Application Chosen'
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
    } else {
      this.setState({ status: 'Please select an application' });
    }
    this.setState({ validated: true });
  }

  render() {
    const {
      job,
      jobApplications,
      show,
      status,
      update,
      validated,
      isSubmitting,
    } = this.state;

    // determine button text
    let showCompareButton = true;
    let buttonText = 'Select Application';
    if (job.application_selected) {
      buttonText = 'Application Selected';
      showCompareButton = false;
    } else if (new Date(job.date_time) < new Date().setHours(0, 0, 0, 0)) {
      buttonText = 'View Applications';
      showCompareButton = false;
    }

    return (
      <>
        <div>
          <Button
            id={`openCompareJobApplicationsModal-${job.id}`}
            job={job.id}
            onClick={() => this.setState({ show: true })}
            className="btn-block"
          >
            {buttonText}
            <span
              className="btn-warning p-1 rounded-circle"
              style={{ marginLeft: '10px' }}
            >
              {jobApplications.length}
            </span>
          </Button>
        </div>
        <Modal
          size="lg"
          show={show}
          onHide={() => this.setState({ show: false })}
          data-testid={`compareJobApplicationsModal-${job.id}`}
        >
          <Modal.Header closeButton>
            <Modal.Title>Applications for the {job.type} Session</Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Form
              id="compareJobApplicationsForm"
              noValidate
              validated={validated}
              onSubmit={this.handleSubmit}
            >
              <JobDetail job={job} />
              <Row className="mb-3">
                <Accordion>
                  {jobApplications.map((jobApplication) => (
                    <Profile
                      key={jobApplication.id}
                      type="accordion"
                      company={jobApplication}
                      onClick={(id) => this.setState({ jobApplication: id })}
                      selected={job.application_selected}
                    />
                  ))}
                </Accordion>
              </Row>
              {!showCompareButton ? (
                ''
              ) : (
                <Submit
                  buttonText="Select Job Application"
                  isSubmitting={isSubmitting}
                  error={status}
                  updateError={() => this.setState({ status: null })}
                  success={update}
                  updateSuccess={() => this.setState({ update: null })}
                />
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CompareJobApplications;
