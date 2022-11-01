import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import './Profile.css';
import { userService } from '../../services/user.service';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';

function ProfileCard(props) {
  const { user, company } = props;

  const [fullUser, setFullUser] = useState({});
  const [fullCompany, setFullCompany] = useState({});

  useEffect(() => {
    if (company.job_id) {
      userService.get(company.user).then((u) => {
        setFullUser(u);
      });
      jobService.getJobApplication(company.id).then((c) => {
        setFullCompany(c);
      });
    } else {
      setFullUser(user);
      setFullCompany(company);
    }
  }, [user, company]);

  return (
    <Card>
      <Card.Title>
        <ProfileHeader user={fullUser} company={fullCompany} />
      </Card.Title>
      <Card.Body>
        <ProfileBody company={fullCompany} />
      </Card.Body>
    </Card>
  );
}

export default ProfileCard;
