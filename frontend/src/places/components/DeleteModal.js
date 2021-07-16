import { useRef, useMemo, useEffect, useContext } from 'react';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Modal, Button } from 'react-bootstrap';
import { AppContext } from '../../shared/context/context';

function DeleteModal({
  showDeleteModal,
  handleCloseDeleteModal,
  setError,
  setIsLoading,
}) {
  const { show, title, id } = showDeleteModal;
  const { accessToken, refreshToken, setAccessToken, logout, setAlertMsg } =
    useContext(AppContext);

  const handleDelete = async () => {
    handleCloseDeleteModal();
    console.log('id of ' + id + ' is deleted');
  };

  return (
    <Modal show={show} onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Are you sure you want to delete this place?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleDelete}>
          Delete
        </Button>
        <Button variant='secondary' onClick={handleCloseDeleteModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
