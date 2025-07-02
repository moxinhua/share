// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const user = localStorage.getItem('adminDashboardUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (credentials) => {
    // 模拟登录验证
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
          u.username === credentials.username && u.password === credentials.password
        );
        
        if (user) {
          const loggedInUser = { ...user, password: undefined };
          setCurrentUser(loggedInUser);
          localStorage.setItem('adminDashboardUser', JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject('用户名或密码错误');
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('adminDashboardUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);