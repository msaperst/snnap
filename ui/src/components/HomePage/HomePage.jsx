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
        const { currentUser, users } = this.state;
        return (
            <div>
                <h1>Hi {currentUser.user.name}!</h1>
                <p>You're logged in with React & JWT!!</p>
                {/*<h3>Users from secure api end point:</h3>*/}
                {/*{users &&*/}
                {/*<ul>*/}
                {/*    {users.map(user =>*/}
                {/*        <li key={user.id}>{user.firstName} {user.lastName}</li>*/}
                {/*    )}*/}
                {/*</ul>*/}
                {/*}*/}
            </div>
        );
    }
}

export default HomePage;