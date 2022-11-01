import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ProfileCard from '../../components/Profile/ProfileCard';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import NotFound from '../NotFound/NotFound';

function ProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    userService.get(username).then(
      (u) => {
        setUser(u);
        companyService.get(u.id).then((comp) => {
          setCompany(comp);
        });
      },
      (error) => {
        setUserError(error.toString());
      }
    );
  }, [username]);

  if (userError) {
    return <NotFound />;
  }

  return (
    <Container className="skinny no-card">
      <ProfileCard user={user} company={company} />
    </Container>
  );
}

export default ProfilePage;
