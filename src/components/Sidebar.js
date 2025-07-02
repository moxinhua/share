// src/components/Sidebar.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;

const Sidebar = () => {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();

  // 获取当前选中的菜单项
  const selectedKeys = pathname === '/' ? ['/'] : [pathname];

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
      roles: ['admin', 'user']
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">用户管理</Link>,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser?.role)
  );

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)'
      }}
    >
      <div className="logo" style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>管理系统</h2>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        items={filteredMenuItems}
        style={{ borderRight: 0 }}
      />
      {currentUser && (
        <Menu
          theme="light"
          mode="inline"
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
        >
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined />} 
            onClick={logout}
            style={{ color: '#ff4d4f' }}
          >
            退出登录
          </Menu.Item>
        </Menu>
      )}
    </Sider>
  );
};

export default Sidebar;