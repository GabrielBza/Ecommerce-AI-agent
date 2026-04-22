import { motion } from "framer-motion";
import type { ChatRow } from "../../types/chat";
import { TableDataCell, TableHeaderCell } from "../atoms/TableCell";

type DataTableProps = {
  rows: ChatRow[];
};

export default function DataTable({ rows }: DataTableProps) {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80"
    >
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-900/95 backdrop-blur">
              {columns.map((col) => (
                <TableHeaderCell key={col}>{col}</TableHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition hover:bg-slate-900/60"
              >
                {columns.map((col) => (
                  <TableDataCell key={col}>{String(row[col])}</TableDataCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}