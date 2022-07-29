import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import RequestToHire from '../../components/RequestToHire/RequestToHire';

class HireRequests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      hireRequests: [],
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
    userService.getHireRequests().then((hireRequests) => {
      this.setState({ hireRequests });
    });
  }

  render() {
    const { hireRequests, equipment, skills, currentUser } = this.state;
    return (
      <>
        <Row>
          <Col>
            <h2>My Hire Requests</h2>
          </Col>
        </Row>
        {hireRequests.map((hireRequest) => (
          <RequestToHire
            key={hireRequest.id}
            currentUser={currentUser}
            hireRequest={hireRequest}
            equipment={equipment}
            skills={skills}
          />
        ))}
      </>
    );
  }
}

export default HireRequests;
