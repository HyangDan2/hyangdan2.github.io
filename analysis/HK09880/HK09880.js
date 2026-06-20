const labels = {
    ko: {
        heroTitle: "UBTECH Robotics 휴머노이드 로봇 분석",
        heroCopy: "홍콩 상장 중국 휴머노이드 로봇 기업 UBTECH를 가격, 재무, 산업 적용, AI 로봇 생태계 관점에서 보는 정적 분석 페이지입니다.",
        dataStatus: "데이터 기준",
        latestClose: "최신 종가",
        marketCap: "시가총액",
        revenueLabel: "최근 매출",
        viewState: "현재 판단",
        viewStateSub: "휴머노이드 로봇 모멘텀과 손실 축소 확인 구간",
        chartEyebrow: "Price Snapshot",
        chartTitle: "가격 스냅샷",
        financialEyebrow: "Fundamentals",
        financialTitle: "재무와 성장성",
        technicalEyebrow: "Technical",
        technicalTitle: "기술적 관점",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "사업부와 로봇 생태계",
        peerEyebrow: "Peers",
        peerTitle: "비교군",
        newsEyebrow: "News x Price",
        newsTitle: "뉴스와 주가 연결",
        strategyEyebrow: "Scenarios",
        strategyTitle: "단기 / 중기 / 장기 관찰 시나리오",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "출처 및 원천 데이터",
        support: "지지",
        resistance: "저항",
        shortTerm: "단기",
        mediumTerm: "중기",
        longTerm: "장기",
        viewStateValue: "고성장 로봇 테마, 손실 축소 확인 필요",
        drivers: "동인",
        risks: "리스크",
        relevance: "노출",
        themeToggle: "테마 전환"
    },
    en: {
        heroTitle: "UBTECH Robotics Humanoid Robotics Analysis",
        heroCopy: "A static analysis page for Hong Kong-listed Chinese humanoid robotics company UBTECH, covering price, financials, industrial deployment and the AI robotics ecosystem.",
        dataStatus: "Data As Of",
        latestClose: "Latest Close",
        marketCap: "Market Cap",
        revenueLabel: "Recent Revenue",
        viewState: "Current View",
        viewStateSub: "Humanoid robotics momentum and loss-narrowing checkpoint",
        chartEyebrow: "Price Snapshot",
        chartTitle: "Price Snapshot",
        financialEyebrow: "Fundamentals",
        financialTitle: "Financials and Growth",
        technicalEyebrow: "Technical",
        technicalTitle: "Technical View",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "Business and Robotics Ecosystem",
        peerEyebrow: "Peers",
        peerTitle: "Peer Group",
        newsEyebrow: "News x Price",
        newsTitle: "News and Price Linkage",
        strategyEyebrow: "Scenarios",
        strategyTitle: "Short / Medium / Long-Term Observation Scenarios",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "Sources and Raw Data",
        support: "Support",
        resistance: "Resistance",
        shortTerm: "Short Term",
        mediumTerm: "Medium Term",
        longTerm: "Long Term",
        viewStateValue: "High-growth robotics theme, loss narrowing needs proof",
        drivers: "Drivers",
        risks: "Risks",
        relevance: "Exposure",
        themeToggle: "Toggle theme"
    },
    ja: {
        heroTitle: "UBTECH Robotics ヒューマノイドロボット分析",
        heroCopy: "香港上場の中国ヒューマノイドロボット企業UBTECHを、株価、財務、産業導入、AIロボット生態系の観点から見る静的分析ページです。",
        dataStatus: "データ基準",
        latestClose: "最新終値",
        marketCap: "時価総額",
        revenueLabel: "直近売上高",
        viewState: "現在の見方",
        viewStateSub: "ヒューマノイドロボットのモメンタムと損失縮小の確認ゾーン",
        chartEyebrow: "Price Snapshot",
        chartTitle: "価格スナップショット",
        financialEyebrow: "Fundamentals",
        financialTitle: "財務と成長性",
        technicalEyebrow: "Technical",
        technicalTitle: "テクニカル見解",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "事業とロボット生態系",
        peerEyebrow: "Peers",
        peerTitle: "比較群",
        newsEyebrow: "News x Price",
        newsTitle: "ニュースと株価連動",
        strategyEyebrow: "Scenarios",
        strategyTitle: "短期 / 中期 / 長期 観察シナリオ",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "出典および原データ",
        support: "支持",
        resistance: "抵抗",
        shortTerm: "短期",
        mediumTerm: "中期",
        longTerm: "長期",
        viewStateValue: "高成長ロボットテーマ、損失縮小の確認が必要",
        drivers: "ドライバー",
        risks: "リスク",
        relevance: "エクスポージャー",
        themeToggle: "テーマ切替"
    }
};

let pageData;
let activeLang = "ko";
let priceChart;

const formatNumber = (value, options = {}) => value === null || value === undefined ? "-" : new Intl.NumberFormat(undefined, options).format(value);
const money = (value, currency) => value === null || value === undefined ? "-" : `${formatNumber(value)} ${currency || ""}`.trim();

function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
    return response.json();
}

async function loadData() {
    const latest = await fetchJson("latest.json");
    pageData = await fetchJson(latest.latest);
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
    renderFinancials();
    renderTechnicals();
    renderSegments();
    renderPeers();
    renderNews();
    renderStrategies();
    renderSources();
}

