import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsersList from '../components/UsersList';

const DUMMY_USERS = [
  { id: 1, username: 'Jihyung', places: 0 },
  { id: 1, username: 'Jihyung', places: 3 },
  { id: 1, username: 'Jihyung', places: 3 },
  { id: 1, username: 'Jihyung', places: 3 },
  { id: 1, username: 'Jihyung', places: 3 },
  { id: 1, username: 'Jihyung', places: 3 },
];

function Users() {
  // const [users, setUsers] = useState()
  // useEffect(() => {

  // }, []);
  return (
    <React.Fragment>
      <UsersList users={DUMMY_USERS} />
    </React.Fragment>
  );
}

export default Users;
