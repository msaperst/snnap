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

  const { currentUser, logout } = props;

  if (currentUser) {
    collapse = <Navbar.Toggle aria-controls="responsive-navbar-nav" />;
    menu = (
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <NewRequestToHire />
          <Nav.Link href="#2">Item 2</Nav.Link>
          <NavDropdown title={currentUser.username} id="nav-dropdown">
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
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        {collapse}
        {menu}
      </Container>
    </Navbar>
  );
}

export default Menu;