function renderSummary() {
    const snapshot = pageData.price_snapshot;
    const f = pageData.financials;
    document.getElementById("asOf").textContent = `${pageData.as_of.page_date} / Market ${pageData.as_of.market_data_date}`;
    document.getElementById("marketNote").textContent = pageData.as_of.note[activeLang];
    document.getElementById("latestClose").textContent = money(snapshot.close, snapshot.currency);
    document.getElementById("latestMove").textContent = `${snapshot.change >= 0 ? "+" : ""}${formatNumber(snapshot.change)} (${snapshot.change_percent}%) / Vol ${formatNumber(snapshot.volume)}`;
    document.getElementById("marketCap").textContent = `${snapshot.market_cap}${snapshot.market_cap_unit || ""} ${snapshot.currency}`;
    document.getElementById("rangeLine").textContent = `52W ${money(snapshot.low_52w, snapshot.currency)} - ${money(snapshot.high_52w, snapshot.currency)}`;
    document.getElementById("revenueValue").textContent = money(f.revenue, f.currency);
    document.getElementById("profitLine").textContent = `Net ${money(f.net_income, f.currency)} / Margin ${f.net_margin_percent}%`;
    document.getElementById("viewState").textContent = labels[activeLang].viewStateValue;
}

function renderChart() {
    const ctx = document.getElementById("priceChart");
    const points = pageData.recent_prices;
    const labelsForChart = points.map((item) => item.label || item.date.slice(5));
    const close = points.map((item) => item.close);

    if (typeof Chart === "undefined") return;
    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labelsForChart,
            datasets: [
                { type: "bar", label: "Reference", data: close, backgroundColor: "rgba(207, 79, 31, 0.24)", borderColor: cssVar("--color-accent"), borderWidth: 1 },
                { type: "line", label: "Close", data: close, borderColor: cssVar("--color-accent-2"), backgroundColor: "rgba(73, 194, 178, 0.15)", tension: 0.25, pointRadius: 3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: cssVar("--color-text") } } },
            scales: {
                x: { ticks: { color: cssVar("--color-muted") }, grid: { color: "rgba(127,127,127,0.14)" } },
                y: { ticks: { color: cssVar("--color-muted") }, grid: { color: "rgba(127,127,127,0.14)" } }
            }
        }
    });
}

function renderFinancials() {
    const f = pageData.financials;
    document.getElementById("financialAnalysis").textContent = f.analysis[activeLang];
    const rows = [
        ["Revenue", money(f.revenue, f.currency)],
        ["Operating Income", money(f.operating_income, f.currency)],
        ["Net Income", money(f.net_income, f.currency)],
        ["Net Margin", `${f.net_margin_percent}%`],
        ["EPS", money(pageData.price_snapshot.eps, pageData.price_snapshot.currency)],
        ["Employees", formatNumber(pageData.identity.employees)],
        ["Price Currency", pageData.price_snapshot.currency],
        ["Financial Currency", f.currency]
    ];
    document.getElementById("financialTable").innerHTML = rows.map(([name, value]) => `<div class="mini-row"><span>${name}</span><strong>${value}</strong></div>`).join("");
}

function renderTechnicals() {
    document.getElementById("technicalTrend").textContent = pageData.technical_view.trend_state[activeLang];
    document.getElementById("technicalRisk").textContent = pageData.technical_view.risk_state[activeLang];
    const currency = pageData.price_snapshot.currency;
    const supports = pageData.technical_view.support_zones.map((v) => `<span class="level">${labels[activeLang].support} ${money(v, currency)}</span>`);
    const resistances = pageData.technical_view.resistance_zones.map((v) => `<span class="level">${labels[activeLang].resistance} ${money(v, currency)}</span>`);
    document.getElementById("levels").innerHTML = [...supports, ...resistances].join("");
}

function renderSegments() {
    document.getElementById("segmentGrid").innerHTML = pageData.business_segment_map.map((segment) => {
        const drivers = segment.drivers.map((driver) => `<span class="pill">${driver}</span>`).join("");
        const risks = segment.risk_factors.map((risk) => `<span class="pill mixed">${risk}</span>`).join("");
        return `<article class="segment-card"><h3>${segment.segment_name[activeLang]}</h3><span class="pill positive">${labels[activeLang].relevance}: ${segment.company_relevance}</span><p>${segment.segment_linkage[activeLang]}</p><div class="segment-meta"><strong>${labels[activeLang].drivers}</strong>${drivers}</div><div class="segment-meta"><strong>${labels[activeLang].risks}</strong>${risks}</div></article>`;
    }).join("");
}

function renderPeers() {
    document.getElementById("peerGrid").innerHTML = pageData.peer_group.map((peer) => {
        const context = typeof peer.one_year_context === "string" ? peer.one_year_context : peer.one_year_context[activeLang];
        return `<article class="peer-card"><h3>${peer.company}</h3><dl><dt>Ticker</dt><dd>${peer.ticker}</dd><dt>Region</dt><dd>${peer.region}</dd><dt>Price</dt><dd>${money(peer.price, peer.currency)}</dd><dt>Market Cap</dt><dd>${peer.market_cap || "-"}</dd></dl><p>${context}</p></article>`;
    }).join("");
}

function renderNews() {
    document.getElementById("newsList").innerHTML = pageData.news_events.map((event) => `<article class="news-item"><div class="news-meta"><span class="pill">${event.date}</span><span class="pill ${event.sentiment}">${event.sentiment}</span><span class="pill">${event.impact_horizon}</span></div><h3>${event.title}</h3><p>${event.price_linkage.interpretation[activeLang]}</p><p><strong>${event.source}</strong> - ${event.price_linkage.observed}</p></article>`).join("");
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
