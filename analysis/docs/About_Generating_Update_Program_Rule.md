# Stock Analysis Static Data Harness Rule

## Purpose

This document defines the harness rules for an Agentic AI updater that generates static stock-analysis data for GitHub Pages.

The updater must work from a generic input pair:

```text
market + ticker
```

Examples:

```text
TSE 7013
KRX 012450
NYSE LMT
NASDAQ NVDA
XETRA RHM
```

The output must be static HTML/CSS/JavaScript/JSON that can run on GitHub Pages without a backend server. The page must load `latest.json`, then load the timestamped raw data JSON referenced by it.

## Input Contract

The updater must accept an input object similar to:

```json
{
  "market": "TSE",
  "ticker": "7013",
  "company_hint": "IHI Corporation",
  "analysis_date": "2026-05-10",
  "language_set": ["ko", "en", "ja"],
  "output_base_dir": "analysis"
}
```

Required fields:

- `market`
- `ticker`
- `analysis_date`
- `output_base_dir`

Optional fields:

- `company_hint`
- `language_set`
- `peer_hints`
- `segment_hints`
- `source_hints`
- `force_refresh`

## Market And Ticker Normalization Rule

The updater must normalize folder and file names as:

```text
{MARKET}{TICKER}
```

Rules:

- Uppercase the market code.
- Preserve leading zeros in tickers.
- Remove spaces and separators from the folder/file key.
- Do not add exchange suffixes to folder names.
- Keep exchange suffixes only inside JSON data when useful for market-data lookup.

Examples:

- `TSE 7013` -> `TSE7013`
- `KRX 012450` -> `KRX012450`
- `NYSE LMT` -> `NYSELMT`
- `NASDAQ NVDA` -> `NASDAQNVDA`
- `XETRA RHM` -> `XETR RHM` is invalid; use `XETRA RHM` -> `XETRARHM`

## Output Path Rule

The updater must write files under:

```text
analysis/{MARKET}{TICKER}/
```

Required output structure:

```text
analysis/
└─ {MARKET}{TICKER}/
   ├─ {MARKET}{TICKER}.html
   ├─ {MARKET}{TICKER}.css
   ├─ {MARKET}{TICKER}.js
   ├─ latest.json
   └─ raw_data/
      └─ {YYYYMMDD_HHMMSS_KST}.json
```

Examples:

```text
analysis/TSE7013/TSE7013.html
analysis/KRX012450/KRX012450.html
analysis/NYSELMT/NYSELMT.html
```

`latest.json` must contain only the newest raw-data pointer:

```json
{
  "latest": "raw_data/20260510_161157_KST.json"
}
```

The updater must not modify the site root `index.html` by default. Create or update the standalone analysis page only. Add index/home links only when the user explicitly requests them.

## GitHub Pages URL Rule

The final page must be reachable as:

```text
https://HyangDan2.github.io/analysis/{MARKET}{TICKER}/{MARKET}{TICKER}.html
```

Examples:

```text
https://HyangDan2.github.io/analysis/TSE7013/TSE7013.html
https://HyangDan2.github.io/analysis/KRX012450/KRX012450.html
https://HyangDan2.github.io/analysis/NYSELMT/NYSELMT.html
```

## Language Rule

Default language set:

- `ko`
- `en`
- `ja`

Every generated user-facing analysis field must provide all requested languages.

Standard multilingual object:

```json
{
  "ko": "...",
  "en": "...",
  "ja": "..."
}
```

If a translation cannot be generated confidently, the updater must still provide a short neutral version and record the limitation in `data_quality.notes`.

The UI language buttons should use:

- `KOR`
- `ENG`
- `JPN`

For future expansion, the updater may support local-language sets, but `ko/en/ja` is the baseline for this project.

## Target Identity Verification Rule

Before generating analysis, the updater must verify the target identity from trusted sources.

Required identity fields:

- company name
- market
- ticker
- exchange
- currency
- sector or industry
- official company website or IR page, when available

If `company_hint` conflicts with verified identity, the updater must stop or write a clear failure report. Do not silently proceed with a mismatched company.

Examples:

- `TSE 7013` must verify as IHI Corporation.
- `TSE 7011` must verify as Mitsubishi Heavy Industries.
- `KRX 012450` must verify as Hanwha Aerospace.
- `NYSE LMT` must verify as Lockheed Martin.

## Market-Specific Source Rule

Use market-appropriate primary sources first.

TSE / Japan:

- Company IR
- JPX
- TDnet
- Kabutan or other auditable market-data pages
- Japanese reputable news sources

