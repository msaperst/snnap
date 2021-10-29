import { Nav, NavDropdown } from 'react-bootstrap';
import React from 'react';
import { authenticationService } from '../../services/authentication.service';
import './NavBar.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
    };
  }

  render() {
    const { currentUser } = this.state;
    const { logout } = this.props;
    return (
      <Nav className="bg-dark">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <NavDropdown title={currentUser.username} id="nav-dropdown">
          <Nav.Link href="/profile">Profile</Nav.Link>
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        </NavDropdown>
      </Nav>
    );
  }
}

export default NavBar;
