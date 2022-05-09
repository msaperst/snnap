import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import NotFound from '../NotFound/NotFound';

function UserPage() {
  const { username } = useParams();

  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    userService.get(username).then(
      (user) => {
        setUser(user);
        companyService.get(user.id).then((company) => {
          setCompany(company);
        });
      },
      (error) => {
        setUserError(error);
      }
    );
  }, [username]);

  if (userError) {
    return <NotFound />;
  }
  return (
    <h2>
      {user.username}, {company.name}
    </h2>
  );
}

export default UserPage;
