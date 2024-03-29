import React from 'react';
import { Accordion, Button, Form, Row, Modal, Badge } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import Submit from '../Submit/Submit';
import JobDetail from '../Job/JobDetail';
import Profile from '../Profile/Profile';
import { commonFormComponents } from '../CommonFormComponents';
import './CompareJobApplications.css';

class CompareJobApplications extends React.Component {
  constructor(props) {
    super(props);
    this.isMountedVal = false;

    const { job, show } = this.props;
    this.state = {
      job,
      jobApplications: [],
      jobApplication: null,
      show,
      status: null,
      update: null,
      validated: false,
      isSubmitting: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.isMountedVal = true;
    const { job } = this.state;
    jobService.getJob(job.id).then((hr) => {
      this.setState({ job: hr });
    });
    jobService.getJobApplications(job.id).then((hra) => {
      this.setState({ jobApplications: hra });
    });
  }

  componentWillUnmount() {
    this.isMountedVal = false;
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
            commonFormComponents.setRedrawSuccess((state) => {
              if (this.isMountedVal) {
                this.setState(state);
              }
              commonFormComponents.setEvent('Jobs', 'Selected Job Application');
            }, 'Job Application Chosen');
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

    // determine if we show the badge
    let badge = '';
    if (jobApplications.length) {
      badge = (
        <Badge bg="primary" className="float-end" pill>
          {jobApplications.length}
        </Badge>
      );
    } else {
      buttonText = 'View Job Details';
      showCompareButton = false;
    }

    return (
      <>
        <div>
          <Button
            id={`openCompareJobApplicationsModal-${job.id}`}
            job={job.id}
            onClick={() => {
              this.setState({ show: true });
              commonFormComponents.setEvent(
                'Jobs',
                'Opened Job Comparison Modal'
              );
            }}
            className="btn-block"
          >
            {buttonText} {badge}
          </Button>
        </div>
        <Modal
          size="lg"
          show={show}
          onHide={() => {
            this.setState({ show: false });
          }}
          data-testid={`compareJobApplicationsModal-${job.id}`}
          aria-label={`Applications for the ${job.type} Session`}
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
              {jobApplications.length > 0 && (
                <Row className="mb-3">
                  <h2 className="h3">Applications</h2>
                </Row>
              )}
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
