const labels = {
    ko: {
        heroTitle: "KODEX 차이나휴머노이드로봇 ETF 분석",
        heroCopy: "중국 휴머노이드 로봇, 정밀 감속기, 자동화 부품, 배터리와 센서 밸류체인을 NAV와 보유종목 관점에서 보는 정적 ETF 분석 페이지입니다.",
        dataStatus: "데이터 기준",
        latestClose: "확정 종가",
        feeLabel: "보수 / 분배",
        viewState: "현재 판단",
        viewStateSub: "휴머노이드 테마와 NAV 괴리 확인 구간",
        chartEyebrow: "Price Action",
        chartTitle: "ETF 가격 흐름",
        profileEyebrow: "ETF Profile",
        profileTitle: "ETF 구조와 NAV",
        technicalEyebrow: "Technical",
        technicalTitle: "기술적 관점",
        themeEyebrow: "Theme Exposure",
        themeTitle: "테마 노출 맵",
        holdingsEyebrow: "Holdings",
        holdingsTitle: "상위 보유종목",
        peerEyebrow: "ETF Peers",
        peerTitle: "ETF 비교군",
        newsEyebrow: "News x NAV",
        newsTitle: "뉴스와 ETF 가격 연결",
        strategyEyebrow: "ETF Scenarios",
        strategyTitle: "단기 / 중기 / 장기 관찰 시나리오",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "출처 및 원천 데이터",
        shortTerm: "단기",
        mediumTerm: "중기",
        longTerm: "장기",
        support: "지지",
        resistance: "저항",
        viewStateValue: "테마 반등 후 추적 품질 확인",
        drivers: "동인",
        risks: "리스크",
        relevance: "노출",
        themeToggle: "테마 전환"
    },
    en: {
        heroTitle: "KODEX China Humanoid Robot ETF Analysis",
        heroCopy: "A static ETF analysis page for China humanoid robotics, precision reducers, automation components, batteries and sensor value-chain exposure through NAV and holdings context.",
        dataStatus: "Data As Of",
        latestClose: "Confirmed Close",
        feeLabel: "Fee / Distribution",
        viewState: "Current View",
        viewStateSub: "Humanoid theme and NAV gap check zone",
        chartEyebrow: "Price Action",
        chartTitle: "ETF Price Flow",
        profileEyebrow: "ETF Profile",
        profileTitle: "ETF Structure and NAV",
        technicalEyebrow: "Technical",
        technicalTitle: "Technical View",
        themeEyebrow: "Theme Exposure",
        themeTitle: "Theme Exposure Map",
        holdingsEyebrow: "Holdings",
        holdingsTitle: "Top Holdings",
        peerEyebrow: "ETF Peers",
        peerTitle: "ETF Peer Group",
        newsEyebrow: "News x NAV",
        newsTitle: "News and ETF Price Linkage",
        strategyEyebrow: "ETF Scenarios",
        strategyTitle: "Short / Medium / Long-Term Observation Scenarios",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "Sources and Raw Data",
        shortTerm: "Short Term",
        mediumTerm: "Medium Term",
        longTerm: "Long Term",
        support: "Support",
        resistance: "Resistance",
        viewStateValue: "Theme rebound with tracking quality check",
        drivers: "Drivers",
        risks: "Risks",
        relevance: "Exposure",
        themeToggle: "Toggle theme"
    },
    ja: {
        heroTitle: "KODEX China Humanoid Robot ETF 分析",
        heroCopy: "中国ヒューマノイドロボット、精密減速機、自動化部品、バッテリー、センサーのバリューチェーンを、NAVと保有銘柄の観点から見る静的ETF分析ページです。",
        dataStatus: "データ基準",
        latestClose: "確認済み終値",
        feeLabel: "費用 / 分配",
        viewState: "現在の見方",
        viewStateSub: "ヒューマノイドテーマとNAV乖離の確認ゾーン",
        chartEyebrow: "Price Action",
        chartTitle: "ETF価格推移",
        profileEyebrow: "ETF Profile",
        profileTitle: "ETF構造とNAV",
        technicalEyebrow: "Technical",
        technicalTitle: "テクニカル見解",
        themeEyebrow: "Theme Exposure",
        themeTitle: "テーマエクスポージャーマップ",
        holdingsEyebrow: "Holdings",
        holdingsTitle: "上位保有銘柄",
        peerEyebrow: "ETF Peers",
        peerTitle: "ETF比較群",
        newsEyebrow: "News x NAV",
        newsTitle: "ニュースとETF価格連動",
        strategyEyebrow: "ETF Scenarios",
        strategyTitle: "短期 / 中期 / 長期 観察シナリオ",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "出典および原データ",
        shortTerm: "短期",
        mediumTerm: "中期",
        longTerm: "長期",
        support: "支持",
        resistance: "抵抗",
        viewStateValue: "テーマ反発後に追随品質を確認",
        drivers: "ドライバー",
        risks: "リスク",
        relevance: "エクスポージャー",
        themeToggle: "テーマ切替"
    }
};

let pageData;
let activeLang = "ko";
let priceChart;

