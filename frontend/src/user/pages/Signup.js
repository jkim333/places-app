import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
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
  email: yup.string().email('Invalid email address').required('Required'),
  password: yup.string().required().min(8),
  image: yup
    .mixed()
    .required()
    .test('fileType', 'upload a valid image file', (value) => {
      if (value) {
        return imageFileExtensions.includes(value.type);
      }
    }),
});

function Signup() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const { setAlertMsg } = useContext(AppContext);
  const unmounted = useRef(false);

  let history = useHistory();

  const filePickerRef = useRef();
  const handlePickImage = () => {
    filePickerRef.current.click();
  };

  const source = useMemo(() => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
  }, []);

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
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('image', values.image);
            const response = await axios({
              method: 'POST',
              data: formData,
              url: 'http://localhost:8000/auth/users/',
              cancelToken: source.token,
            });
            if (!unmounted.current) {
              setIsLoading(false);
              history.push('/login');
              setAlertMsg({
                message: 'Your account was successfully created. Please login.',
                variant: 'success',
              });
            }
          } catch (err) {
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
          email: '',
          password: '',
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
            <Col lg={{ span: 6, offset: 3 }}>
              <Card>
                <Card.Body>
                  <Form noValidate onSubmit={handleSubmit}>
                    <Row className='mb-3'>
                      <Form.Group as={Col} controlId='validationFormik01'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type='email'
                          placeholder='Enter email'
                          name='email'
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />

                        <Form.Control.Feedback type='invalid'>
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                      <Form.Group as={Col} controlId='validationFormik02'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type='password'
                          placeholder='Password'
                          name='password'
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />

                        <Form.Control.Feedback type='invalid'>
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                      <Form.Group as={Col} controlId='validationFormik03'>
                        <Form.Label>Image</Form.Label>
                        <Image
                          src={previewUrl}
                          style={{
                            width: '13rem',
                            height: '13rem',
                            display: 'block',
                            objectFit: 'cover',
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

                        <Form.Control.Feedback type='invalid'>
                          {errors.image}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Button type='submit'>Sign Up</Button>
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

export default Signup;
