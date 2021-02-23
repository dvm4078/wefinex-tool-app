import React, { useState, useEffect } from 'react';
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

const { ipcRenderer } = require('electron');

const { Option } = Select;

function UserDashboardPage(props) {
  const { loggedInWefinex, wefinexInfo, user } = useSelector(
    (state) => state.app
  );

  const [state, setState] = useState({
    method: '0',
    takeProfit: false,
    takeProfitValue: 0,
    takeProfitType: '$',
    stopLoss: false,
    stopLossValue: 0,
    stopLossType: '$',
    startWhenTakeProfitTimes: false,
    startWhenTakeProfitTimesValue: 0,
    startWhenStopLossTimes: false,
    startWhenStopLossTimesValue: 0,
    startWhenTakeProfit: false,
    startWhenStopLoss: false,
    saveHistory: false,
  });

  const persistSettings = (settings) => {
    localStorage.setItem('SETTINGS', JSON.stringify(settings));
  };

  const handleChangeOption = (prop, value) => {
    const newState = {
      ...state,
      [prop]: value,
    };
    setState(newState);
    persistSettings(newState);
  };

  const restoreSettings = () => {
    try {
      const settings = JSON.parse(localStorage.getItem('SETTINGS'));
      if (settings) {
        setState(settings);
      }
    } catch (error) {}
  };

  useEffect(() => {
    restoreSettings();
  }, []);

  const handleStartTrade = () => {
    const options = {
      ...state,
      tid: (user.group || {}).tid,
    };
    return new Promise((resolve) => {
      ipcRenderer.once('start-trade-reply', (_, arg) => {
        resolve(arg);
      });
      ipcRenderer.send('start-trade', options);
    });
  };

  const startTrade = async () => {
    try {
      if (user.group && user.group.tid) {
        const response = await handleStartTrade();

        if (!response.success) {
          notification.error({
            message: 'Lỗi!',
            description:
              'Đã có lỗi xảy ra. Vui lòng liên hệ Admin để được trợ giúp!',
          });
        } else {
          notification.success({
            message: 'Thành công!',
            description: 'Bắt đầu tự động trade',
          });
        }
      } else {
        notification.error({
          message: 'Lỗi!',
          description:
            'Bạn chưa được chỉ định nhóm telegram để lấy tín hiệu. Vui lòng liên hệ Admin để được trợ giúp!',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Lỗi!',
        description: error.message,
      });
    }
  };

  const handleStopTrade = () => {
    return new Promise((resolve) => {
      ipcRenderer.once('stop-trade-reply', (_, arg) => {
        resolve(arg);
      });
      ipcRenderer.send('stop-trade', {});
    });
  };

  const stopTrade = async () => {
    try {
      const response = await handleStopTrade();

      if (!response.success) {
        notification.error({
          message: 'Lỗi!',
          description:
            'Đã có lỗi xảy ra. Vui lòng liên hệ Admin để được trợ giúp!',
        });
      } else {
        notification.success({
          message: 'Thành công!',
          description: 'Đã dừng tự động trade',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Lỗi!',
        description: error.message,
      });
    }
  };

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
                    style={{ maxWidth: '400px' }}
                    value={state.method}
                    onChange={(value) => handleChangeOption('method', value)}
                  >
                    <Option value="0">Phương pháp tổng hợp</Option>
                    <Option value="1">Phương pháp 1</Option>
                    <Option value="2">Phương pháp 2</Option>
                    <Option value="3">Phương pháp 3</Option>
                    <Option value="4">Phương pháp 4</Option>
                    <Option value="5">Phương pháp 5</Option>
                    <Option value="6">Phương pháp 6</Option>
                    <Option value="7">Phương pháp 7</Option>
                  </Select>
                </Form.Item>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox
                    checked={state.takeProfit}
                    onChange={(event) =>
                      handleChangeOption('takeProfit', event.target.checked)
                    }
                  >
                    Chốt lỗ
                  </Checkbox>
                  <InputNumber
                    value={state.takeProfitValue}
                    onChange={(value) =>
                      handleChangeOption('takeProfitValue', value)
                    }
                  />{' '}
                  kiểu
                  <Radio.Group
                    style={{ marginLeft: '7px' }}
                    value={state.takeProfitType}
                    onChange={(event) =>
                      handleChangeOption('takeProfitType', event.target.value)
                    }
                  >
                    <Radio value="%">%</Radio>
                    <Radio value="$">$</Radio>
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox
                    checked={state.stopLoss}
                    onChange={(event) =>
                      handleChangeOption('stopLoss', event.target.checked)
                    }
                  >
                    Chốt lãi
                  </Checkbox>
                  <InputNumber
                    value={state.stopLossValue}
                    onChange={(value) =>
                      handleChangeOption('stopLossValue', value)
                    }
                  />{' '}
                  kiểu
                  <Radio.Group
                    style={{ marginLeft: '7px' }}
                    value={state.stopLossType}
                    onChange={(event) =>
                      handleChangeOption('stopLossType', event.target.value)
                    }
                  >
                    <Radio value="%">%</Radio>
                    <Radio value="$">$</Radio>
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox
                    checked={state.startWhenTakeProfitTimes}
                    onChange={(event) =>
                      handleChangeOption(
                        'startWhenTakeProfitTimes',
                        event.target.checked
                      )
                    }
                  >
                    Bắt đầu lượt trade mới khi thắng
                  </Checkbox>
                  <InputNumber
                    style={{ width: '70px' }}
                    value={state.startWhenTakeProfitTimesValue}
                    onChange={(value) =>
                      handleChangeOption('startWhenTakeProfitTimesValue', value)
                    }
                  />{' '}
                  lần
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <Checkbox
                    checked={state.startWhenStopLossTimes}
                    onChange={(event) =>
                      handleChangeOption(
                        'startWhenStopLossTimes',
                        event.target.checked
                      )
                    }
                  >
                    Bắt đầu lượt trade mới khi thua
                  </Checkbox>
                  <InputNumber
                    style={{ width: '70px' }}
                    value={state.startWhenStopLossTimesValue}
                    onChange={(value) =>
                      handleChangeOption('startWhenStopLossTimesValue', value)
                    }
                  />{' '}
                  lần
                </div>
                <Form.Item
                  name="startTradeWhenTakeProfit"
                  valuePropName="checked"
                >
                  <Checkbox
                    checked={state.startWhenTakeProfit}
                    onChange={(event) =>
                      handleChangeOption(
                        'startWhenTakeProfit',
                        event.target.checked
                      )
                    }
                  >
                    Bắt đầu lượt trade mới khi đạt chốt lãi
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  name="startTradeWhenStopLoss"
                  valuePropName="checked"
                >
                  <Checkbox
                    checked={state.startWhenStopLoss}
                    onChange={(event) =>
                      handleChangeOption(
                        'startWhenStopLoss',
                        event.target.checked
                      )
                    }
                  >
                    Bắt đầu lượt trade mới khi đạt chốt lỗ
                  </Checkbox>
                </Form.Item>
                <Form.Item name="wrireLog" valuePropName="checked">
                  <Checkbox
                    checked={state.saveHistory}
                    onChange={(event) =>
                      handleChangeOption('saveHistory', event.target.checked)
                    }
                  >
                    Lưu lại lịch sử đánh
                  </Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={startTrade}>
                    Bắt đầu
                  </Button>
                  <Button type="primary" danger onClick={stopTrade}>
                    Dừng
                  </Button>
                </Form.Item>
              </Form>
            </div>
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
                <b>Lãi / lỗ: </b>0$
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
