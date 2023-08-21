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
      selected: null,
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
    if (window.location.hash && window.location.hash !== '#') {
      this.setState({ selected: window.location.hash.substring(1) });
    }
  }

  componentDidUpdate() {
    const { selected } = this.state;
    if (selected) {
      const anchor = document.querySelector(
        `div[data-testid="job-${selected}"]`
      );
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  render() {
    const { jobs, equipment, skills, currentUser, selected } = this.state;
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
            active={job.id === parseInt(selected, 10)}
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
