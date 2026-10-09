import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../api/client";
import LoginPage from "./LoginPage";

// On remplace le vrai client HTTP : aucun appel réseau pendant les tests
vi.mock("../api/client", () => ({ default: { post: vi.fn() } }));

function renderLogin(url = "/login") {
  return render(
    <MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<p>Page profil</p>} />
      </Routes>
    </MemoryRouter>
  );
}

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText("Email"), "sacha@pokeweb.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "pikachu123");
  await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
}

describe("LoginPage", () => {

  it("enregistre le token et ouvre le profil", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: "header.e30.signature" } });
    renderLogin();

    await fillAndSubmit();

    expect(api.post).toHaveBeenCalledWith("/login", { email: "sacha@pokeweb.fr", password: "pikachu123" });
    expect(localStorage.getItem("pokeweb_token")).toBe("header.e30.signature");
    expect(await screen.findByText("Page profil")).toBeInTheDocument();
  });

  it("affiche une erreur si le mot de passe est faux", async () => {
    vi.mocked(api.post).mockRejectedValue(new Error("401"));
    renderLogin();

    await fillAndSubmit();

    expect(await screen.findByRole("alert")).toHaveTextContent("Email ou mot de passe incorrect.");
  });

  it("connecte en un clic avec le compte de démo", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: "header.e30.signature" } });
    renderLogin();

    await userEvent.click(screen.getByRole("button", { name: "Essayer avec le compte de démo" }));

    expect(api.post).toHaveBeenLastCalledWith("/login", { email: "demo@pokeweb.fr", password: "pokeweb-demo" });
    expect(await screen.findByText("Page profil")).toBeInTheDocument();
  });

  it("explique que la session a expiré", () => {
    renderLogin("/login?expired=1");

    expect(screen.getByText("Ta session a expiré, reconnecte-toi pour continuer.")).toBeInTheDocument();
  });
});
