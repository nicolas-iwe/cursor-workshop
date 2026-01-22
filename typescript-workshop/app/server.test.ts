import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import { getHealthStatus, getBooks } from "./services.js";

describe("API Routes", () => {
  describe("GET /api/healthz", () => {
    it("devrait retourner un statut JSON avec GOOD ou BAD", async () => {
      // Créer une app Express simple pour tester
      const app = express();
      app.get("/api/healthz", (_req, res) => {
        res.json({ status: getHealthStatus() });
      });

      const response = await request(app).get("/api/healthz");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(["GOOD", "BAD"]).toContain(response.body.status);
    });

    it("devrait retourner GOOD pour les secondes paires", async () => {
      const mockDate = new Date("2024-01-01T12:00:10.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(10);

      const app = express();
      app.get("/api/healthz", (_req, res) => {
        res.json({ status: getHealthStatus() });
      });

      const response = await request(app).get("/api/healthz");
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("GOOD");
      
      vi.restoreAllMocks();
    });

    it("devrait retourner BAD pour les secondes impaires", async () => {
      const mockDate = new Date("2024-01-01T12:00:11.000Z");
      vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
      vi.spyOn(mockDate, "getSeconds").mockReturnValue(11);

      const app = express();
      app.get("/api/healthz", (_req, res) => {
        res.json({ status: getHealthStatus() });
      });

      const response = await request(app).get("/api/healthz");
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("BAD");
      
      vi.restoreAllMocks();
    });
  });

  describe("GET /api/books", () => {
    it("devrait retourner une liste de livres en JSON", async () => {
      const app = express();
      app.get("/api/books", (_req, res) => {
        res.json(getBooks());
      });

      const response = await request(app).get("/api/books");
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Vérifier la structure d'un livre
      const book = response.body[0];
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("collection");
      expect(book).toHaveProperty("rating");
      expect(book).toHaveProperty("blurb");
    });

    it("devrait retourner tous les livres", async () => {
      const app = express();
      app.get("/api/books", (_req, res) => {
        res.json(getBooks());
      });

      const response = await request(app).get("/api/books");
      
      expect(response.status).toBe(200);
      // Vérifier qu'on a bien tous les livres (9 selon models.ts)
      expect(response.body.length).toBe(9);
    });
  });
});
