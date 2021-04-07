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
import { getGroups } from '../../actions/group';

const { ipcRenderer } = require('electron');

const methods = [
  { name: 'QLV1 - Phương pháp 1', value: '1' },
  { name: 'QLV1 - Phương pháp 2', value: '2' },
  { name: 'QLV1 - Phương pháp 3', value: '3' },
  { name: 'QLV1 - Phương pháp 4', value: '4' },
  { name: 'QLV1 - Phương pháp 5', value: '5' },
  { name: 'QLV1 - Phương pháp 6', value: '6' },
  { name: 'QLV2 - Phương pháp 1', value: '8' },
  { name: 'QLV2 - Phương pháp 2', value: '9' },
  { name: 'QLV2 - Phương pháp 3', value: '10' },
  { name: 'QLV2 - Phương pháp 4', value: '11' },
  { name: 'QLV2 - Phương pháp 5', value: '12' },
  { name: 'QLV2 - Phương pháp 6', value: '13' },
  { name: 'QLV3 - Phương pháp 1', value: '15' },
  { name: 'QLV3 - Phương pháp 2', value: '16' },
  { name: 'QLV3 - Phương pháp 3', value: '17' },
  { name: 'QLV3 - Phương pháp 4', value: '18' },
  { name: 'QLV3 - Phương pháp 5', value: '19' },
  { name: 'QLV3 - Phương pháp 6', value: '20' },
  { name: 'QLV4 - Phương pháp 1', value: '7' },
  { name: 'QLV4 - Phương pháp 2', value: '14' },
  { name: 'Săn rồng 2', value: '21' },
  { name: 'Săn rồng 3', value: '22' },
  { name: 'Săn rồng 4', value: '23' },
  { name: 'Săn rồng 5', value: '24' },
  { name: 'Săn rồng 6', value: '25' },
  { name: 'Săn rồng 2 ngược', value: '26' },
  { name: 'Săn rồng 3 ngược', value: '27' },
  { name: 'Săn rồng 4 ngược', value: '28' },
  { name: 'Săn rồng 5 ngược', value: '29' },
  { name: 'Săn rồng 6 ngược', value: '30' },
];

