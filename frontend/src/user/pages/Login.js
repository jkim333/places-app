import React, { useContext } from 'react';
import { AppContext } from '../../shared/context/context';

function Login() {
  const { login } = useContext(AppContext);

  return (
    <div>
      <div onClick={login}>Login</div>
    </div>
  );
}

export default Login;
