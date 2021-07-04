import { Row } from 'react-bootstrap';
import UserItem from './UserItem';

function UsersList({ users }) {
  return (
    <Row>
      {users.map((user) => (
        <UserItem user={user} key={user.id} />
      ))}
    </Row>
  );
}

export default UsersList;
