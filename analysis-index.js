let manifestItems = [];
let enrichedItems = [];

const state = {
    asset: "all",
    market: "all",
    query: "",
    sort: "updated_desc"
};

const els = {
    grid: document.getElementById("cardGrid"),
    empty: document.getElementById("emptyState"),
    search: document.getElementById("searchInput"),
    market: document.getElementById("marketFilter"),
    sort: document.getElementById("sortSelect"),
    total: document.getElementById("totalCount"),
    stocks: document.getElementById("stockCount"),
    etfs: document.getElementById("etfCount"),
    partial: document.getElementById("partialCount"),
    coverage: document.getElementById("coverageCount"),
    coverageMeta: document.getElementById("coverageMeta"),
    resultMeta: document.getElementById("resultMeta"),
    resultTitle: document.getElementById("resultTitle")
};

const formatNumber = (value) => value === null || value === undefined || value === "" ? "-" : new Intl.NumberFormat().format(value);
const money = (value, currency) => value === null || value === undefined ? "-" : `${formatNumber(value)} ${currency || ""}`.trim();
const normalizeAsset = (asset) => String(asset || "").toLowerCase();

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("analysis-theme", theme);
}

function getItemDate(item) {
    return item.raw?.as_of?.page_date || item.raw?.generated_at || "";
}

function getQuality(item) {
    return item.raw?.data_quality?.status || (item.rawError ? "unavailable" : "unknown");
}

function getDisplayName(item) {
    return item.name_ko || item.name || item.key;
}

function getSubtitle(item) {
    const rawIdentity = item.raw?.identity || item.raw?.target || {};
    const issuer = item.issuer || item.raw?.etf_profile?.issuer;
    const sector = item.sector || rawIdentity.sector || item.industry;
    if (normalizeAsset(item.asset_type) === "etf") {
        return [issuer, item.theme].filter(Boolean).join(" · ");
    }
    return [sector, item.theme].filter(Boolean).join(" · ");
}

function getPrimaryValue(item) {
    const currency = item.raw?.price_snapshot?.currency || item.raw?.identity?.currency || item.raw?.target?.currency;
    if (normalizeAsset(item.asset_type) === "etf") {
        const nav = item.raw?.etf_profile?.nav;
        const price = item.raw?.price_snapshot?.close;
        return nav ? money(nav, currency) : money(price, currency);
    }
    return money(item.raw?.price_snapshot?.close, currency);
}

function getPrimaryLabel(item) {
    return normalizeAsset(item.asset_type) === "etf" ? "NAV / Price" : "Latest Close";
}

function getSecondaryValue(item) {
    if (normalizeAsset(item.asset_type) === "etf") {
        const fee = item.raw?.etf_profile?.real_expense_ratio_percent ?? item.raw?.etf_profile?.total_expense_ratio_percent;
        return fee === undefined || fee === null ? "-" : `${fee}%`;
    }
    const f = item.raw?.financials || {};
    if (f.per) return `${f.per}x PER`;
    if (f.roe_percent) return `${f.roe_percent}% ROE`;
    return "-";
}

function getSecondaryLabel(item) {
    return normalizeAsset(item.asset_type) === "etf" ? "Expense" : "Valuation";
}

function getTertiaryValue(item) {
    if (normalizeAsset(item.asset_type) === "etf") {
        return item.raw?.etf_profile?.holdings_count || item.raw?.holdings?.length || "-";
    }
    return item.raw?.identity?.industry || item.industry || item.raw?.target?.exchange || "-";
}

function getTertiaryLabel(item) {
    return normalizeAsset(item.asset_type) === "etf" ? "Holdings" : "Industry";
}

