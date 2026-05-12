# Cahier des Charges — Site Web Vendeur de Motos d'Occasion

**Version :** 1.0  
**Date :** Avril 2026  
**Statut :** Brouillon

---

## 1. Présentation du Projet

### 1.1 Contexte

Un vendeur indépendant de motos d'occasion souhaite se doter d'un site web vitrine et e-commerce léger pour :

- Présenter et vendre ses motos d'occasion (environ une dizaine en stock)
- Proposer ses services annexes (pose de stickers, vente en dépôt-vente contre rémunération)
- Gérer son activité via un espace administrateur privé

### 1.2 Objectifs

- Maximiser la visibilité en ligne grâce à un bon référencement naturel (SEO)
- Offrir une expérience utilisateur fluide et moderne aux acheteurs potentiels
- Permettre à l'administrateur de gérer son catalogue et ses statistiques en toute autonomie

---

## 2. Périmètre Fonctionnel

### 2.1 Partie Publique (Visiteurs)

#### Catalogue de motos
- Liste des motos disponibles avec photo principale, marque, modèle, année, kilométrage et prix
- Page détail de chaque moto (galerie photos, description complète, caractéristiques techniques)
- Filtres de recherche : marque, type, fourchette de prix, kilométrage
- Badge "Vendu" sur les motos déjà vendues (non retirées du catalogue)

#### Services
- Page dédiée aux services proposés :
  - Pose de stickers (personnalisation)
  - Vente en dépôt-vente (vente à leur place contre rémunération)
- Description, tarifs indicatifs, et appel à l'action (contact)

#### Blog
- Liste des articles de blog
- Page article individuelle (titre, contenu, date, image)
- Optimisé pour le SEO (balises meta, Open Graph)

#### Contact
- Formulaire de contact (nom, e-mail, message, moto concernée optionnelle)
- Informations de contact (téléphone, localisation, réseaux sociaux)

#### SEO & Performance
- Balises `meta title` et `meta description` uniques par page
- Données structurées Schema.org pour les véhicules (Product, Vehicle)
- Sitemap XML généré automatiquement
- Pages rapides (Core Web Vitals optimisés)
- URLs propres et lisibles (`/motos/honda-cb500-2020`)

---

### 2.2 Partie Administration (Admin uniquement)

