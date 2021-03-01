import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import sum from 'lodash/sum';
import flatten from 'lodash/flatten';
import numeral from 'numeral';

import { getHistory } from '../../actions/history';

const dateFormat = require('dateformat');
const { ipcRenderer } = require('electron');

const columns = [
  { title: 'Phiên', dataIndex: 'id', key: 'id' },
  { title: 'Phương pháp', dataIndex: 'methodName', key: 'methodName' },
  {
    title: 'Thời gian',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt = {}) => dateFormat(createdAt, 'h:MM:ss dd-mm-yyyy'),
  },
  {
    title: 'Lãi / lỗ',
    // dataIndex: 'result',
    key: 'result',
    render: (session) => {
      const rounds = session.rounds || [];
      const logs = flatten(rounds.map((round) => round.logs || []));
      const moneys = (logs || []).map((log) => log.money || 0);
      const result = sum(moneys);
      return (
        <b style={{ color: result < 0 ? 'red' : 'green' }}>
          {numeral(result).format('0.00$')}
        </b>
      );
    },
  },
];

function UserHistoryPage(props) {
  const dispatch = useDispatch();
  const { loading, page, logs, total } = useSelector((state) => state.history);

  const handleEndBet = (event, message) => {
    dispatch(getHistory(5, page));
  };

  useEffect(() => {
    dispatch(getHistory(5, 1));
    ipcRenderer.on('end-bet', handleEndBet);
    return () => {
      ipcRenderer.removeListener('end-bet', handleEndBet);
    };
  }, []);

  const renderLogTable = (_logs) => {
    const tableColumns = [
      { title: 'Loại', dataIndex: 'type', key: 'type' },
      {
        title: 'Số tiền',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => {
          return numeral(amount).format('0.00$');
        },
      },
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt = {}) => dateFormat(createdAt, 'h:MM:ss dd-mm-yyyy'),
      },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
      {
        title: 'Lãi / lỗ',
        dataIndex: 'money',
        key: 'money',
        render: (money) => {
          return (
            <b style={{ color: money < 0 ? 'red' : 'green' }}>
              {numeral(money).format('0.00$')}
            </b>
          );
        },
      },
    ];

    return (
      <Table
        rowKey="id"
        columns={tableColumns}
        dataSource={_logs}
        pagination={false}
      />
    );
  };

  const renderRoundTable = (rounds) => {
    const tableColumns = [
      { title: 'Vòng', dataIndex: 'id', key: 'id' },
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt = {}) => dateFormat(createdAt, 'h:MM:ss dd-mm-yyyy'),
      },
      {
        title: 'Lãi / lỗ',
        render: (round) => {
          const moneys = (round.logs || []).map((log) => log.money || 0);
          const result = sum(moneys);
          return (
            <b style={{ color: result < 0 ? 'red' : 'green' }}>
              {numeral(result).format('0.00$')}
            </b>
          );
        },
      },
    ];

    return (
      <Table
        rowKey="id"
        columns={tableColumns}
        dataSource={rounds}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => renderLogTable(record.logs),
          rowExpandable: (record) => !!record.logs.length,
        }}
      />
    );
  };

  return (
    <>
      <Table
        // className="components-table-demo-nested"
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: 5,
          total,
          onChange: (page) => {
            dispatch(getHistory(5, page));
          },
        }}
        columns={columns}
        // expandable={{ expandedRowRender }}
        expandable={{
          expandedRowRender: (record) => renderRoundTable(record.rounds),
          rowExpandable: (record) => !!record.rounds.length,
        }}
        dataSource={logs}
      />
    </>
  );
}

UserHistoryPage.propTypes = {};

export default UserHistoryPage;
