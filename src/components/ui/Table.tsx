import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers?: (string | React.ReactNode)[];
  children?: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export const Table = ({ 
  headers, 
  children, 
  className, 
  striped = true,
  hoverable = true,
  compact = false,
  ...props 
}: TableProps) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        {headers && headers.length > 0 && (
          <thead>
            <tr className={cn(
              "text-[10px] font-bold uppercase tracking-widest border-b",
              "bg-zinc-50 dark:bg-zinc-900/50",
              "border-zinc-200 dark:border-zinc-800",
              "text-zinc-500"
            )}>
              {headers.map((header, i) => (
                <th key={i} className={cn("py-4 px-4 first:pl-6 last:pr-6 font-semibold whitespace-nowrap")}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className={cn(
          "divide-y divide-zinc-100 dark:divide-zinc-800",
          striped && "divide-zinc-100 dark:divide-zinc-800/50"
        )}>
          {children}
        </tbody>
      </table>
    </div>
  );
};

// Table Row component
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onClick?: () => void;
  selected?: boolean;
}

export const TableRow = ({ children, className, onClick, selected, ...props }: TableRowProps) => {
  return (
    <tr 
      className={cn(
        "transition-colors duration-200",
        onClick && "cursor-pointer",
        selected && "bg-primary/5 dark:bg-primary/10",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
};

// Table Cell component
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
  return (
    <td className={cn("py-4 px-4 first:pl-6 last:pr-6 align-middle", className)} {...props}>
      {children}
    </td>
  );
};

// Table Header Cell component
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = ({ children, className, ...props }: TableHeadProps) => {
  return (
    <th className={cn("py-3 px-4 first:pl-6 last:pr-6 font-semibold", className)} {...props}>
      {children}
    </th>
  );
};

// Table Body component
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = ({ children, className, ...props }: TableBodyProps) => {
  return <tbody className={className} {...props}>{children}</tbody>;
};

// Table Head component
interface TableHeadSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeadSection = ({ children, className, ...props }: TableHeadSectionProps) => {
  return <thead className={className} {...props}>{children}</thead>;
};
