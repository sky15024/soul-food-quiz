---
name: i18n-quiz
description: 在心理測驗或趣味測驗需要加入多語系（繁中、英文等）切換功能時啟用。涵蓋 i18n 架構設計、UI 文字翻譯、題目翻譯、結果翻譯、語言切換器 UI 與 CSS、進度保留切換邏輯、行動裝置相容性等完整流程。參考實作：hidden-power-quiz。
---

# 測驗多語系技能（i18n-quiz）

基於 `hidden-power-quiz` 的實戰經驗。支援語言：**繁體中文（zh-TW）** 與 **英文（en）**，架構可擴充。

---

## 1. 檔案架構

```
quiz-project/
├── questions.js   ← 繁中原始題目（原有）
├── i18n.js        ← 新增：所有多語系內容（UI + 題目 + 結果）
├── app.js         ← 修改：讀取 i18n 題目與結果
└── index.html     ← 修改：加入切換器 UI、data-i18n 屬性
```

### ⚠️ 載入順序（關鍵）

```html
<script src="questions.js"></script>   <!-- 1. 先載入 zh-TW 題目 -->
<script src="i18n.js"></script>        <!-- 2. i18n 此時才能拿到 questions -->
<script src="app.js"></script>         <!-- 3. 最後載入邏輯 -->
```

> ❌ **若 `i18n.js` 在 `questions.js` 之前載入**：`zh-TW` 題目會拿到空陣列 `[]`，切換回繁中時題目全部消失。

---

## 2. i18n.js 架構

### 全域變數

```javascript
// 1. 讀取儲存的語言偏好（預設 zh-TW）
window.__lang = (function() {
  try { return localStorage.getItem('quiz-lang') || 'zh-TW'; } catch(e) { return 'zh-TW'; }
})();
```

### 結果 Meta（語言無關的部分）

```javascript
// 星等、圖片、稀有度不需要翻譯，抽出來共用
var _resultMeta = {
  type_key: { stars: 3, image: 'images/result.png', rarity: 'RARE', rarityColor: '#5b8cff', emoji: '⚡' },
  // ...
};
```

### UI 文字對照表

```javascript
window.__i18n = {
  ui: {
    'zh-TW': {
      eyebrow:           '✦ 隱藏天賦診斷系統 ✦',
      title:             '你的<br><span class="title-highlight">隱藏超能力</span><br>是什麼？',
      subtitle:          '10 道直覺題目，測出你的神秘天賦',
      btn_start:         '開始測你的隱藏超能力',
      view_count_suffix: ' 人測出自己的稀有等級',
      quiz_masthead:     '⚡ 隱藏超能力診斷',
      q_count:           function(n, total) { return '第 ' + n + ' 題，共 ' + total + ' 題'; },
      btn_prev:          '◀ 上一題',
      result_label:      '你的隱藏超能力是',
      share_prompt:      '📸 截圖分享，看看朋友的隱藏超能力是幾星！',
      btn_retry:         '🔄 再測一次（不服氣的請進）',
      copy_toast:        '✓ 已複製！趕快分享你的超能力吧！',
      share_text: function(res) {
        var stars = '★'.repeat(res.stars) + '☆'.repeat(5 - res.stars);
        return stars + ' [' + res.rarity + '] 我的隱藏超能力是「' + res.title + '」！\n' + res.subtitle + '\n\n你的隱藏超能力是幾星？來測看看：';
      },
    },
    'en': {
      eyebrow:           '✦ Hidden Talent Diagnostic System ✦',
      title:             'What\'s Your<br><span class="title-highlight">Hidden Power</span><br>?',
      subtitle:          '10 intuition questions to reveal your innate gift',
      btn_start:         'Discover Your Hidden Power',
      view_count_suffix: ' people have found their rarity',
      quiz_masthead:     '⚡ Hidden Power Diagnosis',
      q_count:           function(n, total) { return 'Q' + n + ' / ' + total; },
      btn_prev:          '◀ Back',
      result_label:      'Your Hidden Power is',
      share_prompt:      '📸 Share your result — see what power your friends have!',
      btn_retry:         '🔄 Try Again',
      copy_toast:        '✓ Copied! Share your hidden power!',
      share_text: function(res) {
        var stars = '★'.repeat(res.stars) + '☆'.repeat(5 - res.stars);
        return stars + ' [' + res.rarity + '] My hidden power is "' + res.title + '"!\n' + res.subtitle + '\n\nWhat\'s your hidden power? Find out here:';
      },
    },
  },
```

