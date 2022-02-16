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
      allHireRequests: [],
      filteredHireRequests: [],
      filteredOn: null,
    };

    this.filterType = this.filterType.bind(this);
  }

  componentDidMount() {
    userService.getUser().then((user) => {
      const { currentUser } = this.state;
      currentUser.lastLogin = user.lastLogin;
      this.setState({ currentUser });
    });
    jobService.getHireRequests().then((hireRequests) => {
      this.setState({
        allHireRequests: hireRequests,
        filteredHireRequests: hireRequests,
      });
    });
  }

  filterType(type) {
    const { allHireRequests, filteredOn } = this.state;
    let filteredHireRequests = [];
    if (filteredOn === type) {
      // undo our filtering
      this.setState({ filteredOn: null });
      filteredHireRequests = allHireRequests;
    } else {
      // do our filtering
      this.setState({ filteredOn: type });
      allHireRequests.forEach((hireRequest) => {
        if (hireRequest.typeId === type) {
          filteredHireRequests.push(hireRequest);
        }
      });
    }
    this.setState({ filteredHireRequests });
  }

  render() {
    const { filteredHireRequests, filteredOn } = this.state;
    return (
      <>
        <Search filter={this.filterType} filteredOn={filteredOn} />

        {filteredHireRequests.map((hireRequest) => (
          <RequestToHire key={hireRequest.id} hireRequest={hireRequest} />
        ))}
      </>
    );
  }
}

export default HomePage;
