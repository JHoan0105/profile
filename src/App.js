/*
=========================================================
* Provisioning Portal - v2.1.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Guardian imports
import Error from 'views/Error.jsx';
import getPing from 'services/getPing'

import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import MainLayout from './layouts/main';
import ProfileLayout from './layouts/profile'
import { AuthContext } from 'contexts/AuthContext';
import ErrorBoundary from 'contexts/ErrorBoundary'

import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import React, { useState, useRef, useLayoutEffect } from 'react';

// Chakra imports

export default function Main() {
  console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
  console.log("portal API URL", process.env.REACT_APP_PROVISIONING_PORTAL_API_URL)
  if (process.env.NODE_ENV !== "development") {
    console.log = function () { };
  }

  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const nav = useNavigate();                                               // used to navigate to different page
  const accountInfo = useRef();                                           // account info Context reference

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        await getPing();                                                  // pings server to check token expiry
      } catch (error) {
        if (error.toString() === 'Error: token expired') {
          document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          nav('/')
        }
      }
    };
    const checkTk = localStorage.getItem('token')
    if (checkTk)
      fetchData();
  })

  return (
    <ErrorBoundary fallback={() => console.log('fallback')}>
      <ChakraProvider theme={currentTheme}>
        <AuthContext.Provider value={{ accountInfo }} >
          <Routes>
            <Route path='profile/*' element={
              <ProfileLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
            />
            <Route path="auth/*" element={<AuthLayout />} />
            <Route
              path='admin/*'
              element={
                <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              }
            />
            <Route
              path='main/*'
              element={
                <MainLayout theme={currentTheme} setTheme={setCurrentTheme} />
              }
            />
            <Route path='error/*'
              element={
                <Error />
              } />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </AuthContext.Provider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}
