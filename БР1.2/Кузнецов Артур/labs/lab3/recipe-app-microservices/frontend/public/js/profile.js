// Если нет токена — перекидываем на страницу входа
function requireAuthOrRedirect() {
    const token = readToken();
    if (!token) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

async function loadProfilePage() {
    if (!requireAuthOrRedirect()) return;

    // 1) получить профиль
    const userResp = await sendJsonRequest(`${API_BASE.AUTH}/user/me`, "GET");
    if (!userResp.ok) {
        // токен мог устареть
        saveToken(null);
        window.location.href = "login.html";
        return;
    }
    const user = userResp.data;
    document.getElementById("userFullName").innerText = `${user.first_name} ${user.last_name}`;

    // 2) получить собственные рецепты
    const recipesResp = await sendJsonRequest(`${API_BASE.RECIPE}/recipes/mine`, "GET");
    if (!recipesResp.ok) {
        document.getElementById("recipesContainer").innerText = "Не удалось загрузить рецепты.";
        return;
    }
    renderRecipesList(recipesResp.data || []);
}

function renderRecipesList(recipes) {
    const container = document.getElementById("recipesContainer");
    container.innerHTML = "";
    if (!recipes || recipes.length === 0) {
        container.innerHTML = "<p class='text-muted'>У вас пока нет публикаций.</p>";
        return;
    }
    for (const recipe of recipes) {
        const card = document.createElement("div");
        card.className = "card mb-3";
        card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${escapeHtml(recipe.title)}</h5>
        <p class="card-text"><small class="text-muted">Тип: ${recipe.dishType?.name || "-"} • Сложность: ${recipe.recipeDifficulty?.name || "-"}</small></p>
        <p class="card-text">${escapeHtml((recipe.description || "").slice(0, 200))}</p>
        <a class="btn btn-sm btn-primary" href="recipe.html?id=${recipe.id}">Открыть</a>
      </div>
    `;
        container.appendChild(card);
    }
}

function escapeHtml(input) {
    if (!input) return "";
    return input.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function attachProfileEvents() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) logoutButton.addEventListener("click", () => { saveToken(null); window.location.href = "login.html"; });
}

window.addEventListener("DOMContentLoaded", () => {
    attachProfileEvents();
    if (document.location.pathname.endsWith("profile.html")) {
        loadProfilePage().catch(err => {
            console.error(err);
            saveToken(null);
            window.location.href = "login.html";
        });
    }
});
