import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import Dashboard from './Dashboard';
import LoginWefinex from '../LoginWefinex';

function UserDashboardPage(props) {
  const { loggedInWefinex } = useSelector((state) => state.app);

  return <>{!loggedInWefinex ? <LoginWefinex /> : <Dashboard />}</>;
}

UserDashboardPage.propTypes = {};

export default UserDashboardPage;
