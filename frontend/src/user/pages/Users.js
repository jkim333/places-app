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
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:8000/api/users/',
        });
        setUsers(response.data);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError('Sorry, something went wrong! Please try this page again.');
      }
    };
    fetchUsers();
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
