import { describe, it, expect } from "vitest";
import { cloneBooks, Book } from "./models.js";

describe("models", () => {
  describe("cloneBooks", () => {
    it("devrait retourner une liste de livres", () => {
      const books = cloneBooks();
      expect(books).toBeInstanceOf(Array);
      expect(books.length).toBeGreaterThan(0);
    });

    it("devrait retourner des clones indépendants", () => {
      const books1 = cloneBooks();
      const books2 = cloneBooks();
      
      expect(books1).not.toBe(books2);
      expect(books1[0]).not.toBe(books2[0]);
      
      // Modifier un livre ne devrait pas affecter l'autre
      books1[0].title = "Modified Title";
      expect(books2[0].title).not.toBe("Modified Title");
    });

    it("devrait retourner des livres avec toutes les propriétés requises", () => {
      const books = cloneBooks();
      const book = books[0];
      
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("collection");
      expect(book).toHaveProperty("rating");
      expect(book).toHaveProperty("blurb");
      expect(book).toHaveProperty("accent");
      expect(book).toHaveProperty("accentDark");
      expect(book).toHaveProperty("icon");
    });

    it("devrait avoir des ratings valides entre 0 et 5", () => {
      const books = cloneBooks();
      books.forEach((book) => {
        expect(book.rating).toBeGreaterThanOrEqual(0);
        expect(book.rating).toBeLessThanOrEqual(5);
      });
    });
  });
});
