'use client';
import React, { useEffect, useState } from 'react';
import { Card, Typography, Alert, Space, Divider, Form, Input, Table, Spin } from 'antd';
import moment from 'moment';
import ClaimButton from '@/app/_drafts/ui/ubi/claimbutton'; // 导入ClaimButton组件
import { useAccount } from 'wagmi'
import { config } from '@/app/lib/wagmi';

const ClaimAllowance: React.FC = () => {
    const { address, status } = useAccount({ config });
    const [claimData, setClaimData] = useState<{ claimedUBI: number, missedUBI: number, claimableUBI: number } | null>(null); // UBI数据
    const [loading, setLoading] = useState<boolean>(false); // 加载状态
    const [error, setError] = useState<string | null>(null); // 错误信息

    useEffect(() => {
        if (status === 'connected') {
            const fetchUBIData = async () => {
                try {
                    setLoading(true);
                    // 这里替换为实际的API请求
                    const response = await fetch('/api/ubi-data');
                    if (!response.ok) {
                        throw new Error('Failed to fetch your UBI claim data.');
                    }
                    const data = await response.json();
                    setClaimData(data);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchUBIData();
        }
    }, [status]);

    const columns = [
        {
            title: 'UBI Amount',
            dataIndex: 'ubi',
            key: 'ubi',
            render: (ubi: number) => `${ubi} UBI`,
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (time: string) => moment(time).fromNow(),
        },
    ];

    return (
        <Card>
            <Typography.Title level={4}>Claim Your Allowance</Typography.Title>

            {status === 'disconnected' ? (
                <Alert
                    message="Please connect your wallet to request UBI. It's free!"
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                    closable
                />
            ) : null}

            {status === 'connected' && error ? (
                <Alert
                    message={`Error: ${error}`}
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                    closable
                />
            ) : null}

            <Spin spinning={loading}>
                <Space size="middle" style={{ marginBottom: '16px' }} split={<Divider type="vertical" />}>
                    <Typography.Text>Claimed: {claimData ? claimData.claimedUBI : 'N/A'} UBI</Typography.Text>
                    <Typography.Text>Missed: {claimData ? claimData.missedUBI : 'N/A'} UBI</Typography.Text>
                </Space>

                <Form layout="horizontal">
                    <Form.Item label="Address">
                        <Input value={address ? address : 'N/A'} readOnly />
                    </Form.Item>

                    <Form.Item label="Claimable">
                        <Space>
                            <Typography.Text>{claimData ? claimData.claimableUBI : 'N/A'} UBI</Typography.Text>
                        </Space>
                    </Form.Item>

                    <Form.Item>
                        <ClaimButton disabled={!address || !claimData || claimData.claimableUBI <= 0} />
                    </Form.Item>
                </Form>

                <Divider />
                <Typography.Title level={5}>Recent Claim Records</Typography.Title>
                <Table
                    columns={columns}
                    dataSource={claimData ? [
                        { key: '1', ubi: 15, time: '2023-01-01T12:00:00Z' },
                        { key: '2', ubi: 10, time: '2023-01-02T12:00:00Z' },
                    ] : []}
                    pagination={false}
                    locale={{ emptyText: 'No data available' }}
                />
            </Spin>
        </Card>
    );
};

export default ClaimAllowance;