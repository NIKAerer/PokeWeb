import { describe, expect, it } from "vitest";
import { formatNumber, normalize } from "./pokemon";
import { describeRound } from "../components/battle/battleMessages";

describe("formatNumber", () => {
  it("affiche le numéro du Pokédex sur 3 chiffres", () => {
    expect(formatNumber(25)).toBe("#025");
    expect(formatNumber(150)).toBe("#150");
  });
});

describe("normalize", () => {
  it("ignore les accents et les majuscules pour la recherche", () => {
    expect(normalize("Évoli")).toBe("evoli");
    expect(normalize("SALAMÈCHE")).toBe("salameche");
  });
});

describe("describeRound", () => {
  it("raconte un tour de combat en français", () => {
    const log = [
      { attacker: "fighter", damage: 52, effectiveness: 2 },
      { attacker: "wild", damage: 0, effectiveness: 0 },
    ];

    expect(describeRound(log, "Salamèche", "Fantominus")).toEqual([
      "Salamèche attaque ! C'est super efficace (−52 PV).",
      "Fantominus sauvage attaque… Ça n'a aucun effet.",
    ]);
  });
});
