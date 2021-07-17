import { useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from './shared/context/context';
import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import Navigation from './shared/components/Navigation';
import AlertComponent from './shared/components/AlertComponent';

const initialRoutes = (
  <Switch>
    <Route path='/' exact>
      <Users />
    </Route>
    <Route path='/:userId/places' exact>
      <UserPlaces />
    </Route>
    <Route path='/places/new' exact>
      <NewPlace />
    </Route>
    <Route path='/places/:placeId' exact>
      <UpdatePlace />
    </Route>
    <Route path='/:userId/places' exact>
      <UserPlaces />
    </Route>
    <Route path='/login' exact>
      <Login />
    </Route>
    <Route path='/signup' exact>
      <Signup />
    </Route>
    <Redirect to='/' />
  </Switch>
);

function App() {
  const { accessToken, alertMsg, setAlertMsg } = useContext(AppContext);
  const [routes, setRoutes] = useState(initialRoutes);

  useEffect(() => {
    if (accessToken && accessToken === 'initialAccessToken') {
    } else if (accessToken && accessToken !== 'initialAccessToken') {
      setRoutes(
        <Switch>
          <Route path='/' exact>
            <Users />
          </Route>
          <Route path='/:userId/places' exact>
            <UserPlaces />
          </Route>
          <Route path='/places/new' exact>
            <NewPlace />
          </Route>
          <Route path='/places/:placeId' exact>
            <UpdatePlace />
          </Route>
          <Redirect to='/' />
        </Switch>
      );
    } else {
      setRoutes(
        <Switch>
          <Route path='/' exact>
            <Users />
          </Route>
          <Route path='/:userId/places' exact>
            <UserPlaces />
          </Route>
          <Route path='/login' exact>
            <Login />
          </Route>
          <Route path='/signup' exact>
            <Signup />
          </Route>
          <Redirect to='/login' />
        </Switch>
      );
    }
  }, [accessToken]);

  return (
    <Router>
      <Navigation />
      <main>
        <Container className='mt-5'>
          <>
            {alertMsg && (
              <AlertComponent
                variant={alertMsg.variant}
                onClose={() => setAlertMsg(null)}
                msg={alertMsg.message}
              />
            )}
            {routes}
          </>
        </Container>
      </main>
    </Router>
  );
}

export default App;
