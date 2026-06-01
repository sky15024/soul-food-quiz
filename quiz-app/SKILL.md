---
name: quiz-app
description: 在需要製作心理測驗、性格測驗、趣味測驗等互動式測驗工具時啟用。涵蓋三畫面切換架構（首頁→測驗→結果）、題目資料結構、自動跳題、分數計算、結果分類、雷達圖、結果截圖、社群分享整合等完整流程。
---

# 心理測驗製作技能

此技能提供製作互動式心理測驗/趣味測驗的完整架構指引。基於心理年齡測驗的實戰經驗整理。

---

## 架構概覽

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  首頁 INTRO  │ ──→ │  測驗 QUIZ   │ ──→ │  結果 RESULT  │
│  screen-intro│     │  screen-quiz │     │  screen-result│
│              │     │              │     │               │
│ ・測驗標題    │     │ ・進度條      │     │ ・結果數值     │
│ ・副標描述    │     │ ・題目卡片    │     │ ・結果類型     │
│ ・開始按鈕    │     │ ・選項按鈕    │     │ ・結果描述     │
│              │     │ ・上一題按鈕  │     │ ・雷達圖       │
│              │     │              │     │ ・分享按鈕     │
│              │     │              │     │ ・再測一次     │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 三畫面切換機制

### HTML 結構

```html
<div class="container">
  <!-- INTRO -->
  <div id="screen-intro" class="screen active">...</div>
  <!-- QUIZ -->
  <div id="screen-quiz" class="screen">...</div>
  <!-- RESULT -->
  <div id="screen-result" class="screen">...</div>
</div>
```

### CSS

```css
.screen { display: none; }
.screen.active { display: block; }
```

### JavaScript

```javascript
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

---

## 題目資料結構

### 設計原則

1. **每題 4 個選項**（A/B/C/D），固定分數 0/1/2/3
2. **每題有 `hint`**：補充說明，降低使用者理解門檻
3. **每題標註維度**：用註解標明測量什麼，方便維護
4. **選項文字要口語化**：像聊天不像考試，使用者才願意繼續

### 範本

```javascript
const questions = [
  {
    // 維度：好奇心與開放性
    text: '你上次主動去學一件「完全不熟的新事物」是什麼時候？',
    hint: '例如新語言、新軟體、新樂器，工作必要的不算',
    options: [
      { label: '最近就有，我很喜歡嘗試新東西', score: 0 },
      { label: '幾個月前，後來沒繼續', score: 1 },
      { label: '說真的，好幾年前了', score: 2 },
      { label: '我學那麼多幹嘛，會用的就夠了', score: 3 },
    ]
  },
  // ... 更多題目
];
```

### 性別分版題目結構

若測驗需針對不同性別顯示不同用語（如「他」vs「她」），可使用如下結構：

```javascript
const questions = [
  {
    textF: '如果他突然「已讀不回」你的訊息...', // 女生看的題目
    textM: '如果她突然「已讀不回」你的訊息...', // 男生看的題目
    hint: '誠實面對自己的第一反應',
    optionsF: [
      { label: '反而更想知道他在幹嘛', dims: { cold: 2 } },
      // ...
    ],
    optionsM: [
      { label: '反而更想知道她在幹嘛', dims: { cold: 2 } },
      // ...
    ]
  }
];

