import { Modal, Button } from 'react-bootstrap';

function ErrorModal({ error, setError }) {
  const handleClose = () => {
    setError(null);
  };

  return (
    <Modal show={!!error} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>An Error Occurred!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;
