import React from 'react';
import PropTypes from 'prop-types';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

const columns = [
  { title: 'Phiên', dataIndex: 'session', key: 'session' },
  { title: 'Phương pháp', dataIndex: 'method', key: 'method' },
  { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Lãi / lỗ', dataIndex: 'result', key: 'result' },
];

const data = [
  {
    session: '1',
    method: 'Phương pháp 1',
    createdAt: '15:12 24-02-2021',
    result: '+0.95$',
  },
];
// for (let i = 0; i < 3; ++i) {
//   data.push({
//     key: i,
//     name: 'Screem',
//     platform: 'iOS',
//     version: '10.3.4.5654',
//     upgradeNum: 500,
//     creator: 'Jack',
//     createdAt: '2014-12-24 23:12:00',
//   });
// }

function UserHistoryPage(props) {
  const expandedRowRender = () => {
    const columns = [
      { title: 'Vòng', dataIndex: 'round', key: 'round' },
      { title: 'Loại', dataIndex: 'type', key: 'type' },
      { title: 'Số tiền', dataIndex: 'amout', key: 'amout' },
      { title: 'Kết quả', dataIndex: 'result', key: 'result' },
      { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt' },
    ];

    const data = [
      {
        round: '1',
        type: 'Tăng',
        amount: '1$',
        result: '+0.95$',
        createdAt: '15:14 24-02-2021',
      },
    ];
    // for (let i = 0; i < 3; ++i) {
    //   data.push({
    //     key: i,
    //     date: '2014-12-24 23:12:00',
    //     name: 'This is production name',
    //     upgradeNum: 'Upgraded: 56',
    //   });
    // }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <>
      <Table
        // className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
      />
    </>
  );
}

UserHistoryPage.propTypes = {};

export default UserHistoryPage;