let userGender = null; // 'female' | 'male'
function getQuestionText(q) { return userGender === 'female' ? q.textF : q.textM; }
function getQuestionOptions(q) { return userGender === 'female' ? q.optionsF : q.optionsM; }
```

首頁需加性別選擇按鈕，選中後才啟用「開始測驗」。

### 題目數量建議

| 題數 | 適合 | 備註 |
|---|---|---|
| 5 題 | 超輕量、社群病毒傳播 | 結果可信度低 |
| **10 題** | **最佳平衡** | **推薦，完成率高且有足夠區分度** |
| 15–20 題 | 較專業的測驗 | 需要更強的 UI 引導避免中途放棄 |

---

## 結果分類資料結構

### 設計原則

1. **分數區間不重疊、不遺漏**
2. **每個結果有專屬圖片**（用 generate_image 生成）
3. **結果描述要有個性**：讓使用者想截圖分享
4. **雷達圖維度分數**：視覺化呈現多面向分析

### 範本

```javascript
const results = [
  {
    min: 0, max: 5,         // 總分範圍
    image: 'img_type1.png', // 結果圖片
    title: '活力充沛型',     // 結果類型名稱（要有記憶點）
    desc: '好奇心旺盛...',   // 結果描述（2-3句，口語化）
    scores: { dim1: 90, dim2: 88, dim3: 85, dim4: 80, dim5: 92 }  // 雷達圖
  },
  // ... 更多結果
];
```

### 結果數量建議

- **最少 3 個**（好/中/差），**推薦 5–8 個**
- 每個結果要有明確差異化的「人設感」

---

## 測驗流程 JavaScript

### 核心狀態

```javascript
let currentQ = 0;
let answers = new Array(questions.length).fill(null);
```

### 開始測驗

```javascript
function startQuiz() {
  showScreen('quiz');
  renderQuestion(0);
}
```

### 渲染題目（含情境插圖）

```javascript
function renderQuestion(idx) {
  const q = questions[idx];
  currentQ = idx;

  // 更新進度
  document.getElementById('q-count').textContent = `第 ${idx + 1} 題，共 ${questions.length} 題`;
  const pct = Math.round((idx / questions.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';

  // 更新題目
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-hint').textContent = q.hint;

  // 情境插圖（q1.png ~ q10.png）
  document.getElementById('q-illust').src = `q${idx + 1}.png`;

  // 渲染選項
  const wrap = document.getElementById('options-wrap');
  wrap.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (answers[idx] === oi ? ' selected' : '');
    btn.innerHTML = `<span class="opt-label">${labels[oi]}</span><span>${opt.label}</span>`;
    btn.onclick = () => selectOption(oi);
    wrap.appendChild(btn);
  });

  // 上一題按鈕
  document.getElementById('btn-prev').disabled = idx === 0;

  // 卡片動畫
  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  card.offsetHeight; // force reflow
  card.style.animation = 'fadeUp 0.35s ease';
}
```

### 選擇選項（自動跳題）

```javascript
function selectOption(oi) {
  answers[currentQ] = oi;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === oi);
  });

  // 選完後自動跳下一題（延遲 500ms 讓使用者看到選取效果）
  setTimeout(() => {
    if (currentQ < questions.length - 1) {
      renderQuestion(currentQ + 1);
    } else {
      showResult();
    }
  }, 500);
}
```

> **不需要「下一題」按鈕** — 選完選項自動跳轉，體驗更流暢。只保留「上一題」按鈕讓使用者可以回頭改。

### 上一題

```javascript
function prevQ() {
  if (currentQ > 0) renderQuestion(currentQ - 1);
}
```

### 計算結果

```javascript
function showResult() {
  // 計算總分
  let total = 0;
  answers.forEach((ai, qi) => {
    if (ai !== null) total += questions[qi].options[ai].score;
  });

  // 對應年齡（依測驗類型調整公式）
  const minScore = 0, maxScore = questions.length * 3;
  const minAge = 12, maxAge = 75;
  const pct = total / maxScore;
  const age = Math.round(minAge + pct * (maxAge - minAge));

  // 找到對應結果
  const res = results.find(r => total >= r.min && total <= r.max) || results[results.length - 1];

  // 填入結果
  document.getElementById('res-age').textContent = age;
  document.getElementById('res-title').textContent = res.title;
  document.getElementById('res-desc').textContent = res.desc;

  // 結果圖片
  const heroImg = document.getElementById('result-hero-img');
  if (heroImg && res.image) {
    heroImg.src = res.image;
    heroImg.alt = res.title;
  }

  // 切換畫面 + 雷達圖 + 慶祝動畫
  showScreen('result');
  setTimeout(() => drawRadar(res.scores), 50);
  setTimeout(launchConfetti, 300);
}
```

### 重測

```javascript
function resetQuiz() {
  answers = new Array(questions.length).fill(null);
  currentQ = 0;
  // ★ 若有首頁全版背景，重新顯示
  document.getElementById('intro-bg').classList.remove('hidden');
  showScreen('intro');
}
```

> **踩坑**：若首頁使用 `position:fixed` 的全版背景（`.intro-bg`），在 `startQuiz()` 時會加 `.hidden` 淡出。`resetQuiz()` 必須移除 `.hidden` 恢復背景，否則重測時首頁無背景圖。

---

## 視覺設計要點

### 配色選項 A：深色神秘系（原版）

適合「占卜、靈魂、命運」等帶有神秘感的測驗主題：

```css
:root {
  --bg: #0d0d1a;
  --card: rgba(255,255,255,0.04);
  --accent: #a78bfa;       /* 紫色系 */
  --accent-dark: #7c3aed;
  --text: #e2e8f0;
  --muted: #94a3b8;
}
```

### 配色選項 B：暖色扁平系（推薦搭配 Flat Illustration 插圖）

適合使用「扁平插畫＋手繪質感」插圖風格的測驗，UI 改成暖色背景後插圖更協調：

```css
:root {
  --bg: #faf7f2;           /* 奶油白 */
  --bg2: #f2ede4;
  --surface: #ffffff;
  --surface2: #f0ebe2;
  --border: rgba(44,36,22,0.1);
  --text: #2d2416;         /* 深棕 */
  --text-muted: rgba(44,36,22,0.62);  /* 淺棕，注意對比度要 ≥ 0.6 才清楚 */
  --accent: #7c6fc4;       /* 柔紫 */
  --accent2: #e8896a;      /* 暖橘 */
  --gold: #e8a030;         /* 暖金 */
}
```

> ⚠️ **暖色系注意事項**：`--text-muted` 透明度不能低於 0.6，否則副標題、hint、label 在白色背景上會看不清楚。建議直接用實色如 `#7a6650` 取代 rgba 避免計算問題。

