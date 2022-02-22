import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { authenticationService } from '../services/authentication.service';

export function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        }

        // authorised so return component
        return <Component {...props} />;
      }}
    />
  );
}
