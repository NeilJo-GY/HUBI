import React, { useEffect } from 'react';

interface LineProps {
  color: 'green' | 'gray';
  width: number;  // 线段宽度，以像素为单位
  height: number; // 线段高度，以像素为单位
  progress: number; // 进度百分比，代表当前时间点的位置
  animate?: boolean; // 可选，是否应用动画效果
}

const Line: React.FC<LineProps> = ({ color, width, height, progress, animate = false }) => {
  const lineStyle: React.CSSProperties = {
    width: `${width}px`,  // 宽度
    height: `${height}px`, // 高度
    position: 'relative',
    overflow: 'hidden',
  };

  const progressPosition = Math.min(Math.max(progress, 0), 100); // 保证 progress 在 0-100% 之间

  useEffect(() => {
    // 确保 document 存在，并且只在客户端执行
    if (typeof document !== 'undefined') {
      const styleSheet = document.styleSheets[0];
      if (styleSheet) {
        styleSheet.insertRule(`
          @keyframes expand {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
        `, styleSheet.cssRules.length);
      }
    }
  }, []); // 只在组件挂载时执行

  return (
    <div style={lineStyle}>
      {/* 过去的时间段 */}
      <div
        className="bg-green-500 transition-all duration-500"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progressPosition}%`, // 显示进度
        }}
      />
      {/* 未来的时间段 */}
      <div
        className="bg-gray-300 transition-all duration-500"
        style={{
          position: 'absolute',
          top: 0,
          left: `${progressPosition}%`,
          height: '100%',
          width: `${100 - progressPosition}%`,
        }}
      />
    </div>
  );
};

export default Line;