### 必備動畫

```css
/* 卡片進場 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 選項選中效果 */
.option-btn.selected {
  background: rgba(167,139,250,0.18);
  border-color: var(--accent);
  box-shadow: 0 0 16px rgba(167,139,250,0.15);
}

/* 慶祝紙片 */
@keyframes confettiFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) translateX(var(--tx)) rotate(720deg); opacity: 0; }
}
```

### 進度條

```html
<div class="progress-wrap">
  <div class="progress-header">
    <span id="q-count">第 1 題，共 10 題</span>
    <span id="q-pct">0%</span>
  </div>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" id="progress-fill" style="width:0%"></div>
  </div>
</div>
```

---

## 首頁設計要點

首頁是決定使用者是否開始測驗的關鍵：

1. **Badge 標籤**：`🔮 心理年齡測驗` — 讓人一眼知道這是什麼
2. **主標題要大、要吸睛**：「你幾歲的心理年齡？」
3. **副標要有趣味 + 輕微焦慮感**：「10個荒謬但準確的問題」「⚠️ 建議18歲以上才能承受真相」
4. **Emoji 動畫條**：👶🧒🧑🧓👴 — 視覺暗示年齡跨度
5. **CTA 按鈕醒目**：漸變背景 + hover 動畫

### 首頁全版背景圖

使用 `position: fixed` 的獨立元素鋪滿整個瀏覽器視窗，避免被 `.container` 的 `max-width` 裁切：

```html
<div class="intro-bg" id="intro-bg"></div>
```

```css
.intro-bg { position: fixed; inset: 0; background: url('intro_hero.png') center/cover no-repeat; z-index: 0; pointer-events: none; transition: opacity 0.6s ease; }
.intro-bg::after { content: ''; position: absolute; inset: 0; background: rgba(10,10,20,0.4); }
.intro-bg.hidden { opacity: 0; }
```

> **重點**：背景不可放在 `.container` 或 `#screen-intro` 上（這些有 `max-width`），必須放在 `<body>` 層級的獨立元素。

> **進入測驗時**：`startQuiz()` 中加 `document.getElementById('intro-bg').classList.add('hidden')` 淡出。

> **重測時**：`resetQuiz()` 中移除 `.hidden` 恢復。

