// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={
          <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
              <Header />
              <Content style={{ margin: '16px' }}>
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute allowedRoles={['admin', 'user']}>
                    </ProtectedRoute>
                  } />
                  <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<div>404 Page Not Found</div>} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;