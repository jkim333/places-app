import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PlaceItem({ place, handleOpenMapModal, handleOpenDeleteModal }) {
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
          <Card.Text>{`${place.address} `}</Card.Text>
          <Card.Text>{`${place.description} `}</Card.Text>
          <div>
            <Button
              variant='primary'
              className='mr-2'
              onClick={() =>
                handleOpenMapModal(
                  place.title,
                  place.address,
                  place.lat,
                  place.lon
                )
              }
            >
              View On Map
            </Button>
            <Link
              to={`/places/${place.id}`}
              className='btn btn-outline-secondary mr-2'
              role='button'
            >
              Edit
            </Link>
            <Button
              variant='outline-danger'
              className='mr-2'
              onClick={() => handleOpenDeleteModal(place.title, place.id)}
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default PlaceItem;
