import React, { useEffect, useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';
import { jobService } from '../../services/job.service';
import { userService } from '../../services/user.service';
import ProfileHeader from './ProfileHeader';
import ProfileBody from './ProfileBody';
import './Profile.css';

function ProfileAccordion(props) {
  const { user, company, onClick, selected } = props;

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
    <Accordion.Item
      eventKey={fullCompany.id}
      data-testid={`jobApplication-${fullCompany.id}`}
    >
      <Accordion.Header>
        <Container>
          <ProfileHeader
            user={fullUser}
            company={fullCompany}
            onClick={onClick}
            selected={selected}
          />
        </Container>
      </Accordion.Header>
      <Accordion.Body>
        <ProfileBody company={fullCompany} />
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default ProfileAccordion;
