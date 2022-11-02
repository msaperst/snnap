import React, { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import ProfileAccordion from './ProfileAccordion';
import ProfileCard from './ProfileCard';

function Profile(props) {
  const { type, user, company, onClick, selected } = props;

  const [fullUser, setFullUser] = useState({});
  const [fullCompany, setFullCompany] = useState({});

  useEffect(() => {
    if (company.job_id) {
      userService.get(company.user_id).then((u) => {
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

  if (type === 'accordion') {
    return (
      <ProfileAccordion
        user={fullUser}
        company={fullCompany}
        onClick={onClick}
        selected={selected}
      />
    );
  }
  return <ProfileCard user={fullUser} company={fullCompany} />;
}

export default Profile;
