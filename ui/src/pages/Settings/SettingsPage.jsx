import React, { useEffect, useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import AccountInformation from '../../components/Settings/AccountInformation/AccountInformation';
import PersonalInformation from '../../components/Settings/PersonalInformation/PersonalInformation';
import CompanyInformation from '../../components/Settings/CompanyInformation/CompanyInformation';
import Portfolio from '../../components/Settings/Portfolio/Portfolio';
import Password from '../../components/Settings/Password/Password';
import Notifications from '../../components/Settings/Notifications/Notifications';
import './SettingsPage.css';

function SettingsPage() {
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
        <h2>Settings</h2>
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
          <Tab eventKey="personal" title="Personal ProfileCard">
            <div className="skinny">
              <PersonalInformation user={user} />
            </div>
          </Tab>
          <Tab eventKey="company" title="Company ProfileCard">
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

export default SettingsPage;
