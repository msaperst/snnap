import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import Notifications from '../../components/UserSettings/Notifications/Notifications';

function SettingsPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    userService.getSettings().then((set) => {
      setSettings(set);
    });
  }, []);

  return (
    <Container className="skinny">
      <Row>
        <Col>
          <h2>Settings</h2>
          <Tab.Container defaultActiveKey="notifications">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="notifications">Notifications</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="notifications">
                    <Notifications settings={settings} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
}

export default SettingsPage;
