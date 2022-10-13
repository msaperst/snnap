import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Menu.css';
import snnapLogo from './SNNAP.png';
import NewJob from '../NewJob/NewJob';
import useWebSocketLite from '../../helpers/useWebSocketLite';

function Menu(props) {
  let collapse = null;
  let menu = null;
  const { logout, currentUser } = props;
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState('');
  const [bell, setBell] = useState('');

  const ws = useWebSocketLite({
    socketUrl: `${process.env.REACT_APP_WSS}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_HTTP_PORT}/wsapp/unreadNotifications`,
    token,
  });

  useEffect(() => {
    if (currentUser) {
      setToken(currentUser.token);
    }
    if (ws.data) {
      const { message } = ws.data;
      if (message > 0) {
        const not = (
          <span
            className="btn-primary p-1 rounded-circle"
            style={{ marginLeft: '10px' }}
          >
            {message}
          </span>
        );
        setNotifications(not);
        setBell(' 🔔');
      } else {
        setNotifications('');
        setBell('');
      }
    }
  }, [currentUser, ws.data]);

  if (currentUser) {
    collapse = <Navbar.Toggle aria-controls="responsive-navbar-nav" />;
    menu = (
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="My Jobs" id="gig-dropdown">
            <NewJob />
            <NavDropdown.Item href="/jobs">My Jobs</NavDropdown.Item>
            <NavDropdown.Item href="/job-applications">
              Jobs I&apos;ve Applied To
            </NavDropdown.Item>
            {/* <NavDropdown.Divider /> */}
            {/* <NewRequestToWork /> */}
            {/* <NavDropdown.Item href="/work-requests"> */}
            {/*  My Work Requests */}
            {/* </NavDropdown.Item> */}
            {/* <NavDropdown.Item href="/work-request-applications"> */}
            {/*  My Work Request Applications */}
            {/* </NavDropdown.Item> */}
          </NavDropdown>
          <NavDropdown
            title={`${currentUser.username}${bell}`}
            id="user-dropdown"
          >
            <NavDropdown.Item href="/notifications">
              Notifications{notifications}
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
    <Navbar variant="dark" expand="lg">
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
