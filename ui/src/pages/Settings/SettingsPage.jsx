import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  let page = 'account';
  if (location && location.state) {
    page = location.state.page;
  }
  const [key, setKey] = useState(page);
  const [user, setUser] = useState({});
  const [settings, setSettings] = useState({});
  const [company, setCompany] = useState({});
  const isMountedVal = useRef(true);

  useEffect(() => {
    isMountedVal.current = true;
    userService.get().then((user) => {
      if (isMountedVal) {
        setUser(user);
      }
    });
    userService.getSettings().then((settings) => {
      if (isMountedVal) {
        setSettings(settings);
      }
    });
    companyService.get().then((company) => {
      if (isMountedVal) {
        setCompany(company);
      }
    });
    return () => {
      isMountedVal.current = false;
    };
  }, []);

  const updateKey = useCallback((k) => setKey(k), []);

  return (
    <Row>
      <Col>
        <h1 className="h2">Settings</h1>
        <Tabs
          activeKey={key}
          onSelect={updateKey}
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

export default SettingsPage;
