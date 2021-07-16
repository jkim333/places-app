import React, { useState } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const login = (accessToken, refreshToken, userId) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAlertMsg(null);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AppContext.Provider
      value={{
        accessToken,
        refreshToken,
        setAccessToken,
        userId,
        login,
        logout,
        alertMsg,
        setAlertMsg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
