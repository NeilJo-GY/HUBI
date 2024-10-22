/* 
设计一个卡片组件，用来展示每一期的UBI津贴
UBI津贴领取的基本规则
  所有经过KYC认证的地址都可以领取UBI津贴，
  每期领取一次，每期周期为7天，
  每个地址每次领取15UBI，周期内任意时间可领取，周期结束任未领取的作废，
  领取的操作通过向链上合约发起交易来完成
卡片样式分3个部分
  第1部分展示本期津贴基本信息
    第几期（从0期开始）
    显示当期的起始和截止时间
    同时要展示本期的剩余时间倒计时
  第2部分展示本期津贴领取的统计信息
    展示地址数，包括已经领取本期UBI的KYC地址数和本期可领取UBI的KYC地址数
    展示本期已经领取的UBI数量
  第3部分展示最新的领取交易信息
    领取的地址信息
    领取的UBI数量
    领取的时间（距离当前时间的多少）
    只展示最近的5条交易就可以
*/

'use client';
import React, { useEffect, useState } from 'react';
import { Card, Typography, Statistic, Table, Divider, Space, Row, Col } from 'antd';
import moment from 'moment';
import CountUp from 'react-countup';

const UbiAllowanceCard = ({ period, startDate, endDate, claimedAddresses, claimedUbi, recentTransactions }) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const end = moment(endDate);
      const duration = moment.duration(end.diff(now));
      setRemainingTime(`${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'UBI',
      dataIndex: 'ubi',
      key: 'ubi',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => moment(time).fromNow(),
    },
  ];

  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <Card>
      <Typography.Title level={4}>Allowance: MageUBI-{period}</Typography.Title>

      <div style={{ marginBottom: '16px' }}>
        <Space split={<Divider type="vertical" />}>
          <Typography.Text>Start Date: {startDate}</Typography.Text>
          <Typography.Text>End Date: {endDate}</Typography.Text>
          <Typography.Text>Remaining: {remainingTime}</Typography.Text>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={12}>
          <Statistic title="Claimed Addresses" value={claimedAddresses} formatter={formatter} />
        </Col>
        <Col span={12}>
          <Statistic title="Claimed UBI" value={claimedUbi} formatter={formatter} />
        </Col>
      </Row>

      <Divider />

      <div>
        <Typography.Title level={5}>Recent Claimed</Typography.Title>
        <Table
          columns={columns}
          dataSource={recentTransactions.slice(0, 5).map((tx, index) => ({ key: index, ...tx }))}
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default UbiAllowanceCard;