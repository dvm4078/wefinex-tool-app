import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  notification,
  Form,
  Select,
  Checkbox,
  InputNumber,
  Radio,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import numeral from 'numeral';

import {
  startTrade as startTradeAction,
  stopTrade as stopTradeAction,
} from '../../actions/wefinex';
import { getBalance } from '../../actions/app';

const { Option } = Select;

function Dashboard(props) {
  const dispatch = useDispatch();
  const {
    loggedInWefinex,
    wefinexInfo,
    user,
    initialBalance,
    balance,
  } = useSelector((state) => state.app);

  const { loading, isTrading } = useSelector((state) => state.wefinex);

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
    dispatch(getBalance());
  }, []);

  const startTrade = async () => {
    if (user.group && user.group.tid) {
      const options = {
        ...state,
        tid: (user.group || {}).tid,
      };
      dispatch(startTradeAction(options));
    } else {
      notification.error({
        message: 'Lỗi!',
        description:
          'Bạn chưa được chỉ định nhóm telegram để lấy tín hiệu. Vui lòng liên hệ Admin để được trợ giúp!',
      });
    }
  };

  const stopTrade = async () => {
    dispatch(stopTradeAction());
  };

  return (
    <div style={{ display: 'flex', margin: '-24px' }}>
      <div
        style={{
          width: '70%',
          // paddingRight: '24px',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Card
          title="Thiết lập giao dịch"
          bordered={false}
          // style={{ width: 300 }}
        >
          <Form layout="vertical">
            <Form.Item
              label="Phương pháp"
              style={{ marginBottom: '15px', flexDirection: 'row' }}
            >
              <Select
                style={{ maxWidth: '250px', marginLeft: '10px' }}
                value={state.method}
                onChange={(value) => handleChangeOption('method', value)}
                disabled={isTrading}
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
            <div
              style={{
                marginBottom: '15px',
                color: isTrading
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading}
                checked={state.takeProfit}
                onChange={(event) =>
                  handleChangeOption('takeProfit', event.target.checked)
                }
              >
                Chốt lỗ
              </Checkbox>
              <InputNumber
                disabled={isTrading}
                value={state.takeProfitValue}
                onChange={(value) =>
                  handleChangeOption('takeProfitValue', value)
                }
              />{' '}
              kiểu
              <Radio.Group
                disabled={isTrading}
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
            <div
              style={{
                marginBottom: '15px',
                color: isTrading
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading}
                checked={state.stopLoss}
                onChange={(event) =>
                  handleChangeOption('stopLoss', event.target.checked)
                }
              >
                Chốt lãi
              </Checkbox>
              <InputNumber
                disabled={isTrading}
                value={state.stopLossValue}
                onChange={(value) => handleChangeOption('stopLossValue', value)}
              />{' '}
              kiểu
              <Radio.Group
                disabled={isTrading}
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
            <div
              style={{
                marginBottom: '15px',
                color: isTrading
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading}
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
                disabled={isTrading}
                style={{ width: '70px' }}
                value={state.startWhenTakeProfitTimesValue}
                onChange={(value) =>
                  handleChangeOption('startWhenTakeProfitTimesValue', value)
                }
              />{' '}
              lần
            </div>
            <div
              style={{
                marginBottom: '15px',
                color: isTrading
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading}
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
                disabled={isTrading}
                style={{ width: '70px' }}
                value={state.startWhenStopLossTimesValue}
                onChange={(value) =>
                  handleChangeOption('startWhenStopLossTimesValue', value)
                }
              />{' '}
              lần
            </div>
            <Form.Item
              style={{ marginBottom: '15px' }}
              name="startTradeWhenTakeProfit"
              valuePropName="checked"
            >
              <Checkbox
                disabled={isTrading}
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
              style={{ marginBottom: '15px' }}
              name="startTradeWhenStopLoss"
              valuePropName="checked"
            >
              <Checkbox
                disabled={isTrading}
                checked={state.startWhenStopLoss}
                onChange={(event) =>
                  handleChangeOption('startWhenStopLoss', event.target.checked)
                }
              >
                Bắt đầu lượt trade mới khi đạt chốt lỗ
              </Checkbox>
            </Form.Item>
            <Form.Item
              style={{ marginBottom: '15px' }}
              name="wrireLog"
              valuePropName="checked"
            >
              <Checkbox
                disabled={isTrading}
                checked={state.saveHistory}
                onChange={(event) =>
                  handleChangeOption('saveHistory', event.target.checked)
                }
              >
                Lưu lại lịch sử đánh
              </Checkbox>
            </Form.Item>
            <Form.Item>
              {isTrading ? (
                <Button
                  type="primary"
                  loading={loading}
                  danger
                  block
                  onClick={stopTrade}
                >
                  Dừng
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={loading}
                  block
                  onClick={startTrade}
                >
                  Bắt đầu
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div style={{ flex: 1 }}>
        <Card
          title="Thông tin tài khoản"
          bordered={false}
          // style={{ width: 300 }}
        >
          <p>
            <b>User: </b>
            {wefinexInfo.nn}
          </p>
          <p>
            <b>Số dư ban đầu: </b>
            {numeral((initialBalance || {}).availableBalance).format('0.00$')}
          </p>
          <p>
            <b>Số dư hiện tại: </b>
            {numeral((balance || {}).availableBalance).format('0.00$')}
          </p>
          <p>
            <b>Lãi / lỗ: </b>
            {numeral(
              ((balance || {}).availableBalance || 0) -
                ((initialBalance || {}).availableBalance || 0)
            ).format('0.00$')}
          </p>
          <p>
            <b>Nhóm theo dõi: </b>
            {(user.group || {}).name}
          </p>
        </Card>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
