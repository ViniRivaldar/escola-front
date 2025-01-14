import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaCircle, FaPowerOff } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Nav } from './styled';
import * as actions from '../../store/modules/auth/actions'

export default function Header() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state=> state.auth.isLoggedIn)

  const handleLogout = e =>{
    e.preventDefault()
    
    dispatch(actions.loginFailure())

    navigate('/')
  }

  return (
    <Nav>
      <Link to="/">
        <FaHome size={24} />
      </Link>
      <Link to="/register">
        <FaUserAlt size={24} />
      </Link>
      {isLoggedIn ? (
        <Link onClick={handleLogout} to="/logout">
          <FaPowerOff size={24} />
        </Link>
      ):(
        <Link to="/login">
          <FaSignInAlt size={24} />
        </Link>
      )}

      {isLoggedIn &&  <FaCircle size={24} color='#66ff33'/>}
    </Nav>
  );
}
