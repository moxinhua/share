// src/pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, 
  Form, Modal, Select, message, 
  Popconfirm, Tag 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, 
  EditOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const { currentUser: authUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const loadUsers = () => {
    setLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
      setFilteredUsers(storedUsers);
    } catch (error) {
      message.error('加载用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showAddModal = () => {
    setCurrentUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (user) => {
    setCurrentUser(user);
    form.setFieldsValue({
      ...user,
      password: '' // 安全起见，不显示密码
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    if (id === authUser.id) {
      message.error('不能删除当前登录用户');
      return;
    }
    
    const newUsers = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(newUsers));
    setUsers(newUsers);
    message.success('用户删除成功');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newUser = {
        ...values,
        id: currentUser ? currentUser.id : Date.now(),
        status: values.status || 'active'
      };

      let newUsers;
      if (currentUser) {
        // 更新用户
        newUsers = users.map(user => 
          user.id === currentUser.id ? newUser : user
        );
      } else {
        // 添加用户
        newUsers = [...users, newUser];
      }

      localStorage.setItem('users', JSON.stringify(newUsers));
      setUsers(newUsers);
      setIsModalVisible(false);
      message.success(`用户${currentUser ? '更新' : '添加'}成功`);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '激活' : '禁用'}
        </Tag>
      ),
      filters: [
        { text: '激活', value: 'active' },
        { text: '禁用', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            disabled={record.id === authUser.id}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此用户吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.id === authUser.id}
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.id === authUser.id}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索用户"
          prefix={<SearchOutlined />}
          style={{ width: 300, marginRight: 16 }}
          value={searchText}
          onChange={handleSearch}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          添加用户
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={currentUser ? "编辑用户" : "添加用户"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
          initialValues={{ role: 'user', status: 'active' }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: !currentUser, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              <Option value="active">激活</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;