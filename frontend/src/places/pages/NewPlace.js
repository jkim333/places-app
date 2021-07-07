import React, { useContext, useState } from 'react';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import { AppContext } from '../../shared/context/context';
import ErrorModal from '../../shared/components/ErrorModal';
import Loading from '../../shared/components/Loading';

const schema = yup.object().shape({
  title: yup.string().max(100).required(),
  description: yup.string().max(500).required(),
  address: yup.string().max(100).required(),
});

function NewPlace() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, refreshToken, setAccessToken } = useContext(AppContext);

  // Function that will be called to refresh authorization
  const refreshAuthLogic = (failedRequest) =>
    axios
      .post(
        'http://127.0.0.1:8000/auth/jwt/refresh/',
        { refresh: refreshToken },
        { headers: { 'content-type': 'application/json' } }
      )
      .then((tokenRefreshResponse) => {
        localStorage.setItem('accessToken', tokenRefreshResponse.data.access);
        setAccessToken(tokenRefreshResponse.data.access);
        failedRequest.response.config.headers['Authorization'] =
          'Bearer ' + tokenRefreshResponse.data.access;
        return Promise.resolve();
      });

  // Instantiate the interceptor (you can chain it as it returns the axios instance)
  createAuthRefreshInterceptor(axios, refreshAuthLogic);

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <ErrorModal error={error} setError={setError} />
      <Formik
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            setIsLoading(true);
            const response = await axios({
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
              },
              data: {
                title: values.title,
                description: values.description,
                address: values.address,
              },
              url: 'http://localhost:8000/api/places/',
            });
            setIsLoading(false);
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
                    errorMessage += `'${errors[i][0]}' field : ${errors[i][1]}`;
                  } else {
                    errorMessage += `${errors[i][0]} : ${errors[i][1]} <br/>`;
                  }
                }
                setError(errorMessage);
              } else {
                setError(
                  'Something went wrong. Please try again another time.'
                );
              }
            } else if (err.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              setError('Something went wrong. Please try again another time.');
            } else {
              // Something happened in setting up the request that triggered an Error
              setError('Something went wrong. Please try again another time.');
            }
            setIsLoading(false);
          }
        }}
        initialValues={{
          title: '',
          description: '',
          address: '',
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