const formatNumber = (value, options = {}) => new Intl.NumberFormat(undefined, options).format(value);
const money = (value, currency) => value === null || value === undefined ? "-" : `${formatNumber(value)} ${currency}`;

function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function loadData() {
    const latestResponse = await fetch("latest.json");
    if (!latestResponse.ok) throw new Error(`latest.json HTTP ${latestResponse.status}`);
    const latest = await latestResponse.json();
    const dataResponse = await fetch(latest.latest);
    if (!dataResponse.ok) throw new Error(`${latest.latest} HTTP ${dataResponse.status}`);
    pageData = await dataResponse.json();
    render();
}

function applyStaticLabels() {
    document.documentElement.lang = activeLang === "ja" ? "ja" : activeLang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
        const key = node.dataset.i18n;
        node.textContent = labels[activeLang][key] || node.textContent;
    });
    document.querySelectorAll(".lang-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.lang === activeLang);
    });
    document.getElementById("themeToggle").setAttribute("aria-label", labels[activeLang].themeToggle);
}

function render() {
    applyStaticLabels();
    renderSummary();
    renderChart();
    renderProfile();
    renderTechnicals();
    renderThemes();
    renderHoldings();
    renderPeers();
    renderNews();
    renderStrategies();
    renderSources();
}

function renderSummary() {
    const snapshot = pageData.price_snapshot;
    const profile = pageData.etf_profile;
    const currency = snapshot.currency || pageData.identity.currency || "KRW";
    document.getElementById("asOf").textContent = `${pageData.as_of.page_date} / Market ${pageData.as_of.market_data_date}`;
    document.getElementById("marketNote").textContent = pageData.as_of.note[activeLang];
    document.getElementById("latestClose").textContent = money(snapshot.close, currency);
    document.getElementById("latestMove").textContent = `${snapshot.change >= 0 ? "+" : ""}${formatNumber(snapshot.change)} (${snapshot.change_percent}%) / Vol ${formatNumber(snapshot.volume)}`;
    document.getElementById("navValue").textContent = money(profile.nav, currency);
    document.getElementById("discountLine").textContent = `Indicative gap ${profile.premium_discount_percent}`;
    document.getElementById("feeValue").textContent = `${profile.total_expense_ratio_percent}% / ${profile.real_expense_ratio_percent}%`;
    document.getElementById("distributionLine").textContent = `${profile.latest_distribution.amount} ${profile.latest_distribution.currency} / Yield ${profile.distribution_yield_percent}%`;
    document.getElementById("viewState").textContent = labels[activeLang].viewStateValue;
}