### 題目對照表

```javascript
  questions: {
    'zh-TW': typeof questions !== 'undefined' ? questions : [],  // 直接引用 questions.js
    'en': [
      {
        text: 'After work, what\'s the first thing you want to do?',
        hint: 'Don\'t overthink it — what\'s your first instinct?',
        options: [
          { label: 'Crash on the couch and not move', power: 'relax' },
          // ...
        ]
      },
      // 每一題對應 zh-TW 的同一題同一選項順序
    ],
  },
```

> **重點**：選項的 `power`（計分 key）在中英文版本必須相同，只有顯示文字不同。

### 結果文字對照表

```javascript
  resultText: {
    'zh-TW': {
      type_key: {
        title:    '逆向導航系統',
        subtitle: '你能精準預測塞車路段，然後成功開進一條更塞的路',
        desc:     '你的大腦內建交通感知雷達...',
        quote:    '「導航說走這條只要 15 分鐘……」',
        tip:      '你是「過度分析型」人格...',
      },
      // ...
    },
    'en': {
      type_key: {
        title:    'Reverse Navigation System',
        subtitle: 'You predict traffic jams — then take an even worse route',
        desc:     'Your brain has a built-in traffic radar...',
        quote:    '"The GPS said 15 minutes… I drove 40."',
        tip:      'You\'re an over-analyst — but your observational skills are sharp.',
      },
      // ...
    },
  },
};
```

### Helper 函式

```javascript
// 合併 meta + 當前語言文字，回傳完整結果物件
window.__getResult = function(key) {
  var meta = _resultMeta[key] || _resultMeta['fallback'];
  var text = (window.__i18n.resultText[window.__lang] || window.__i18n.resultText['zh-TW'])[key]
          || window.__i18n.resultText['zh-TW']['fallback'];
  return Object.assign({}, meta, text, { __key: key });
};
```

---

## 3. setLanguage 函式

```javascript
window.setLanguage = function(lang) {
  if (!window.__i18n.ui[lang]) return;
  window.__lang = lang;
  try { localStorage.setItem('quiz-lang', lang); } catch(e) {}

  // 更新切換按鈕 active 狀態
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  var ui = window.__i18n.ui[lang];

  // HTML（含 <br> <span> 的欄位）用 innerHTML
  ['title', 'subtitle'].forEach(function(key) {
    var el = document.querySelector('[data-i18n="' + key + '"]');
    if (el) el.innerHTML = ui[key];
  });

  // 純文字欄位用 textContent
  ['eyebrow','quiz_masthead','btn_prev','result_label','share_prompt','btn_retry',
   'btn_start','view_count_suffix'].forEach(function(key) {
    document.querySelectorAll('[data-i18n="' + key + '"]').forEach(function(el) {
      el.textContent = ui[key];
    });
  });

  // 進度保留：重新渲染當前畫面
  var quizActive   = document.getElementById('screen-quiz')   ?.classList.contains('active');
  var resultActive = document.getElementById('screen-result') ?.classList.contains('active');

  if (quizActive && typeof renderQuestion === 'function') {
    renderQuestion(currentQ);  // 保留進度，只換題目語言
  }
  if (resultActive && window.__pendingResultKey && typeof renderResult === 'function') {
    renderResult(window.__getResult(window.__pendingResultKey));
  }
};
```

---

## 4. app.js 修改重點

### renderQuestion：讀取當前語言題目

```javascript
function renderQuestion(idx) {
  // 讀取當前語言題目，fallback 到 questions（zh-TW 原始）
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  const q = _qs[idx];
  currentQ = idx;

  // q-count 使用 i18n 函式
  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  document.getElementById('q-count').textContent =
    _ui ? _ui.q_count(idx + 1, _qs.length) : `第 ${idx + 1} 題，共 ${_qs.length} 題`;

  // 其餘渲染照舊...
}
```

### showResult：記錄結果 key，支援語言切換後重繪

```javascript
function showResult() {
  // ... 計算 topPower（結果 key）

  window.__pendingResultKey = topPower;  // ← 必須記錄，讓 setLanguage 能重繪
  pendingResult = window.__getResult ? window.__getResult(topPower) : results[topPower];

  renderResult(pendingResult);
}
```

### shareTo：使用 i18n 分享文案

