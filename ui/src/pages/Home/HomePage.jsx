import React from 'react';

import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
    };

    userService.getUser().then((user) => {
      const { currentUser } = this.state;
      currentUser.lastLogin = user.lastLogin;
      this.setState({ currentUser });
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div>
        <h1 id="welcome">Hi {currentUser.name}!</h1>
        <p>You are logged in!</p>
        <p>You last logged in {currentUser.lastLogin}</p>
      </div>
    );
  }
}

export default HomePage;
