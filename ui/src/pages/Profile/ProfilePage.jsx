import React, { useEffect, useState } from 'react';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import AccountInformation from '../../components/UserProfile/AccountInformation/AccountInformation';
import PersonalInformation from '../../components/UserProfile/PersonalInformation/PersonalInformation';
import CompanyInformation from '../../components/UserProfile/CompanyInformation/CompanyInformation';
import Portfolio from '../../components/UserProfile/Portfolio/Portfolio';
import Password from '../../components/UserProfile/Password/Password';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    userService.get().then((user) => {
      setUser(user);
    });
    companyService.get().then((company) => {
      setCompany(company);
    });
  }, []);

  return (
    <Container className="skinny">
      <Row>
        <Col>
          <h2>Profile</h2>
          <Tab.Container defaultActiveKey="account">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="account">Account Information</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="personal">
                      Personal Information
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password">Update Password</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="company">Company Information</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="portfolio">Build Portfolio</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="account">
                    <AccountInformation user={user} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="personal">
                    <PersonalInformation user={user} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="password">
                    <Password />
                  </Tab.Pane>
                  <Tab.Pane eventKey="company">
                    <CompanyInformation company={company} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="portfolio">
                    <Portfolio company={company} />
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

export default ProfilePage;
