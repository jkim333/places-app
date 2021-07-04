import React from 'react';
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
  return (
    <React.Fragment>
      <UsersList users={DUMMY_USERS} />
    </React.Fragment>
  );
}

export default Users;
