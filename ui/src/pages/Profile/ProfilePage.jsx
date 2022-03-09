import React, { useEffect, useState } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import { userService } from '../../services/user.service';
import AccountInformation from '../../components/UserProfile/AccountInformation/AccountInformation';
import PersonalInformation from '../../components/UserProfile/PersonalInformation/PersonalInformation';
import UpdatePassword from './UpdatePassword';

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
              <UpdatePassword />
              <h3>Company Information</h3>
            </Stack>
          </Col>
          <Col>
            <Stack>
              <PersonalInformation user={user} />
              <h3>Portfolio</h3>
            </Stack>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProfilePage;
