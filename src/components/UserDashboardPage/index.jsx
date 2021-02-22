import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  notification,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Radio,
} from 'antd';

import { useDispatch, useSelector } from 'react-redux';

import LoginWefinex from '../LoginWefinex';

const { Option } = Select;

function UserDashboardPage(props) {
  const { loggedInWefinex, wefinexInfo, user } = useSelector(
    (state) => state.app
  );
  return (
    <>
      {!loggedInWefinex ? (
        <LoginWefinex />
      ) : (
        <Card bordered={false} style={{ margin: '-24px' }}>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: '70%',
                paddingRight: '24px',
                borderRight: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <h3 style={{ marginBottom: '15px' }}>Thiết lập giao dịch</h3>
              <Form
                // form={form}
                layout="vertical"
                // initialValues={{ requiredMark }}
                // onValuesChange={onRequiredTypeChange}
                // requiredMark={requiredMark}
              >
                {/* <Form.Item label="Required Mark" name="requiredMark">
                  <Radio.Group>
                    <Radio.Button value="optional">Optional</Radio.Button>
                    <Radio.Button value={true}>Required</Radio.Button>
                    <Radio.Button value={false}>Hidden</Radio.Button>
                  </Radio.Group>
                </Form.Item> */}
                <Form.Item label="Phương pháp">
                  <Select
                  // onChange={onGenderChange}
                  // allowClear
                  >
                    <Option value="admin">Admin</Option>
                    <Option value="user">User</Option>
                  </Select>
                </Form.Item>
                {/* <Form.Item label="Bắt đầu lượt trade mới khi đạt">
                  <Checkbox.Group style={{ width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                      <Checkbox
                        value="A"
                        style={{ lineHeight: '32px', width: '100px' }}
                      >
                        Chốt lãi
                      </Checkbox>
                      <Checkbox value="B" style={{ lineHeight: '32px' }}>
                        Chốt lỗ
                      </Checkbox>
                    </div>
                  </Checkbox.Group>
                </Form.Item> */}
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox>Chốt lỗ</Checkbox>
                  <InputNumber /> kiểu
                  <Radio.Group style={{ marginLeft: '7px' }}>
                    <Radio value="a">%</Radio>
                    <Radio value="b">$</Radio>
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox>Chốt lãi</Checkbox>
                  <InputNumber /> kiểu
                  <Radio.Group style={{ marginLeft: '7px' }}>
                    <Radio value="a">%</Radio>
                    <Radio value="b">$</Radio>
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox>Bắt đầu lượt trade mới khi thua</Checkbox>
                  <InputNumber /> lần
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox>Bắt đầu lượt trade mới khi thắng</Checkbox>
                  <InputNumber /> lần
                </div>
                <Form.Item
                  name="startTradeWhenTakeProfit"
                  valuePropName="checked"
                >
                  <Checkbox>Bắt đầu lượt trade mới khi đạt chốt lãi</Checkbox>
                </Form.Item>
                <Form.Item
                  name="startTradeWhenTakeProfitLose"
                  valuePropName="checked"
                >
                  <Checkbox>Bắt đầu lượt trade mới khi đạt chốt lỗ</Checkbox>
                </Form.Item>
                <Form.Item name="wrireLog" valuePropName="checked">
                  <Checkbox>Lưu lại lịch sử đánh</Checkbox>
                </Form.Item>
                {/* <Form.Item
                  label="Field B"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <Input placeholder="input placeholder" />
                </Form.Item> */}
                <Form.Item>
                  <Button type="primary">Bắt đầu</Button>
                </Form.Item>
              </Form>
            </div>
            {/* <Divider type="vertical" /> */}
            <div style={{ flex: 1, paddingLeft: '24px' }}>
              <h3 style={{ marginBottom: '15px' }}>Thông tin tài khoản</h3>
              <p>
                <b>User: </b>
                {wefinexInfo.nn}
              </p>
              <p>
                <b>Số dư ban đầu: </b>0$
              </p>
              <p>
                <b>Số dư hiện tại: </b>0$
              </p>
              <p>
                <b>Lãi/lỗ: </b>0$
              </p>
              <p>
                <b>Nhóm theo dõi: </b>
                {(user.group || {}).name}
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

UserDashboardPage.propTypes = {};

export default UserDashboardPage;
