import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: (string | React.ReactNode)[];
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Table = ({ headers, children, className, ...props }: TableProps) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        <thead>
          <tr className="bg-zinc-900/50 text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-white/5">
            {headers.map((header, i) => (
              <th key={i} className="py-4 px-6">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children}
        </tbody>
      </table>
    </div>
  );
};
