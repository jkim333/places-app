import React, { useState } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [token, setToken] = useState('a');
  const [userId, setUserId] = useState(1);

  const login = () => {
    console.log('login');
  };

  const logout = () => {
    console.log('logout');
  };

  return (
    <AppContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
