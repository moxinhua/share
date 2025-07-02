// src/components/Header.js
import React from 'react';
import { Layout, Dropdown, Menu, Avatar, Badge } from 'antd';
import { 
  BellOutlined, 
  UserOutlined,
  MailOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

const HeaderBar = () => {
  const { currentUser, logout } = useAuth();

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Item key="settings">
        <UserOutlined /> 设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logout}>
        <UserOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ 
      background: '#fff', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'flex-end',
      boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
      zIndex: 1
    }}>
      <div style={{ marginRight: 24 }}>
        <Badge count={5} style={{ marginRight: 24 }}>
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>
        <Badge count={3}>
          <MailOutlined style={{ fontSize: 18 }} />
        </Badge>
      </div>
      
      <Dropdown overlay={menu} trigger={['click']}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar 
            size="default" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }} 
          />
          <span style={{ marginLeft: 8, fontWeight: 500 }}>
            {currentUser?.name || '管理员'}
          </span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;