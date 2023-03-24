import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import Job from '../../components/Job/Job';

class Jobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      jobs: [],
      equipment: [],
      skills: [],
    };
  }

  componentDidMount() {
    jobService.getEquipment().then((equipment) => {
      this.setState({ equipment });
    });
    jobService.getSkills().then((skills) => {
      this.setState({ skills });
    });
    userService.getJobs().then((jobs) => {
      this.setState({ jobs });
    });
  }

  componentDidUpdate() {
    if (window.location.hash && window.location.hash !== '#') {
      const anchor = document.querySelector(
        `div[data-testid="job-${window.location.hash.substring(1)}"]`
      );
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  render() {
    const { jobs, equipment, skills, currentUser } = this.state;
    return (
      <>
        <Row>
          <Col>
            <h1 className="h2">My Jobs</h1>
          </Col>
        </Row>
        {jobs.map((job) => (
          <Job
            key={job.id}
            currentUser={currentUser}
            job={job}
            equipment={equipment}
            skills={skills}
          />
        ))}
      </>
    );
  }
}

export default Jobs;
