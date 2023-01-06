import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import snnapLogo from './SNNAP.png';
import NewJob from '../NewJob/NewJob';
import useWebSocketLite from '../../helpers/useWebSocketLite';
import Rate from '../Rate/Rate';
import ProfileNotification from '../ProfileNotification/ProfileNotification';
import './Menu.css';

function Menu(props) {
  let collapse = null;
  let menu = null;
  const { logout, currentUser } = props;
  const [token, setToken] = useState('');
  const [alerts, setAlerts] = useState('');
  const [messages, setMessages] = useState('');
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

  function setNotification(value, setter) {
    if (value > 0) {
      setter(
        <Badge bg="primary" className="float-end" pill>
          {value}
        </Badge>
      );
    } else {
      setter('');
    }
  }

  useEffect(() => {
    if (currentUser) {
      setToken(currentUser.token);
    }
    if (wsNotifications.data) {
      const { message } = wsNotifications.data;
      const { alerts, messages } = message;
      setNotification(alerts, setAlerts);
      setNotification(messages, setMessages);
      if (alerts + messages > 0) {
        setBell(' 🔔');
      } else {
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
            <LinkContainer to="/jobs">
              <NavDropdown.Item>Created Job Postings</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/job-applications">
              <NavDropdown.Item>Submitted Applications</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown
            title={`${currentUser.username}${bell}`}
            id="user-dropdown"
          >
            <LinkContainer to="/notifications">
              <NavDropdown.Item>Notifications{alerts}</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/chat">
              <NavDropdown.Item>Chat{messages}</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to={`/profile/${currentUser.username}`}>
              <NavDropdown.Item>My Profile</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/settings">
              <NavDropdown.Item>Settings</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    );
  }

  return (
    <>
      <Navbar variant="dark" expand="lg" role="navigation">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                alt="SNNAP"
                src={snnapLogo}
                className="d-inline-block align-top logo"
              />
            </Navbar.Brand>
          </LinkContainer>
          {collapse}
          {menu}
        </Container>
      </Navbar>
      {rates}
      {currentUser && <ProfileNotification />}
    </>
  );
}

export default Menu;
