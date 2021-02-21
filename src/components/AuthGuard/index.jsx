/**
 *
 * AuthGuard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function AuthGuard({ children }) {
  const { loggedIn, user } = useSelector((state) => state.app);
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  // if (loggedIn && user) {
  //   return <Redirect to="/" />;
  // }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