KRX / Korea:

- Company IR
- DART
- KRX
- Naver Finance / FnGuide / other auditable market-data pages
- Korean reputable news sources

NYSE / NASDAQ / US:

- Company IR
- SEC filings
- Earnings releases and transcripts
- Exchange or auditable market-data pages
- Reputable financial news sources

Europe:

- Company IR
- Exchange pages such as Xetra, LSE, Euronext, Borsa Italiana
- Regulatory filings
- Reputable regional and global news sources

## Required JSON Schema

Each raw data JSON must include:

```json
{
  "schema_version": "1.1.0",
  "generated_at": "...",
  "input": {},
  "identity": {},
  "as_of": {},
  "price_snapshot": {},
  "recent_prices": [],
  "monthly_prices": [],
  "financials": {},
  "business_segment_map": [],
  "peer_group": [],
  "news_events": [],
  "technical_view": {},
  "trading_scenarios": {},
  "sources": [],
  "data_quality": {},
  "disclaimer": {}
}
```

Backward compatibility:

- Existing pages may use `target` instead of `identity`.
- Existing pages may use `segment_sector_map` instead of `business_segment_map`.
- New updaters should prefer `identity` and `business_segment_map`, but may emit aliases if the current page renderer requires them.

## Date Rule

The updater must distinguish:

- `generated_at`: when the JSON was generated
- `as_of.page_date`: the analysis date
- `as_of.market_data_date`: the latest market close used
- `timezone`: normally `Asia/Seoul` for this project

If the analysis date falls on a weekend or market holiday, use the latest confirmed trading day and explain this in all requested languages.

## Price Data Rule

`price_snapshot` must include:

- source
- date
- open
- high
- low
- close
- change
- change_percent
- volume
- currency

`recent_prices` should include enough OHLCV rows to draw a useful chart. Prefer at least 60 trading days when available.

`monthly_prices` should include at least 12 months when available.

If complete price history is unavailable, the updater must record the limitation in `data_quality.notes`.

## Financial Rule

The updater must extract, estimate, or clearly mark unavailable:

- revenue
- operating profit
- profit before tax
- net income or profit attributable to owners
- EPS
- BPS
- PER
- PBR
- ROE
- operating margin
- debt ratio
- equity ratio
- total assets
- total equity
- cash flow from operations
- dividend, if relevant
- next-year guidance, if available

All units must be explicit.

The financial analysis text must be generated as three short paragraphs in each requested language:

1. earnings quality and forecast momentum
2. valuation using PER, PBR, EPS, and BPS
3. balance-sheet risk using equity ratio, debt ratio, cash flow, and order or revenue conversion

## Business Segment Map Rule

The updater must generate a business segment map based on the actual company, not a fixed template.

Each item must include:

- `segment_id`
- `segment_name.ko/en/ja`
- `company_relevance`
- `segment_linkage.ko/en/ja`
- `tickers`
- `drivers`
- `risk_factors`
- `price_linkage.ko/en/ja`

Allowed `company_relevance` values:

- `direct`
- `direct_adjacent`
- `adjacent`
- `comparison`

The segment analysis must be written as approximately three paragraphs:

1. company business exposure and strategic relevance
2. global peer set and macro/industry drivers
3. how that segment links to the target stock price, including whether the link is direct or indirect

For backward compatibility with current TSE7013 pages, the updater may also emit:

- `segment_sector_map`
- `ihi_relevance`
- `ihi_linkage`

But new generic pages should use `business_segment_map`, `company_relevance`, and `segment_linkage`.

## Peer Group Rule

The updater must build peers from three layers:

1. same-market peers
2. global sector peers
3. business-segment peers

Each peer should include:

- company
- ticker
- market or exchange
- region
- currency
- price
- market cap
- PER
- PBR, if available
- ROE, if available
- revenue or sales, if available
- short multilingual peer analysis

Each peer analysis must be approximately three paragraphs:

1. business role and why the peer matters to the target company
2. valuation or earnings comparison
3. read-through to the target stock price or sector narrative

Do not hard-code IHI peers for unrelated companies. Use IHI/MHI/Kawasaki only when analyzing Japanese heavy industry or when they are genuinely relevant.

## News And Price Linkage Rule

`news_events` should include 8 to 12 items by default, unless the target has limited public news flow.

Every news item must include:

- date
- title
- source
- URL, when available
- related tickers
- sentiment
- impact horizon
- observed price reaction, if available
- multilingual interpretation

Allowed sentiment values:

