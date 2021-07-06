import React, { useState } from 'react';
import axios from 'axios';

const AppContext = React.createContext();

function AppProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
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
  };

  return (
    <AppContext.Provider
      value={{
        accessToken,
        userId,
        login,
        getNewAccessTokenUsingRefreshToken,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
