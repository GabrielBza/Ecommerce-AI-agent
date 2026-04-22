type StatusListProps = {
  statuses?: string[];
};

export default function StatusList({ statuses = [] }: StatusListProps) {
  if (!statuses.length) return null;

  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        Progresso
      </div>

      <ul className="space-y-2">
        {statuses.map((status, index) => (
          <li key={`${status}-${index}`} className="flex items-center gap-3 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            {status}
          </li>
        ))}
      </ul>
    </div>
  );
}