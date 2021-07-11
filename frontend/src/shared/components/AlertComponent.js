import { Alert } from 'react-bootstrap';

function AlertComponent(props) {
  return (
    <Alert variant={props.variant} onClose={props.onClose} dismissible>
      {props.msg}
    </Alert>
  );
}

export default AlertComponent;
