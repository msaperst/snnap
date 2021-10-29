import React from 'react';

import { authenticationService } from '../../services/authentication.service';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
    };
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div>
        <h1>Hi {currentUser.name}!</h1>
        <p>You're logged in with React & JWT!!</p>
      </div>
    );
  }
}

export default HomePage;
