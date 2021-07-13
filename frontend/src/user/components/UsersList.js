import { Row, Col } from 'react-bootstrap';
import UserItem from './UserItem';

function UsersList({ users }) {
  if (users && users.length > 0) {
    return (
      <Row className='mb-5'>
        {users.map((user) => (
          <UserItem user={user} key={user.id} />
        ))}
      </Row>
    );
  }
  return (
    <Row className='mb-5'>
      <Col className='text-center'>No users were found ...</Col>
    </Row>
  );
}

export default UsersList;