- `positive`
- `mixed`
- `negative`
- `neutral`

Allowed impact horizons:

- `short`
- `medium`
- `long`

The price linkage must explain whether the event is:

- already priced in
- a new catalyst
- an execution-risk warning
- a one-off accounting item
- a long-term structural support

When possible, connect event dates to nearby 1-day, 5-day, and 20-day price movement. If exact event-study data is unavailable, say so plainly.

## Technical Analysis Rule

The updater must compute or infer:

- support zones
- resistance zones
- trend state
- risk state
- 5-day moving average
- 20-day moving average
- 60-day moving average
- 120-day moving average, if enough data exists
- RSI, if enough data exists
- volume expansion or contraction

If full calculation data is not available, the updater must use observed price zones and label the result as chart-structure analysis rather than indicator calculation.

`technical_view.trend_state.ko/en/ja` must be written as approximately three paragraphs:

1. current trend structure and recent price movement
2. support, resistance, breakout, and invalidation zones
3. volume, momentum, and confirmation conditions

`technical_view.risk_state.ko/en/ja` may be shorter, but must clearly state the invalidation price zone and next upside confirmation zone.

## Trading Scenario Rule

The updater must produce three scenarios:

- short term
- medium term
- long term

Each scenario must include:

- setup
- entry or observation condition
- confirmation condition
- invalidation or risk condition
- fundamental or technical basis

Each scenario body must be approximately three paragraphs:

1. main setup and price or fundamental trigger
2. execution approach, such as staged entry, confirmation, or position reduction
3. risk condition and invalidation logic

Never present scenarios as guaranteed outcomes. Use research wording, not instruction wording.

## Static Page Rendering Rule

The generated HTML page should:

- load `latest.json`
- load the referenced raw JSON
- support language switching
- render chart, financials, segment map, peers, news, technical view, trading scenarios, sources, and disclaimer
- show a clear error message if opened through `file://`
- degrade gracefully if a CDN chart library fails

No private API key may be embedded in client-side JavaScript.

## GitHub Pages Rule

The updater must assume there is no backend server.

Allowed:

- static HTML
- static CSS
- static JavaScript
- static JSON
- public CDN libraries

Not allowed:

- server-only secrets
- private API keys in browser JavaScript
- runtime database writes from the page
- paid API calls directly from public client code

## Data Quality Rule

The updater must include `data_quality` with:

- `status`: `complete`, `partial`, or `failed`
- `missing_fields`
- `stale_fields`
- `notes`
- `source_confidence`

If a required data source is unavailable:

1. Keep the previous valid `latest.json` unchanged.
2. Do not overwrite a valid raw data file with partial data unless explicitly allowed.
3. Write limitations into `data_quality.notes`.
4. Prefer partial output only when the page can clearly show what is missing.

## Auditability Rule

Every numeric or factual claim should map to at least one source item.

Each source item should include:

- title
- URL
- publisher or owner
- usage purpose
- data date, when known
- access date or generated date

## Things The Updater Must Not Do

- It must not confuse tickers or companies.
- It must not drop leading zeros in tickers such as KRX `012450`.
- It must not fabricate prices, earnings, or source names.
- It must not overwrite historical raw data files.
- It must not expose private API keys.
- It must not remove old raw data unless explicitly requested.
- It must not output only one language for user-facing analysis when the requested language set has multiple languages.
- It must not use a fixed peer list for every company.
- It must not treat all news as direct catalysts.

## Recommended Run Order

1. Normalize `market + ticker`.
2. Build `{MARKET}{TICKER}` output paths.
3. Verify target identity.
4. Fetch latest market date and price snapshot.
5. Fetch recent chart data.
6. Fetch latest official financials.
7. Build the business segment map.
8. Build same-market, global, and segment peer groups.
9. Fetch recent company, sector, and macro news.
10. Link news to price movement where possible.
11. Generate multilingual financial, segment, peer, technical, and scenario analysis.
12. Validate JSON schema.
13. Write timestamped raw data.
14. Update `latest.json` only after successful validation.
15. Optionally update or generate the static HTML/CSS/JS page.
16. Optionally commit and push.

## Backward Compatibility Notes

The existing page:

```text
analysis/TSE7013/TSE7013.html
```

may continue to use:

- `target`
- `segment_sector_map`
- `ihi_relevance`
- `ihi_linkage`

New generic pages should prefer:

- `identity`
- `business_segment_map`
- `company_relevance`
- `segment_linkage`

The updater may emit both old and new keys during a transition period.
