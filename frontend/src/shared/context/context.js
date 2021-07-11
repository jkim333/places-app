import React, { useState } from 'react';
import axios from 'axios';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const login = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAlertMsg(null);
  };

  const getNewAccessTokenUsingRefreshToken = async () => {
    try {
      const response = await axios({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: { refresh: refreshToken },
        url: 'http://localhost:8000/auth/jwt/refresh/',
      });
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
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
        getNewAccessTokenUsingRefreshToken,
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
