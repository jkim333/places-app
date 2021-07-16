import { Modal, Button } from 'react-bootstrap';
import Map from './Map';

function MapModal({ showMapModal, handleCloseMapModal }) {
  const { show, title, address, lat, lon } = showMapModal;
  return (
    <Modal size='lg' show={show} onHide={handleCloseMapModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Map lat={lat} lon={lon} />
        <h5>{address}</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleCloseMapModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MapModal;
