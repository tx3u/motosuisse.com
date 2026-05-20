/**
 * @file api.ts
 * Centralised HTTP client and TypeScript types for every backend endpoint.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Domain types ────────────────────────────────────────────────────────────

export interface Moto {
  id: number;
  slug: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
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

export interface PaginatedMotos {
  data: Moto[];
  total: number;
  page: number;
  limit: number;
}

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

export type UpdateMotoPayload = Partial<CreateMotoPayload>;

export interface Service {
  id: number;
  titre: string;
  description: string;
  prix_indicatif: string | null;
  image: string | null;
  actif: boolean;
  ordre: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  titre: string;
  description: string;
  prix_indicatif?: number;
  actif?: boolean;
  ordre?: number;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

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

export interface CreateReviewPayload {
  nom: string;
  ville?: string;
  moto?: string;
  note: number;
  texte: string;
}

export interface ArticleSummary {
  id: number;
  titre: string;
  slug: string;
  image_couverture: string | null;
  statut: "publie" | "brouillon";
  createdAt: string;
}

export interface Article extends ArticleSummary {
  contenu: string;
  meta_title: string | null;
  meta_description: string | null;
  updatedAt: string;
}

export interface CreateArticlePayload {
  titre: string;
  contenu: string;
  image_couverture?: string;
  statut?: "publie" | "brouillon";
  meta_title?: string;
  meta_description?: string;
}

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

let _accessToken: string | null = null;

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

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── API client ───────────────────────────────────────────────────────────────

export const api = {
  motos: {
    list: (filters: FilterMotos = {}) => {
      const params = new URLSearchParams();
      (Object.entries(filters) as [string, string | number | undefined][]).forEach(
        ([k, v]) => { if (v !== undefined) params.set(k, String(v)); },
      );
      const qs = params.toString();
      return request<PaginatedMotos>(`/api/motos${qs ? `?${qs}` : ""}`);
    },

    get: (slug: string) => request<Moto>(`/api/motos/${slug}`),

    getAdmin: (slug: string) =>
      request<Moto>(`/api/motos/admin/${slug}`, { headers: authHeaders() }),

    removeImage: (id: number, url: string) =>
      request<Moto>(`/api/motos/${id}/images`, {
        method: "DELETE",
        body: JSON.stringify({ url }),
        headers: authHeaders(),
      }),

    create: (data: CreateMotoPayload) =>
      request<Moto>("/api/motos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    addImage: async (id: number, file: File): Promise<Moto> => {
      const form = new FormData();
      form.append("file", file);
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/motos/${id}/images`, {
          method: "POST",
          headers: authHeaders(),
          credentials: "include",
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

    update: (id: number, data: UpdateMotoPayload) =>
      request<Moto>(`/api/motos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    delete: (id: number) =>
      request<void>(`/api/motos/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  contact: {
    send: (data: { nom: string; email: string; telephone?: string; sujet?: string; message: string }) =>
      request<{ message: string }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  services: {
    list: () => request<Service[]>("/api/services"),

    create: (data: CreateServicePayload) =>
      request<Service>("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    update: (id: number, data: UpdateServicePayload) =>
      request<Service>(`/api/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    setImage: async (id: number, file: File): Promise<Service> => {
      const form = new FormData();
      form.append("file", file);
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/services/${id}/image`, {
          method: "POST",
          headers: authHeaders(),
          credentials: "include",
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

    removeImage: (id: number) =>
      request<Service>(`/api/services/${id}/image`, {
        method: "DELETE",
        headers: authHeaders(),
      }),

    delete: (id: number) =>
      request<void>(`/api/services/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  auth: {
    login: (email: string, password: string) =>
      request<{ accessToken: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    refresh: () =>
      request<{ accessToken: string }>("/api/auth/refresh", { method: "POST" }),

    logout: () =>
      request<{ message: string }>("/api/auth/logout", { method: "POST" }),

    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ message: string }>("/api/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: authHeaders(),
      }),
  },

  reviews: {
    listVisible: () => request<Review[]>("/api/reviews"),

    listAll: () => request<Review[]>("/api/reviews/admin", { headers: authHeaders() }),

    create: (data: CreateReviewPayload) =>
      request<Review>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    toggleVisibility: (id: number) =>
      request<Review>(`/api/reviews/${id}/visibility`, {
        method: "PATCH",
        headers: authHeaders(),
      }),

    delete: (id: number) =>
      request<{ message: string }>(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  messages: {
    list: () =>
      request<ContactMessage[]>("/api/contact", { headers: authHeaders() }),

    markAsRead: (id: number) =>
      request<ContactMessage>(`/api/contact/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      }),

    delete: (id: number) =>
      request<{ message: string }>(`/api/contact/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  articles: {
    listPublic: () =>
      request<ArticleSummary[]>("/api/articles"),

    list: () =>
      request<ArticleSummary[]>("/api/articles/admin", { headers: authHeaders() }),

    get: (slug: string) =>
      request<Article>(`/api/articles/${slug}`),

    getById: (id: number) =>
      request<Article>(`/api/articles/admin/${id}`, { headers: authHeaders() }),

    create: (data: CreateArticlePayload) =>
      request<Article>("/api/articles", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    update: (id: number, data: Partial<CreateArticlePayload>) =>
      request<Article>(`/api/articles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    delete: (id: number) =>
      request<void>(`/api/articles/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },

  stats: {
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

    views: (motoId?: number) =>
      request<{ date: string; _sum: { count: number | null } }[]>(
        `/api/stats/views${motoId ? `?motoId=${motoId}` : ""}`,
        { headers: authHeaders() },
      ),
  },

  admin: {
    authHeaders,
    getAccessToken,

    saveTokens: (accessToken: string) => {
      _accessToken = accessToken;
      const secure =
        typeof window !== "undefined" && window.location.protocol === "https:"
          ? "; Secure"
          : "";
      document.cookie = `admin_session=1; path=/; SameSite=Strict; max-age=86400${secure}`;
    },

    clearTokens: () => {
      _accessToken = null;
      document.cookie = "admin_session=; path=/; SameSite=Strict; max-age=0";
    },
  },
};
