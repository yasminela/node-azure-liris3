import React from 'react';
import { theme } from '../../styles/theme';

function ProgressBar({ value, max = 100, showLabel = true, height = 8, animated = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getColor = () => {
    if (percentage >= 80) return theme.colors.success;
    if (percentage >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: theme.colors.gray }}>
          <span>Progression</span>
          <span style={{ fontWeight: 'bold', color: getColor() }}>{percentage}%</span>
        </div>
      )}
      <div style={{ background: theme.colors.primary[100], borderRadius: '999px', height: `${height}px`, overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]})`,
            borderRadius: '999px',
            transition: animated ? 'width 1s ease-out' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {animated && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 2s infinite'
            }} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;