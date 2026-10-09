// Petite Pokéball dessinée en CSS. "empty" l'affiche grisée (Pokéball déjà utilisée).
export default function PokeballIcon({ size = 32, shaking = false, empty = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 border-black ${
        shaking ? "animate-shake" : ""
      } ${empty ? "opacity-25 grayscale" : ""}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-poke-red" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <div className="absolute inset-x-0 top-1/2 h-[12%] -translate-y-1/2 bg-black" />
      <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white" />
    </div>
  );
}
