import React, { useEffect, useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import AccountInformation from '../../components/UserProfile/AccountInformation/AccountInformation';
import PersonalInformation from '../../components/UserProfile/PersonalInformation/PersonalInformation';
import CompanyInformation from '../../components/UserProfile/CompanyInformation/CompanyInformation';
import Portfolio from '../../components/UserProfile/Portfolio/Portfolio';
import Password from '../../components/UserProfile/Password/Password';
import Notifications from '../../components/UserProfile/Notifications/Notifications';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [settings, setSettings] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    userService.get().then((user) => {
      setUser(user);
    });
    userService.getSettings().then((settings) => {
      setSettings(settings);
    });
    companyService.get().then((company) => {
      setCompany(company);
    });
  }, []);

  return (
    <Row>
      <Col>
        <h2>Profile</h2>
        <Tabs
          defaultActiveKey="account"
          className="mb-3"
          justify
          variant="pills"
        >
          <Tab eventKey="account" title="Account Information">
            <div className="skinny">
              <AccountInformation user={user} />
              <Row className="mb-5" />
              <Password />
              <Row className="mb-5" />
              <Notifications settings={settings} />
            </div>
          </Tab>
          <Tab eventKey="personal" title="Personal Profile">
            <div className="skinny">
              <PersonalInformation user={user} />
            </div>
          </Tab>
          <Tab eventKey="company" title="Company Profile">
            <div className="skinny">
              <CompanyInformation company={company} />
              <Row className="mb-5" />
              <Portfolio company={company} />
            </div>
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}

export default ProfilePage;
