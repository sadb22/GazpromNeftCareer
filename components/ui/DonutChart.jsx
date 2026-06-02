import React from 'react';

export default function DonutChart({ percentage, completed, inProgress, planned, size = 130 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 15;
  const strokeW = 13;
  const circumference = 2 * Math.PI * r;
  const total = (completed + inProgress + planned) || 1;
  const gap = 3;

  const dashFor = (n) => Math.max(0, (n / total) * circumference - gap);
  const rotFor  = (offset) => -90 + (offset / total) * 360;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle r={r} cx={cx} cy={cy} fill="none" stroke="#E8EBF2" strokeWidth={strokeW} />

          {planned > 0 && (
            <circle r={r} cx={cx} cy={cy} fill="none"
              stroke="#B8BDC5" strokeWidth={strokeW}
              strokeDasharray={`${dashFor(planned)} ${circumference}`}
              transform={`rotate(${rotFor(completed + inProgress)}, ${cx}, ${cy})`}
            />
          )}
          {inProgress > 0 && (
            <circle r={r} cx={cx} cy={cy} fill="none"
              stroke="#10B981" strokeWidth={strokeW}
              strokeDasharray={`${dashFor(inProgress)} ${circumference}`}
              transform={`rotate(${rotFor(completed)}, ${cx}, ${cy})`}
            />
          )}
          {completed > 0 && (
            <circle r={r} cx={cx} cy={cy} fill="none"
              stroke="#005DB9" strokeWidth={strokeW}
              strokeDasharray={`${dashFor(completed)} ${circumference}`}
              transform={`rotate(${rotFor(0)}, ${cx}, ${cy})`}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="font-bold text-dark" style={{ fontSize: size > 110 ? '1.35rem' : '1rem', lineHeight: 1.15 }}>
            {percentage}%
          </span>
          <span className="text-muted" style={{ fontSize: '0.6rem', marginTop: 2 }}>выполнено</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#005DB9' }} />
          <span className="text-secondary">Завершено <strong className="text-dark">{completed}</strong> мод.</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#10B981' }} />
          <span className="text-secondary">В процессе <strong className="text-dark">{inProgress}</strong> мод.</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#B8BDC5' }} />
          <span className="text-secondary">Запланировано <strong className="text-dark">{planned}</strong> мод.</span>
        </div>
      </div>
    </div>
  );
}
