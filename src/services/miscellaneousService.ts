import { BACKEND_URL } from './authService';

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, token: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json() as Promise<T>;
}

export interface MiscSummary {
  id: string;
  title: string;
  type: string;
  status: string;
  visibility: string;
  start_date: string;
  cover_url?: string;
}

export const miscellaneousService = {
  async list(token: string, filters: { myRole?: string; page?: number } = {}) {
    const params = new URLSearchParams();
    if (filters.myRole) params.set('myRole', filters.myRole);
    if (filters.page) params.set('page', String(filters.page));
    params.set('limit', '20');
    return get<{ data: MiscSummary[]; total: number }>(`/miscellaneous?${params}`, token);
  },

  async getById(id: string, token: string) {
    return get<MiscSummary & Record<string, unknown>>(`/miscellaneous/${id}`, token);
  },

  async getMyInvites(token: string) {
    return get<unknown[]>('/invites/mine', token);
  },

  async acceptInvite(miscId: string, inviteId: string, token: string) {
    return patch(`/miscellaneous/${miscId}/invites/${inviteId}/accept`, token);
  },

  async rejectInvite(miscId: string, inviteId: string, token: string) {
    return patch(`/miscellaneous/${miscId}/invites/${inviteId}/reject`, token);
  },

  async getAttendanceToken(sessionId: string, token: string) {
    return get<{ token: string; expires_at: string }>(`/attendance-sessions/${sessionId}/token`, token);
  },
};
