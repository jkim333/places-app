import { Col, Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UserItem({ user }) {
  return (
    <Col md={6} sm={12} xs={12} className='my-3'>
      <Link to={`/${user.id}/places`}>
        <Card>
          <Card.Body className='d-flex flex-row align-items-center'>
            <Image src='holder.js/171x180' roundedCircle className='mr-3' />
            <div>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text>{`${user.places.length} place${
                user.places !== 1 ? 's' : ''
              }`}</Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

export default UserItem;
