const labels = {
    ko: {
        heroTitle: "삼성전자 글로벌 반도체/AI 메모리 분석",
        heroCopy: "삼성전자를 중심으로 AI 메모리, 파운드리, 모바일, 디스플레이, 글로벌 반도체 피어를 함께 보는 정적 분석 페이지입니다.",
        dataStatus: "데이터 기준",
        latestClose: "최신 종가",
        marketCap: "시가총액",
        qRevenue: "Q1 매출",
        viewState: "현재 판단",
        viewStateSub: "반등 확인 구간",
        chartEyebrow: "Price Action",
        chartTitle: "최근 차트 흐름",
        financialEyebrow: "Fundamentals",
        financialTitle: "재무제표 분석",
        technicalEyebrow: "Technical",
        technicalTitle: "기술적 관점",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "삼성전자 사업부별 글로벌 섹터 맵",
        peerEyebrow: "Global Peers",
        peerTitle: "글로벌 비교군",
        newsEyebrow: "News x Price",
        newsTitle: "글로벌 뉴스와 주가 연동",
        strategyEyebrow: "Trading Scenarios",
        strategyTitle: "단기 / 중기 / 장기 매매 방안",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "출처 및 원천 데이터",
        shortTerm: "단기",
        mediumTerm: "중기",
        longTerm: "장기",
        support: "지지",
        resistance: "저항",
        viewStateValue: "AI 메모리 랠리 속 단기 과열 확인",
        revenue: "매출",
        opProfit: "영업이익",
        netProfit: "지배주주순이익",
        roe: "ROE",
        opMargin: "영업이익률",
        orders: "수주",
        forecast: "FY2026 회사 전망",
        per: "PER",
        pbr: "PBR",
        eps: "EPS",
        bps: "BPS",
        debtRatio: "부채비율",
        drivers: "동인",
        risks: "리스크",
        relevance: "연결성"
    },
    en: {
        heroTitle: "Samsung Electronics Global Semiconductor & AI Memory Analysis",
        heroCopy: "A static analysis dashboard for Samsung Electronics, AI memory, foundry, mobile, display and global semiconductor peers.",
        dataStatus: "Data As Of",
        latestClose: "Latest Close",
        marketCap: "Market Cap",
        qRevenue: "Q1 Revenue",
        viewState: "Current View",
        viewStateSub: "Rebound confirmation zone",
        chartEyebrow: "Price Action",
        chartTitle: "Recent Chart Flow",
        financialEyebrow: "Fundamentals",
        financialTitle: "Financial Statement Analysis",
        technicalEyebrow: "Technical",
        technicalTitle: "Technical View",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "Samsung Business Segment Global Sector Map",
        peerEyebrow: "Global Peers",
        peerTitle: "Global Peer Group",
        newsEyebrow: "News x Price",
        newsTitle: "Global News and Price Linkage",
        strategyEyebrow: "Trading Scenarios",
        strategyTitle: "Short / Medium / Long-Term Plans",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "Sources and Raw Data",
        shortTerm: "Short Term",
        mediumTerm: "Medium Term",
        longTerm: "Long Term",
        support: "Support",
        resistance: "Resistance",
        viewStateValue: "AI-memory rally with short-term overheating check",
        revenue: "Revenue",
        opProfit: "Operating Profit",
        netProfit: "Profit to Owners",
        roe: "ROE",
        opMargin: "Operating Margin",
        orders: "Orders",
        forecast: "FY2026 Guidance",
        per: "PER",
        pbr: "PBR",
        eps: "EPS",
        bps: "BPS",
        debtRatio: "Debt Ratio",
        drivers: "Drivers",
        risks: "Risks",
        relevance: "Relevance"
    },
    ja: {
        heroTitle: "Samsung Electronics グローバル半導体・AIメモリ分析",
        heroCopy: "Samsung Electronicsを中心に、AIメモリ、ファウンドリ、モバイル、ディスプレイ、グローバル半導体peerを比較する静的分析ページです。",
        dataStatus: "データ基準",
        latestClose: "最新終値",
        marketCap: "時価総額",
        qRevenue: "Q1売上高",
        viewState: "現在の見方",
        viewStateSub: "反発確認ゾーン",
        chartEyebrow: "Price Action",
        chartTitle: "直近チャート推移",
        financialEyebrow: "Fundamentals",
        financialTitle: "財務諸表分析",
        technicalEyebrow: "Technical",
        technicalTitle: "テクニカル見解",
        segmentEyebrow: "Business Segment Map",
        segmentTitle: "Samsung事業セグメント別グローバルセクターマップ",
        peerEyebrow: "Global Peers",
        peerTitle: "グローバル比較銘柄",
        newsEyebrow: "News x Price",
        newsTitle: "グローバルニュースと株価連動",
        strategyEyebrow: "Trading Scenarios",
        strategyTitle: "短期 / 中期 / 長期 売買方針",
        sourceEyebrow: "Audit Trail",
        sourceTitle: "出典および原データ",
        shortTerm: "短期",
        mediumTerm: "中期",
        longTerm: "長期",
        support: "支持",
        resistance: "抵抗",
        viewStateValue: "AIメモリラリー内の短期過熱確認",
        revenue: "売上高",
        opProfit: "営業利益",
        netProfit: "親会社所有者帰属利益",
        roe: "ROE",
        opMargin: "営業利益率",
        orders: "受注",
        forecast: "FY2026会社予想",
        per: "PER",
        pbr: "PBR",
        eps: "EPS",
        bps: "BPS",
        debtRatio: "負債比率",
        drivers: "ドライバー",
        risks: "リスク",
        relevance: "関連性"
    }
};

