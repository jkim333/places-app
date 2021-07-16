import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PlaceItem from './PlaceItem';

function PlaceList({ places }) {
  if (places && places.length > 0) {
    return (
      <React.Fragment>
        {places.map((place) => (
          <Row className='mb-3' key={place.id}>
            <PlaceItem place={place} />
          </Row>
        ))}
      </React.Fragment>
    );
  }
  return (
    <Row className='mb-5'>
      <Col className='text-center'>No places were found ...</Col>
    </Row>
  );
}

export default PlaceList;
