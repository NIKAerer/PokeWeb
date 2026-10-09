import { TYPES } from "../utils/pokemon";

export default function TypeBadge({ type, size = "sm" }) {
  const { label, color } = TYPES[type] ?? { label: type, color: "#64748b" };
  const sizes = size === "lg" ? "px-4 py-1.5 text-base" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`${sizes} rounded-full font-rajdhani font-semibold uppercase tracking-wider text-white`}
      style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}66` }}
    >
      {label}
    </span>
  );
}
