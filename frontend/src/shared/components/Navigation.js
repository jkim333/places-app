import { useContext } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/context';

function Navigation() {
  const { token, userId, logout } = useContext(AppContext);

  return (
    <Navbar bg='light' expand='lg'>
      <Navbar.Brand href='#home'>YourPlace</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ml-auto'>
          <NavLink to='/' exact className='nav-link'>
            ALL USERS
          </NavLink>
          {!!token && (
            <NavLink to={`/${userId}/places`} className='nav-link'>
              MY PLACES
            </NavLink>
          )}
          {!!token && (
            <NavLink to='/places/new' className='nav-link'>
              ADD PLACE
            </NavLink>
          )}
          {!token && (
            <NavLink to='/login' className='nav-link'>
              LOGIN
            </NavLink>
          )}
          {!token && (
            <NavLink to='/signup' className='nav-link'>
              SIGNUP
            </NavLink>
          )}
          {!!token && (
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
