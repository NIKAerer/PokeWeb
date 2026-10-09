// Une section de présentation de l'accueil : une image et un texte côte à côte.
// "reverse" place l'image à droite pour alterner d'une section à l'autre.
export default function FeatureSection({ title, text, image, alt, glow, reverse = false }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-20 md:px-16">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={`mx-auto max-h-80 w-full object-contain md:max-h-96 ${reverse ? "md:order-last" : ""}`}
        style={{ filter: `drop-shadow(0 0 35px ${glow})` }}
      />
      <div className="flex flex-col gap-5 text-center md:text-left">
        <h2 className="font-orbitron text-3xl text-white drop-shadow-lg md:text-5xl">{title}</h2>
        <p className="font-rajdhani text-lg leading-relaxed text-slate-300">{text}</p>
      </div>
    </section>
  );
}
