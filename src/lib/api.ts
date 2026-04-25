/**
 * Centro Satori — API client.
 *
 * Apunta al backend Express+Prisma desplegado en la Oracle VM.
 * Configura `VITE_API_URL` en `.env` (ej: https://satori.co-kizuna.com).
 * Si no hay backend disponible aún, la calculadora de comisiones funciona
 * en modo local (ver useCommissionCalculator).
 */

const API_URL = import.meta.env.VITE_API_URL ?? "";

const TOKEN_KEY = "satori_token";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, auth: needsAuth = false, headers, ...rest } = opts;

  if (!API_URL) {
    throw new ApiError(
      "Backend no configurado. Define VITE_API_URL en tu entorno.",
      0,
      null,
    );
  }

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (needsAuth) {
    const token = auth.getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (typeof data === "object" && data && "error" in data && String((data as { error: unknown }).error)) ||
      `Error ${res.status}`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}

// ─── Endpoints tipados ──────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  rut?: string;
  empresa?: string;
  region?: string;
  phone?: string;
}

export interface Adjudication {
  id: string;
  contractNumber: string;
  contractName: string;
  buyerOrg: string;
  adjudicatedAt: string;
  contractAmount: string | number;
  commissionRate: string | number;
  commissionAmount: string | number;
  paymentStatus: "pending" | "invoiced" | "paid" | "disputed";
  flowToken?: string | null;
  invoicedAt?: string | null;
  paidAt?: string | null;
  verified: boolean;
  verificationUrl?: string | null;
  createdAt: string;
}

export interface AdjudicationsSummary {
  totalContracts: number;
  totalAdjudicated: number;
  totalCommissions: number;
  pendingPayments: number;
}

export const apiAuth = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    rut?: string;
    empresa?: string;
    region?: string;
    phone?: string;
  }) =>
    api<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload: { email: string; password: string }) =>
    api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: payload,
    }),

  me: () => api<{ user: User }>("/api/auth/me", { auth: true }),
};

export const apiAdjudications = {
  list: () =>
    api<{ adjudications: Adjudication[]; summary: AdjudicationsSummary }>(
      "/api/adjudications/my",
      { auth: true },
    ),

  declare: (payload: {
    contractNumber: string;
    contractName: string;
    buyerOrg: string;
    adjudicatedAt: string;
    contractAmount: number;
  }) =>
    api<{
      adjudication: Adjudication;
      commission: { rate: number; commissionCLP: number; bracketLabel: string };
      message: string;
    }>("/api/adjudications/declare", {
      method: "POST",
      body: payload,
      auth: true,
    }),
};

export interface CommissionResult {
  rate: number;
  commissionCLP: number;
  bracketLabel: string;
  formattedCommission: string;
  formattedAmount: string;
}

export const apiCommission = {
  calculate: (amount: number) =>
    api<CommissionResult>(`/api/commission/calculator?amount=${amount}`),
};