---

## 結果頁設計要點

1. **Hero 大圖**：佔據視覺焦點，每種結果不同圖
2. **年齡數字要大、要醒目**：用特殊字型 + 漸變色
3. **結果標題有人設感**：「活力充沛型」比「得分：5分」好 100 倍
4. **雷達圖**：Canvas 繪製，5-6 個維度，視覺上很「專業」
5. **分享提示語**：「📸 截圖分享給朋友，看看他們幾歲」
6. **分享按鈕**：套用 social-share 技能
7. **頁面固定內嵌廣告**：放置於分享區域下方，套用 game-ads 技能（Inline Banner）
8. **再測一次按鈕**：放在最下方

### 結果頁角落圖騰（type-specific）

為每種結果類型設計專屬四角圖騰裝飾，增加精緻感：

```html
<!-- 在 result-card 內動態注入 -->
<div class="corner-ornament" style="top:-10px;left:-10px"><img src="corner_cold.png"></div>
<div class="corner-ornament" style="top:-10px;right:-10px;transform:scaleX(-1)"><img ...></div>
<div class="corner-ornament" style="bottom:-10px;left:-10px;transform:scaleY(-1)"><img ...></div>
<div class="corner-ornament" style="bottom:-10px;right:-10px;transform:scale(-1)"><img ...></div>
```

```css
.corner-ornament { position: absolute; width: 80px; height: 80px; pointer-events: none; z-index: 2; opacity: 0.85; }
.corner-ornament img { width: 100%; height: 100%; object-fit: contain; }
```

> **❗ 角落圖騰必須使用透明背景 PNG**（已去背）。禁止使用 `mix-blend-mode: screen` 來「假裝」去背 — html2canvas 不支援 blend mode，截圖時黑底會直接顯示出來。

同時使用 `data-type` 屬性在 `.result-card` 上切換邊框色和光暈效果：

```css
.result-card[data-type="cold"] { border: 2px solid rgba(100,180,255,0.4); box-shadow: 0 0 30px rgba(100,180,255,0.08); }
.result-card[data-type="sweet"] { border: 2px solid rgba(255,150,180,0.4); box-shadow: 0 0 30px rgba(255,150,180,0.08); }
/* ... 每種類型一組 */
```

---

## 整合清單

製作測驗時，依序整合以下技能：

| 技能 | 用途 |
|---|---|
| **quiz-app**（本技能） | 測驗核心架構 |
| **self-lab 總站整合** | **必做！** 將新測驗加入總站卡片列表 + i18n 翻譯（見 `skills/self-lab/SKILL.md`） |
| **i18n-quiz** | 繁中 / 英文多語系切換（題目、結果、UI 文字全翻譯） |
| **social-share** | 分享按鈕（選「結果圖分享」模式） |
| **page-counter** | 「已有 N 人測過」計數器 |
| **game-ads** | 插頁式廣告或頁面固定內嵌廣告 |
| **gtm-embed** | Google Tag Manager 追蹤 |
| **git-push** | 推送到 GitHub |
| **cloudflare-deploy** | 部署到 Cloudflare Pages |

---

## 題目情境插圖

為每題生成對應情境的插圖，讓測驗不再單調：

### 圖片規範

| 項目 | 要求 |
|---|---|
| 命名 | `q1.png` ~ `q10.png`（題目插圖）、`result_xxx.png`（結果插圖）|
| 風格 | **扁平插畫＋手繪質感（Flat Illustration + Soft Texture）** — 圓潤角色、奶油色或暖色背景、柔和顆粒紋理 |
| 語調 | 幽默日常、有點荒謬、角色表情誇張但可愛 |
| 文字 | **圖上不可有任何文字** |
| 背景 | 配合 UI 設計語言：深色 UI → 深色/透明背景；暖色 UI → 奶油色/暖色背景 |

> ⚠️ **風格一致性**：結果插圖、題目插圖、首頁插圖都必須使用同一套風格。若使用扁平插畫風格，UI 整體也應改為暖色系統（見下方「配色選項 B」），否則視覺語言衝突。

### HTML

