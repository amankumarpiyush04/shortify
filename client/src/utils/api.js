const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("shortify_token");

  console.log("API FETCH:", path);
  console.log("TOKEN EXISTS:", Boolean(token));

  const headers = {
    ...(options.headers || {}),
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };

  console.log("AUTH HEADER:", headers.Authorization);

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

export default API_URL;