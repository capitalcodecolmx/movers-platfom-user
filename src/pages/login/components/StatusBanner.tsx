import React from 'react';

type StatusTone = 'error' | 'success';

interface StatusBannerProps {
  tone: StatusTone;
  message: string;
}

const toneStyles: Record<StatusTone, string> = {
  error: 'bg-red-50 border-red-200 text-red-600',
  success: 'bg-blue-50 border-blue-200 text-blue-700',
};

const StatusBanner: React.FC<StatusBannerProps> = ({ tone, message }) => (
  <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-medium ${toneStyles[tone]}`}>
    {message}
  </div>
);

export default StatusBanner;
