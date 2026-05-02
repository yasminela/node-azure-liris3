import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Card({ children, title, icon, hover = true, className = '' }) {
  const { darkMode } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: isHovered ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' : '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
      }}
      className={className}
    >
      {title && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          borderLeft: '4px solid #667eea',
          paddingLeft: '16px'
        }}>
          {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: darkMode ? '#f1f5f9' : '#1e293b', margin: 0 }}>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;