import { useContext } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/context';

function Navigation() {
  const { accessToken, userId, logout } = useContext(AppContext);

  return (
    <Navbar bg='light' expand='lg'>
      <NavLink to='/' exact className='nav-link navbar-brand'>
        YourPlace
      </NavLink>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ml-auto'>
          <NavLink to='/' exact className='nav-link'>
            ALL USERS
          </NavLink>
          {!!accessToken && (
            <NavLink to={`/${userId}/places`} className='nav-link'>
              MY PLACES
            </NavLink>
          )}
          {!!accessToken && (
            <NavLink to='/places/new' className='nav-link'>
              ADD PLACE
            </NavLink>
          )}
          {!accessToken && (
            <NavLink to='/login' className='nav-link'>
              LOGIN
            </NavLink>
          )}
          {!accessToken && (
            <NavLink to='/signup' className='nav-link'>
              SIGNUP
            </NavLink>
          )}
          {!!accessToken && (
            <Button onClick={logout} variant='link'>
              LOGOUT
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
