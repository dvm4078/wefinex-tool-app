/**
 *
 * GuestGuard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import { createStructuredSelector } from 'reselect';

// import { makeSelectLoggedIn } from 'containers/App/selectors';

function GuestGuard({ children }) {
  const { loggedIn } = useSelector((state) => state.app);
  if (loggedIn) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
