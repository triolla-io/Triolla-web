'use client';
import { useState } from 'react';

export default function FaqBox({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${className}${open ? ' active' : ''}`}
      onClick={() => setOpen(o => !o)}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </div>
  );
}
