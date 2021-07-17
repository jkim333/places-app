import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

function AlertComponent(props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose();
    }, 2000);

    return function cleanup() {
      clearTimeout(timer);
    };
  }, [props]);

  return (
    <Alert variant={props.variant} onClose={props.onClose} dismissible>
      {props.msg}
    </Alert>
  );
}

export default AlertComponent;
