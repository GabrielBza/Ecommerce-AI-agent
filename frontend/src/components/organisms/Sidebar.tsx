export default function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-800/80 bg-slate-900/80 p-6 backdrop-blur-xl xl:block">
      <div className="flex h-full flex-col">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Agente IA
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
            Chat Analítico
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Faça perguntas em linguagem natural sobre vendas, logística,
            avaliações, consumidores e produtos do e-commerce.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <h3 className="text-sm font-medium text-slate-200">Exemplos</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-400">
            <li>• Quais são os 10 produtos mais vendidos?</li>
            <li>• Qual a receita total por categoria?</li>
            <li>• Qual o percentual de pedidos no prazo por estado?</li>
            <li>• Quais categorias têm a maior taxa de avaliação negativa?</li>
          </ul>
        </div>

        <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-500">
          A interface mostra a resposta analítica de forma amigável, sem expor a SQL ao usuário final.
        </div>
      </div>
    </aside>
  );
}