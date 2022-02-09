import React from 'react';

import Search from '../../components/Search/Search';
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
    });
  }

  render() {
    return <Search />;
  }
}

export default HomePage;
