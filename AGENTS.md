# 🏯 2026 關西盛夏避暑之旅 — 專案開發與維護規則 (AGENTS.md)

本文件定義本專案（`Travelplan/2026 Osaka`）的核心架構、旅遊情報檢索規範、實景照片處理 SOP 以及程式碼維護底線。所有在專案中工作的 AI 助理與開發者均須嚴格遵守。

---

## 1. 核心原則與架構規範

1. **唯一真相來源 (SSoT) 雙向同步**：
   * **Markdown SSoT**：所有景點、交通、美食與備案內容以 `plans/` 知識庫目錄 Markdown 文件為最高準則（如 `plans/00_總覽與交通/`、`plans/01_每日行程/`、`plans/03_深度專題/`）。
   * **Web Portal (`docs/`)**：所有網頁（`index.html`、`day-0X.html`、`guide-*.html`、`guides.html`）必須與 Markdown SSoT 100% 內容同步。
2. **部署與帳號隔離**：
   * 本專案為個人 GitHub 帳號 (`aa1662`) 所屬之公開旅遊指南，發布於 `https://aa1662.github.io/2026-Osaka/`。
3. **模式切換規則**：
   * 當使用者訊息開頭為 **`「問: 」`** 時，自動觸發 **純諮詢 / Codebase 探討模式 (Investigatory Mode)**：專注於分析、解答與架構建議，**絕不主動修改檔案或執行改動操作**，直到使用者明確同意（如回覆「同意」、「動手」）後才可執行。

---

## 2. 實景照片挑選與下載 SOP (Photo-Flow)

在為旅遊專案新增、替換或補充封面與景點照片時，必須嚴格執行以下 **Photo-Flow 標準作業程序**：

```
                       【tripQ 實景照片標準作業流程】
                                    │
    ┌────────────────┬──────────────┴────────────────┬────────────────┐
    ▼                ▼                               ▼                ▼
【1. 禁絕 AI 生圖】 【2. 優選攝影師實拍】           【3. 防盜鏈安全下載】 【4. 完整性驗收】
 嚴禁 generate_image  Google Search / 頂級部落格    帶 User-Agent & Referer 檢查 Size > 50KB
 堅持真實旅遊照片     相機旅圖 / Mimi韓 / 官網大圖   避免 403 / 縮圖 / 壞圖   線上 HTTP 200 驗證
```

### 規程細節：

1. **🚫 嚴禁使用 AI 生成圖片 (Zero AI Generated Images)**：
   * 旅遊指南講求「現場真實性」，嚴格禁止使用 `generate_image` 或任何 AI 算圖工具生成景點虛擬插圖。
2. **📸 尋找高水準實景大圖 (High Aesthetic & Resolution)**：
   * **來源優先序**：使用者提供的 Google Search 連結 ➔ 專業攝影旅遊網誌（如《相機旅圖》、《Mimi韓》、樂天旅遊、Jalan、日本國家旅遊局 JNTO）。
   * **構圖震撼度**：挑選具備地標代表性、層次分明（廣角/中焦）與光影優雅的橫幅照片（16:9 或 4:3）。
   * **解析度標準**：原始寬度建議 $\ge 1200\text{px}$，避免模糊縮圖。
3. **🛡️ 防盜鏈安全下載管道 (Safe Fetching Pipeline)**：
   * 使用 Python 腳本下載時，**必須帶上標準 `User-Agent` 與來源站的 `Referer`**，避免被目標網站判定為惡意爬蟲或阻擋防盜鏈（回傳 403 Forbidden 或 1KB 假圖）。
   * **檔案大小與格式校驗**：下載後必須驗證檔案大小（必須 $> 50\text{KB}$），並確保為合法 JPEG/PNG，杜絕將 HTML 錯誤頁面存成 `.jpg` 的問題。
4. **🎨 檔案儲存與 Web 佈局套用**：
   * 圖片存放路徑：`docs/images/{spot_key}.jpg`。
   * **三大呈現位置同步更新**：
     * `docs/day-0X.html`：時間軸卡片左側帶圖（`.timeline-card.has-image` 搭配 `.timeline-image-wrap`）。
     * `docs/guide-{spot}.html`：獨立專題頁頂部全幅 Hero Banner。
     * `docs/guides.html`：專題庫 Bento 卡片封面圖。
5. **🚀 部署與線上驗證 (Deploy & Verify)**：
   * 提交 Git Commit 並 Push 至 GitHub。
   * 使用腳本對 GitHub Pages 上的圖片與頁面進行 HTTP 狀態碼檢驗，確保全數返回 `HTTP 200 OK`。

---

## 3. `tripQ` 多維旅遊情報檢索協議

當使用者詢問旅遊行程、備案比較、餐廳評價或景點優劣時，觸發 `tripQ` 檢索協議，綜合以下維度輸出：

| 維度分類 | 資訊來源與權重 | 著重檢核重點 |
| :--- | :--- | :--- |
| **🇹🇼 台灣社群口碑** | 背包客棧、PTT Japan_Travel、Mobile01、FB 日本旅遊社團 | 台灣家庭/長輩/親子旅客的真實體驗、排隊時間、動線順暢度 |
| **🇯🇵 日本當地權威** | 食べログ (Tabelog 3.5+ 準米其林門檻)、Jalan、Retrip、觀光協會官網 | 日本人真實評價、正宗名物、最新營業與票價規定 |
| **⚡ 即時動態體感** | Threads、Instagram、小紅書、Google Maps 最新 1 個月評論 | 現場施工、暑假人潮擁擠度、近期菜單變動、冷氣/避暑真實體感 |
| **⛅ 官方監測氣象** | 日本氣象廳 (JMA)、山頂 Live WebCam 實況鏡頭 | 8 月盛夏氣溫對比（如山頂 24°C vs 平地 35°C）、降雨機率與起霧時段 |

---

## 4. 備案管理與封存規則 (Archiving Architecture)

* **淘汰或暫時備用的景點攻略**：不直接刪除，而是移動至 `Archived/` 目錄保存（如 `Archived/Guide_甲賀忍者村機關屋敷與忍術體驗.md`、`Archived/Guide_國寶姬路城登大天守與好古園活水軒.md`）。
* **網頁端備用入口**：在 `docs/guides.html` 底部維護「🎒 親子動態 / 🏯 國寶名城 ✕ 備選特輯」，並在主行程時間軸提供輕量備選標籤與跳轉連結。
