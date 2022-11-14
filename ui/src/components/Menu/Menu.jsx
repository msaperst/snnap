import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Menu.css';
import snnapLogo from './SNNAP.png';
import NewJob from '../NewJob/NewJob';
import useWebSocketLite from '../../helpers/useWebSocketLite';
import Rate from '../Rate/Rate';

function Menu(props) {
  let collapse = null;
  let menu = null;
  const { logout, currentUser } = props;
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState('');
  const [bell, setBell] = useState('');
  const [rates, setRates] = useState('');

  const wsNotifications = useWebSocketLite({
    socketUrl: `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/wsapp/unreadNotifications`,
    token,
  });

  const wsRates = useWebSocketLite({
    socketUrl: `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/wsapp/neededRatings`,
    token,
  });

  useEffect(() => {
    if (currentUser) {
      setToken(currentUser.token);
    }
    if (wsNotifications.data) {
      const { message } = wsNotifications.data;
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
    if (wsRates.data) {
      const { message } = wsRates.data;
      if (Array.isArray(message)) {
        setRates(
          message.map((rate) => (
            <Rate
              key={rate.id}
              id={rate.id}
              userId={rate.userId}
              jobId={rate.jobId}
            />
          ))
        );
      }
    }
  }, [currentUser, wsNotifications.data, wsRates.data]);

  if (currentUser) {
    collapse = <Navbar.Toggle aria-controls="responsive-navbar-nav" />;
    menu = (
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="My Jobs" id="gig-dropdown">
            <NewJob />
            <NavDropdown.Item href="/jobs">
              Created Job Postings
            </NavDropdown.Item>
            <NavDropdown.Item href="/job-applications">
              Submitted Applications
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title={`${currentUser.username}${bell}`}
            id="user-dropdown"
          >
            <NavDropdown.Item href="/notifications">
              Notifications{notifications}
            </NavDropdown.Item>
            <NavDropdown.Item href={`/profile/${currentUser.username}`}>
              My Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    );
  }

  return (
    <>
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
      {rates}
    </>
  );
}

export default Menu;
