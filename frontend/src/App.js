import { useContext } from 'react';
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

function App() {
  const { token } = useContext(AppContext);

  let routes;
  if (token) {
    routes = (
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
    routes = (
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

  return (
    <Router>
      <Navigation />
      <main>
        <Container>{routes}</Container>
      </main>
    </Router>
  );
}

export default App;