```html
<div class="question-card" id="question-card">
  <img class="q-illust" id="q-illust" src="" alt="">
  <p class="q-text" id="q-text"></p>
  <p class="q-hint" id="q-hint"></p>
  <div class="options-wrap" id="options-wrap"></div>
</div>
```

### CSS

```css
.q-illust { display: block; max-width: 60%; max-height: 180px; margin: 0 auto 16px; border-radius: 12px; object-fit: contain; }
```

> **不要用 `mix-blend-mode: screen`**，會把所有顏色打亮（洗白）。此效果僅適用於角落圖騰（黑底去背），不適用於正式插圖。

---

## 背景氛圍裝飾

全頁面加上浮動光暈與粒子效果，避免純黑背景太單調：

### 漸層光暈

```css
body { position: relative; }
body::before, body::after { content: ''; position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(100px); }
body::before { width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,121,168,0.35), transparent 70%); top: 5%; right: -10%; animation: floatOrb1 12s ease-in-out infinite; }
body::after { width: 500px; height: 500px; background: radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%); bottom: 10%; left: -10%; animation: floatOrb2 15s ease-in-out infinite; }
@keyframes floatOrb1 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-60px,80px) } }
@keyframes floatOrb2 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(50px,-70px) } }
```

> **常見問題**：光暈太小或位在畫面外 → 看不到。建議寬高 500px 以上，`top/bottom` 使用百分比值。

### 飄落花瓣 + 閃爍星星

```html
<div class="bg-particles" id="bg-particles"></div>
```

```css
.bg-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.petal { position: absolute; width: 10px; height: 10px; background: radial-gradient(ellipse, rgba(255,182,193,0.7), rgba(255,182,193,0)); border-radius: 50% 0 50% 0; animation: petalFall linear infinite; }
.sparkle { position: absolute; width: 3px; height: 3px; background: #fff; border-radius: 50%; animation: sparkleBlink ease-in-out infinite; }
@keyframes petalFall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 0 } 10% { opacity: 0.7 } 90% { opacity: 0.5 } 100% { transform: translateY(105vh) rotate(360deg) translateX(80px); opacity: 0 } }
@keyframes sparkleBlink { 0%,100% { opacity: 0; transform: scale(0.5) } 50% { opacity: 0.8; transform: scale(1.2) } }
```

```javascript
(function initParticles() {
  const container = document.getElementById('bg-particles');
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (8 + Math.random() * 10) + 's';
    petal.style.animationDelay = Math.random() * 12 + 's';
    container.appendChild(petal);
  }
  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    star.className = 'sparkle';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    star.style.animationDelay = Math.random() * 4 + 's';
    container.appendChild(star);
  }
})();
```

---

## 桌面版響應式字體加大

桌面版（>600px）所有文字都應放大，否則在寬螢幕上顯得過小：

```css
@media(min-width: 601px) {
  .container { max-width: 800px; }
  .intro-title { font-size: 3.2rem; }
  .intro-sub { font-size: 1.25rem; }
  .q-text { font-size: 1.35rem; }
  .q-hint { font-size: 1.05rem; }
  .option-btn { font-size: 1.1rem; padding: 18px 20px; }
  .result-type { font-size: 1.85rem; }
  .result-desc { font-size: 1.1rem; }
  .gender-btn { font-size: 1.1rem; padding: 20px 0; }
  .cta-btn { font-size: 1.15rem; padding: 18px 48px; }
}
```

---

## 踩坑紀錄

