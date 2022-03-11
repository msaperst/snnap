import React, { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import AccountInformation from '../../components/UserProfile/AccountInformation/AccountInformation';
import PersonalInformation from '../../components/UserProfile/PersonalInformation/PersonalInformation';
import Portfolio from '../../components/UserProfile/Portfolio/Portfolio';

function ProfilePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    userService.get().then((user) => {
      setUser(user);
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
              <h3>Update Password</h3>
              <h3>Company Information</h3>
            </Stack>
          </Col>
          <Col>
            <Stack>
              <PersonalInformation user={user} />
              <Portfolio companyExperience="Some experience" portfolio={[{}]} />
            </Stack>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProfilePage;
