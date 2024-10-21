import React, { useContext } from 'react';
import Dot from './TimelineDot';
import Line from './TimelineLine';
import GrantContext from '@/app/lib/GrantContext';

export interface TimelineItem {
  date: string;
  isPast: boolean;
  isCurrentGrant: boolean;
}

interface HorizontalTimelineProps {
  currentGrantIndex: number; // 当前周期（grant）的Index
  selectedGrantIndex: number; // 选中的周期（grant）的Index
  progress: number; // 当前周期的进度
  onSelectGrant: (index: number) => void; // 父组件传入的函数，用于更新选中的grant
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  currentGrantIndex,
  selectedGrantIndex,
  progress,
  onSelectGrant,
}) => {
  const { grants } = useContext(GrantContext); // 从 GrantContext 获取 grants 数据

  if (!grants || grants.length === 0) {
    return <div>No timeline items available.</div>;
  }

  // 生成 timelineItems，isPast 基于当前时间计算
  const timelineItems: TimelineItem[] = grants.map((grant) => {
    const now = Date.now();
    const startDate = new Date(grant.startTimestamp * 1000).getTime();
    return {
      date: new Date(startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      isPast: now > startDate, // 如果当前时间已经超过 startDate，则认为是过去的时间点
      isCurrentGrant: grant.grantId === currentGrantIndex,
    };
  });

  console.log(grants); // 打印 grants 内容，确保 startDate 不同

  const lineWidth = 200 // Width of the line between dots
  const defaultDotWidth = 16; // w-4 的宽度
  const currentGrantDotWidth = 20; // w-5 的宽度
  // 计算总宽度时，当前的 grant 点需要使用不同的宽度
  const totalWidth = (timelineItems.length - 1) * lineWidth
    + (timelineItems.length - 1) * defaultDotWidth // 所有非当前点的宽度
    + currentGrantDotWidth // 当前点的宽度

  const handleDotClick = (index: number) => {
    onSelectGrant(index); // 更新选中的点
  };

  return (
    <div
      className="flex items-center"
      style={{ width: `${totalWidth}px` }}  // 设置容器的总宽度
    >
      {timelineItems.map((item, index) => (
        <React.Fragment key={index}>
          {/* 渲染Dot组件 */}
          <Dot
            id={`dot-${index}`}
            size={item.isCurrentGrant ? 'large' : 'small'}
            color={item.isPast ? 'green' : 'gray'}
            filled={selectedGrantIndex === index}  // 仅选中的点显示为实心
            date={item.date}
            onClick={() => handleDotClick(index)} // 点击更新选中状态
            position={index === 0 ? 'first' : index === timelineItems.length - 1 ? 'last' : 'middle'}
          />

          {/* 渲染Line组件，确保最后一个点后面也有线 */}
          {index < timelineItems.length - 1 && (
            <Line
              color={item.isPast ? 'green' : 'gray'}
              width={lineWidth}  // 线段的长度
              height={2}  // 线段的厚度
              progress={index === currentGrantIndex ? progress : 100}  // 当前周期线段显示进度，其它线段为100%
              animate={index === currentGrantIndex}  // 只有当前周期的线段使用动画
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HorizontalTimeline;