# game-ads SKILL — 廣告整合規範（以 hidden-power-quiz 為標準）

> 本 SKILL 以 `hidden-power-quiz` 專案的廣告實作為唯一標準範本。
> 所有測驗類遊戲廣告整合必須完全遵循本文件。

---

## 1. 廣告架構總覽

每個測驗專案包含**兩種廣告**：

| 廣告類型 | HTML ID / Class | 觸發時機 | 位置 |
|---|---|---|---|
| ✅ Inline（固定橫幅） | `.result-inline-ad` | 結果畫面顯示時即可見 | 分享按鈕下方、重玩按鈕上方 |
| ✅ Interstitial（插頁） | `#ad-interstitial` | 結果顯示後 **3秒** 自動彈出 | fixed，覆蓋全螢幕 |

---

## 2. HTML 結構

### 2-A. Inline 廣告（`.result-inline-ad`）

放在結果區塊（`.result-screen`）內，位於 **分享按鈕下方、重玩按鈕上方**。

```html
<!-- 固定橫幅廣告 -->
<a class="result-inline-ad" href="https://www.gametower.com.tw/Action/partygo/mixytalk0416/index.html?utm_source=quiz&utm_medium=display&utm_campaign=mega_traffic_2026&utm_content=inline_banner" target="_blank" rel="noopener noreferrer">
  <img src="https://ad.gametower.com.tw/Action/partygo/mixytalk0416/banner.png" alt="玩星" class="inline-ad-img">
  <div class="inline-ad-bottom">
    <div class="inline-ad-info">
      <span class="inline-ad-name">玩星</span>
      <span class="inline-ad-desc">免費認證，抽中 iPhone17 !!</span>
    </div>
    <span class="inline-ad-arrow">→</span>
  </div>
  <div class="inline-ad-badge">廣告</div>
</a>
```

> ⚠️ **重要**：`.inline-ad-badge` 是 `.result-inline-ad` 的直接子元素（不在 `.inline-ad-bottom` 裡面），透過 `position: absolute` 固定在圖片右上角。

---

### 2-B. Interstitial 廣告（`#ad-interstitial`）

放在 `</body>` 閉合標籤**之前**，與 Confetti 容器同層。

```html
<!-- 插頁廣告 -->
<div id="ad-interstitial" style="display:none;">
  <div class="ad-inter-backdrop"></div>
  <div class="ad-inter-card">
    <button class="ad-inter-close" onclick="closeAdInterstitial()">✕</button>
    <div class="ad-inter-title">🎉 等你一下</div>
    <div class="ad-inter-msg">這個超多好物在等你 ✨<br>如果覺得不錯，點一下支持我們吧！</div>
    <div class="ad-inter-list">
      <a class="ad-inter-item banner-style" href="https://www.gametower.com.tw/Action/partygo/mixytalk0416/index.html?utm_source=quiz&utm_medium=display&utm_campaign=mega_traffic_2026&utm_content=interstitial" target="_blank" rel="noopener noreferrer">
        <img src="https://ad.gametower.com.tw/Action/partygo/mixytalk0416/banner.png" alt="玩星" class="banner-img">
        <div class="ad-inter-bottom">
          <div class="ad-inter-item-info">
            <span class="ad-inter-item-name">玩星</span>
            <span class="ad-inter-item-desc">免費認證，抽中 iPhone17 !!</span>
          </div>
          <span class="ad-inter-item-arrow">→</span>
        </div>
      </a>
    </div>
    <div class="ad-inter-badge">廣告</div>
  </div>
</div>
```

> ⚠️ **重要**：`.ad-inter-badge`（「廣告」標籤）在 `.ad-inter-card` 底部，**不是**在 `.ad-inter-item` 裡面。

---

## 3. CSS 樣式（完整規範）

以下為 hidden-power-quiz `style.css` 中廣告相關的完整樣式，必須**精確複製**。

### 3-A. Inline 廣告 CSS

```css
/* Inline ad — 分享按鈕下方的固定橫幅 */
.result-inline-ad {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--border);
  margin: 0 0 16px 0;
  text-decoration: none;
  position: relative;
  background: #fff;
}
.inline-ad-img {
  width: 100%;
  height: auto;      /* 不設固定高度，保留圖片原始比例 */
  display: block;
  background: #fff;  /* 防止透明 PNG 在深色背景顯示異常 */
}
.inline-ad-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}
.inline-ad-info { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.inline-ad-name { font-size: 15px; font-weight: 700; color: #111; }
.inline-ad-desc { font-size: 13px; color: #555; }
.inline-ad-arrow { display: none; }

/* badge：固定在圖片右上角 */
.inline-ad-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
}
```

### 3-B. Interstitial 廣告 CSS

```css
/* Interstitial — 全螢幕插頁廣告 */
#ad-interstitial {
  position: fixed;
  inset: 0;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.ad-inter-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(250,247,242,0.85);
  backdrop-filter: blur(4px);
}
.ad-inter-card {
  position: relative;
  z-index: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px 20px 20px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}
.ad-inter-close {
  position: absolute;
  top: 14px; right: 14px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  line-height: 1;
}
.ad-inter-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  text-align: center;
}
.ad-inter-msg {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: center;
}
.ad-inter-item.banner-style {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  background: #fff;
  border: 1px solid #e8e8e8;
}
.banner-img { width: 100%; height: auto; display: block; }
.ad-inter-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}
.ad-inter-item-info { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.ad-inter-item-name { font-size: 15px; font-weight: 700; color: #111; }
.ad-inter-item-desc { font-size: 13px; color: #555; }
.ad-inter-item-arrow { display: none; }

/* badge：在 .ad-inter-card 底部，居中顯示 */
.ad-inter-badge {
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 10px;
}
```

