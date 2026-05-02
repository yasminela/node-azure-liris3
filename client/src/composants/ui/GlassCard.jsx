import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function GlassCard({ children, className = '', hover = true, onClick }) {
  const { darkMode } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        background: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${darkMode ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)'}`,
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(hover && {
          ':hover': {
            transform: 'translateY(-4px)',
            borderColor: '#9333ea',
            boxShadow: '0 0 30px rgba(147, 51, 234, 0.2)'
          }
        })
      }}
      className={className}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = '#9333ea';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(147, 51, 234, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = darkMode ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {children}
    </div>
  );
}

export default GlassCard;