"use client";

import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface AnimatedProgressBarProps {
  value: number; // Current usage value (0-100)
  height?: number;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  animationDuration?: number; // Duration in milliseconds
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  height = 8,
  showPercentage = true,
  color = 'primary',
  animationDuration = 2000
}) => {
  const [animatedValue, setAnimatedValue] = useState(100); // Start from 100%
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setIsAnimating(true);
      
      // Start animation from 100% to the actual value
      const startTime = Date.now();
      const startValue = 100;
      const endValue = Math.max(0, Math.min(100, value)); // Ensure value is between 0-100
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Use easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue - (startValue - endValue) * easeOutCubic;
        
        setAnimatedValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, animationDuration]);

  // Determine color based on usage level
  const getProgressColor = () => {
    if (animatedValue >= 80) return 'success';
    if (animatedValue >= 60) return 'info';
    if (animatedValue >= 40) return 'warning';
    if (animatedValue >= 20) return 'error';
    return 'error';
  };

  const progressColor = color === 'primary' ? getProgressColor() : color;

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <LinearProgress
        variant="determinate"
        value={animatedValue}
        color={progressColor}
        sx={{
          height: height,
          borderRadius: height / 2,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
            transition: isAnimating ? 'none' : 'transform 0.3s ease-in-out',
          },
        }}
      />
      {showPercentage && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'black',
            fontWeight: 600,
            fontSize: '11px',
            textShadow: 'none',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          {Math.round(animatedValue)}%
        </Typography>
      )}
    </Box>
  );
};

export default AnimatedProgressBar;

