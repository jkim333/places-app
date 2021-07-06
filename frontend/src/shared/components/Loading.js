import { Spinner } from 'react-bootstrap';

function Loading() {
  return (
    <div className='d-flex justify-content-center'>
      <Spinner animation='border' role='status'></Spinner>
    </div>
  );
}

export default Loading;
