import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Table, Tag, Button, Tooltip } from 'antd';
import {
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { getUsers } from '../../actions/user';

const data = [
  {
    key: '1',
    username: 'John Brown',
    group: 32,
    role: 'admin',
  },
  {
    key: '2',
    username: 'Jim Green',
    group: 42,
    role: 'user',
  },
  {
    key: '3',
    username: 'Joe Black',
    group: 32,
    role: 'user',
  },
];

function AdminUsersPage(props) {
  const dispatch = useDispatch();
  const { loading, page, users, total } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers('', 1));
  }, []);
  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        style={{ marginBottom: '10px' }}
      >
        Thêm người dùng
      </Button>
      <Table
        columns={[
          {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <a>{text}</a>,
          },
          {
            title: () => (
              <span>
                Nhóm&nbsp;
                <Tooltip title="Theo dõi tín hiệu tại nhóm nào trên telegram">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            ),
            dataIndex: 'group',
            key: 'group',
          },
          {
            title: 'Loại',
            key: 'role',
            dataIndex: 'role',
            render: (role) => (
              <Tag color={role === 'admin' ? 'green' : 'geekblue'}>
                {role.toUpperCase()}
              </Tag>
            ),
          },
          {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 120,
            render: (user) => (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(user)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: '10px' }}
                  onClick={() => onDelete(user)}
                />
              </>
            ),
          },
        ]}
        dataSource={users}
      />
    </>
  );
}

AdminUsersPage.propTypes = {};

export default AdminUsersPage;
