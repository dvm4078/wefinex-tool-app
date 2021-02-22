import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Table, Tag, Button, Tooltip, Modal, Form, Input, Select } from 'antd';
import {
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import {
  getUsers,
  createUser as actionCreateUser,
  updateUser as actionUpdateUser,
  deleteUser as actionDeleteUser,
} from '../../actions/user';
import { getGroups } from '../../actions/group';

const { Option } = Select;
const { confirm } = Modal;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function ModalDetailUser({ status, onOk, onCancel, userDetail }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, groups } = useSelector((state) => state.group);

  useEffect(() => {
    if (status !== 'close') {
      dispatch(getGroups());
      form.setFieldsValue({
        username: userDetail.username,
        wAccount: userDetail.wAccount,
        password: undefined,
        followGroupId: userDetail.followGroupId,
        role: userDetail.role || 'user',
      });
    }
  }, [status, userDetail]);

  const onFinish = (values) => {
    console.log(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    try {
      let fieldNeedValidate = ['username', 'wAccount'];
      if (status === 'create') {
        fieldNeedValidate = [...fieldNeedValidate, 'password'];
      }
      await form.validateFields(fieldNeedValidate);
      const data = form.getFieldsValue([
        'username',
        'password',
        'wAccount',
        'followGroupId',
        'role',
      ]);
      if (!data.password) {
        delete data.password;
      }
      onOk(data);
    } catch (error) {}
  };

  return (
    <>
      <Modal
        title={status === 'create' ? 'Thêm thành viên' : 'Cập nhật thông tin'}
        visible={status !== 'close'}
        // onOk={handleOk}
        // onCancel={handleCancel}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            onClick={handleOk}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: status === 'create' }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="wAccount"
            label="Tài khoản wefinex"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="followGroupId"
            label="Nhóm telegram"
            // rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn nhóm để nhận tín hiệu vào lệnh"
              // onChange={onGenderChange}
              allowClear
            >
              {groups.map((group) => {
                return (
                  <Option key={group.tid} value={group.tid}>
                    {group.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Loại tài khoản"
            // rules={[{ required: true }]}
          >
            <Select
            // onChange={onGenderChange}
            // allowClear
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function AdminUsersPage(props) {
  const dispatch = useDispatch();
  const { loading, page, users, total } = useSelector((state) => state.user);
  const [modalStatus, setModalStatus] = useState('close');
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    dispatch(getUsers('', 1));
  }, []);

  const updateUser = (user) => {
    setModalStatus('update');
    setUserDetail(user);
  };

  const deleteUser = (user) => {
    dispatch(actionDeleteUser(user.id));
  };

  const closeModal = () => {
    setModalStatus('close');
    setUserDetail({});
  };

  return (
    <>
      <ModalDetailUser
        // visible={modalStatus !== 'close'}
        status={modalStatus}
        onOk={(user) => {
          if (modalStatus === 'create') {
            dispatch(actionCreateUser(user));
          } else {
            dispatch(actionUpdateUser(userDetail.id, user));
          }
          closeModal();
        }}
        onCancel={closeModal}
        userDetail={userDetail}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        style={{ marginBottom: '10px' }}
        onClick={() => setModalStatus('create')}
      >
        Thêm người dùng
      </Button>
      <Table
        loading={loading}
        pagination={{
          current: page,
          pageSize: 5,
          total,
          onChange: (page) => {
            dispatch(getUsers('', page));
          },
        }}
        columns={[
          {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <a>{text}</a>,
          },
          {
            title: 'Tài khoản wefinex',
            dataIndex: 'wAccount',
            key: 'wAccount',
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
            render: (group) => (group || {}).name,
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
                  onClick={() => updateUser(user)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    confirm({
                      title: 'Bạn có chắc chắn muốn xóa thành viên này?',
                      icon: <ExclamationCircleOutlined />,
                      // content: 'Some descriptions',
                      okText: 'Yes',
                      okType: 'danger',
                      cancelText: 'No',
                      onOk() {
                        deleteUser(user);
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }}
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
