import React, { useEffect, useState } from 'react';
import { authenticationService } from '../../services/authentication.service';
import Search from '../../components/Search/Search';
import Filter from '../../components/Filter/Filter';
import './HomePage.css';

function HomePage() {
  const [searchFilter, setSearchFilter] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (window.location.hash && window.location.hash !== '#') {
      setSelected(window.location.hash.substring(1));
    }
  }, []);

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
        selected={selected}
      />
    </>
  );
}

export default HomePage;
