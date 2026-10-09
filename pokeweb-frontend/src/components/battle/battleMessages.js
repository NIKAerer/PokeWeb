// Transforme le compte rendu d'un tour (envoyé par l'API) en phrases à afficher.
export function describeRound(log, fighterName, wildName) {
  return log.map(({ attacker, damage, effectiveness }) => {
    const name = attacker === "fighter" ? fighterName : `${wildName} sauvage`;
    let sentence = `${name} attaque`;

    if (effectiveness === 0) {
      return `${sentence}… Ça n'a aucun effet.`;
    }
    if (effectiveness > 1) {
      sentence += " ! C'est super efficace";
    } else if (effectiveness < 1) {
      sentence += ". Ce n'est pas très efficace";
    }

    return `${sentence} (−${damage} PV).`;
  });
}
