import React from 'react';

export default function PageHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight uppercase">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