function renderChart() {
    const ctx = document.getElementById("priceChart");
    const chartLabels = pageData.recent_prices.map((item) => item.date.slice(5));
    const close = pageData.recent_prices.map((item) => item.close);
    const volume = pageData.recent_prices.map((item) => Math.round(item.volume / 1000));

    if (typeof Chart === "undefined") {
        const wrap = ctx.parentElement;
        ctx.style.display = "none";
        wrap.querySelectorAll(".chart-fallback").forEach((node) => node.remove());
        const maxClose = Math.max(...close);
        const fallback = document.createElement("div");
        fallback.className = "chart-fallback";
        fallback.innerHTML = pageData.recent_prices.slice(-10).map((item) => {
            const height = Math.max(8, Math.round((item.close / maxClose) * 120));
            return `<div class="fallback-bar"><span style="height:${height}px"></span><small>${item.date.slice(5)}</small><strong>${formatNumber(item.close)}</strong></div>`;
        }).join("");
        wrap.appendChild(fallback);
        return;
    }

    if (priceChart) priceChart.destroy();
    ctx.style.display = "block";

    priceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: chartLabels,
            datasets: [
                { type: "line", label: "Close", data: close, borderColor: cssVar("--color-accent-2"), backgroundColor: "rgba(73, 194, 178, 0.15)", tension: 0.25, yAxisID: "price", pointRadius: 0 },
                { type: "bar", label: "Volume K", data: volume, backgroundColor: "rgba(207, 79, 31, 0.25)", borderColor: "rgba(207, 79, 31, 0.4)", yAxisID: "volume" }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: { legend: { labels: { color: cssVar("--color-text") } } },
            scales: {
                x: { ticks: { color: cssVar("--color-muted"), maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }, grid: { color: "rgba(127,127,127,0.14)" } },
                price: { position: "left", ticks: { color: cssVar("--color-muted") }, grid: { color: "rgba(127,127,127,0.14)" } },
                volume: { position: "right", ticks: { color: cssVar("--color-muted") }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function renderProfile() {
    const p = pageData.etf_profile;
    document.getElementById("profileAnalysis").textContent = p.analysis[activeLang];
    const rows = [
        ["Benchmark", p.benchmark],
        ["Replication", p.replication_method],
        ["NAV", money(p.nav, pageData.identity.currency)],
        ["Market Price", money(p.market_price, pageData.identity.currency)],
        ["AUM", p.aum],
        ["TER", `${p.total_expense_ratio_percent}%`],
        ["Real Expense", `${p.real_expense_ratio_percent}%`],
        ["Tracking Error", p.tracking_error],
        ["Holdings", `${p.holdings_count}`],
        ["Listed", p.listing_date],
        ["ISIN", pageData.identity.isin || "-"]
    ];
    document.getElementById("profileTable").innerHTML = rows.map(([name, value]) => `<div class="mini-row"><span>${name}</span><strong>${value}</strong></div>`).join("");
}

function renderTechnicals() {
    document.getElementById("technicalTrend").textContent = pageData.technical_view.trend_state[activeLang];
    document.getElementById("technicalRisk").textContent = pageData.technical_view.risk_state[activeLang];
    const currency = pageData.identity.currency || pageData.price_snapshot.currency || "KRW";
    const supports = pageData.technical_view.support_zones.map((v) => `<span class="level">${labels[activeLang].support} ${money(v, currency)}</span>`);
    const resistances = pageData.technical_view.resistance_zones.map((v) => `<span class="level">${labels[activeLang].resistance} ${money(v, currency)}</span>`);
    document.getElementById("levels").innerHTML = [...supports, ...resistances].join("");
}

function renderThemes() {
    document.getElementById("themeGrid").innerHTML = pageData.theme_exposure_map.map((theme) => {
        const drivers = theme.drivers.map((driver) => `<span class="pill">${driver}</span>`).join("");
        const risks = theme.risk_factors.map((risk) => `<span class="pill mixed">${risk}</span>`).join("");
        const holdings = theme.representative_holdings.map((holding) => `<span class="pill">${holding}</span>`).join("");
        return `<article class="segment-card"><h3>${theme.theme_name[activeLang]}</h3><div class="segment-meta"><span class="pill positive">${labels[activeLang].relevance}: ${theme.exposure_type}</span></div><p>${theme.portfolio_linkage[activeLang]}</p><p>${theme.price_linkage[activeLang]}</p><div class="segment-meta"><strong>${labels[activeLang].drivers}</strong>${drivers}</div><div class="segment-meta"><strong>${labels[activeLang].risks}</strong>${risks}</div><div class="ticker-row">${holdings}</div></article>`;
    }).join("");
}

function renderHoldings() {
    document.getElementById("holdingsGrid").innerHTML = pageData.holdings.map((holding) => {
        return `<article class="holding-card"><h3>${holding.rank}. ${holding.name}</h3><dl><dt>Weight</dt><dd>${holding.weight}%</dd><dt>Sector</dt><dd>${holding.sector}</dd><dt>Country</dt><dd>${holding.country}</dd><dt>Value</dt><dd>${money(holding.market_value_krw, "KRW")}</dd></dl><p>${holding.interpretation[activeLang]}</p></article>`;
    }).join("");
}

function renderPeers() {
    document.getElementById("peerGrid").innerHTML = pageData.peer_group.map((peer) => {
        const context = typeof peer.one_year_context === "string" ? peer.one_year_context : peer.one_year_context[activeLang];
        return `<article class="peer-card"><h3>${peer.fund_name}</h3><dl><dt>Ticker</dt><dd>${peer.ticker}</dd><dt>Issuer</dt><dd>${peer.issuer}</dd><dt>Region</dt><dd>${peer.region}</dd><dt>TER</dt><dd>${peer.expense_ratio ?? "-"}%</dd><dt>AUM</dt><dd>${peer.aum || "-"}</dd></dl><p>${context}</p></article>`;
    }).join("");
}

function renderNews() {
    document.getElementById("newsList").innerHTML = pageData.news_events.map((event) => `<article class="news-item"><div class="news-meta"><span class="pill">${event.date}</span><span class="pill ${event.sentiment}">${event.sentiment}</span><span class="pill">${event.impact_horizon}</span><span class="pill">${event.related_tickers.join(", ")}</span></div><h3>${event.title}</h3><p>${event.price_linkage.interpretation[activeLang]}</p><p><strong>${event.source}</strong> - ${event.price_linkage.observed}</p></article>`).join("");
}

function renderStrategies() {
    const s = pageData.trading_scenarios;
    const cards = [[labels[activeLang].shortTerm, s.short_term[activeLang]], [labels[activeLang].mediumTerm, s.medium_term[activeLang]], [labels[activeLang].longTerm, s.long_term[activeLang]]];
    document.getElementById("strategyGrid").innerHTML = cards.map(([title, copy]) => `<article class="strategy-card"><h3>${title}</h3><p>${copy}</p></article>`).join("");
}

function renderSources() {
    document.getElementById("sourceList").innerHTML = pageData.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a> - ${source.used_for}</li>`).join("");
    document.getElementById("disclaimer").textContent = pageData.disclaimer[activeLang];
}

document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => {
        activeLang = button.dataset.lang;
        render();
    });
});

document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    renderChart();
});

loadData().catch((error) => {
    document.getElementById("asOf").textContent = "Data load failed";
    const isFile = window.location.protocol === "file:";
    document.getElementById("marketNote").textContent = isFile
        ? "Open this page through a local web server or GitHub Pages. Browser fetch() is blocked on file://."
        : error.message;
});
