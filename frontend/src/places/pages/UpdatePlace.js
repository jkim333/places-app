import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../shared/context/context';
import Loading from '../../shared/components/Loading';
import ErrorModal from '../../shared/components/ErrorModal';

const schema = yup.object().shape({
  description: yup.string().max(500).required(),
  address: yup.string().max(100).required(),
});

function UpdatePlace() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const { placeId } = useParams();
  const {
    userId,
    logout,
    setAlertMsg,
    accessToken,
    refreshToken,
    setAccessToken,
  } = useContext(AppContext);

  let history = useHistory();

  let unmounted = useRef(false);

  const source = useMemo(() => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }, []);
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
          cancelToken: source.token,
        }
      );
      if (!unmounted.current) {
        setAccessToken(response.data.access);
        localStorage.setItem(
          'accessToken',
          JSON.stringify(response.data.access)
        );
      }
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

  useEffect(() => {
    const fetchPlace = async (placeId) => {
      try {
        if (!unmounted.current) {
          setIsLoading(true);
        }
        const response = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}/`,
          cancelToken: source.token,
        });
        if (!unmounted.current) {
          if (userId !== response.data.creator) {
            setAlertMsg({
              message:
                'Sorry, you are not the author of this place. Please login again using correct credentials.',
              variant: 'danger',
            });
            logout();
          } else {
            setPlace(response.data);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 404) {
            if (!unmounted.current) {
              setError('This place does not exist.');
            }
          } else {
            if (!unmounted.current) {
              setError('Something went wrong. Please try again another time.');
            }
          }
          if (!unmounted.current) {
            setIsLoading(false);
          }
        } else {
          if (!unmounted.current) {
            setError('Something went wrong. Please try again another time.');
            setIsLoading(false);
          }
        }
      }
    };

    if (userId) {
      fetchPlace(placeId);
    }
  }, [placeId, userId, source.token, logout, setAlertMsg]);

  useEffect(() => {
    return function cleanup() {
      unmounted.current = true;
      source.cancel('Operation canceled by the user.');
    };
  }, [source]);

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <ErrorModal error={error} setError={setError} />
      {place ? (
        <Formik
          validationSchema={schema}
          onSubmit={async (values) => {
            try {
              if (!unmounted.current) {
                setIsLoading(true);
              }
              await axiosInstance({
                method: 'PUT',
                headers: {
                  Authorization: 'Bearer ' + accessToken,
                  'content-type': 'application/json',
                },
                data: {
                  description: values.description,
                  address: values.address,
                },
                url: `${process.env.REACT_APP_BACKEND_URL}/api/places/${placeId}/`,
                cancelToken: source.token,
              });
              if (!unmounted.current) {
                setIsLoading(false);
                history.push(`/${userId}/places`);
                setAlertMsg({
                  message: 'Your place was updated successfully.',
                  variant: 'success',
                });
              }
            } catch (err) {
              console.log(err);
              if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (err.response.status < 500) {
                  const errors = Object.entries(err.response.data);
                  let errorMessage = '';
                  for (let i = 0; i < errors.length; i++) {
                    if (i === errors.length - 1) {
                      errorMessage += `'${errors[i][0]}' field : ${errors[i][1][0]}`;
                    } else {
                      errorMessage += `${errors[i][0]} : ${errors[i][1][0]} <br/>`;
                    }
                  }
                  if (!unmounted.current) {
                    setError(errorMessage);
                  }
                } else {
                  if (!unmounted.current) {
                    setError(
                      'Something went wrong. Please try again another time.'
                    );
                  }
                }
                if (!unmounted.current) {
                  setIsLoading(false);
                }
              } else if (err.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                if (!unmounted.current) {
                  setError(
                    'Something went wrong. Please try again another time.'
                  );
                  setIsLoading(false);
                }
              } else if (err.message === 'refreshToken expired') {
                if (!unmounted.current) {
                  setAlertMsg({
                    message: 'Your Session expired. Please login again.',
                    variant: 'danger',
                  });
                  setIsLoading(false);
                }
                source.cancel('Operation canceled by the user.');
                logout();
              } else {
                // Something happened in setting up the request that triggered an Error
                if (!unmounted.current) {
                  setError(
                    'Something went wrong. Please try again another time.'
                  );
                  setIsLoading(false);
                }
              }
            }
          }}
          initialValues={{
            description: place.description,
            address: place.address,
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            setFieldValue,
          }) => (
            <Row className={isLoading ? 'd-none' : 'mb-5'}>
              <Col>
                <Card>
                  <Card.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row className='mb-3'>
                        <Form.Group as={Col} controlId='validationFormik01'>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as='textarea'
                            placeholder='Enter a description'
                            name='description'
                            value={values.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                            style={{ height: '150px' }}
                          />

                          <Form.Control.Feedback type='invalid'>
                            {errors.description}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className='mb-3'>
                        <Form.Group as={Col} controlId='validationFormik02'>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Enter an address'
                            name='address'
                            value={values.address}
                            onChange={handleChange}
                            isInvalid={!!errors.address}
                          />

                          <Form.Control.Feedback type='invalid'>
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Button type='submit'>Update</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Formik>
      ) : (
        <Row className={isLoading ? 'd-none' : 'mb-5'}>
          <Col className='text-center'>
            Something went wrong. Please try again another time.
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
}

export default UpdatePlace;
