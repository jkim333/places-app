import React, { useState, useEffect } from 'react';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [accessToken, setAccessToken] = useState('initialAccessToken');
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const uid = localStorage.getItem('userId');
    if (access && refresh && uid) {
      setAccessToken(JSON.parse(access));
      setRefreshToken(JSON.parse(refresh));
      setUserId(JSON.parse(uid));
    } else {
      setAccessToken(null);
      setRefreshToken(null);
      setUserId(null);
    }
  }, []);

  const login = (accessToken, refreshToken, userId) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserId(userId);
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    localStorage.setItem('userId', JSON.stringify(userId));
    setAlertMsg(null);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
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
