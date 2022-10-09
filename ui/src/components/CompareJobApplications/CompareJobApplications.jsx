import React from 'react';
import { Accordion, Button, Form, Row, Modal } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import './CompareJobApplications.css';
import Submit from '../Submit/Submit';
import JobDetail from '../Job/JobDetail';
import JobApplication from '../JobApplication/JobApplication';
import { commonFormComponents } from '../CommonFormComponents';

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
    return (
      <>
        <div>
          <Button
            id={`openCompareJobApplicationsModal-${job.id}`}
            job={job.id}
            onClick={() => this.setState({ show: true })}
          >
            {job.application_selected
              ? 'Application Selected'
              : 'Select Application'}
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
                    <JobApplication
                      key={jobApplication.id}
                      jobApplication={jobApplication}
                      radio={(id) => this.setState({ jobApplication: id })}
                      selected={job.application_selected}
                    />
                  ))}
                </Accordion>
              </Row>
              {job.application_selected ? (
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
