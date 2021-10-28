import React from 'react';

import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <h1>Hi {currentUser.user.name}!</h1>
                <p>You're logged in with React & JWT!!</p>
            </div>
        );
    }
}

export default HomePage;