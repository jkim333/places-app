import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import PlaceItem from './PlaceItem';
import DeleteModal from './DeleteModal';
import MapModal from './MapModal';

function PlaceList({ places, setError, setIsLoading }) {
  const [showMapModal, setShowMapModal] = useState({
    show: false,
    title: null,
    address: null,
    lat: null,
    lon: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    title: null,
    id: null,
  });

  const handleOpenMapModal = (title, address, lat, lon) => {
    setShowMapModal({ show: true, title, address, lat, lon });
  };

  const handleCloseMapModal = () => {
    setShowMapModal({
      show: false,
      title: null,
      address: null,
      lat: null,
      lon: null,
    });
  };

  const handleOpenDeleteModal = (title, id) => {
    setShowDeleteModal({ show: true, title, id });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal({ show: false, title: null, id: null });
  };

  if (places && places.length > 0) {
    return (
      <React.Fragment>
        {showMapModal && (
          <MapModal
            showMapModal={showMapModal}
            handleCloseMapModal={handleCloseMapModal}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            showDeleteModal={showDeleteModal}
            handleCloseDeleteModal={handleCloseDeleteModal}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        )}
        {places.map((place) => (
          <Row className='mb-3' key={place.id}>
            <PlaceItem
              place={place}
              handleOpenMapModal={handleOpenMapModal}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
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
