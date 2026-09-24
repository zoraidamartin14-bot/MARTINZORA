export async function apiFetch(endpoint: string, getToken: () => Promise<string | null>, options: RequestInit = {}) {
  const token = await getToken();
  if (!token) {
    throw new Error('User is not authenticated');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
