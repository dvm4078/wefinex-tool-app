import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Redirect, Route, Switch } from 'react-router-dom';

function HomePage(props) {
  const { loggedIn, user, loggedInWefinex } = useSelector((state) => state.app);
  console.log(
    'loggedIn, user, loggedInWefinex ',
    loggedIn,
    user,
    loggedInWefinex
  );
  if (!loggedIn) {
    return <Redirect to="/login" />;
  }
  if (user.role === 'admin') {
    return <Redirect to="/admin/users" />;
  } else {
    return <Redirect to="/user/dashboard" />;
    // if (!loggedInWefinex) {
    //   return <Redirect to="/login-wefinex" />;
    // } else {
    //   return <Redirect to="/user/dashboard" />;
    // }
  }
}

HomePage.propTypes = {};

export default HomePage;
