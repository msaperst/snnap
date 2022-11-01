import React from 'react';
import { Card } from 'react-bootstrap';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import './Profile.css';

function ProfileCard(props) {
  const { user, company } = props;

  return (
    <Card>
      <Card.Title>
        <ProfileHeader user={user} company={company} />
      </Card.Title>
      <Card.Body>
        <ProfileBody company={company} />
      </Card.Body>
    </Card>
  );
}

export default ProfileCard;
