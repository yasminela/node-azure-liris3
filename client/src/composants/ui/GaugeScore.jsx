import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function GaugeScore({ score, size = 120, label = 'Score de maturité' }) {
  const { darkMode } = useTheme();
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={darkMode ? '#334155' : '#e2e8f0'}
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="gauge-fill"
        />
        <text
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fontSize={size * 0.2}
          fontWeight="bold"
          fill={getColor()}
        >
          {animatedScore}%
        </text>
      </svg>
      <p style={{ marginTop: '8px', fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>{label}</p>
    </div>
  );
}

export default GaugeScore;