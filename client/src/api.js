const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  searchRestaurants: (query) => request(`/restaurants${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  getRestaurant: (id) => request(`/restaurants/${id}`),
  createRestaurant: (payload) => request("/restaurants", { method: "POST", body: payload, auth: true }),
  updateRestaurant: (id, payload) => request(`/restaurants/${id}`, { method: "PUT", body: payload, auth: true }),
};

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
