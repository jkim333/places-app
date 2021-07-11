import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsersList from '../components/UsersList';
import Loading from '../../shared/components/Loading';
import ErrorModal from '../../shared/components/ErrorModal';

function Users() {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    const fetchUsers = async () => {
      if (!unmounted) {
        setIsLoading(true);
      }
      try {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:8000/api/users/',
          cancelToken: source.token,
        });
        if (!unmounted) {
          setUsers(response.data);
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!unmounted) {
          setIsLoading(false);
          setError('Sorry, something went wrong! Please try this page again.');
        }
      }
    };
    fetchUsers();

    return function cleanup() {
      unmounted = true;
      source.cancel('Operation canceled by the user.');
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} setError={setError} />
      <UsersList users={users} />
    </React.Fragment>
  );
}

export default Users;
