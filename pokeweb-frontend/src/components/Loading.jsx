import { useEffect, useState } from "react";

const SLOW_AFTER_MS = 4000;

// Message de chargement. Si l'API tarde (le serveur gratuit de la démo s'endort
// après 15 minutes sans visite), on explique pourquoi au lieu de laisser croire à une panne.
export default function Loading({ text = "Chargement…" }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center font-rajdhani text-slate-400">
      {text && <p>{text}</p>}
      {slow && <p className="mt-2 text-sm text-slate-500">Le serveur de démo se réveille, cela peut prendre jusqu'à une minute.</p>}
    </div>
  );
}
