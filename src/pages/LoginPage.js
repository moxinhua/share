// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './LoginPage.css';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // 初始化一些测试用户
  React.useEffect(() => {
    if (!localStorage.getItem('users')) {
      const initialUsers = [
        { id: 1, username: 'admin', password: 'admin123', name: '管理员', email: 'admin@example.com', role: 'admin', status: 'active' },
        { id: 2, username: 'user1', password: 'user123', name: '普通用户', email: 'user@example.com', role: 'user', status: 'active' },
        { id: 3, username: 'user2', password: 'user123', name: '普通用户', email: 'user1@example.com', role: 'user', status: 'active' },
        { id: 4, username: 'user3', password: 'user123', name: '普通用户', email: 'user2@example.com', role: 'user', status: 'active' },
        { id: 5, username: 'user4', password: 'user123', name: '普通用户', email: 'user3@example.com', role: 'user', status: 'active' },
        { id: 6, username: 'user5', password: 'user123', name: '普通用户', email: 'user4@example.com', role: 'user', status: 'active' },
        { id: 7, username: 'user6', password: 'user123', name: '普通用户', email: 'user5@example.com', role: 'user', status: 'active' },
        { id: 8, username: 'user7', password: 'user123', name: '普通用户', email: 'user6@example.com', role: 'user', status: 'active' },
        { id: 9, username: 'user8', password: 'user123', name: '普通用户', email: 'user7@example.com', role: 'user', status: 'active' },
        { id: 10, username: 'user9', password: 'user123', name: '普通用户', email: 'user8@example.com', role: 'user', status: 'active' },
        { id: 11, username: 'user10', password: 'user123', name: '普通用户', email: 'user9@example.com', role: 'user', status: 'inactive' },
        { id: 12, username: 'user11', password: 'user123', name: '普通用户', email: 'user10@example.com', role: 'user', status: 'active' },
        { id: 13, username: 'user12', password: 'user123', name: '普通用户', email: 'user11@example.com', role: 'user', status: 'active' },
        { id: 14, username: 'user13', password: 'user123', name: '普通用户', email: 'user12@example.com', role: 'user', status: 'active' }
      ];
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await auth.login(values);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      message.success('登录成功');
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="管理系统登录" bordered={false}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
          <div className="login-tip">
            测试账号: admin/admin123 (管理员) 或 user1/user123 (普通用户)
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;