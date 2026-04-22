import type { ReactNode } from "react";

type CellProps = {
  children: ReactNode;
};

export function TableHeaderCell({ children }: CellProps) {
  return (
    <th className="border-b border-slate-800 px-4 py-3 text-left text-sm font-semibold text-slate-300">
      {children}
    </th>
  );
}

export function TableDataCell({ children }: CellProps) {
  return (
    <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-200">
      {children}
    </td>
  );
}