import React, { useState } from 'react';
import { theme } from '../../styles/theme';

function StatCard({ icon, value, label, color, trend, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${theme.colors.white}, ${color}08)`,
        borderRadius: '24px',
        padding: '24px',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: theme.animation.transition,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? theme.shadows.xl : theme.shadows.md,
        border: `1px solid ${color}20`
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: `${color}15`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.dark, marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', color: theme.colors.gray }}>{label}</div>
      {trend && (
        <div style={{ marginTop: '12px', fontSize: '12px', color: trend > 0 ? theme.colors.success : theme.colors.error }}>
          {trend > 0 ? `+${trend}%` : `${trend}%`}
        </div>
      )}
    </div>
  );
}

export default StatCard;