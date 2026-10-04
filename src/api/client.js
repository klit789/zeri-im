const API = '/api';

function getAdvocateToken() {
  return sessionStorage.getItem('zeri_advocate_token');
}

export async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getAdvocateToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'request_failed');
    err.status = res.status;
    err.code = data.error;
    throw err;
  }
  return data;
}

export function setAdvocateToken(token) {
  if (token) sessionStorage.setItem('zeri_advocate_token', token);
  else sessionStorage.removeItem('zeri_advocate_token');
}

export function fetchPublicStories(params) {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/stories/public?${q}`);
}

export function submitStory(payload) {
  return apiFetch('/stories', { method: 'POST', body: JSON.stringify(payload) });
}

export function supportStory(id) {
  return apiFetch(`/stories/${id}/support`, { method: 'POST' });
}

export function submitReply(storyId, body) {
  return apiFetch(`/stories/${storyId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function advocateLogin(password) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export function fetchAdvocateStories(category) {
  const q = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  return apiFetch(`/stories/advocate/all${q}`);
}

export function markStoryRead(id) {
  return apiFetch(`/stories/advocate/${id}/read`, { method: 'PATCH' });
}

export function setStoryStatus(id, status) {
  return apiFetch(`/stories/advocate/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteStory(id) {
  return apiFetch(`/stories/advocate/${id}`, { method: 'DELETE' });
}