const { Option } = Select;
function Dashboard(props) {
  const dispatch = useDispatch();
  const { loading: grLoading, groups } = useSelector((state) => state.group);
  const {
    loggedInWefinex,
    wefinexInfo,
    user,
    initialBalance,
    balance,
  } = useSelector((state) => state.app);

  const { loading, isTrading, options } = useSelector((state) => state.wefinex);

  const [grSelected, setGrSelected] = useState(undefined);

  const handleChangeOption = (prop, value) => {
    dispatch(changeOption(prop, value));
  };

  const handleEndBet = (event, message) => {
    dispatch(getBalance());
  };

  useEffect(() => {
    if (groups.length) {
      setGrSelected(groups[0].tid);
    }
  }, [groups]);

  useEffect(() => {
    dispatch(getBalance());
    dispatch(getGroups());
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
    if (grSelected) {
      const settings = {
        ...options,
        tid: grSelected,
        initialBalance:
          options.betAccountType === 'LIVE'
            ? (initialBalance || {}).availableBalance
            : (initialBalance || {}).demoBalance,
        username: wefinexInfo.nn,
      };
      dispatch(startTradeAction(settings));
      // dispatch(getBalance());
    } else {
      notification.error({
        message: 'Lỗi!',
        description: 'Vui lòng chọn nhóm telegram để lấy tín hiệu',
      });
    }
  };

  const stopTrade = async () => {
    dispatch(stopTradeAction());
  };

  const hasMethod1 = true;

  const getRiskReduction1Methods = () => {
    const ortherMethods = [
      ...options.riskReduction2Methods,
      ...options.riskReduction3Methods,
      ...options.riskReduction4Methods,
    ];
    const methodsSelected = methods.filter(({ value }) =>
      includes(options.methods, value)
    );
    const availableMethods = methodsSelected.filter(
      ({ value }) => !includes(ortherMethods, value)
    );
    return availableMethods;
  };

  const riskReduction1Methods = getRiskReduction1Methods();

  const getRiskReduction2Methods = () => {
    const ortherMethods = [
      ...options.riskReduction1Methods,
      ...options.riskReduction3Methods,
      ...options.riskReduction4Methods,
    ];
    const methodsSelected = methods.filter(({ value }) =>
      includes(options.methods, value)
    );
    const availableMethods = methodsSelected.filter(
      ({ value }) => !includes(ortherMethods, value)
    );
    return availableMethods;
  };

  const riskReduction2Methods = getRiskReduction2Methods();

  const getRiskReduction3Methods = () => {
    const ortherMethods = [
      ...options.riskReduction1Methods,
      ...options.riskReduction2Methods,
      ...options.riskReduction4Methods,
    ];
    const methodsSelected = methods.filter(({ value }) =>
      includes(options.methods, value)
    );
    const availableMethods = methodsSelected.filter(
      ({ value }) => !includes(ortherMethods, value)
    );
    return availableMethods;
  };

  const riskReduction3Methods = getRiskReduction3Methods();

  const getRiskReduction4Methods = () => {
    const ortherMethods = [
      ...options.riskReduction1Methods,
      ...options.riskReduction2Methods,
      ...options.riskReduction3Methods,
    ];
    const methodsSelected = methods.filter(({ value }) =>
      includes(options.methods, value)
    );
    const availableMethods = methodsSelected.filter(
      ({ value }) => !includes(ortherMethods, value)
    );
    return availableMethods;
  };

  const riskReduction4Methods = getRiskReduction4Methods();

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
                {methods.map(({ name, value }) => (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                ))}
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
                  width: '150px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Né thị trường xấu 1:
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ marginLeft: '10px', flex: 1 }}
                value={options.riskReduction1Methods}
                onChange={(value) =>
                  handleChangeOption('riskReduction1Methods', value)
                }
                disabled={isTrading}
              >
                {riskReduction1Methods.map(({ name, value }) => (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                ))}
              </Select>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.riskReduction1Value}
                onChange={(value) =>
                  handleChangeOption('riskReduction1Value', value)
                }
                style={{
                  maxWidth: '50px',
                  marginLeft: '5px',
                  marginRight: '5px',
                  flex: 1,
                  height: '32px',
                }}
              />
              lần
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
                  width: '150px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Né thị trường xấu 2:
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ marginLeft: '10px', flex: 1 }}
                value={options.riskReduction2Methods}
                onChange={(value) =>
                  handleChangeOption('riskReduction2Methods', value)
                }
                disabled={isTrading}
              >
                {riskReduction2Methods.map(({ name, value }) => (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                ))}
              </Select>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.riskReduction2Value}
                onChange={(value) =>
                  handleChangeOption('riskReduction2Value', value)
                }
                style={{
                  maxWidth: '50px',
                  marginLeft: '5px',
                  marginRight: '5px',
                  flex: 1,
                  height: '32px',
                }}
              />
              lần
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
                  width: '150px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Né thị trường xấu 3:
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ marginLeft: '10px', flex: 1 }}
                value={options.riskReduction3Methods}
                onChange={(value) =>
                  handleChangeOption('riskReduction3Methods', value)
                }
                disabled={isTrading}
              >
                {riskReduction3Methods.map(({ name, value }) => (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                ))}
              </Select>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.riskReduction3Value}
                onChange={(value) =>
                  handleChangeOption('riskReduction3Value', value)
                }
                style={{
                  maxWidth: '50px',
                  marginLeft: '5px',
                  marginRight: '5px',
                  flex: 1,
                  height: '32px',
                }}
              />
              lần
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
                  width: '150px',
                  color: isTrading
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(0, 0, 0, 0.85)',
                }}
              >
                Né thị trường xấu 4:
              </p>
              <Select
                mode="multiple"
                allowClear
                style={{ marginLeft: '10px', flex: 1 }}
                value={options.riskReduction4Methods}
                onChange={(value) =>
                  handleChangeOption('riskReduction4Methods', value)
                }
                disabled={isTrading}
              >
                {riskReduction4Methods.map(({ name, value }) => (
                  <Option key={value} value={value}>
                    {name}
                  </Option>
                ))}
              </Select>
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.riskReduction4Value}
                onChange={(value) =>
                  handleChangeOption('riskReduction4Value', value)
                }
                style={{
                  maxWidth: '50px',
                  marginLeft: '5px',
                  marginRight: '5px',
                  flex: 1,
                  height: '32px',
                }}
              />
              lần
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
              Tổng
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.totalStopLossValue}
                onChange={(value) =>
                  handleChangeOption('totalStopLossValue', value)
                }
                style={{ marginRight: '5px', marginLeft: '5px' }}
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
              Tổng
              <InputNumber
                disabled={isTrading || !hasMethod1}
                value={options.totalTakeProfitValue}
                onChange={(value) =>
                  handleChangeOption('totalTakeProfitValue', value)
                }
                style={{ marginRight: '5px', marginLeft: '5px' }}
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
                // height: '32px',
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
          <p>
            <b>Tín hiệu: </b>
            <Select
              style={{ width: '100%' }}
              value={grSelected}
              onChange={(value) => {
                setGrSelected(value);
              }}
              disabled={isTrading}
            >
              {groups.map(({ name, tid }) => (
                <Option key={tid} value={tid}>
                  {name}
                </Option>
              ))}
            </Select>
          </p>
        </Card>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
