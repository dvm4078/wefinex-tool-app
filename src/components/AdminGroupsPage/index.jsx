import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'antd';

import { getGroups } from '../../actions/group';

function AdminGroupsPage(props) {
  const dispatch = useDispatch();
  const { loading, groups } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getGroups());
  }, []);

  return (
    <>
      <Table
        columns={[
          {
            title: 'Tên nhóm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
          },
          {
            title: 'ID',
            key: 'tid',
            dataIndex: 'tid',
          },
        ]}
        dataSource={groups}
        loading={loading}
        pagination={false}
      />
    </>
  );
}

AdminGroupsPage.propTypes = {};

export default AdminGroupsPage;
