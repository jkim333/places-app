import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { AppContext } from '../../shared/context/context';
import ErrorModal from '../../shared/components/ErrorModal';
import Loading from '../../shared/components/Loading';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Required'),
  password: yup.string().required(),
});

function Login() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AppContext);
  const unmounted = useRef(false);

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
            const response = await axios({
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              data: { email: values.email, password: values.password },
              url: 'http://localhost:8000/auth/jwt/create/',
              cancelToken: source.token,
            });
            const secondResponse = await axios({
              method: 'GET',
              headers: { Authorization: 'Bearer ' + response.data.access },
              url: 'http://localhost:8000/auth/users/me/',
              cancelToken: source.token,
            });
            if (!unmounted.current) {
              setIsLoading(false);
              login(
                response.data.access,
                response.data.refresh,
                secondResponse.data.id
              );
            }
          } catch (err) {
            if (err.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              if (err.response.status < 500) {
                if (!unmounted.current) {
                  setError(
                    'No active account found with the given credentials.'
                  );
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
        }) => (
          <Row className={isLoading && 'd-none'}>
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
                    <Button type='submit'>Login</Button>
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

export default Login;
