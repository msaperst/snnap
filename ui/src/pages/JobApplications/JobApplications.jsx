import React from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import JobApplication from '../../components/JobApplication/JobApplication';
import './JobApplications.css';

class JobApplications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      jobApplications: [],
    };
  }

  componentDidMount() {
    userService.getJobApplications().then((jobApplications) => {
      this.setState({ jobApplications });
    });
  }

  render() {
    const { jobApplications, currentUser } = this.state;
    return (
      <>
        <Row>
          <Col>
            <h2>My Job Applications</h2>
          </Col>
        </Row>
        {jobApplications.map((jobApplication) => (
          <Accordion
            key={jobApplication.id}
            defaultActiveKey={jobApplication.id}
          >
            <JobApplication
              currentUser={currentUser}
              jobApplication={jobApplication}
            />
          </Accordion>
        ))}
      </>
    );
  }
}

export default JobApplications;
