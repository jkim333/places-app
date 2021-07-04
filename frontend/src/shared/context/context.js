import React, { useState } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [token, setToken] = useState(false);

  return (
    <AppContext.Provider value={{ token }}>{children}</AppContext.Provider>
  );
}

export { AppContext, AppProvider };
