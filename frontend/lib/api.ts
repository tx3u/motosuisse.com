/**
 * @file api.ts
 * Centralised HTTP client and TypeScript types for every backend endpoint.
 *
 * All requests go through the {@link request} helper which provides uniform
 * error normalisation.  Authenticated requests attach a JWT Bearer token via
 * {@link authHeaders}.  Token lifecycle (expiry check, storage) is handled by
 * {@link getAccessToken} and {@link api.admin}.
 *
 * NOTE — Token storage:
 * The access token (15 min) lives only in memory (`_accessToken` variable).
 * The refresh token (7 days) is stored in an HttpOnly cookie set by the backend,
 * making it inaccessible to JavaScript even under XSS.  All fetch calls use
 * `credentials: 'include'` so the browser sends that cookie automatically.
 */

/** Base URL of the NestJS backend, injected at build time. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Domain types ────────────────────────────────────────────────────────────

/** A motorcycle listing as returned by the backend. */
export interface Moto {
  id: number;
  slug: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  /** Asking price in CHF. Serialised as a string by Prisma (Decimal type). */
  prix: string;
  description: string | null;
  cylindree: string | null;
  puissance: string | null;
  type: string | null;
  featured: boolean;
  statut: "disponible" | "vendu";
  images: string[];
  createdAt: string;
  updatedAt: string;
}

/** Paginated response wrapper for motorcycle listings. */
export interface PaginatedMotos {
  data: Moto[];
  total: number;
  page: number;
  limit: number;
}

/** Query-string filters accepted by the catalogue endpoint. */
export interface FilterMotos {
  marque?: string;
  prix_min?: number;
  prix_max?: number;
  kilometrage_max?: number;
  statut?: "disponible" | "vendu";
  featured?: boolean;
  page?: number;
  limit?: number;
}

/** Payload to create a new motorcycle listing. */
export interface CreateMotoPayload {
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  prix: number;
  description?: string;
  cylindree?: string;
  puissance?: string;
  type?: string;
  featured?: boolean;
  statut?: "disponible" | "vendu";
}

/** Partial update payload for an existing motorcycle listing. */
export type UpdateMotoPayload = Partial<CreateMotoPayload>;

