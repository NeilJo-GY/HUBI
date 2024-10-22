'use client'

import React, { useRef, useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useActiveAccount } from "thirdweb/react";
import { GrantProvider } from '@/app/lib/GrantProvider';
import { useGrantData } from '@/app/lib/useGrantData';
import { useReservations } from '@/app/lib/useReservations2';
import Navbar from '@/app/components/navbar';
import HorizontalTimeline from '@/app/components/HorizontalTimeline/HorizontalTimeline';
import GrantCard from '@/app/components/GrantCard';
import RecentReservationList from '@/app/components/ReservationList2';

export default function PreGrant() {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  console.log("Address:", address);  // Log to check if address is being fetched correctly

  const [selectedGrantIndex, setSelectedGrantIndex] = useState<number | null>(null);
  console.log("Selected Grant Index:", selectedGrantIndex);

  const containerRef = useRef<HTMLDivElement>(null)

  const {
    grants,
    currentId,
    isLoading,
    isError,
    error
  } = useGrantData(address || '');

  console.log("Grants data:", grants);
  console.log("Current Grant ID:", currentId);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);
  console.log("Error:", error);

  // 添加 useReservations Hook，获取 reservations 数据
  const reservations = useReservations();

  // 当 currentId 加载完成后，将 selectedGrantIndex 设置为 currentId
  useEffect(() => {
    if (currentId !== undefined && currentId !== null) {
      setSelectedGrantIndex(currentId);
    }
  }, [currentId]);

  const [progress, setProgress] = useState(0);
  console.log("Current progress:", progress);

  useEffect(() => {
    if (grants && grants.length > 0 && currentId !== undefined) {
      const currentGrant = grants.find(grant => grant.grantId === currentId);
      console.log("Current Grant:", currentGrant);

      if (currentGrant) {
        const updateProgress = () => {
          const now = Date.now();
          const startTime = currentGrant.startTimestamp * 1000;
          const endTime = currentGrant.endTimestamp * 1000;
          const totalDuration = endTime - startTime;

          if (totalDuration > 0) {
            const elapsedDuration = now - startTime;
            const progressPercentage = Math.min(
              Math.max((elapsedDuration / totalDuration) * 100, 0),
              100
            );
            console.log("Calculated progress:", progressPercentage);
            setProgress(progressPercentage);
          } else {
            console.log("Setting progress to 100%");
            setProgress(100);
          }
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [grants, currentId]);

  // 初次渲染时，默认将 scrollLeft 设置为时间轴的最右端
  useEffect(() => {
    console.log('Grants:', grants);
    console.log('Container ref:', containerRef.current);
    if (containerRef.current && grants.length > 0) {
      const container = containerRef.current;
      const timeline = container.firstChild as HTMLElement;

      if (timeline) {
        // 方法 1: 基于数据加载的初始滚动
        const scrollToEnd = () => {
          const timelineWidth = timeline.scrollWidth;
          container.scrollLeft = timelineWidth - container.clientWidth;
        };

        // 使用 requestAnimationFrame 确保 DOM 更新完成
        requestAnimationFrame(scrollToEnd);

        // 方法 2: 使用 ResizeObserver 持续监听大小变化
        const resizeObserver = new ResizeObserver(() => {
          console.log('Timeline resized');
          scrollToEnd();
        });

        resizeObserver.observe(timeline);

        // 清理函数
        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, [grants, containerRef.current]); // 依赖于 grants 数组，确保在数据加载后执

  // 当 selectedGrantIndex 变化时，滚动到对应的时间点
  useEffect(() => {
    const selectedDot = document.getElementById(`dot-${selectedGrantIndex}`);
    if (selectedDot) {
      selectedDot.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedGrantIndex]);

  const handleGrantChange = (index: number) => {
    setSelectedGrantIndex(index); // 切换到指定的 grant
  };

  const handlePrevGrant = () => {
    if (selectedGrantIndex !== null && selectedGrantIndex > 0) {
      console.log("Moving to previous grant");
      setSelectedGrantIndex(selectedGrantIndex - 1);
    }
  };

  const handleNextGrant = () => {
    if (grants && selectedGrantIndex !== null && selectedGrantIndex < grants.length - 1) {
      console.log("Moving to next grant");
      setSelectedGrantIndex(selectedGrantIndex + 1);
    }
  };

  const isDataLoading = isLoading || grants === undefined || currentId === undefined || reservations.length === 0;

  if (isDataLoading) {
    console.log("Rendering loading state");
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
    console.log("Rendering error state");
    return <div>Error: {error?.message || 'Unknown error occurred'}</div>;
  }

  if (!grants || grants.length === 0 || selectedGrantIndex === null) {
    console.log("Rendering null due to missing data");
    return null;
  }

  console.log("Rendering PreGrant component");
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <Navbar className="fixed top-0 left-0 w-full z-50" />

      {/* 左右切换按钮放置在 PreGrant 页面中 */}
      <Button
        className="fixed left-20 top-1/2 transform -translate-y-1/2 z-40 flex items-center justify-center"
        onClick={handlePrevGrant}
        disabled={selectedGrantIndex === 0}
        icon={<LeftOutlined />}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: selectedGrantIndex === 0 ? '#A0AEC0' : '#4A5568', // 不可点击时颜色变浅
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // 添加阴影效果
          color: '#fff',
          cursor: selectedGrantIndex === 0 ? 'not-allowed' : 'pointer', // 不可点击时光标变化
          transition: 'background-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={(e) => {
          if (selectedGrantIndex !== 0) {
            e.currentTarget.style.backgroundColor = '#2D3748'; // 鼠标悬停效果
          }
        }}
        onMouseLeave={(e) => {
          if (selectedGrantIndex !== 0) {
            e.currentTarget.style.backgroundColor = '#4A5568'; // 恢复原始颜色
          }
        }}
      />

      <Button
        className="fixed right-20 top-1/2 transform -translate-y-1/2 z-40 flex items-center justify-center"
        onClick={handleNextGrant}
        disabled={selectedGrantIndex === grants.length + 1}
        icon={<RightOutlined />}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: selectedGrantIndex === grants.length + 1 ? '#A0AEC0' : '#4A5568', // 不可点击时颜色变浅
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // 添加阴影效果
          color: '#fff',
          cursor: selectedGrantIndex === grants.length + 1 ? 'not-allowed' : 'pointer', // 不可点击时光标变化
          transition: 'background-color 0.3s, transform 0.3s',
        }}
        onMouseEnter={(e) => {
          if (selectedGrantIndex !== grants.length + 1) {
            e.currentTarget.style.backgroundColor = '#2D3748'; // 鼠标悬停效果
          }
        }}
        onMouseLeave={(e) => {
          if (selectedGrantIndex !== grants.length + 1) {
            e.currentTarget.style.backgroundColor = '#4A5568'; // 恢复原始颜色
          }
        }}
      />

      <GrantProvider userAddress={address}>
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
              ref={containerRef}
            >
              <HorizontalTimeline
                currentGrantIndex={currentId}
                selectedGrantIndex={selectedGrantIndex}
                progress={progress}
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
            <GrantCard selectedGrantId={selectedGrantIndex} address={address} />
          </div>
          <RecentReservationList reservations={reservations} />
        </div >
      </GrantProvider>
    </div >
  );
}