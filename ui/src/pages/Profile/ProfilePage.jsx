import React, { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
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
    <Row>
      <Col>
        <h2>Profile</h2>
        <Row className="mb-3">
          <Col>
            <Stack>
              <AccountInformation user={user} />
              <PersonalInformation user={user} />
              <Password />
            </Stack>
          </Col>
          <Col>
            <Stack>
              <CompanyInformation company={company} />
              <Portfolio company={company} />
            </Stack>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProfilePage;
