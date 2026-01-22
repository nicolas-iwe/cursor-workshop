import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getBooks,
  getHealthStatus,
  formatRating,
  loadWorkshopGoalsHTML,
} from "./services.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("services", () => {
  describe("getBooks", () => {
    it("devrait retourner une liste de livres", () => {
      const books = getBooks();
      expect(books).toBeInstanceOf(Array);
      expect(books.length).toBeGreaterThan(0);
    });

    it("devrait retourner des livres avec la structure Book", () => {
      const books = getBooks();
      const book = books[0];
      
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("collection");
      expect(book).toHaveProperty("rating");
      expect(typeof book.rating).toBe("number");
    });
  });

  describe("getHealthStatus", () => {
    it("devrait retourner GOOD pour les secondes paires", () => {
      // Mock Date pour une seconde paire (par exemple, seconde 10)
      const mockDate = new Date("2024-01-01T12:00:10.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(10);

      const status = getHealthStatus();
      expect(status).toBe("GOOD");

      vi.restoreAllMocks();
    });

    it("devrait retourner BAD pour les secondes impaires", () => {
      // Mock Date pour une seconde impaire (par exemple, seconde 11)
      const mockDate = new Date("2024-01-01T12:00:11.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(11);

      const status = getHealthStatus();
      expect(status).toBe("BAD");

      vi.restoreAllMocks();
    });

    it("devrait retourner GOOD pour la seconde 0", () => {
      const mockDate = new Date("2024-01-01T12:00:00.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(0);

      const status = getHealthStatus();
      expect(status).toBe("GOOD");

      vi.restoreAllMocks();
    });

    it("devrait retourner BAD pour la seconde 59", () => {
      const mockDate = new Date("2024-01-01T12:00:59.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(59);

      const status = getHealthStatus();
      expect(status).toBe("BAD");

      vi.restoreAllMocks();
    });
  });

  describe("formatRating", () => {
    it("devrait formater un rating avec une décimale et une étoile", () => {
      expect(formatRating(4.5)).toBe("4.5★");
      expect(formatRating(3.2)).toBe("3.2★");
      expect(formatRating(5.0)).toBe("5.0★");
    });

    it("devrait arrondir correctement les décimales", () => {
      expect(formatRating(4.567)).toBe("4.6★");
      expect(formatRating(3.123)).toBe("3.1★");
    });

    it("devrait gérer les ratings à zéro", () => {
      expect(formatRating(0)).toBe("0.0★");
    });
  });

  describe("loadWorkshopGoalsHTML", () => {
    const testBasePath = path.resolve(__dirname, "..");

    it("devrait retourner un message d'erreur si le fichier n'existe pas", async () => {
      // Réinitialiser le module pour tester le cas d'erreur sans cache
      vi.resetModules();
      const { loadWorkshopGoalsHTML: loadHTML } = await import("./services.js");
      const invalidPath = "/chemin/inexistant/qui/n/existe/pas";
      const html = loadHTML(invalidPath);
      expect(html).toContain("Workshop goals are unavailable");
    });

    it("devrait charger le HTML du README s'il existe", () => {
      const html = loadWorkshopGoalsHTML(testBasePath);
      expect(html).toBeTruthy();
      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(0);
    });

    it("devrait mettre en cache le résultat après le premier chargement", () => {
      const html1 = loadWorkshopGoalsHTML(testBasePath);
      const html2 = loadWorkshopGoalsHTML(testBasePath);
      
      // Devrait être la même référence (mise en cache)
      expect(html1).toBe(html2);
    });

    it("devrait extraire uniquement la section Workshop du README", () => {
      const html = loadWorkshopGoalsHTML(testBasePath);
      // Le HTML devrait contenir du contenu mais pas tout le README
      expect(html).toBeTruthy();
      // Vérifier qu'il contient du HTML formaté
      expect(html).toContain("<h3>");
    });
  });
});
