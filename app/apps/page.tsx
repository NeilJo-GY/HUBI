'use client'

import React from 'react';
import { Layout, Typography, Input, Select, Button, Card, Tag, Row, Col, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from '@/app/src/components/Header';
import Image from 'next/image';

const { Content } = Layout;
const { Paragraph } = Typography;
const { Option } = Select;

interface Project {
    name: string;
    logo: string;
    summary: string;
    categories: string[];
    tags: string[];
}

const projects: Project[] = [
    { name: "HUBI-Grant", logo: "/logo.svg?height=40&width=40", summary: "A platform for managing and claiming UBI grants.", categories: ["UBI", "Grant"], tags: ["OP", "M"] },
    { name: "HID (Human Digital Identity)", logo: "/HID.svg?height=40&width=40", summary: "Securely and anonymously proves you are human online.", categories: ["Infrastructure", "ID"], tags: ["OP", "M"] },
    { name: "Seer.ai", logo: "/s.svg?height=40&width=40", summary: "A social platform generating prophecy content using AI.", categories: ["AI", "Social"], tags: ["M", "OP"] },
    { name: "Agenis", logo: "/A.svg?height=40&width=40", summary: "On-chain Agent Generation Platform.", categories: ["AI", "Agent"], tags: ["M", "OP"] },
    { name: "Paul the Octopus", logo: "/paul.png?height=40&width=40", summary: "The first agent who can predict, manages its own social media account, and has its own meme coin.", categories: ["Agent", "Meme"], tags: ["SOL"] },
];

export default function Component() {
    return (
        <>
            <Header />
            <Content style={{ padding: '0 250px', marginTop: 120 }}>
                <Paragraph style={{ textAlign: 'center', fontSize: 18, marginBottom: 32 }}>
                    Discover Dapps powered by AI.
                </Paragraph>
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Space>
                            <Select defaultValue="network" style={{ width: 120 }}>
                                <Option value="network">Network</Option>
                                <Option value="mainnet">Ethereum</Option>
                                <Option value="testnet">OP Mainnet</Option>
                            </Select>
                            <Input
                                placeholder="Search"
                                prefix={<SearchOutlined />}
                                style={{ width: 200 }}
                            />
                        </Space>
                    </Col>
                    <Col>
                        <Button type="primary">Submit Project</Button>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    {projects.map((project, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <Card style={{ height: '160px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Card.Meta
                                    avatar={
                                        <Image
                                            src={project.logo}
                                            alt={project.name}
                                            width={40}
                                            height={40}
                                        />

                                    }
                                    title={project.name}
                                    description={
                                        <>
                                            <Paragraph style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {project.summary}
                                            </Paragraph>
                                            <Space wrap>
                                                {project.categories.map((category, catIndex) => (
                                                    <Tag key={catIndex} color="default">{category}</Tag>
                                                ))}
                                                {project.tags.map((tag, tagIndex) => (
                                                    <Tag key={tagIndex} color="blue">{tag}</Tag>
                                                ))}
                                            </Space>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>
        </>
    );
}