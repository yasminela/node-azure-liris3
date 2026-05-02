import React from 'react';
import { theme } from '../../styles/theme';

function Button({ children, onClick, variant = 'primary', size = 'md', icon, loading = false, disabled = false }) {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[700]})`, color: theme.colors.white },
    secondary: { background: theme.colors.secondary[500], color: theme.colors.white },
    success: { background: theme.colors.success, color: theme.colors.white },
    danger: { background: theme.colors.error, color: theme.colors.white },
    outline: { background: 'transparent', border: `2px solid ${theme.colors.primary[500]}`, color: theme.colors.primary[500] }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '16px 32px', fontSize: '16px' }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...variants[variant],
        ...sizes[size],
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: theme.animation.transition,
        transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered && !disabled ? theme.shadows.md : 'none',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {loading ? <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}

export default Button;