```javascript
function shareTo(platform) {
  const res = pendingResult;
  const _shareUI = window.__i18n && window.__i18n.ui[window.__lang];
  const text = _shareUI
    ? _shareUI.share_text(res)
    : `${starsText} [${res.rarity}] 我的隱藏超能力是「${res.title}」！\n${res.subtitle}\n\n來測測看：`;
  // ...
}
```

---

## 5. HTML 結構

### 語言切換器 UI

置於 `.container` 內、`screens` 之上，作為 **sticky top bar**：

```html
<div class="container">

  <!-- ============ Lang Bar (sticky) ============ -->
  <div class="lang-bar">
    <div class="lang-switcher" id="lang-switcher">
      <button class="lang-btn active" data-lang="zh-TW" onclick="setLanguage('zh-TW')">繁中</button>
      <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
    </div>
  </div>

  <!-- screens -->
  <div id="screen-intro" class="screen active">...</div>
  <div id="screen-quiz" class="screen">...</div>
  <div id="screen-result" class="screen">...</div>

</div>
```

### data-i18n 屬性

在所有需要翻譯的靜態文字元素加上 `data-i18n` 屬性：

```html
<!-- 首頁 -->
<div class="intro-eyebrow" data-i18n="eyebrow">✦ 隱藏天賦診斷系統 ✦</div>
<h1 class="intro-title" data-i18n="title">你的<br>...</h1>
<p class="intro-subtitle" data-i18n="subtitle">10 道直覺題目...</p>
<span data-i18n="btn_start">開始測你的隱藏超能力</span>
<span data-i18n="view_count_suffix"> 人測出自己的稀有等級</span>

<!-- 測驗頁 -->
<div class="quiz-masthead-mini" data-i18n="quiz_masthead">⚡ 隱藏超能力診斷</div>
<span data-i18n="btn_prev">◀ 上一題</span>

<!-- 結果頁 -->
<div class="result-label" data-i18n="result_label">你的隱藏超能力是</div>
<p class="share-prompt" data-i18n="share_prompt">📸 截圖分享...</p>
<span data-i18n="btn_retry">🔄 再測一次（不服氣的請進）</span>
```

### 初始化腳本

在 `</body>` 前加入：

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof setLanguage === 'function') setLanguage(window.__lang || 'zh-TW');
  });
