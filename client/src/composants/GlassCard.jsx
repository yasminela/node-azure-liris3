import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function GlassCard({ children, className = '', hover = true, onClick }) {
  const { darkMode } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default GlassCard;