// HorizontalTimeline.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Dot from './TimelineDot';
import Line from './TimelineLine';

export interface GrantType {
  grantId: number;
  startTimestamp: number;
  endTimestamp: number;
  // 添加其他必要的字段
}

interface HorizontalTimelineProps {
  grants: GrantType[];
  currentGrantIndex: number; // 当前周期（grant）的Index
  selectedGrantIndex: number | null; // 选中的 grant 的 ID
  onSelectGrant: (index: number) => void; // 父组件传入的函数，用于更新选中的grant
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  grants,
  currentGrantIndex,
  selectedGrantIndex,
  onSelectGrant,
}) => {
  const [progress, setProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算并更新进度
  useEffect(() => {
    const currentGrant = grants.find(grant => grant.grantId === currentGrantIndex);
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
          setProgress(progressPercentage);
        } else {
          setProgress(100);
        }
      };

      updateProgress();
      const interval = setInterval(updateProgress, 60000); // 每60秒更新一次

      return () => clearInterval(interval);
    }
  }, [currentGrantIndex, grants]);

  // 初始滚动逻辑：在数据加载完成后滚动到选中的 grant
  useEffect(() => {
    if (
      !hasScrolled &&
      containerRef.current &&
      grants.length > 0 &&
      selectedGrantIndex !== null
    ) {
      const scrollToSelectedGrant = () => {
        const selectedDot = document.getElementById(`dot-${selectedGrantIndex}`);
        if (selectedDot) {
          selectedDot.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        } else {
          // 如果找不到选中的点，滚动到时间轴最右端
          if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
          }
        }
      };

      // 使用 requestAnimationFrame 确保 DOM 更新完成后执行滚动
      requestAnimationFrame(() => {
        scrollToSelectedGrant();
        setHasScrolled(true);
      });

      // 使用 ResizeObserver 监听时间轴尺寸变化，动态调整滚动位置
      const timeline = containerRef.current.firstChild as HTMLElement;
      if (timeline) {
        const resizeObserver = new ResizeObserver(() => {
          scrollToSelectedGrant();
        });
        resizeObserver.observe(timeline);

        // 清理函数，组件卸载时断开观察
        return () => {
          resizeObserver.disconnect();
        };
      }
    }
  }, [grants, selectedGrantIndex, hasScrolled]);

  // 当 selectedGrantIndex 变化时，滚动到对应的 grant
  useEffect(() => {
    if (
      hasScrolled &&
      containerRef.current &&
      selectedGrantIndex !== null
    ) {
      const selectedDot = document.getElementById(`dot-${selectedGrantIndex}`);
      if (selectedDot) {
        selectedDot.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedGrantIndex, hasScrolled]);

  const handleDotClick = (index: number) => {
    onSelectGrant(index); // 更新选中的点
  };

  const lineWidth = 200 // Width of the line between dots
  const defaultDotWidth = 16; // w-4 的宽度
  const currentGrantDotWidth = 20; // w-5 的宽度
  // 计算总宽度时，当前的 grant 点需要使用不同的宽度
  const totalWidth =
    (grants.length - 1) * lineWidth +
    (grants.length - 1) * defaultDotWidth // 所有非当前点的宽度
    + currentGrantDotWidth // 当前点的宽度

  return (
    <div
      className="flex items-center"
      style={{ width: `${totalWidth}px` }}  // 设置容器的总宽度
      ref={containerRef}
    >
      {grants.map((grant, index) => (
        <React.Fragment key={grant.grantId}>
          <Dot
            id={`dot-${grant.grantId}`} // 确保 ID 与滚动逻辑匹配
            size={grant.grantId === currentGrantIndex ? 'large' : 'small'}
            color={grant.grantId <= currentGrantIndex ? 'green' : 'gray'}
            filled={selectedGrantIndex === grant.grantId}
            date={new Date(grant.startTimestamp * 1000).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
            })}
            onClick={() => handleDotClick(grant.grantId)}
            position={
              index === 0
                ? 'first'
                : index === grants.length - 1
                  ? 'last'
                  : 'middle'
            }
          />
          {index < grants.length - 1 && (
            <Line
              color={grant.grantId < currentGrantIndex ? 'green' : 'gray'}
              width={lineWidth}
              height={2}
              progress={grant.grantId === currentGrantIndex ? progress : 100}
              animate={grant.grantId === currentGrantIndex}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HorizontalTimeline;