let pageData;
let activeLang = "ko";
let priceChart;

const formatNumber = (value) => new Intl.NumberFormat().format(value);
const money = (value, currency) => `${formatNumber(value)} ${currency}`;
const jpyB = (value) => `JPY ${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}B`;

async function loadData() {
    const latestResponse = await fetch("latest.json");
    if (!latestResponse.ok) {
        throw new Error(`latest.json HTTP ${latestResponse.status}`);
    }
    const latest = await latestResponse.json();
    const dataResponse = await fetch(latest.latest);
    if (!dataResponse.ok) {
        throw new Error(`${latest.latest} HTTP ${dataResponse.status}`);
    }
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
    const targetPeer = pageData.peer_group[0];
    const financials = pageData.financials;
    document.getElementById("asOf").textContent = `${pageData.as_of.page_date} / Market ${pageData.as_of.market_data_date}`;
    document.getElementById("marketNote").textContent = pageData.as_of.note[activeLang];
    document.getElementById("latestClose").textContent = money(snapshot.close, "JPY");
    document.getElementById("latestMove").textContent = `${snapshot.change >= 0 ? "+" : ""}${snapshot.change} (${snapshot.change_percent}%) / Vol ${formatNumber(snapshot.volume)}`;
    document.getElementById("marketCap").textContent = targetPeer.market_cap || pageData.financials.market_cap;
    document.getElementById("valuationLine").textContent = `PER ${pageData.financials.per} / PBR ${pageData.financials.pbr}`;
    document.getElementById("qRevenue").textContent = `KRW ${financials.revenue}T`;
    document.getElementById("qProfit").textContent = `${labels[activeLang].opProfit} KRW ${financials.operating_profit}T (${financials.operating_margin_percent}%)`;
    document.getElementById("viewState").textContent = labels[activeLang].viewStateValue;
}

