'use client';
/* 
参照rainbow-me/react-native-animated-charts的简洁且优美的样式，
设计一个react混合图表组件，将被用在网页顶部；其中用面积图来展示全球贫困人口总数，可随着不同的贫困线发生变化；
用一个柔和的线性图来展示UBI（UBI是Universal Basic Income的缩写，现在将UBI作为一个代币的名字，用来实施全面基本收入计划）价格的变化；
用另外一个柔和的线性图来展示每人每日可领取基本收入（UBI的数量*当前价格）的变化；
用另外一个面积图来展示领取UBI的地址（经过KYC认证的区块链地址）数变化。
*/

import React from 'react';
import {
    ComposedChart,Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DataProps {
  date: string;
  poverty: number;
  ubiPrice: number;
  dailyUBI: number;
  kycAddresses: number;
}

const data: DataProps[] = [
  { date: '2023-012-01', poverty: 1100000000 },
  { date: '2024-01-01', poverty: 900000000, ubiPrice: 1, dailyUBI: 2, kycAddresses: 10000 },
  { date: '2024-02-01', poverty: 890000000, ubiPrice: 1.5, dailyUBI: 3, kycAddresses: 20000 },
  { date: '2024-03-01', poverty: 880000000, ubiPrice: 2, dailyUBI: 4, kycAddresses: 30000 },
  { date: '2024-04-01', poverty: 50000000, ubiPrice: 1, dailyUBI: 2, kycAddresses: 50000 },
  { date: '2024-05-01', poverty: 20000000, ubiPrice: 1.5, dailyUBI: 3, kycAddresses: 20000 },
  { date: '2024-06-01', poverty: 10000000, ubiPrice: 2, dailyUBI: 4, kycAddresses: 30000 },
  // 添加更多数据
];

const formatLogScale = (value: number) => {
  if (value < 1000000) return value.toLocaleString();
  return `${(value / 1000000).toFixed(0)}M`;
};

const formatCurrency = (value: number) => `$${value.toFixed(0)}`;

const CustomXAxisTick = ({ x, y, payload, index }) => {
  if (index === 0 || index === data.length - 1) {
    return null;
  }
  return <text x={x} y={y + 10} textAnchor="middle" fill="#666">{payload.value}</text>;
};

const MixedChart: React.FC = () => {
  console.log('Chart data:', data); // 打印数据

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPoverty" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorKycAddresses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false}
          tick={<CustomXAxisTick />}
        />
        <YAxis 
          yAxisId="left" 
          scale="log" 
          domain={[10000, 1000000000]} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={formatLogScale} 
          ticks={[10000, 100000, 1000000, 10000000, 100000000, 1000000000]} 
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 10]} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={formatCurrency}
        />
        <Tooltip 
          formatter={(value: any, name: any, props: any) => {
            if (name === 'UBI Price' || name === 'Daily UBI') {
              return `$${value.toFixed(2)}`;
            }
            return value;
          }}
        />        
        <Legend />
        <Line yAxisId="right" type="monotone" dataKey="ubiPrice" stroke="#ff7300" dot={false} name="UBI Price" />
        <Line yAxisId="right" type="monotone" dataKey="dailyUBI" stroke="#387908" dot={false} name="Daily UBI" />
        <Area yAxisId="left" type="monotone" dataKey="poverty" stroke="#8884d8" fillOpacity={1} fill="url(#colorPoverty)" name="Poverty" />
        <Area yAxisId="left" type="monotone" dataKey="kycAddresses" stroke="#82ca9d" fillOpacity={1} fill="url(#colorKycAddresses)" name="KYC Addresses" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MixedChart;