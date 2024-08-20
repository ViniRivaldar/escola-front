import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const MyRoute = ({ element: Component, isClosed = false, ...rest }) => { 
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const location = useLocation();
  
  if (isClosed && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

MyRoute.propTypes = {
  element: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired, 
  isClosed: PropTypes.bool,
};

export default MyRoute;
