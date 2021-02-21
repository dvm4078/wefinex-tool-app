import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../../actions/app';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

function LoginPage(props) {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.app);
  const onFinish = async ({ username, password }) => {
    try {
      dispatch(login(username, password));
      // const user = await login(username, password);
      // setAuthState(user);
      // history.push('/');
    } catch (error) {
      Error('Error', error.message);
    }
  };

  return (
    <div className="login-page">
      <Card
        title="Đăng nhập"
        bordered={false}
        style={{ width: 500, marginTop: '-200px' }}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: 'Vui lòng điền tên đăng nhập!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
