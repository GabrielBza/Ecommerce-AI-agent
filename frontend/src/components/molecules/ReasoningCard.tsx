import type { ChatReasoning } from "../../types/chat";

type ReasoningCardProps = {
  reasoning: ChatReasoning;
};

export default function ReasoningCard({ reasoning }: ReasoningCardProps) {
  return (
    <details className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <summary className="cursor-pointer text-sm font-medium text-blue-300">
        Como interpretei a pergunta
      </summary>

      <div className="mt-4 space-y-4 text-sm text-slate-300">
        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Entidade principal
          </div>
          <div>{reasoning.entidade_principal}</div>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Métrica principal
          </div>
          <div>{reasoning.metrica_principal}</div>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Tabelas utilizadas
          </div>
          <ul className="list-disc pl-5">
            {reasoning.tabelas_utilizadas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Relacionamentos utilizados
          </div>
          <ul className="list-disc pl-5">
            {reasoning.relacionamentos_utilizados.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Agregação
          </div>
          <div>{reasoning.agregacao}</div>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Filtro ou critério
          </div>
          <div>{reasoning.filtro_ou_criterio}</div>
        </div>

        <div>
          <div className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            Explicação final
          </div>
          <div className="leading-6">{reasoning.explicacao_final}</div>
        </div>
      </div>
    </details>
  );
}