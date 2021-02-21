import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GroupOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { logout } from '../actions/app';
import Authendication from '../utils/authendication';

const { Header, Sider, Content } = Layout;

function UserLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.app);

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    Authendication.logout();
    dispatch(logout());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Thành viên
          </Menu.Item>
          <Menu.Item key="2" icon={<GroupOutlined />}>
            Nhóm
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
                    <Link to="/change-password">Đổi mật khẩu</Link>
                    {/* <a href="http://www.taobao.com/">Đổi mật khẩu</a> */}
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
