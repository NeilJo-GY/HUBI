'use client'

import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useActiveAccount } from "thirdweb/react";
import { useGrantData } from '@/app/src/hooks/useGrantData';
import { useReservations } from '@/app/src/hooks/useReservations';
import Navbar from '@/app/src/components/navbar';
import HorizontalTimeline from '@/app/src/components/HorizontalTimeline/HorizontalTimeline';
import GrantCard from '@/app/src/components/GrantCard';
import RecentReservationList from '@/app/src/components/ReservationList';

export default function PreGrant() {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  // console.log("Address:", address);  // Log to check if address is being fetched correctly

  const [selectedGrantIndex, setSelectedGrantIndex] = useState<number | null>(null);

  const {
    grants,
    currentGrant,
    isLoading: grantsLoading,
    error: grantsError,
  } = useGrantData();

  /*
  console.log("Grants data:", grants);
  console.log("Current Grant ID:", currentGrant?.grantId);
  console.log("Is Loading:", grantsLoading);
  console.log("Error:", grantsError);
  */

  // 从 useReservations 获取数据
  const {
    loading: reservationsLoading,
    error: reservationsError,
    reservations
  } = useReservations();

  /*
  console.log("Reservations data:", reservations);
  console.log("Reservations Loading:", reservationsLoading);
  console.log("Reservations Error:", reservationsError);
  */

  const isDataLoading = grantsLoading || reservationsLoading || !grants || !currentGrant || !reservations;
  const isError = grantsError || reservationsError;

  // 当 currentGrant 加载完成后，设置 selectedGrantIndex
  useEffect(() => {
    if (currentGrant) {
      setSelectedGrantIndex(currentGrant.grantId);
    }
  }, [currentGrant]);

  const handleGrantChange = (index: number) => {
    setSelectedGrantIndex(index); // 切换到指定的 grant
  };

  const handlePrevGrant = () => {
    if (selectedGrantIndex !== null && selectedGrantIndex > 1) {
      // console.log("Moving to previous grant");
      setSelectedGrantIndex(selectedGrantIndex - 1);
    }
  };

  const handleNextGrant = () => {
    if (grants && selectedGrantIndex !== null && selectedGrantIndex < grants.length) {
      // console.log("Moving to next grant");
      setSelectedGrantIndex(selectedGrantIndex + 1);
    }
  };

  if (isDataLoading) {
    // console.log("Rendering loading state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
        <Navbar className="fixed top-0 left-0 w-full z-50" />
        <div
          className="flex-grow flex flex-col items-center justify-center text-center"
          style={{
            paddingTop: '128px',
            overflowY: 'auto',
          }}
        >
          <Spin size="large" style={{ color: '#fff' }} />
        </div>
      </div>
    );
  }

  if (isError) {
    // console.log("Rendering error state");
    return <div>Error: {isError?.message || 'Unknown error occurred'}</div>;
  }

  if (!grants || grants.length === 0 || selectedGrantIndex === null) {
    console.log("Rendering null due to missing data");
    return null;
  }

  // console.log("Rendering PreGrant component");
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <Navbar className="fixed top-0 left-0 w-full z-50" />

      {/* 左右切换按钮放置在 PreGrant 页面中 */}
      <Button
        className="fixed left-20 top-1/2 transform -translate-y-1/2 z-40 flex items-center justify-center"
        onClick={handlePrevGrant}
        disabled={selectedGrantIndex === 1}
        icon={<LeftOutlined />}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: selectedGrantIndex === 1 ? '#A0AEC0' : '#4A5568', // 不可点击时颜色变浅
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // 添加阴影效果
          color: '#fff',
          cursor: selectedGrantIndex === 1 ? 'not-allowed' : 'pointer', // 不可点击时光标变化
          transition: 'background-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={(e) => {
          if (selectedGrantIndex !== 1) {
            e.currentTarget.style.backgroundColor = '#2D3748'; // 鼠标悬停效果
          }
        }}
        onMouseLeave={(e) => {
          if (selectedGrantIndex !== 1) {
            e.currentTarget.style.backgroundColor = '#4A5568'; // 恢复原始颜色
          }
        }}
      />

      <Button
        className="fixed right-20 top-1/2 transform -translate-y-1/2 z-40 flex items-center justify-center"
        onClick={handleNextGrant}
        disabled={selectedGrantIndex === grants.length}
        icon={<RightOutlined />}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: selectedGrantIndex === grants.length ? '#A0AEC0' : '#4A5568', // 不可点击时颜色变浅
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // 添加阴影效果
          color: '#fff',
          cursor: selectedGrantIndex === grants.length ? 'not-allowed' : 'pointer', // 不可点击时光标变化
          transition: 'background-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={(e) => {
          if (selectedGrantIndex !== grants.length) {
            e.currentTarget.style.backgroundColor = '#2D3748'; // 鼠标悬停效果
          }
        }}
        onMouseLeave={(e) => {
          if (selectedGrantIndex !== grants.length) {
            e.currentTarget.style.backgroundColor = '#4A5568'; // 恢复原始颜色
          }
        }}
      />

      {/* 时间轴容器 */}
      <div
        className="container mx-auto px-4 flex justify-center"
        style={{
          position: 'fixed',
          top: '120px',
          left: 0,
          right: 0,
          zIndex: 30, // 设置 z-index 确保其在其他元素之上
          backgroundColor: 'inherit', // Ensure the background remains consistent
        }}
      >
        {grants && grants.length > 0 && (
          <div
            className="overflow-x-auto"
            style={{
              width: '700px',
              maxWidth: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              height: '150px', // 设置容器高度
              padding: '20px 0', // 上下内边距确保上下内容有足够空间
              scrollBehavior: 'smooth', // 添加平滑滚动
            }}
          >
            <HorizontalTimeline
              grants={grants}
              currentGrantIndex={currentGrant.grantId}
              selectedGrantIndex={selectedGrantIndex}
              onSelectGrant={handleGrantChange}
            />
          </div>
        )}
      </div>

      <div
        className="flex-grow flex flex-col items-center justify-center text-center relative"
        style={{
          paddingTop: '128px',
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        {/* 渲染 GrantCard */}
        <div className="relative w-full max-w-5xl mt-24">
          <GrantCard
            selectedGrantId={selectedGrantIndex}
            address={address}
          />
        </div>
        {/* 将 reservations 作为属性传递给 RecentReservationList */}
        <RecentReservationList reservations={reservations} />
      </div >
    </div >
  );
}