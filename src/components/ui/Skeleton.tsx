import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return <div className={`skeleton ${className}`} style={style} />;
};

export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({ className = '', style, lines = 1 }) => {
  return (
    <>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`skeleton-text ${className}`} style={style} />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return <Skeleton className={`skeleton-card ${className}`} style={style} />;
};