</script>
```

---

## 6. CSS：語言切換器樣式

### `.lang-bar`（sticky 容器）

```css
.lang-bar {
  position: sticky;
  top: 0;
  z-index: 300;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 4px;
  pointer-events: none;     /* 透明容器，只讓按鈕可點 */
  margin-bottom: -10px;
}
.lang-bar .lang-switcher {
  pointer-events: all;
}
```

### `.lang-switcher`（藥丸形按鈕群）

```css
.lang-switcher {
  z-index: 300;
  display: flex;
  align-items: center;
  background: rgba(250,247,242,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(44,36,22,0.12);
  border-radius: 100px;
  padding: 3px;
  gap: 1px;
  box-shadow: 0 2px 12px rgba(44,36,22,0.1);
}
.lang-btn {
  border: none;
  background: transparent;
  font-size: 14px;           /* ≥ 14px，防止 iOS 自動縮放 */
  font-weight: 700;
  color: rgba(44,36,22,0.4);
  padding: 5px 13px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
  touch-action: manipulation; /* 防止手機雙擊縮放 */
}
.lang-btn.active {
  background: #ffffff;
  color: #2d2416;
  box-shadow: 0 1px 4px rgba(44,36,22,0.12);
}
```

### 英文版大標字型縮放

英文單詞比中文字寬，固定字型在手機上容易撐爆：

```css
.result-title {
  font-size: clamp(20px, 6.5vw, 32px);  /* 手機自動縮小，桌面上限 32px */
  word-break: break-word;
  hyphens: auto;
}
```

---

## 7. Viewport 設定（防手機縮放）

```html
<meta name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## 8. 踩坑紀錄

| 問題 | 原因 | 解法 |
|---|---|---|
| 切回繁中後題目還是英文 | `i18n.js` 在 `questions.js` 之前載入，`zh-TW` 拿到空陣列 | 改載入順序：`questions.js → i18n.js → app.js` |
| 切換語言測驗進度消失 | `setLanguage` 呼叫 `renderQuestion` 時沒傳入 `currentQ` | `renderQuestion(currentQ)` 保留索引重繪 |
| 結果頁切換語言沒更新 | 沒記錄目前結果 key | `window.__pendingResultKey = topPower` 記錄 key，`setLanguage` 時重呼叫 `renderResult` |
| JS 程式碼顯示在頁面上 | PowerShell 插入 `<script>` 時漏掉開頭標籤 | 確認 `<script>` 與 `</script>` 數量對稱 |
| 語言按鈕隨頁面捲動 | `position: fixed` 被 `body { overflow-x: hidden }` 破壞 | 改用 `position: sticky` 的 `.lang-bar` 包裝 |
| `position: fixed` 在手機失效 | 任何含 `overflow: hidden` 的父元素都可能破壞 fixed | 改用 `position: sticky` + `.lang-bar` 在 `.container` 頂部 |
| 手機點按鈕意外縮放 | `font-size < 16px` 觸發 iOS 自動縮放 | `font-size: 14px` + `touch-action: manipulation` + viewport `user-scalable=no` |
| 英文結果標題太大、佔太多行 | 英文單詞比中文字符寬，固定字型在手機上爆版 | `font-size: clamp(20px, 6.5vw, 32px)`，讓字型自適應寬度 |
| `data-i18n` 切換後 HTML 標籤消失 | 對含 `<br>` `<span>` 的欄位用 `textContent` 而非 `innerHTML` | `title`、`subtitle` 等 HTML 欄位必須用 `innerHTML` 賦值 |
| 多個 `DOMContentLoaded` 重複觸發 | 多次插入初始化腳本造成重複 | 只保留一個 init script，並確認去重 |

---

## 9. 英文版文案長度規範

> **核心原則**：英文單詞遠比中文字元寬，相同字型大小下英文會佔用 2–3 倍的水平空間。在手機螢幕（375–430px）上若不控制文案長度，結果頁會顯得冗長、佔滿整個螢幕。

### 各欄位字數上限建議

| 欄位 | 中文長度參考 | 英文建議上限 | 說明 |
|---|---|---|---|
| `title` | 5–8 字 | **3–4 個英文單詞** | 結果標題；超過 4 個詞在手機上容易佔 3 行 |
| `subtitle` | 15–25 字 | **10–15 個英文單詞** | 一句話摘要，建議用破折號 `—` 分多個概念 |
| `desc` | 3–4 句 | **2 句以內** | 核心描述；保留最精華的笑點，刪掉補充說明 |
| `quote` | 20–30 字 | **≤ 15 個英文單詞** | 引述語；越短越有力 |
| `tip` | 2 句 | **1 句（含人格標籤）** | 格式：`"[形容詞] type — [一句話點評]"` |

### 範例對照

```
❌ 太長：
desc: "Your brain has a built-in traffic radar calibrated entirely backwards.
       It guides you straight into hell routes with 100% accuracy.
       You're the person even Google Maps wants to give up on.
       Friends have a standing rule: if you say turn left, they turn right."

✅ 合適：
desc: "Your built-in traffic radar is calibrated entirely backwards —
       steering you into worse routes with perfect accuracy.
       Friends have one rule: whatever you suggest, they go the other way."
```

```
❌ 太長：
tip: "You're an 'over-analyst' — thinking too much backfires.
      But your observational skills are sharp. The output direction is just reversed."

✅ 合適：
tip: "Over-analyst type — observational skills are sharp, but the output direction is reversed."
```

### 英文文案撰寫技巧

1. **刪掉補充說明**：只留最有衝擊力的一句話，「以防萬一」的解釋都可以刪
2. **用破折號 `—` 合句**：把兩句話合成一句，省空間且更有力
3. **用口語縮寫**：`you're`、`it's`、`can't`，比完整形式短且更生活化
4. **quote 越短越好**：引述語的衝擊力來自簡短，不要超過 15 個詞
5. **tip 固定格式**：開頭直接說人格類型，避免重複主語 `"You're a ... type — [評語]"`

---

## 10. 擴充新語言（未來）

1. 在 `i18n.js` 的 `ui`、`questions`、`resultText` 各加一個語言 key（如 `'ja'`）
2. 在 HTML 的 `.lang-switcher` 新增按鈕 `<button data-lang="ja" onclick="setLanguage('ja')">日本語</button>`
3. 無需改動 `app.js` 或 `setLanguage` 邏輯

---

## 11. 參考實作

- **專案**：`hidden-power-quiz`
- **核心檔案**：`i18n.js`、`app.js`（`renderQuestion`、`showResult`、`shareTo` 函式）
- **已支援語言**：繁體中文（zh-TW）、English（en）
