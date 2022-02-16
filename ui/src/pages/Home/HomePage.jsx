import React from 'react';

import Search from '../../components/Search/Search';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import RequestToHire from '../../components/RequestToHire/RequestToHire';

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
          <RequestToHire key={hireRequest.id} hireRequest={hireRequest} />
        ))}
      </>
    );
  }
}

export default HomePage;
