import React, { useState } from 'react';
import { authenticationService } from '../../services/authentication.service';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import './HomePage.css';

function HomePage() {
  const [searchFilter, setSearchFilter] = useState(null);

  // eslint-disable-next-line class-methods-use-this
  const filter = (e) => {
    e.preventDefault();
    setSearchFilter(e.target.value);
  };

  return (
    <>
      <Search filter={filter} />
      <Filter
        currentUser={authenticationService.currentUserValue}
        filter={searchFilter}
      />
    </>
  );
}

export default HomePage;
