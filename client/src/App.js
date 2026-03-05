import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library';
import Reader from './pages/Reader';
import './index.css';

const RouterComponent = process.env.REACT_APP_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

function App() {
  return (
    <RouterComponent>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />

          <Route
            path="/read/:bookId"
            element={
              <PrivateRoute>
                <Reader />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </RouterComponent>
  );
}

export default App;
