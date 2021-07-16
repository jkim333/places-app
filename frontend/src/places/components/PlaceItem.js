import React from 'react';
import { Col, Card } from 'react-bootstrap';

function PlaceItem({ place }) {
  return (
    <Col className='my-3 d-flex justify-content-center'>
      <Card style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Img
          variant='top'
          src={place.image ? `${place.image}` : '#'}
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{place.title}</Card.Title>
          <Card.Text>{`${place.description} `}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default PlaceItem;
