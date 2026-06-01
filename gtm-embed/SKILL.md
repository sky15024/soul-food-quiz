---
name: gtm-embed
description: 在需要將 Google Tag Manager 埋入前端網頁時啟用。若任務涉及「埋 GTM」、「加 GTM」、「Google Tag Manager 安裝」，應優先套用本技能，自動執行正確的埋點流程並推送到 GitHub。
---

# GTM 埋點技能

此技能定義將 Google Tag Manager 標準埋點程式碼正確插入 HTML 檔案的完整流程。

---

## 固定 GTM Container ID

本專案統一使用以下 Container ID，除非使用者明確指定其他 ID，否則一律使用此值：

```
GTM-5SL4XJ6V
```

---

## 埋點位置規範（GTM 官方要求）

### 位置一：`<head>` 最頂端
- **放在 `<meta charset>` 與 `<meta viewport>` 之後，所有外部資源（Firebase SDK、Google Fonts、CSS）之前**
- GTM 必須是第一個載入的外部腳本，確保所有 pageview 都能被正確捕捉
- ⚠️ **嚴禁將 GTM 放在 Firebase SDK、Google Fonts 或任何 `<script src>` 之後**，否則 GTM 後台將無法記錄到資料

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5SL4XJ6V');</script>
  <!-- End Google Tag Manager -->

  <title>...</title>
  <!-- 之後才是 Fonts、CSS、Firebase 等資源 -->
  ...
```

### 位置二：`<body>` 開頭標記正後方
- **緊接在 `<body ...>` 開頭標記後的第一行**
- 此為 JavaScript 停用時的 noscript fallback

```html
<body ...>

  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5SL4XJ6V"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager -->

  ...
```

---

## 執行流程

### 1. 讀取目標 HTML 檔案
使用 `view_file` 確認：
- `<head>` 的起始行號（第一個 `<meta>` 之前）
- `<body>` 的起始行號（通常含 class / style 屬性跨多行）

### 2. 確認是否已埋過
搜尋檔案是否已存在 `GTM-5SL4XJ6V` 字串，若已存在則**跳過埋點步驟**，直接告知使用者已埋過。

### 3. 使用 multi_replace_file_content 插入
同時修改兩個位置（head + body），在一次呼叫中完成，避免多次修改造成行號偏移問題。

### 4. 推送到 GitHub
完成埋點後，依照 git-push 技能流程推送：
```bash
git add index.html   # 或實際修改的 HTML 檔名
git commit -m "chore: 埋入 Google Tag Manager (GTM-5SL4XJ6V)"
git push origin main --force-with-lease
```

---

## 注意事項

- 若專案有多個 HTML 檔案（如 `index.html`、`404.html`），需分別詢問使用者要埋哪幾個。
- 若 `<body>` 標記跨多行（含 class、style），TargetContent 需完整比對多行內容。
- 不可使用 `git add .`，只暫存本次修改的 HTML 檔案。
- 埋點完成後告知使用者可至 GTM 後台點擊「預覽（Preview）」模式進行驗證。

---

## ⛔ 常見錯誤（已發生過，禁止重犯）

### 錯誤一：GTM 放在 Firebase SDK 或其他外部腳本之後
**症狀**：GTM 後台完全沒有流量紀錄，即使代碼本身語法正確。  
**原因**：GTM 載入太慢，部分 pageview 事件在 GTM 初始化前就已觸發，導致漏記。  
**正確做法**：GTM 必須放在所有 `<script src>` 之前，只有 `<meta charset>` 和 `<meta viewport>` 可以在它之前。

```html
<!-- ❌ 錯誤：GTM 放在 Firebase 之後 -->
<head>
  <meta charset="UTF-8">
  <script src="firebase-app.js"></script>  <!-- Firebase -->
  <script src="firebase-firestore.js"></script>
  <script>/* firebase.initializeApp(...) */</script>
  <!-- Google Tag Manager -->
  <script>/* GTM snippet */</script>  <!-- 太晚了！ -->
</head>

<!-- ✅ 正確：GTM 在所有外部腳本之前 -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google Tag Manager -->
  <script>/* GTM snippet */</script>  <!-- 最先載入 ✓ -->
  <!-- End Google Tag Manager -->
  <script src="firebase-app.js"></script>  <!-- Firebase 在後面 -->
</head>
```

---

## 驗證方式

1. GTM 後台 → 選擇 Container → 右上角「Preview」
2. 輸入網站 URL，確認畫面出現「Tag Assistant Connected」
3. 或使用 Chrome 擴充套件「Tag Assistant Legacy」即時確認