function matchesQuery(item) {
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const haystack = [
        item.asset_type,
        item.market,
        item.ticker,
        item.key,
        item.name,
        item.name_ko,
        item.theme,
        item.issuer,
        item.benchmark,
        item.sector,
        item.industry,
        item.raw?.identity?.company,
        item.raw?.identity?.name,
        item.raw?.etf_profile?.fund_name
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
}

function compareItems(a, b) {
    if (state.sort === "asset") {
        return `${a.asset_type}${a.market}${getDisplayName(a)}`.localeCompare(`${b.asset_type}${b.market}${getDisplayName(b)}`);
    }
    if (state.sort === "market") {
        return `${a.market}${a.asset_type}${getDisplayName(a)}`.localeCompare(`${b.market}${b.asset_type}${getDisplayName(b)}`);
    }
    if (state.sort === "name") {
        return getDisplayName(a).localeCompare(getDisplayName(b));
    }
    return getItemDate(b).localeCompare(getItemDate(a));
}

function filteredItems() {
    return enrichedItems
        .filter((item) => state.asset === "all" || normalizeAsset(item.asset_type) === state.asset)
        .filter((item) => state.market === "all" || item.market === state.market)
        .filter(matchesQuery)
        .sort(compareItems);
}

function renderMarketOptions() {
    const markets = [...new Set(manifestItems.map((item) => item.market).filter(Boolean))].sort();
    els.market.innerHTML = [`<option value="all">All Markets</option>`, ...markets.map((market) => `<option value="${market}">${market}</option>`)].join("");
}

function renderSummary(items) {
    const stocks = enrichedItems.filter((item) => normalizeAsset(item.asset_type) === "stock").length;
    const etfs = enrichedItems.filter((item) => normalizeAsset(item.asset_type) === "etf").length;
    const partial = enrichedItems.filter((item) => getQuality(item) === "partial").length;
    els.total.textContent = enrichedItems.length;
    els.stocks.textContent = stocks;
    els.etfs.textContent = etfs;
    els.partial.textContent = partial;
    els.coverage.textContent = `${stocks} / ${etfs}`;
    els.coverageMeta.textContent = `Stocks / ETFs · ${items.length} shown`;
    els.resultMeta.textContent = `${items.length} of ${enrichedItems.length}`;
}

function cardTemplate(item) {
    const asset = normalizeAsset(item.asset_type);
    const quality = getQuality(item);
    const rawState = item.rawError ? "Data unavailable" : `Updated ${getItemDate(item) || "-"}`;
    const benchmark = asset === "etf" ? (item.benchmark || item.raw?.identity?.benchmark || "-") : (item.sector || item.industry || "-");

    return `
        <article class="analysis-card">
            <div class="card-top">
                <div class="card-title">
                    <div class="badge-row">
                        <span class="pill ${asset}">${asset.toUpperCase()}</span>
                        <span class="pill">${item.market} ${item.ticker}</span>
                        <span class="pill ${quality}">${quality}</span>
                    </div>
                    <h3><a href="${item.url}">${getDisplayName(item)}</a></h3>
                    <span class="card-subtitle">${getSubtitle(item) || item.theme || "-"}</span>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-row"><span>${getPrimaryLabel(item)}</span><strong>${getPrimaryValue(item)}</strong></div>
                <div class="detail-row"><span>${getSecondaryLabel(item)}</span><strong>${getSecondaryValue(item)}</strong></div>
                <div class="detail-row"><span>${getTertiaryLabel(item)}</span><strong>${getTertiaryValue(item)}</strong></div>
                <div class="detail-row"><span>${asset === "etf" ? "Benchmark" : "Theme"}</span><strong>${benchmark}</strong></div>
            </div>
            <div class="card-actions">
                <span class="raw-state">${rawState}</span>
                <a class="open-link" href="${item.url}">Open</a>
            </div>
        </article>
    `;
}

function render() {
    const items = filteredItems();
    renderSummary(items);
    els.grid.innerHTML = items.map(cardTemplate).join("");
    els.empty.hidden = items.length !== 0;
}

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
    return response.json();
}

async function enrichItem(item) {
    try {
        const latest = await fetchJson(item.latest_json);
        const base = item.latest_json.split("/").slice(0, -1).join("/");
        const rawPath = `${base}/${latest.latest}`;
        const raw = await fetchJson(rawPath);
        return { ...item, raw, raw_path: rawPath };
    } catch (error) {
        return { ...item, rawError: error.message };
    }
}

async function init() {
    try {
        manifestItems = await fetchJson("analysis/manifest.json");
        enrichedItems = manifestItems.map((item) => ({ ...item }));
        renderMarketOptions();
        render();
        enrichedItems = await Promise.all(manifestItems.map(enrichItem));
        render();
    } catch (error) {
        els.coverage.textContent = "0 / 0";
        els.coverageMeta.textContent = `Manifest load failed: ${error.message}`;
        els.grid.innerHTML = "";
        els.empty.hidden = false;
    }
}

document.getElementById("themeToggle").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.querySelectorAll("[data-filter='asset']").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll("[data-filter='asset']").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
        state.asset = button.dataset.value;
        els.resultTitle.textContent = state.asset === "all" ? "All Analysis Pages" : `${state.asset.toUpperCase()} Analysis Pages`;
        render();
    });
});

els.search.addEventListener("input", () => {
    state.query = els.search.value;
    render();
});

els.market.addEventListener("change", () => {
    state.market = els.market.value;
    render();
});

els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    render();
});

init();
