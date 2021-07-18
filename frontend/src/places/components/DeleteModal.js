import { useContext } from 'react';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Modal, Button } from 'react-bootstrap';
import { AppContext } from '../../shared/context/context';

function DeleteModal({
  showDeleteModal,
  handleCloseDeleteModal,
  setError,
  setIsLoading,
  setPlaces,
  fetchPlaces,
}) {
  const { show, title, id } = showDeleteModal;
  const { accessToken, refreshToken, setAccessToken, logout, setAlertMsg } =
    useContext(AppContext);

  const axiosInstance = axios.create();

  // Function that will be called to refresh authorization
  const refreshAuthLogic = async (failedRequest) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/jwt/refresh/`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setAccessToken(response.data.access);
      localStorage.setItem('accessToken', JSON.stringify(response.data.access));
      failedRequest.response.config.headers['Authorization'] =
        'Bearer ' + response.data.access;
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(new Error('refreshToken expired'));
    }
  };

  // Instantiate the interceptor (you can chain it as it returns the axios instance)
  createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    pauseInstanceWhileRefreshing: true,
  });

  const handleDelete = async () => {
    handleCloseDeleteModal();

    try {
      setPlaces([]);
      setIsLoading(true);
      await axiosInstance({
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        url: `${process.env.REACT_APP_BACKEND_URL}/api/places/${id}`,
      });
      fetchPlaces(1);
      setIsLoading(false);
      setAlertMsg({
        message: 'Your place was deleted successfully.',
        variant: 'success',
      });
    } catch (err) {
      console.log(err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 403) {
          setError('You do not have permission to delete this page.');
        } else {
          setError('Something went wrong. Please try again another time.');
        }
        setIsLoading(false);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        setError('Something went wrong. Please try again another time.');
        setIsLoading(false);
      } else if (err.message === 'refreshToken expired') {
        setAlertMsg({
          message: 'Your Session expired. Please login again.',
          variant: 'danger',
        });
        setIsLoading(false);
        logout();
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Something went wrong. Please try again another time.');
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this place?</Modal.Body>
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
