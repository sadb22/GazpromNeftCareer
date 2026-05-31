import React from 'react';

export default function DashboardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full mb-8">
      {children}
    </div>
  );
}
