type TableMetaProps = {
  rowCount: number;
  columnCount: number;
};

export default function TableMeta({ rowCount, columnCount }: TableMetaProps) {
  const rowLabel = rowCount === 1 ? "linha" : "linhas";
  const columnLabel = columnCount === 1 ? "coluna" : "colunas";

  return (
    <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
      <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5">
        {rowCount} {rowLabel} • {columnCount} {columnLabel}
      </span>
    </div>
  );
}