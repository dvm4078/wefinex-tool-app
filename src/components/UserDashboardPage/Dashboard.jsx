import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';

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
  changeOption,
} from '../../actions/wefinex';
import { getBalance } from '../../actions/app';

const { ipcRenderer } = require('electron');

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

  const { loading, isTrading, options } = useSelector((state) => state.wefinex);

  const handleChangeOption = (prop, value) => {
    dispatch(changeOption(prop, value));
  };

  const handleEndBet = (event, message) => {
    dispatch(getBalance());
  };

  useEffect(() => {
    dispatch(getBalance());
    ipcRenderer.on('end-bet', handleEndBet);
    return () => {
      ipcRenderer.removeListener('end-bet', handleEndBet);
    };
  }, []);

  const startTrade = async () => {
    if (options.methods && !options.methods.length) {
      notification.error({
        message: 'Lỗi!',
        description: 'Vui lòng chọn phương pháp đánh!',
      });
      return;
    }
    if (user.group && user.group.tid) {
      const settings = {
        ...options,
        tid: (user.group || {}).tid,
        initialBalance:
          options.betAccountType === 'LIVE'
            ? (initialBalance || {}).availableBalance
            : (initialBalance || {}).demoBalance,
        username: wefinexInfo.nn,
      };
      dispatch(startTradeAction(settings));
      dispatch(getBalance());
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

  const hasMethod1 = true;

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
          style={{ paddingBottom: '10px' }}
        >
          <Form layout="vertical">
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                height: '32px',
              }}
            >
              <p
                style={{
                  width: '110px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Tài khoản:{' '}
              </p>
              <Select
                style={{ marginLeft: '10px', maxWidth: '100px' }}
                value={options.betAccountType}
                onChange={(value) =>
                  handleChangeOption('betAccountType', value)
                }
                disabled={isTrading}
              >
                <Option value="LIVE">Thực</Option>
                <Option value="DEMO">Demo</Option>
              </Select>
            </div>
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                minHeight: '32px',
              }}
            >
              <p
                style={{
                  width: '110px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Phương pháp:{' '}
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ marginLeft: '10px', flex: 1 }}
                value={options.methods}
                onChange={(value) => handleChangeOption('methods', value)}
                disabled={isTrading}
              >
                {/* <Option value="0">Phương pháp tổng hợp</Option> */}
                <Option value="1">Phương pháp 1</Option>
                <Option value="2">Phương pháp 2</Option>
                <Option value="3">Phương pháp 3</Option>
                <Option value="4">Phương pháp 4</Option>
                <Option value="5">Phương pháp 5</Option>
                <Option value="6">Phương pháp 6</Option>
                <Option value="7">Phương pháp 7</Option>
              </Select>
            </div>
            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                height: '32px',
              }}
            >
              <p
                style={{
                  width: '110px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Giá trị vào lệnh:{' '}
              </p>
              <InputNumber
                style={{ marginLeft: '10px', height: '32px' }}
                min={1}
                disabled={isTrading}
                value={options.betValue}
                onChange={(value) => handleChangeOption('betValue', value)}
              />
            </div>
            <div
              style={{
                marginBottom: '10px',
                color:
                  isTrading || !hasMethod1
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.stopLoss}
                onChange={(event) =>
                  handleChangeOption('stopLoss', event.target.checked)
                }
                style={{ width: '85px' }}
              >
                Chốt lỗ
              </Checkbox>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.stopLossValue}
                onChange={(value) => handleChangeOption('stopLossValue', value)}
                style={{ marginRight: '5px' }}
              />{' '}
              kiểu
              <Radio.Group
                disabled={isTrading || !hasMethod1}
                style={{ marginLeft: '10px' }}
                value={options.stopLossType}
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
                marginBottom: '10px',
                color:
                  isTrading || !hasMethod1
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.takeProfit}
                onChange={(event) =>
                  handleChangeOption('takeProfit', event.target.checked)
                }
                style={{ width: '85px' }}
              >
                Chốt lãi
              </Checkbox>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.takeProfitValue}
                onChange={(value) =>
                  handleChangeOption('takeProfitValue', value)
                }
                style={{ marginRight: '5px' }}
              />{' '}
              kiểu
              <Radio.Group
                disabled={isTrading || !hasMethod1}
                style={{ marginLeft: '10px' }}
                value={options.takeProfitType}
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
                marginBottom: '10px',
                height: '32px',
              }}
            >
              <Checkbox
                disabled={isTrading}
                defaultChecked={options.withWefinex}
                checked={options.withWefinex}
                onChange={(event) =>
                  handleChangeOption('withWefinex', event.target.checked)
                }
              >
                Chốt lãi/lỗ với số dư trên sàn
              </Checkbox>
            </div>
            <div
              style={{
                marginBottom: '10px',
                color:
                  isTrading || !hasMethod1
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.startWhenTakeProfitTimes}
                onChange={(event) =>
                  handleChangeOption(
                    'startWhenTakeProfitTimes',
                    event.target.checked
                  )
                }
                style={{ width: '240px' }}
              >
                Bắt đầu lượt trade mới khi thắng
              </Checkbox>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                style={{ width: '70px' }}
                value={options.startWhenTakeProfitTimesValue}
                onChange={(value) =>
                  handleChangeOption('startWhenTakeProfitTimesValue', value)
                }
              />{' '}
              lần
            </div>
            <div
              style={{
                marginBottom: '15px',
                color:
                  isTrading || !hasMethod1
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.startWhenStopLossTimes}
                onChange={(event) =>
                  handleChangeOption(
                    'startWhenStopLossTimes',
                    event.target.checked
                  )
                }
                style={{ width: '240px' }}
              >
                Bắt đầu lượt trade mới khi thua
              </Checkbox>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                style={{ width: '70px' }}
                value={options.startWhenStopLossTimesValue}
                onChange={(value) =>
                  handleChangeOption('startWhenStopLossTimesValue', value)
                }
              />{' '}
              lần
            </div>

            <div
              style={{
                marginBottom: '10px',
                height: '32px',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.startWhenTakeProfit}
                onChange={(event) =>
                  handleChangeOption(
                    'startWhenTakeProfit',
                    event.target.checked
                  )
                }
              >
                Bắt đầu lượt trade mới khi đạt chốt lãi
              </Checkbox>
            </div>
            <div
              style={{
                marginBottom: '10px',
                height: '32px',
              }}
            >
              <Checkbox
                disabled={isTrading || !hasMethod1}
                checked={options.startWhenStopLoss}
                onChange={(event) =>
                  handleChangeOption('startWhenStopLoss', event.target.checked)
                }
              >
                Bắt đầu lượt trade mới khi đạt chốt lỗ
              </Checkbox>
            </div>

            <div
              style={{
                marginBottom: '10px',
                height: '32px',
              }}
            >
              <Checkbox
                disabled={isTrading}
                defaultChecked={options.saveHistory}
                checked={options.saveHistory}
                onChange={(event) =>
                  handleChangeOption('saveHistory', event.target.checked)
                }
              >
                Lưu lại lịch sử đánh
              </Checkbox>
            </div>
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
            <b>Số dư ban đầu (DEMO): </b>
            {numeral((initialBalance || {}).demoBalance).format('0.00$')}
          </p>
          <p>
            <b>Số dư hiện tại (DEMO): </b>
            {numeral((balance || {}).demoBalance).format('0.00$')}
          </p>
          <p>
            <b>Lãi / lỗ (DEMO): </b>
            {numeral(
              ((balance || {}).demoBalance || 0) -
                ((initialBalance || {}).demoBalance || 0)
            ).format('0.00$')}
          </p>
          {/* <p>
            <b>Nhóm theo dõi: </b>
            {(user.group || {}).name}
          </p> */}
        </Card>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
