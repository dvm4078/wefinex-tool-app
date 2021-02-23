import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Modal, Form, Input, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  LineChartOutlined,
  SettingOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { logout, updatePassword } from '../actions/app';
import Authendication from '../utils/authendication';

const { ipcRenderer } = require('electron');

const { Header, Sider, Content } = Layout;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function ModalUpdatePassword({ visible, onOk, onCancel }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.app);

  const onFinish = (values) => {
    console.log(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    try {
      await form.validateFields([
        'confirmPassword',
        'oldPassword',
        'newPassword',
      ]);
      const data = form.getFieldsValue(['oldPassword', 'newPassword']);
      dispatch(updatePassword(data));
      onOk();
    } catch (error) {}
  };

  return (
    <>
      <Modal
        title="Đổi mật khẩu"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền mật khẩu cũ!',
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: 'Vui lòng điền mật khẩu mới!',
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Hai mật khẩu bạn đã nhập không khớp!');
                },
              }),
            ]}
          >
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function UserLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.app);
  const [openModalUpdatePassword, setOpenModalUpdatePassword] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    Authendication.logout();
    dispatch(logout());
    ipcRenderer.send('logout');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ModalUpdatePassword
        visible={openModalUpdatePassword}
        onOk={() => setOpenModalUpdatePassword(false)}
        onCancel={() => setOpenModalUpdatePassword(false)}
      />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/user/dashboard">Tổng quan</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<LineChartOutlined />}>
            <Link to="/user/methods">Phương pháp</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            <Link to="/admin/settings">Thiết lập</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background header"
          style={{ padding: 0 }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            }
          )}
          <div style={{ padding: '0 24px' }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">
                    <a onClick={() => setOpenModalUpdatePassword(true)}>
                      Đổi mật khẩu
                    </a>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="3" onClick={handleLogout}>
                    Đăng xuất
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {user.username} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

UserLayout.propTypes = {
  children: PropTypes.node,
};

export default UserLayout;
