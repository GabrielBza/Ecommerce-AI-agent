type HeaderProps = {
  onClearChat: () => void;
};

export default function Header({ onClearChat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Converse com seus dados
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Faça perguntas em linguagem natural e receba respostas analíticas com resumo e tabela.
          </p>
        </div>

        <button
          onClick={onClearChat}
          className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          Limpar chat
        </button>
      </div>
    </header>
  );
}