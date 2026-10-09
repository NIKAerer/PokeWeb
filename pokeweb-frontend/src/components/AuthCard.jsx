// Cadre commun aux pages de connexion et d'inscription.
export default function AuthCard({ title, subtitle, error, info, children }) {
  return (
    <main className="relative z-10 flex min-h-page items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-poke-red/40 bg-slate-950/70 p-8 shadow-[0_0_30px_rgba(239,68,68,0.45)] backdrop-blur-xl sm:p-10">
        <h1 className="text-center font-orbitron text-3xl tracking-wide text-white">{title}</h1>
        {subtitle && <p className="mt-2 text-center font-rajdhani text-slate-400">{subtitle}</p>}

        {info && (
          <p className="mt-6 rounded-xl border border-poke-blue/40 bg-poke-blue/10 px-4 py-3 text-center font-rajdhani text-blue-200">
            {info}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center font-rajdhani text-red-300">
            {error}
          </p>
        )}

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
