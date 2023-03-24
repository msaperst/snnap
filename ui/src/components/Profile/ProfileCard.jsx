import React from 'react';
import { Card } from 'react-bootstrap';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import './Profile.css';

function ProfileCard(props) {
  const { user, company, highlight } = props;

  return (
    <Card
      className={`job-application ${highlight ? 'highlight' : ''}`}
      data-testid={`job-application-${company.id}`}
    >
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
