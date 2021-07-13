import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { AppContext } from '../../shared/context/context';
import ErrorModal from '../../shared/components/ErrorModal';
import Loading from '../../shared/components/Loading';

const imageFileExtensions = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
];

const schema = yup.object().shape({
  title: yup.string().max(100).required(),
  description: yup.string().max(500).required(),
  address: yup.string().max(100).required(),
  image: yup
    .mixed()
    .required()
    .test('fileType', 'upload a valid image file', (value) => {
      if (value) {
        return imageFileExtensions.includes(value.type);
      }
    }),
});

function NewPlace() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const { accessToken, refreshToken, setAccessToken, logout, setAlertMsg } =
    useContext(AppContext);
  const unmounted = useRef(false);

  const filePickerRef = useRef();
  const handlePickImage = () => {
    filePickerRef.current.click();
  };

  const source = useMemo(() => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }, []);
  const axiosInstance = axios.create();

  // Function that will be called to refresh authorization
  const refreshAuthLogic = async (failedRequest) => {
    try {
      const response = await axiosInstance.post(
        'http://127.0.0.1:8000/auth/jwt/refresh/',
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
      }
      localStorage.setItem('accessToken', response.data.access);
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
    return function cleanup() {
      unmounted.current = true;
      source.cancel('Operation canceled by the user.');
    };
  }, [source]);

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <ErrorModal error={error} setError={setError} />
      <Formik
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            if (!unmounted.current) {
              setIsLoading(true);
            }
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('address', values.address);
            formData.append('image', values.image);
            const response = await axiosInstance({
              method: 'POST',
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
              data: formData,
              url: 'http://localhost:8000/api/places/',
              cancelToken: source.token,
            });
            if (!unmounted.current) {
              setIsLoading(false);
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
          title: '',
          description: '',
          address: '',
          image: null,
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
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter a title'
                          name='title'
                          value={values.title}
                          onChange={handleChange}
                          isInvalid={!!errors.title}
                        />

                        <Form.Control.Feedback type='invalid'>
                          {errors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                      <Form.Group as={Col} controlId='validationFormik02'>
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
                      <Form.Group as={Col} controlId='validationFormik03'>
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

                    <Row className='mb-3'>
                      <Form.Group as={Col} className='position-relative mb-3'>
                        <Form.Label>Image</Form.Label>
                        <Image
                          src={previewUrl}
                          style={{
                            width: '13rem',
                            height: '13rem',
                            display: 'block',
                          }}
                          thumbnail
                        />
                        <Button
                          variant='info'
                          className='mt-2'
                          onClick={handlePickImage}
                        >
                          Pick Image
                        </Button>
                        <Form.Control
                          className='d-none'
                          type='file'
                          name='image'
                          onChange={(e) => {
                            const file = e.currentTarget.files[0];
                            setFieldValue('image', file);
                            if (
                              !file ||
                              !imageFileExtensions.includes(file.type)
                            ) {
                              setPreviewUrl();
                              return;
                            }
                            const fileReader = new FileReader();
                            fileReader.onload = () => {
                              setPreviewUrl(fileReader.result);
                            };
                            fileReader.readAsDataURL(file);
                          }}
                          isInvalid={!!errors.image}
                          ref={filePickerRef}
                        />
                        <Form.Control.Feedback
                          type='invalid'
                          style={{ display: 'block' }}
                        >
                          {errors.image}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Button type='submit'>Sumbit</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default NewPlace;
