import React from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import HireRequestApplication from '../../components/HireRequestApplication/HireRequestApplication';
import './HireRequestApplications.css';

class HireRequestApplications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      hireRequestApplications: [],
    };
  }

  componentDidMount() {
    userService.getHireRequestApplications().then((hireRequestApplications) => {
      this.setState({ hireRequestApplications });
    });
  }

  render() {
    const { hireRequestApplications, currentUser } = this.state;
    return (
      <>
        <Row>
          <Col>
            <h2>My Hire Request Applications</h2>
          </Col>
        </Row>
        {hireRequestApplications.map((hireRequestApplication) => (
          <Accordion
            key={hireRequestApplication.id}
            defaultActiveKey={hireRequestApplication.id}
          >
            <HireRequestApplication
              currentUser={currentUser}
              hireRequestApplication={hireRequestApplication}
            />
          </Accordion>
        ))}
      </>
    );
  }
}

export default HireRequestApplications;
