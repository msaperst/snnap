import React, { useEffect, useState } from 'react';

import Search from '../../components/Search/Search';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import './HomePage.css';
import Filter from '../../components/Filter/Filter';

function HomePage() {
  const [currentUser, setCurrentUser] = useState(
    authenticationService.currentUserValue
  );
  const [searchFilter, setSearchFilter] = useState(null);

  useEffect(() => {
    userService.get().then((user) => {
      setCurrentUser({ ...currentUser, lastLogin: user.lastLogin });
    });
  }, []);

  // eslint-disable-next-line class-methods-use-this
  const filter = (e) => {
    e.preventDefault();
    setSearchFilter(e.target.value);
  };

  return (
    <>
      <Search filter={filter} />
      <Filter currentUser={currentUser} filter={searchFilter} />
    </>
  );
}

export default HomePage;
