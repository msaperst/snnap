import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import Profile from '../../components/Profile/Profile';

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

  componentDidUpdate() {
    if (window.location.hash && window.location.hash !== '#') {
      const anchor = document.querySelector(
        `div[data-testid="job-application-${window.location.hash.substring(
          1
        )}"]`
      );
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  render() {
    const { jobApplications, currentUser } = this.state;
    return (
      <Container className="skinny">
        <Row>
          <Col>
            <h1 className="h2">Submitted Applications</h1>
          </Col>
        </Row>
        {jobApplications.map((jobApplication) => (
          <Profile
            key={jobApplication.id}
            user={currentUser}
            company={jobApplication}
          />
        ))}
      </Container>
    );
  }
}

export default JobApplications;
