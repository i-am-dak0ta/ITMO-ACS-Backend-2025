// URL-адреса сервисов — настрой при необходимости
const API_BASE = {
    AUTH: "http://localhost:3000",
    RECIPE: "http://localhost:3001",
    SOCIAL: "http://localhost:3002",
};

// Работа с токеном в localStorage
const TOKEN_KEY = "recipeapp_token";

function saveToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

function readToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
    const token = readToken();
    return token ? { Authorization: "Bearer " + token } : {};
}

// Универсальная функция отправки JSON-запроса
async function sendJsonRequest(url, method = "GET", body = null, extraHeaders = {}) {
    const headers = { "Content-Type": "application/json", ...getAuthHeaders(), ...extraHeaders };
    const options = { method, headers };
    if (body !== null) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const text = await response.text();
    // Try parse JSON, fallback to text
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { ok: response.ok, status: response.status, data };
}
