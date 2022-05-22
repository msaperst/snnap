import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Menu.css';
import snnapLogo from './SNNAP.png';
import NewRequestToHire from '../NewRequestToHire/NewRequestToHire';

function Menu(props) {
  let collapse = null;
  let menu = null;
  const { logout, currentUser } = props;

  if (currentUser) {
    collapse = <Navbar.Toggle aria-controls="responsive-navbar-nav" />;
    menu = (
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="Gigs" id="gig-dropdown">
            <NewRequestToHire />
            <NavDropdown.Item href={`/hire-requests/${currentUser.username}`}>
              My Hire Requests
            </NavDropdown.Item>
            <NavDropdown.Divider />
            {/* <NewRequestToWork /> */}
            <NavDropdown.Item href={`/work-requests/${currentUser.username}`}>
              My Work Requests
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title={currentUser.username} id="user-dropdown">
            <NavDropdown.Item href="/notifications">
              Notifications
            </NavDropdown.Item>
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    );
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="SNNAP"
            src={snnapLogo}
            className="d-inline-block align-top logo"
          />
        </Navbar.Brand>
        {collapse}
        {menu}
      </Container>
    </Navbar>
  );
}

export default Menu;