/** A dealership service offering as returned by the backend. */
export interface Service {
  id: number;
  titre: string;
  description: string;
  /** Indicative price in CHF. Serialised as a string by Prisma (Decimal type). */
  prix_indicatif: string | null;
  image: string | null;
  actif: boolean;
  ordre: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload to create a new service offering. */
export interface CreateServicePayload {
  titre: string;
  description: string;
  prix_indicatif?: number;
  actif?: boolean;
  ordre?: number;
}

/** Partial update payload for an existing service offering. */
export type UpdateServicePayload = Partial<CreateServicePayload>;

/** A customer review as returned by the backend. */
export interface Review {
  id: number;
  nom: string;
  ville: string | null;
  moto: string | null;
  note: number;
  texte: string;
  visible: boolean;
  createdAt: string;
}

/** Payload to create a new customer review. */
export interface CreateReviewPayload {
  nom: string;
  ville?: string;
  moto?: string;
  note: number;
  texte: string;
}

/** Summary of a blog article as returned by the list endpoints. */
export interface ArticleSummary {
  id: number;
  titre: string;
  slug: string;
  image_couverture: string | null;
  statut: "publie" | "brouillon";
  createdAt: string;
}

/** Full article including content, returned by the detail endpoint. */
export interface Article extends ArticleSummary {
  contenu: string;
  meta_title: string | null;
  meta_description: string | null;
  updatedAt: string;
}

/** Payload to create or update a blog article. */
export interface CreateArticlePayload {
  titre: string;
  contenu: string;
  image_couverture?: string;
  statut?: "publie" | "brouillon";
  meta_title?: string;
  meta_description?: string;
}

/** An inbound contact form submission as returned by the backend. */
export interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string | null;
  message: string;
  lu: boolean;
  createdAt: string;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

/**
 * Generic fetch wrapper used by all API methods.
 *
 * Automatically sets `Content-Type: application/json` and normalises HTTP
 * error responses into thrown `Error` instances so callers only need to
 * catch a single error type.
 *
 * Network failures (no connection, DNS, etc.) are caught and re-thrown with
 * a user-friendly French message.
 *
 * @template T - Expected shape of the successful response body.
 * @param path - Backend path starting with `/api/...`.
 * @param init - Optional `RequestInit` options (method, headers, body, …).
 * @returns Parsed JSON response cast to `T`.
 * @throws {Error} On network failure or non-2xx HTTP status.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: initHeaders, ...restInit } = init ?? {};

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...initHeaders },
      ...restInit,
    });
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Erreur ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * In-memory access token store. Lives only for the duration of the page
 * session — cleared on refresh, tab close, or explicit logout. Never written
 * to localStorage or any other persistent storage, so XSS cannot exfiltrate
 * it across sessions. The HttpOnly refresh cookie re-hydrates this variable
 * transparently whenever the page reloads (see admin layout.tsx).
 */
let _accessToken: string | null = null;

/**
 * Returns the current in-memory access token if it exists and is not expired.
 * Returns `null` in SSR contexts (the variable is never set server-side).
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined" || !_accessToken) return null;
  try {
    const { exp } = JSON.parse(atob(_accessToken.split(".")[1]));
    if (typeof exp === "number" && Date.now() >= exp * 1000) {
      _accessToken = null;
      return null;
    }
  } catch {
    _accessToken = null;
    return null;
  }
  return _accessToken;
}

/**
 * Builds the `Authorization: Bearer <token>` header for authenticated requests.
 * Returns an empty object if no valid token is available, which will cause
 * the backend to return 401.
 */
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── API client ───────────────────────────────────────────────────────────────

/**
 * Centralised API client.  Group methods by resource to keep call sites
 * readable (`api.motos.list()`, `api.reviews.create(…)`, etc.).
 */
export const api = {
  /** Motorcycle catalogue endpoints. */
  motos: {
    /**
     * Returns a paginated list of motorcycles, optionally filtered.
     * @param filters - Optional filter and pagination parameters.
     */
    list: (filters: FilterMotos = {}) => {
      const params = new URLSearchParams();
      (Object.entries(filters) as [string, string | number | undefined][]).forEach(
        ([k, v]) => { if (v !== undefined) params.set(k, String(v)); },
      );
      const qs = params.toString();
      return request<PaginatedMotos>(`/api/motos${qs ? `?${qs}` : ""}`);
    },

    /**
     * Returns a single motorcycle by slug and records a page view on the backend.
     * Use only on the public moto detail page — not in the admin edit form.
     * @param slug - URL-safe identifier (e.g. "honda-cb500f-2020").
     */
    get: (slug: string) => request<Moto>(`/api/motos/${slug}`),

    /**
     * Returns a single motorcycle by slug WITHOUT incrementing the view counter.
     * Use in admin edit forms to avoid polluting analytics.
     * Requires admin auth.
     */
    getAdmin: (slug: string) =>
      request<Moto>(`/api/motos/admin/${slug}`, { headers: authHeaders() }),

    /**
     * Removes one image URL from the listing and deletes it from Cloudinary.
     * Requires admin auth.
     * @param id  - Listing primary key.
     * @param url - Full Cloudinary URL of the image to remove.
     */
    removeImage: (id: number, url: string) =>
      request<Moto>(`/api/motos/${id}/images`, {
        method: "DELETE",
        body: JSON.stringify({ url }),
        headers: authHeaders(),
      }),

    /**
     * Creates a new motorcycle listing. Requires admin auth.
     * @param data - Creation payload.
     */
    create: (data: CreateMotoPayload) =>
      request<Moto>("/api/motos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /**
     * Uploads an image and appends its URL to the listing. Requires admin auth.
     * Uses raw `fetch` (not `request`) because multipart bodies must not have
     * a `Content-Type` header set manually — the browser sets it with the boundary.
     *
     * @param id   - Listing primary key.
     * @param file - Image file from an `<input type="file">`.
     */
    addImage: async (id: number, file: File): Promise<Moto> => {
      const form = new FormData();
      form.append("file", file);
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/motos/${id}/images`, {
          method: "POST",
          headers: authHeaders(),
          body: form,
        });
      } catch {
        throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Erreur ${res.status}`);
      }
      return res.json();
    },

    /**
     * Partially updates a motorcycle listing. Requires admin auth.
     * @param id   - Listing primary key.
     * @param data - Fields to update.
     */
    update: (id: number, data: UpdateMotoPayload) =>
      request<Moto>(`/api/motos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /**
     * Permanently deletes a motorcycle listing. Requires admin auth.
     * @param id - Listing primary key.
     */
    delete: (id: number) =>
      request<void>(`/api/motos/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  /** Public contact form endpoint. */
  contact: {
    /**
     * Submits a contact form message. Persisted to DB; email notification
     * is sent if MAIL_HOST is configured on the backend.
     */
    send: (data: { nom: string; email: string; telephone?: string; sujet?: string; message: string }) =>
      request<{ message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  /** Service offerings endpoints. */
  services: {
    /** Returns all services (active and inactive). */
    list: () => request<Service[]>("/api/services"),

    /**
     * Creates a new service offering. Requires admin auth.
     * @param data - Creation payload.
     */
    create: (data: CreateServicePayload) =>
      request<Service>("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /**
     * Partially updates a service offering. Requires admin auth.
     * @param id   - Service primary key.
     * @param data - Fields to update.
     */
    update: (id: number, data: UpdateServicePayload) =>
      request<Service>(`/api/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /**
     * Permanently deletes a service offering. Requires admin auth.
     * @param id - Service primary key.
     */
    delete: (id: number) =>
      request<void>(`/api/services/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  /** Authentication endpoints. */
  auth: {
    /**
     * Authenticates with email + password.
     * Returns the access token in the body; the refresh token is set as an
     * HttpOnly cookie by the backend and never touches JavaScript.
     */
    login: (email: string, password: string) =>
      request<{ accessToken: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    /** Exchanges the HttpOnly refresh cookie for a new access token. */
    refresh: () =>
      request<{ accessToken: string }>("/api/auth/refresh", { method: "POST" }),

    /** Clears the HttpOnly refresh cookie server-side. */
    logout: () =>
      request<{ message: string }>("/api/auth/logout", { method: "POST" }),

    /**
     * Changes the admin password. Requires admin auth.
     * @param currentPassword - Current plain-text password for verification.
     * @param newPassword     - New password (min 8 characters).
     */
    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>("/api/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: authHeaders(),
      }),
  },

  /** Customer review endpoints. */
  reviews: {
    /** Returns visible reviews for the public homepage. */
    listVisible: () => request<Review[]>("/api/reviews"),

    /** Returns all reviews (including hidden ones). Requires admin auth. */
    listAll: () => request<Review[]>("/api/reviews/admin", { headers: authHeaders() }),

    /**
     * Creates a new review. Requires admin auth.
     * @param data - Review payload.
     */
    create: (data: CreateReviewPayload) =>
      request<Review>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /**
     * Toggles a review's visibility on the public homepage. Requires admin auth.
     * @param id - Review primary key.
     */
    toggleVisibility: (id: number) =>
      request<Review>(`/api/reviews/${id}/visibility`, {
        method: "PATCH",
        headers: authHeaders(),
      }),

    /**
     * Permanently deletes a review. Requires admin auth.
     * @param id - Review primary key.
     */
    delete: (id: number) =>
      request<{ message: string }>(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  /** Inbound contact message endpoints (admin only). */
  messages: {
    /** Returns all contact messages ordered by most recent first. */
    list: () =>
      request<ContactMessage[]>("/api/contact", { headers: authHeaders() }),

    /**
     * Marks a contact message as read. Requires admin auth.
     * @param id - Message primary key.
     */
    markAsRead: (id: number) =>
      request<ContactMessage>(`/api/contact/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      }),

    /**
     * Permanently deletes a contact message. Requires admin auth.
     * @param id - Message primary key.
     */
    delete: (id: number) =>
      request<{ message: string }>(`/api/contact/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  /** Blog article endpoints. */
  articles: {
    /** Returns published articles for the public blog. */
    listPublic: () =>
      request<ArticleSummary[]>("/api/articles"),

    /** Returns all articles including drafts. Requires admin auth. */
    list: () =>
      request<ArticleSummary[]>("/api/articles/admin", { headers: authHeaders() }),

    /** Returns a single article by slug (public). */
    get: (slug: string) =>
      request<Article>(`/api/articles/${slug}`),

    /** Returns a single article by ID for admin editing. Requires admin auth. */
    getById: (id: number) =>
      request<Article>(`/api/articles/admin/${id}`, { headers: authHeaders() }),

    /** Creates a new article. Requires admin auth. */
    create: (data: CreateArticlePayload) =>
      request<Article>("/api/articles", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /** Partially updates an article. Requires admin auth. */
    update: (id: number, data: Partial<CreateArticlePayload>) =>
      request<Article>(`/api/articles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    /** Permanently deletes an article. Requires admin auth. */
    delete: (id: number) =>
      request<void>(`/api/articles/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  /** Analytics endpoints (admin only). */
  stats: {
    /**
     * Returns inventory counts and the top-viewed motorcycle listings.
     * Requires admin auth.
     */
    get: () =>
      request<{
        total: number;
        disponibles: number;
        vendues: number;
        topViewed: {
          id: number;
          slug: string;
          marque: string;
          modele: string;
          annee: number;
          _count: { vues: number };
        }[];
      }>("/api/stats", { headers: authHeaders() }),

    /**
     * Returns a daily view-count timeline (last 30 days). Requires admin auth.
     * @param motoId - Optional motorcycle ID to scope the timeline to one listing.
     */
    views: (motoId?: number) =>
      request<{ date: string; _sum: { count: number | null } }[]>(
        `/api/stats/views${motoId ? `?motoId=${motoId}` : ""}`,
        { headers: authHeaders() },
      ),
  },

  /** Admin session management helpers (client-side only). */
  admin: {
    authHeaders,
    getAccessToken,

    /**
     * Stores the access token in memory and sets the `admin_session` cookie
     * used by the Edge proxy for fast redirects. Nothing is written to
     * localStorage — the token is unreachable from other scripts or sessions.
     *
     * @param accessToken - Short-lived access token (15 min).
     */
    saveTokens: (accessToken: string) => {
      _accessToken = accessToken;
      const secure =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? "; Secure"
          : "";
      document.cookie = `admin_session=1; path=/; SameSite=Strict; max-age=86400${secure}`;
    },

    /**
     * Clears the in-memory access token and the session cookie.
     * Call `api.auth.logout()` first to have the backend clear the HttpOnly
     * refresh cookie — that cannot be done from JavaScript.
     */
    clearTokens: () => {
      _accessToken = null;
      document.cookie = "admin_session=; path=/; SameSite=Strict; max-age=0";
    },
  },
};
