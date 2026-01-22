# Guide de Maintenance - Typed Bookshop

Ce document fournit toutes les informations nécessaires pour maintenir et développer l'application Typed Bookshop.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Technologies et dépendances](#technologies-et-dépendances)
4. [Configuration](#configuration)
5. [Développement local](#développement-local)
6. [Tests](#tests)
7. [Structure du code](#structure-du-code)
8. [Déploiement](#déploiement)
9. [Dépannage](#dépannage)
10. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

**Typed Bookshop** est une application web TypeScript construite avec Express.js qui présente une collection de livres sur les curseurs. L'application sert à la fois une interface web et une API REST.

### Fonctionnalités principales

- **Interface web** : Pages HTML générées avec Nunjucks
  - Page d'accueil (`/`) : Affiche les objectifs du workshop
  - Page des livres (`/books`) : Liste tous les livres disponibles
- **API REST** :
  - `GET /api/books` : Retourne la liste des livres en JSON
  - `GET /api/healthz` : Endpoint de santé avec la règle Trekkie odd-even

### Comportements spéciaux

- **Health Check Trekkie** : L'endpoint `/api/healthz` retourne `GOOD` pour les secondes paires et `BAD` pour les secondes impaires (règle odd-even des fans de Star Trek)
- **Cache du README** : Le contenu HTML du README est mis en cache après le premier chargement

---

## Architecture

### Structure des fichiers

```
typescript-workshop/
├── app/
│   ├── models.ts          # Modèles de données (Book interface)
│   ├── services.ts         # Logique métier
│   ├── server.ts           # Configuration Express et routes
│   ├── models.test.ts      # Tests unitaires pour models
│   ├── services.test.ts    # Tests unitaires pour services
│   ├── server.test.ts      # Tests d'intégration pour les routes
│   ├── static/             # Fichiers statiques
│   │   ├── css/
│   │   ├── img/
│   │   └── js/
│   └── templates/          # Templates Nunjucks
│       ├── base.njk
│       ├── index.njk
│       └── books.njk
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── Makefile
└── README.md
```

### Flux de données

1. **Requête HTTP** → `server.ts` (routes Express)
2. **Routes** → `services.ts` (logique métier)
3. **Services** → `models.ts` (données)
4. **Réponse** → Templates Nunjucks (HTML) ou JSON (API)

---

## Technologies et dépendances

### Runtime et langage

- **Node.js** : Runtime JavaScript
- **TypeScript** : Langage de programmation (v5.4.2)
- **tsx** : Exécution TypeScript sans compilation

### Frameworks et bibliothèques

#### Dépendances de production

- **express** (^4.19.2) : Framework web
- **nunjucks** (^3.2.4) : Moteur de templates
- **marked** (^12.0.2) : Parser Markdown vers HTML

#### Dépendances de développement

- **vitest** (^1.2.0) : Framework de tests
- **@vitest/ui** (^1.2.0) : Interface graphique pour les tests
- **supertest** (^6.3.3) : Tests HTTP pour Express
- **@types/\*** : Types TypeScript pour les dépendances

### Configuration TypeScript

- **Target** : ES2022
- **Module** : NodeNext (ES modules)
- **Strict mode** : Activé
- **Module resolution** : NodeNext

---

## Configuration

### Variables d'environnement

- `PORT` : Port d'écoute du serveur (défaut : `8082`)

Exemple :
```bash
PORT=3000 npm start
```

### Configuration TypeScript (`tsconfig.json`)

- Mode strict activé
- Modules ES (NodeNext)
- Fichiers inclus : `app/**/*.ts`

### Configuration Vitest (`vitest.config.ts`)

- Environnement : Node.js
- Globals activés
- Couverture de code avec v8

---

## Développement local

### Prérequis

- Node.js (version récente recommandée)
- npm
- Make (optionnel, pour utiliser le Makefile)

### Installation

```bash
# Avec npm
npm install

# Avec Make
make install
```

### Démarrage en mode développement

```bash
# Avec npm
npm run dev

# Avec Make
make dev
# ou
make  # Installe et démarre en une commande
```

Le serveur démarre avec `tsx watch`, qui recharge automatiquement lors des modifications.

### Démarrage en mode production

```bash
npm start
```

### Accès à l'application

- **Interface web** : http://localhost:8082
- **API Books** : http://localhost:8082/api/books
- **Health Check** : http://localhost:8082/api/healthz

---

## Tests

### Exécution des tests

```bash
# Mode watch (par défaut)
npm test

# Exécution unique
npm test -- --run

# Interface graphique
npm run test:ui

# Avec couverture de code
npm run test:coverage
```

### Structure des tests

- **`app/models.test.ts`** : Tests unitaires pour les modèles
  - Clonage des livres
  - Validation des propriétés
  - Indépendance des clones

- **`app/services.test.ts`** : Tests unitaires pour les services
  - `getBooks()` : Récupération des livres
  - `getHealthStatus()` : Règle Trekkie odd-even
  - `formatRating()` : Formatage des notes
  - `loadWorkshopGoalsHTML()` : Chargement et cache du README

- **`app/server.test.ts`** : Tests d'intégration pour les routes
  - `GET /api/healthz` : Endpoint de santé
  - `GET /api/books` : Endpoint des livres

### Écriture de nouveaux tests

1. Créer un fichier `*.test.ts` dans le même répertoire que le fichier source
2. Importer les fonctions à tester
3. Utiliser les fonctions de Vitest : `describe`, `it`, `expect`
4. Pour mocker Date, utiliser `vi.spyOn(global, "Date")`

Exemple :
```typescript
import { describe, it, expect, vi } from "vitest";
import { getHealthStatus } from "./services.js";

describe("getHealthStatus", () => {
  it("devrait retourner GOOD pour les secondes paires", () => {
    const mockDate = new Date("2024-01-01T12:00:10.000Z");
    vi.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    vi.spyOn(mockDate, "getSeconds").mockReturnValue(10);
    
    expect(getHealthStatus()).toBe("GOOD");
    vi.restoreAllMocks();
  });
});
```

---

## Structure du code

### `app/models.ts`

- **`Book`** : Interface TypeScript définissant la structure d'un livre
- **`cloneBooks()`** : Retourne une copie indépendante de la liste des livres

**Points d'attention** :
- Les livres sont clonés pour éviter les mutations accidentelles
- Les données sont hardcodées dans `seededBooks`

### `app/services.ts`

- **`getBooks()`** : Retourne la liste des livres
- **`getHealthStatus()`** : Retourne `GOOD` ou `BAD` selon la règle Trekkie
- **`formatRating(rating: number)`** : Formate une note avec une décimale et une étoile
- **`loadWorkshopGoalsHTML(basePath: string)`** : Charge et parse le README.md

**Points d'attention** :
- `loadWorkshopGoalsHTML` utilise un cache global (`workshopHTML`)
- Le cache n'est pas réinitialisable facilement (conception intentionnelle)
- `getHealthStatus` dépend de `new Date().getSeconds()` (utiliser des mocks en test)

### `app/server.ts`

- Configuration Express
- Configuration Nunjucks
- Routes :
  - `GET /` : Page d'accueil
  - `GET /books` : Page des livres
  - `GET /api/books` : API JSON des livres
  - `GET /api/healthz` : Health check

**Points d'attention** :
- Le port est configurable via `process.env.PORT`
- Les fichiers statiques sont servis depuis `/static`
- `formatRating` est disponible comme fonction globale et filtre Nunjucks

### Templates Nunjucks

- **`base.njk`** : Template de base avec header et footer
- **`index.njk`** : Page d'accueil
- **`books.njk`** : Page de liste des livres

**Variables globales disponibles** :
- `formatRating(rating)` : Formate une note
- `currentYear` : Année actuelle

---

## Déploiement

### Build

L'application n'a pas besoin de build (utilise `tsx` directement), mais pour une production optimisée :

1. Compiler TypeScript :
```bash
tsc
```

2. Copier les fichiers statiques et templates dans `dist/`

3. Démarrer avec Node.js :
```bash
node dist/server.js
```

### Variables d'environnement recommandées

```bash
PORT=8082
NODE_ENV=production
```

### Docker (exemple)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8082
CMD ["npm", "start"]
```

---

## Dépannage

### Le serveur ne démarre pas

1. Vérifier que le port n'est pas déjà utilisé :
```bash
lsof -i :8082
```

2. Vérifier les dépendances :
```bash
npm install
```

3. Vérifier les erreurs TypeScript :
```bash
npx tsc --noEmit
```

### Les tests échouent

1. Vérifier que les mocks sont correctement restaurés :
```typescript
vi.restoreAllMocks(); // À la fin de chaque test
```

2. Pour les tests de `loadWorkshopGoalsHTML`, le cache peut persister. Utiliser `vi.resetModules()` et réimporter si nécessaire.

3. Pour les tests de `getHealthStatus`, toujours mocker `Date` et `getSeconds()`.

### Le cache du README ne se met pas à jour

Le cache est intentionnel et persiste pendant toute la durée de vie du processus. Pour le réinitialiser :

1. Redémarrer le serveur
2. Ou modifier `services.ts` pour ajouter une fonction de réinitialisation (non recommandé en production)

### Erreurs de modules ES

Assurez-vous que :
- `package.json` contient `"type": "module"`
- Les imports utilisent `.js` même pour les fichiers `.ts` (requis par TypeScript avec NodeNext)
- `tsconfig.json` utilise `"module": "NodeNext"`

---

## Bonnes pratiques

### Ajout de nouvelles fonctionnalités

1. **Écrire les tests d'abord** (TDD) :
   - Créer les tests dans `*.test.ts`
   - Implémenter la fonctionnalité
   - Vérifier que tous les tests passent

2. **Respecter la séparation des responsabilités** :
   - `models.ts` : Données
   - `services.ts` : Logique métier
   - `server.ts` : Routes et configuration

3. **Documenter les fonctions complexes** :
```typescript
/**
 * Retourne GOOD pour les secondes paires, BAD pour les impaires
 * (Règle Trekkie odd-even)
 */
export function getHealthStatus(): string {
  // ...
}
```

### Modification des données

- Les livres sont dans `app/models.ts` dans `seededBooks`
- Toujours utiliser `cloneBooks()` pour éviter les mutations
- Pour ajouter un livre, modifier `seededBooks` et mettre à jour les tests si nécessaire

### Modification des templates

- Utiliser les variables globales Nunjucks (`formatRating`, `currentYear`)
- Respecter la structure de `base.njk`
- Tester visuellement après chaque modification

### Gestion des erreurs

- L'application utilise Express pour la gestion des erreurs HTTP
- `loadWorkshopGoalsHTML` retourne un message d'erreur HTML si le README n'est pas trouvé
- Ajouter une gestion d'erreur plus robuste si nécessaire

### Performance

- Le cache du README évite les lectures répétées du fichier
- Les fichiers statiques sont servis directement par Express
- Pour la production, considérer l'ajout de :
  - Compression (gzip)
  - Cache HTTP headers
  - Rate limiting

---

## Ressources utiles

- [Documentation Express](https://expressjs.com/)
- [Documentation Nunjucks](https://mozilla.github.io/nunjucks/)
- [Documentation Vitest](https://vitest.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

---

## Contact et contribution

Pour toute question ou contribution, référez-vous au `README.md` principal et aux guidelines du projet.

**Dernière mise à jour** : 2025
