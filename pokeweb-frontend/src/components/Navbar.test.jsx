import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { saveToken } from "../auth/session";
import { fakeToken } from "../test/tokens";

// MemoryRouter : un routeur en mémoire, pour afficher le composant sans vrai navigateur
function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={["/home"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("propose de se connecter à un visiteur", () => {
    renderNavbar();

    expect(screen.getAllByRole("link", { name: "Connexion" })[0]).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Collection" })).not.toBeInTheDocument();
  });

  it("affiche les pages du joueur quand il est connecté", () => {
    saveToken(fakeToken(3600));
    renderNavbar();

    expect(screen.getByRole("link", { name: "Collection" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
  });

  it("déconnecte le joueur", async () => {
    saveToken(fakeToken(3600));
    renderNavbar();

    await userEvent.click(screen.getByRole("button", { name: "Déconnexion" }));

    expect(localStorage.getItem("pokeweb_token")).toBeNull();
    expect(screen.getAllByRole("link", { name: "Connexion" })[0]).toBeInTheDocument();
  });
});
