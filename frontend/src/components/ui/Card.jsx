import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`card-premium p-6 ${className}`}>
      {children}
    </div>
  );
};