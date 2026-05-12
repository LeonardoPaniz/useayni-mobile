// Para desenvolvimento local:
// No PC (web): http://localhost:3333
// No Android emulator: http://10.0.2.2:3333
// No iPhone real: http://<seu-ip-pc>:3333 (ex: http://192.168.1.100:3333)

const defaultBaseUrl =
  typeof document !== "undefined"
    ? "http://localhost:3333"
    : "http://10.0.2.2:3333"; // Android emulator

// Para usar no iPhone real, defina a variável de ambiente:
// EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3333
const BACKEND_URL = 
  process.env.EXPO_PUBLIC_BACKEND_URL || 
  process.env.BACKEND_URL || 
  defaultBaseUrl;

async function request(path, body) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message || payload?.error || `Erro ${response.status}`;
    throw new Error(message || "Erro de comunicação com o servidor.");
  }

  return payload;
}

export const authService = {
  async login(credentials) {
    return request("/auth/login", credentials);
  },

  async signUp(data) {
    return request("/members", data);
  },
};
