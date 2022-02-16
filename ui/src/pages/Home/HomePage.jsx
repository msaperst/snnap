import React from 'react';

import { Card } from 'react-bootstrap';
import Search from '../../components/Search/Search';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      hireRequests: [],
    };
  }

  componentDidMount() {
    userService.getUser().then((user) => {
      const { currentUser } = this.state;
      currentUser.lastLogin = user.lastLogin;
      this.setState({ currentUser });
    });
    jobService.getHireRequests().then((hireRequests) => {
      this.setState({ hireRequests });
    });
  }

  render() {
    const { hireRequests } = this.state;
    return (
      <>
        <Search />

        {hireRequests.map((hireRequest) => (
          <Card key={hireRequest.id}>
            <Card.Body>{hireRequest.type}</Card.Body>
            <Card.Body>{hireRequest.location}</Card.Body>
            <Card.Body>{hireRequest.details}</Card.Body>
          </Card>
        ))}
      </>
    );
  }
}

export default HomePage;
