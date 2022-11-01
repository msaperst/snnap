import React from 'react';
import { Accordion, Container } from 'react-bootstrap';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import './Profile.css';

function ProfileAccordion(props) {
  const { user, company, onClick, selected } = props;

  return (
    <Accordion.Item
      eventKey={company.id}
      data-testid={`jobApplication-${company.id}`}
    >
      <Accordion.Header>
        <Container>
          <ProfileHeader
            user={user}
            company={company}
            onClick={onClick}
            selected={selected}
          />
        </Container>
      </Accordion.Header>
      <Accordion.Body>
        <ProfileBody company={company} />
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ProfileAccordion;