| 問題 | 原因 | 解法 |
|---|---|---|
| 選完選項沒反應 | 沒綁 onclick 或 auto-advance 延遲太短 | 500ms 延遲 + 選取視覺回饋 |
| 結果頁「返回」回到首頁 | LINE IAB 用 `window.open('', '_self')` 取代頁面 | 改用同頁 overlay |
| 雷達圖不顯示 | Canvas 在 `display:none` 的元素中無法繪製 | 先 `showScreen('result')` 再 `setTimeout(drawRadar, 50)` |
| 結果圖截圖空白 | `html2canvas` 等函式庫跨域圖片問題 | 用純 Canvas API 手繪結果圖 |
| 分享文死板沒人想點 | 只寫「我的結果是 XX」 | 加 emoji + 互動問句 |
| 插圖被打亮（洗白） | 對插圖使用了 `mix-blend-mode: screen` | 此效果不可用於任何圖片 |
| 首頁背景圖有方框邊界 | 背景放在 `.container`（有 max-width）上 | 改用 `position: fixed` 的獨立 `<div>` 鋪滿視窗 |
| 重測後首頁背景消失 | `startQuiz()` 加了 `.hidden` 但 `resetQuiz()` 沒移除 | 在 `resetQuiz()` 移除 `.hidden` |
| 背景光暈看不到 | 光暈太小或位置為負值（畫面外） | 寬高 500px+，位置用百分比 |
| html2canvas 無法渲染 SVG 雷達圖 | SVG 不被 html2canvas 支援 | 截圖前先將 SVG 轉為 Canvas → base64 PNG，替換進 DOM |
| 下載圖片後再測一次無反應 | `saveResultImage` 未正確解鎖 | 加 `_saving` flag 鎖定，完成後解鎖 |
| 下載圖角落有黑框 | 角落圖騰用 `mix-blend-mode: screen` 去背，html2canvas 不支援 | **圖騰必須用真正透明 PNG**（去背工具處理），禁用 blend mode |
| 下載圖 clone 效果差 | 用 `cloneNode` + 離螢容器截圖，CSS 繼承不完整 | 直接截圖原始卡片，用 `backgroundColor: null`（透明） |
| 手機結果圖太大無法一次截圖 | 各元素尺寸未針對手機縮小 | 加 `@media(max-width:600px)` 縮小 hero、雷達圖、字體、標籤 |
| 手機 `<a download>` 無效 | 多數手機瀏覽器不支援 | 用 overlay 顯示圖片 + 「長按儲存」提示 |
| 裝飾偽元素遮擋文字 | `::before`/`::after` 的摺角三角形在手機上蓋住題目文字 | 裝飾加 `opacity: 0.3; z-index: 0`，文字加 `position: relative; z-index: 1` |
| Drop-cap 行數不匹配 | 首字放大 `float: left` 高度不足，最後一行跑回左邊 | 計算覆蓋行數（每行高 ≈ font-size × line-height），手機版需特別加大 |
| 手機結果頁太長看不完 | 雷達圖、圖片、margin 佔太多空間 | 雷達圖 `max-width: 200px`，圖片縮小，margin/padding 全面壓縮 |
| 標點語感不自然 | 問句前用句號（。你會？）很生硬 | 改用逗號（，你會？）更口語 |
| 結果頁垂直空間浪費 | 分數獨立一區 + 雷達圖標題佔空間 | 分數內嵌到勳章下方（一行式），雷達圖標題可省略 |
| OG 宣傳圖中文不準確 | AI 生圖對中文精準排版有限制 | 準備 1200×630 圖，生成後可能需手動微調文字；若需要保證中文正確，改用 HTML/Canvas 生圖後截圖 |
| Threads 分享按鈕顏色錯誤 | 改成淺色 UI 後，Threads 按鈕繼承了淺色背景導致圖示不明顯 | Threads 按鈕必須**硬寫** `background: #000; color: #fff;`，不隨 UI 主題變動 |
| 暖色 UI 文字看不清楚 | `--text-muted` 透明度太低（0.5），在白色/奶油色背景上對比不足 | 淺色 UI 的 muted 文字要用 ≥ 0.6 透明度，或改用實色如 `#7a6650`；小字（12px 以下）更需特別加深 |
| 首頁插圖擋住 CTA 按鈕 | 插圖放在按鈕上方，在手機上佔太多垂直空間導致按鈕被推很遠 | 插圖應放在「開始按鈕」**下方**作為裝飾，確保 CTA 在第一屏可見 |

---

## Quiz Hub 總站整合（必做）

> ⚠️ **每次製作新測驗，都必須同步將該測驗加入 self-lab 總站。網址可以後補（先填 `'#'` 佔位）。**

詳細規範請參考技能：**self-lab**（`skills/self-lab/SKILL.md`）