function renderChart() {
    const ctx = document.getElementById("priceChart");
    const chartLabels = pageData.recent_prices.map((item) => item.date.slice(5));
    const close = pageData.recent_prices.map((item) => item.close);
    const volume = pageData.recent_prices.map((item) => Math.round(item.volume / 1000000));

    if (typeof Chart === "undefined") {
        const wrap = ctx.parentElement;
        ctx.style.display = "none";
        wrap.querySelectorAll(".chart-fallback").forEach((node) => node.remove());
        const fallback = document.createElement("div");
        fallback.className = "chart-fallback";
        fallback.innerHTML = pageData.recent_prices.slice(-10).map((item) => {
            const height = Math.max(8, Math.round((item.close / Math.max(...close)) * 120));
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
                { type: "line", label: "Close", data: close, borderColor: "#49c2b2", backgroundColor: "rgba(73, 194, 178, 0.15)", tension: 0.25, yAxisID: "price" },
                { type: "bar", label: "Volume M", data: volume, backgroundColor: "rgba(255, 122, 26, 0.28)", borderColor: "rgba(255, 122, 26, 0.4)", yAxisID: "volume" }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: { legend: { labels: { color: "#eef6f6" } } },
            scales: {
                x: { ticks: { color: "#9fb3b6", maxRotation: 0 }, grid: { color: "rgba(40,64,74,0.35)" } },
                price: { position: "left", ticks: { color: "#9fb3b6" }, grid: { color: "rgba(40,64,74,0.35)" } },
                volume: { position: "right", ticks: { color: "#9fb3b6" }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function renderFinancials() {
    const f = pageData.financials;
    document.getElementById("financialAnalysis").textContent = f.analysis[activeLang];
    const rows = [
        [labels[activeLang].revenue, `KRW ${f.revenue}T / YoY ${f.revenue_yoy_percent}%`],
        [labels[activeLang].opProfit, `KRW ${f.operating_profit}T / YoY ${f.operating_profit_yoy_percent}%`],
        [labels[activeLang].netProfit, `KRW ${f.net_income}T`],
        [labels[activeLang].roe, `${f.roe_percent}%`],
        [labels[activeLang].opMargin, `${f.operating_margin_percent}%`],
        [labels[activeLang].per, `${f.per}x`],
        [labels[activeLang].pbr, `${f.pbr}x`],
        [labels[activeLang].eps, `${f.eps_krw} KRW`],
        [labels[activeLang].bps, `${f.bps_krw} KRW`],
        [labels[activeLang].debtRatio, `${f.debt_ratio_percent}%`],
        ["Forward PER", `${f.forward_per}x`],
        ["Dividend", `${f.dividend_krw} KRW`]
    ];
    document.getElementById("financialTable").innerHTML = rows.map(([name, value]) => `<div class="mini-row"><span>${name}</span><strong>${value}</strong></div>`).join("");
}

function renderTechnicals() {
    document.getElementById("technicalTrend").textContent = pageData.technical_view.trend_state[activeLang];
    document.getElementById("technicalRisk").textContent = pageData.technical_view.risk_state[activeLang];
    const supports = pageData.technical_view.support_zones.map((v) => `<span class="level">${labels[activeLang].support} ${money(v, "JPY")}</span>`);
    const resistances = pageData.technical_view.resistance_zones.map((v) => `<span class="level">${labels[activeLang].resistance} ${money(v, "JPY")}</span>`);
    document.getElementById("levels").innerHTML = [...supports, ...resistances].join("");
}

function renderPeers() {
    document.getElementById("peerGrid").innerHTML = pageData.peer_group.map((peer) => {
        const context = typeof peer.one_year_context === "string" ? peer.one_year_context : peer.one_year_context[activeLang];
        return `<article class="peer-card"><h3>${peer.company}</h3><dl><dt>Ticker</dt><dd>${peer.ticker}</dd><dt>Region</dt><dd>${peer.region}</dd><dt>Price</dt><dd>${money(peer.price, peer.currency)}</dd><dt>Market Cap</dt><dd>${peer.market_cap}</dd><dt>PER</dt><dd>${peer.pe ?? "-"}</dd></dl><p>${context}</p></article>`;
    }).join("");
}

function renderSegments() {
    const segments = pageData.business_segment_map || pageData.segment_sector_map || [];
    document.getElementById("segmentGrid").innerHTML = segments.map((segment) => {
        const drivers = segment.drivers.slice(0, 4).map((driver) => `<span class="pill">${driver}</span>`).join("");
        const risks = segment.risk_factors.slice(0, 3).map((risk) => `<span class="pill mixed">${risk}</span>`).join("");
        const tickers = segment.tickers.map((ticker) => `<span class="pill">${ticker}</span>`).join("");
        const linkageSource = segment.segment_linkage || segment.ihi_linkage;
        const linkage = linkageSource[activeLang];
        const priceLinkage = segment.price_linkage?.[activeLang] ? `<p>${segment.price_linkage[activeLang]}</p>` : "";
        return `<article class="segment-card"><h3>${segment.segment_name[activeLang]}</h3><div class="segment-meta"><span class="pill positive">${labels[activeLang].relevance}: ${segment.company_relevance || segment.ihi_relevance}</span></div><p>${linkage}</p>${priceLinkage}<div class="segment-meta"><strong>${labels[activeLang].drivers}</strong>${drivers}</div><div class="segment-meta"><strong>${labels[activeLang].risks}</strong>${risks}</div><div class="ticker-row">${tickers}</div></article>`;
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

loadData().catch((error) => {
    document.getElementById("asOf").textContent = "Data load failed";
    const isFile = window.location.protocol === "file:";
    document.getElementById("marketNote").textContent = isFile
        ? "Open this page through a local web server or GitHub Pages. Browser fetch() is blocked on file://."
        : error.message;
});
