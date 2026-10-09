import { describe, expect, it } from "vitest";
import { clearToken, isLoggedIn, saveToken } from "./session";
import { fakeToken } from "../test/tokens";

describe("session", () => {
  it("n'est pas connecté sans token", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("est connecté avec un token encore valide", () => {
    saveToken(fakeToken(3600));
    expect(isLoggedIn()).toBe(true);
  });

  it("n'est plus connecté quand le token a expiré", () => {
    saveToken(fakeToken(-60));
    expect(isLoggedIn()).toBe(false);
  });

  it("refuse un token sans date d'expiration", () => {
    saveToken(`header.${btoa("{}")}.signature`);
    expect(isLoggedIn()).toBe(false);
  });

  it("refuse un token illisible", () => {
    saveToken("pas-un-token");
    expect(isLoggedIn()).toBe(false);
  });

  it("se déconnecte en supprimant le token", () => {
    saveToken(fakeToken(3600));
    clearToken();
    expect(isLoggedIn()).toBe(false);
  });
});