#### Authentification
- Login sécurisé par email + mot de passe
- Un seul compte administrateur (pas d'inscription publique)
- JWT avec refresh token
- Session persistante avec déconnexion manuelle

#### Dashboard Principal
- Vue d'ensemble avec les métriques clés :
  - Nombre total de motos en stock / vendues
  - Clics totaux sur les motos (7 derniers jours, 30 jours)
  - Graphique d'évolution du trafic par moto
  - Motos les plus consultées
  - Articles de blog les plus lus

#### Gestion du Catalogue Motos
- Ajouter une moto (formulaire complet avec upload photos multiples)
- Modifier une fiche moto
- Marquer une moto comme "Vendue" (sans suppression)
- Supprimer une moto définitivement
- Réordonner les motos dans la liste

#### Gestion des Services
- Ajouter / modifier / supprimer un service
- Activer ou désactiver un service (visible ou non publiquement)

#### Gestion du Blog
- Éditeur WYSIWYG (rich text) pour les articles
- Ajouter / modifier / supprimer un article
- Publier ou mettre en brouillon un article
- Upload d'image de couverture

#### Statistiques & Analytics
- Graphiques de visites par moto (courbe sur 7 / 30 / 90 jours)
- Classement des motos par nombre de clics
- Nombre de messages reçus via le formulaire de contact
- Export CSV des données (optionnel, v2)

---

## 3. Stack Technique

### 3.1 Frontend — Next.js

| Élément | Choix |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Composants UI | shadcn/ui ou Radix UI |
| Gestion d'état | Zustand ou React Query (TanStack) |
| Formulaires | React Hook Form + Zod |
| Graphiques (dashboard) | Recharts ou Chart.js |
| Éditeur blog | TipTap ou React Quill |
| SEO | Next.js Metadata API + next-sitemap |

### 3.2 Backend — NestJS

| Élément | Choix |
|---|---|
| Framework | NestJS 10+ |
| Langage | TypeScript |
| ORM | Prisma |
| Base de données | PostgreSQL |
| Auth | JWT (access + refresh token) |
| Upload fichiers | Multer + Cloudinary (ou S3) |
| Validation | class-validator + class-transformer |
| Documentation API | Swagger (NestJS Swagger) |

### 3.3 Infrastructure

| Élément | Choix recommandé |
|---|---|
| Hébergement frontend | Vercel |
| Hébergement backend | Railway ou Render |
| Base de données | Supabase (PostgreSQL managé) ou Railway |
| Stockage images | Cloudinary (free tier suffisant) |
| Nom de domaine | À définir |

---

## 4. Architecture Technique

```
┌─────────────────────┐        ┌──────────────────────┐
│   Next.js Frontend  │ ──────▶│   NestJS API REST     │
│   (Vercel)          │        │   (Railway/Render)    │
└─────────────────────┘        └──────────┬───────────┘
                                           │
                              ┌────────────▼───────────┐
                              │   PostgreSQL (Supabase) │
                              └────────────────────────┘
                                           │
                              ┌────────────▼───────────┐
                              │   Cloudinary (images)   │
                              └────────────────────────┘
```

---

## 5. Modèle de Données (simplifié)

### Moto
```
id, slug, marque, modele, annee, kilometrage, prix, description,
statut (disponible | vendu), images[], vues, createdAt, updatedAt
```

### Service
```
id, titre, description, prix_indicatif, image, actif, ordre, createdAt
```

### Article (Blog)
```
id, titre, slug, contenu, image_couverture, statut (publié | brouillon),
meta_title, meta_description, createdAt, updatedAt
```

### Admin
```
id, email, mot_de_passe_hash, createdAt
```

### Vue (Analytics)
```
id, moto_id, date, count
```

---

## 6. Pages et Routes

### Frontend Public

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/motos` | Catalogue complet |
| `/motos/[slug]` | Fiche moto |
| `/services` | Page services |
| `/blog` | Liste des articles |
| `/blog/[slug]` | Article de blog |
| `/contact` | Page contact |

### Frontend Admin

| Route | Description |
|---|---|
| `/admin/login` | Connexion admin |
| `/admin/dashboard` | Tableau de bord |
| `/admin/motos` | Gestion du catalogue |
| `/admin/motos/nouvelle` | Ajouter une moto |
| `/admin/motos/[id]/edit` | Modifier une moto |
| `/admin/services` | Gestion des services |
| `/admin/blog` | Gestion des articles |
| `/admin/blog/nouveau` | Nouvel article |
| `/admin/stats` | Statistiques détaillées |

### API Backend (NestJS)

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/motos` | Liste des motos |
| GET | `/api/motos/:slug` | Détail moto + incrément vue |
| POST | `/api/motos` | Créer une moto (auth) |
| PATCH | `/api/motos/:id` | Modifier une moto (auth) |
| DELETE | `/api/motos/:id` | Supprimer une moto (auth) |
| GET | `/api/services` | Liste des services |
| POST | `/api/services` | Créer un service (auth) |
| GET | `/api/blog` | Liste des articles |
| GET | `/api/blog/:slug` | Détail article |
| POST | `/api/blog` | Créer un article (auth) |
| POST | `/api/auth/login` | Connexion admin |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/stats/motos` | Stats clics (auth) |
| POST | `/api/contact` | Envoyer message contact |

---

## 7. Sécurité

- Authentification JWT avec access token (15 min) + refresh token (7 jours)
- Route guards NestJS sur toutes les routes admin
- Middleware de protection Next.js pour `/admin/*`
- Validation stricte de toutes les entrées (Zod côté Next.js, class-validator côté NestJS)
- Upload sécurisé : types MIME vérifiés, taille limitée (5 Mo par image)
- Variables d'environnement pour tous les secrets (JWT secret, DB URL, etc.)
- CORS configuré pour n'autoriser que le domaine frontend
- Rate limiting sur les routes sensibles (login, contact)

---

## 8. SEO — Stratégie

- Chaque page moto : title unique `[Marque] [Modèle] [Année] à vendre — [Nom du site]`
- Meta description générée automatiquement depuis la description
- Open Graph & Twitter Cards pour le partage sur les réseaux
- Schema.org `Vehicle` + `Product` sur les fiches motos
- `robots.txt` et `sitemap.xml` automatiques via `next-sitemap`
- Temps de chargement < 2s (images optimisées via `next/image` + Cloudinary)
- URLs en minuscules, sans caractères spéciaux, avec tirets

---

## 9. Phases de Développement

### Phase 1 — Fondations (Semaine 1-2)
- Mise en place du projet NestJS + Next.js
- Configuration base de données (Prisma + PostgreSQL)
- Système d'authentification admin (login, JWT, guards)
- Déploiement des environnements (dev / prod)

### Phase 2 — Catalogue & Services (Semaine 3-4)
- API CRUD motos et services
- Pages publiques : accueil, catalogue, fiche moto, services
- Upload et gestion des images (Cloudinary)
- Interface admin : gestion des motos et services

### Phase 3 — Blog & Contact (Semaine 5)
- API blog (articles)
- Pages publiques blog + formulaire de contact
- Interface admin : éditeur d'articles

### Phase 4 — Analytics & Dashboard (Semaine 6)
- Système de tracking des vues par moto
- Dashboard admin avec graphiques
- Optimisations SEO finales (sitemap, meta, Schema.org)

### Phase 5 — Tests & Lancement (Semaine 7)
- Tests end-to-end (Playwright ou Cypress)
- Audit de performance (Lighthouse)
- Audit SEO
- Mise en production

---

## 10. Livrables

- [ ] Code source versionné (GitHub)
- [ ] Documentation API (Swagger)
- [ ] Guide de déploiement
- [ ] Guide d'utilisation du dashboard admin
- [ ] Site en production avec domaine configuré

---

## 11. Points Ouverts (à préciser)

- Nom du site / de la marque
- Charte graphique (couleurs, logo, typographie) — maquettes à fournir
- Langue du site (français uniquement ?)
- Intégration d'un système de prise de contact par WhatsApp ?
- Gestion des cookies / RGPD (bandeau de consentement)
- Intégration Google Analytics ou solution analytics propre (Plausible, Umami) ?

---

*Document rédigé sur la base du brief initial — à mettre à jour après réception des maquettes.*
