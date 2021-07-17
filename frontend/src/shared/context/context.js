import React, { useState, useEffect } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    const access = sessionStorage.getItem('accessToken');
    const refresh = sessionStorage.getItem('refreshToken');
    const uid = sessionStorage.getItem('userId');
    if (access && refresh && uid) {
      setAccessToken(JSON.parse(access));
      setRefreshToken(JSON.parse(refresh));
      setUserId(JSON.parse(uid));
    }
  }, []);

  const login = (accessToken, refreshToken, userId) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
    sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
    sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    sessionStorage.setItem('userId', JSON.stringify(userId));
    setAlertMsg(null);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userId');
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
