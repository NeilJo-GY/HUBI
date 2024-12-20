import React, { useState } from 'react';

interface DotProps {
  id: string;
  size: 'small' | 'large';
  color: 'green' | 'gray';  // 决定过去的点为绿色，未来的点为灰色
  filled: boolean;  // 决定是否填充实心
  date: string;
  onClick: () => void;
  position: 'first' | 'last' | 'middle';
}

const Dot = React.forwardRef<HTMLDivElement, DotProps>((props, ref) => {
  const { id, size, color, filled, date, onClick, position } = props;
  const [isHovered, setIsHovered] = useState(false)
  const sizeClass = size === 'large' ? 'w-5 h-5' : 'w-4 h-4';

  // 根据是否悬停或点击选择边框颜色或填充
  let fillClass = '';
  if (filled || isHovered) {
    fillClass = color === 'green' ? 'bg-green-500' : 'bg-gray-500';  // 实心
  } else {
    fillClass = color === 'green' ? 'border-green-500 border-2' : 'border-gray-300 border-2';  // 非实心
  }

  const containerClass = position === 'first'
    ? 'ml-4'
    : position === 'last'
      ? 'mr-4'
      : ''

  // 动态设置 `date` 样式
  const dateClass = filled
    ? color === 'green'
      ? 'text-green-500 font-semibold' // 高亮为绿色（过去的时间点）
      : 'text-gray-500 font-semibold'  // 高亮为灰色（未来的时间点）
    : 'text-gray-600';  // 未被选中的点显示为普通灰色

  return (
    <div
      id={id}
      className={`relative cursor-pointer ${containerClass}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref} // Use the forwarded ref here
    >
      {/* 圆点显示 */}
      <div className={`${sizeClass} rounded-full ${fillClass} transition-all duration-200 mx-auto`} />

      {/* 显示日期 */}
      <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 text-sm whitespace-nowrap ${dateClass}`}>
        {date} {/* 显示日期 */}
      </div>
    </div>
  );
});

export default Dot;