import React, { useEffect, useRef, useContext, useState } from 'react';
import { Button, Container, Row } from 'reactstrap';
import logo from '../../assets/images/logo.png';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext.js';

import './header.css';

const nav__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/tours',
    display: 'Tours'
  },
  {
    path: '/booking',
    display: 'Bookings'
  },
  {
    path: '/about',
    display: 'About'
  }
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const logout = () => {
    if (!isBookingPage()) {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user'); // Clear user data from local storage
      navigate('/home');
    }
  };

  const isBookingPage = () => {
    return window.location.pathname === '/booking';
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!refreshing) {
        // Clear user data from local storage only if not refreshing
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('user');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch, navigate, refreshing]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'r') {
        // Prevent default behavior (refreshing the page)
        event.preventDefault();
        // Set refreshing state to true
        setRefreshing(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const stickyHeaderFunc = () => {
      if (window.scrollY > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    };

    window.addEventListener('scroll', stickyHeaderFunc);

    return () => {
      window.removeEventListener('scroll', stickyHeaderFunc);
    };
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle('show__menu');
    }
  };

  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className='nav__wrapper d-flex align-items-center justify-content-between'>
  
            {/* Logo Section */}
            <div className='logo'>
              <img src={logo} alt='logo' />
            </div>
  
            {/* Navigation Menu */}
            <div className='navigation' ref={menuRef} onClick={toggleMenu}>
              <ul className='menu d-flex align-items-center gap-5'>
                {nav__links.map((item, index) => (
                  <li className='nav__item' key={index}>
                    <NavLink to={item.path} className={navClass => navClass.isActive ? "active__link" : ""}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Login & Register Buttons - Adjusted for Spacing */}
            <div className='nav__right d-flex align-items-center gap-4 justify-content-end ms-auto me-5'>
              <div className='nav__btns d-flex align-items-center gap-3'>
                {user ? (
                  <>
                    {/* <h5 className='mb-0'>{user.username}</h5> */}
                    <Button className='btn primary__btn' onClick={logout}>Log-Out</Button>
                  </>
                ) : (
                  <>
                    <Button className='btn secondary__btn'>
                      <Link to='/login'>Login</Link>
                    </Button>
                    <Button className='btn primary__btn'>
                      <Link to='/register'>Register</Link>
                    </Button>
                  </>
                )}
              </div>
  
              <span className='mobile__menu' onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
  
          </div>
        </Row>
      </Container>
    </header>
  );
  

};

export default Header;
