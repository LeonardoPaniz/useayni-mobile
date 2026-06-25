// Para desenvolvimento local:
// No PC (web): http://localhost:3333
// No Android emulator: http://10.0.2.2:3333
// No iPhone real: http://<seu-ip-pc>:3333 (ex: http://192.168.1.100:3333)

export const defaultBaseUrl =
  typeof document !== "undefined"
    ? "http://172.20.10.5:3333/api" // Usar o IP do PC para desenvolvimento local
    : "http://172.20.10.5:3333/api"; // Android emulator

// Para usar no iPhone real, defina a variável de ambiente:
// EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3333
export const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  defaultBaseUrl;

type LoginCredentials = {
  personalEmail: string;
  password: string;
  rememberMe?: boolean;
};

type LoginResponse = {
  member: Record<string, any>;
  accessToken: string;
};

type SignUpData = Record<string, any>;

type ApiErrorPayload = { message?: string; error?: string } | null;

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | T
    | ApiErrorPayload;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload;
    const message =
      errorPayload?.message || errorPayload?.error || `Erro ${response.status}`;
    throw new Error(message || "Erro de comunicação com o servidor.");
  }

  return payload as T;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", credentials);
  },

  async signUp(data: SignUpData): Promise<any> {
    return request<any>("/members", data);
  },
};