---

## 4. JavaScript 初始化與觸發控制

```javascript
// 插頁廣告：顯示（含 5 秒倒計時鎖定關閉按鈕）
function showAdInterstitial() {
  const el = document.getElementById('ad-interstitial');
  if (!el) return;
  el.style.display = 'flex';
  const closeBtn = el.querySelector('.ad-inter-close');
  closeBtn.disabled = true;
  closeBtn.textContent = '5';
  closeBtn.style.cursor = 'not-allowed';
  closeBtn.style.opacity = '0.5';
  let count = 5;
  const timer = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(timer);
      closeBtn.textContent = '✕';
      closeBtn.disabled = false;
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.opacity = '1';
    } else {
      closeBtn.textContent = count;
    }
  }, 1000);
}

// 插頁廣告：關閉（淡出動畫）
function closeAdInterstitial() {
  const el = document.getElementById('ad-interstitial');
  if (!el) return;
  el.style.opacity = '0';
  el.style.transition = 'opacity 0.3s';
  setTimeout(() => {
    el.style.display = 'none';
    el.style.opacity = '1';
    el.style.transition = '';
  }, 300);
}

// === 觸發範例 ===
// 在顯示結果函式的最後，加上 3 秒延遲彈出插頁廣告：
function showResult() {
  // ... (顯示結果邏輯) ...

  // 3 秒後自動彈出插頁廣告
  setTimeout(() => {
    if (typeof showAdInterstitial === 'function') {
      showAdInterstitial();
    }
  }, 3000);
}
```

> ⚠️ **重要**：`showAdInterstitial` 和 `closeAdInterstitial` 必須在 **同一個 `<script>` 區塊**中定義，且位於 `app.js` 之後。

---

## 5. 常見錯誤與解法

| 問題 | 原因 | 解法 |
|---|---|---|
| 「廣告」badge 不在圖片右上角 | badge 被放進 `.inline-ad-bottom` 裡 | badge 必須是 `.result-inline-ad` 的直接子元素，用 `position: absolute; top: 8px; right: 8px` |
| 廣告圖片被裁切 | 設了 `height: 120px; object-fit: cover` | 改用 `height: auto`，保留圖片原始比例 |
| Inline 廣告寬度異常（未與結果框同寬） | 加了 `max-width: 320px` | 移除 `max-width`，只用 `width: 100%; display: flex; flex-direction: column` |
| 3 秒後插頁不彈出 | 舊版僅留廣告 HTML，沒有 JS 函式 | `showAdInterstitial()` 和 `closeAdInterstitial()` 函式與 `#ad-interstitial` 元素必須在同一頁面 |
| 圖片透明 PNG 顯示黑底 | banner PNG 透明，背景色未設 | 在 `.banner-img`、`.inline-ad-img` 加上 `background: #fff;` |
| `#ad-interstitial` 重複出現 2~3 個 | 多次 patch 未清理舊版 | 每次修改前先確認 `ad-interstitial` 只出現 1 個 div + 1 個 JS 函式 |

---

## 6. 實作完成確認清單

- [ ] `#ad-interstitial` HTML 位於 `</body>` 之前
- [ ] `.result-inline-ad` 位於分享按鈕下方、重玩按鈕上方
- [ ] `.inline-ad-badge` 是 `.result-inline-ad` 直接子元素（非 `.inline-ad-bottom` 子元素）
- [ ] `.ad-inter-badge` 在 `.ad-inter-card` 底部（非 `.ad-inter-item` 內部）
- [ ] 廣告圖片 CSS 使用 `height: auto`（非固定高度）
- [ ] `showAdInterstitial()` 在 `showResult()` 中以 `setTimeout(..., 3000)` 觸發
- [ ] 點「✕」關閉按鈕後，插頁廣告正確消失（有淡出動畫）
- [ ] 插頁關閉按鈕倒數 5 秒後才可點擊
- [ ] 廣告圖片背景設 `background: #fff`（防透明 PNG 異常）
- [ ] `#ad-interstitial` 全頁只出現一次

---

## 7. 目前使用的廣告素材

以下為統一使用的廣告素材，已寫入上方 HTML 範本中：

```
廣告連結 URL: https://www.gametower.com.tw/Action/partygo/mixytalk0416/index.html
廣告圖片 URL: https://ad.gametower.com.tw/Action/partygo/mixytalk0416/banner.png
廣告名稱: 玩星
廣告說明: 免費認證，抽中 iPhone17 !!
```

> ⚠️ **UTM 追蹤識別（必做）**：上方範本中的 `utm_source=quiz` 是佔位值，**實作時必須替換為該測驗的專案名稱**（即資料夾名稱 / slug），例如 `utm_source=hidden-power-quiz`、`utm_source=mental-age-quiz`。這樣才能在 GA 後台區分每個測驗的廣告點擊來源。`utm_content` 則用來區分廣告版位：`inline_banner`（固定橫幅）和 `interstitial`（插頁）。

> 若未來需要替換廣告素材，修改上方 HTML 範本中的圖片 URL 和連結 URL 即可（inline + interstitial 各一組）。

---

*最後更新：2026-05-29*