---
name: social-share
description: 在需要於前端工具或網頁中加入社群分享功能時啟用。若任務涉及 Facebook、LINE、Instagram、Threads 分享按鈕、複製連結、OG meta tags、LINE 內建瀏覽器(IAB)相容性、結果圖儲存下載，應優先套用本技能。
---

# 社群分享技能

此技能提供前端社群分享功能的完整實作指引。依據需求分為兩種模式：

| 模式 | 適用場景 | 按鈕 |
|---|---|---|
| **基本分享** | 一般工具、文章頁面，只需分享連結 | FB、LINE、IG、Threads、複製連結 |
| **結果圖分享** | 測驗結果、產生圖片的工具，需截圖儲存 | 上述 + 儲存結果圖 |

---

## ⚠️ 重要注意事項（兩種模式共用）

1. **`shareTo` 函式不可宣告為 `async`** — 瀏覽器 popup blocker 會擋掉 async 函式中的 `window.open`，導致第一次點擊沒反應。需要 `await` 的操作（如複製文字）改用 `.then()` 處理。
2. **FB 分享的 `quote` 參數在部分情境被 Facebook 忽略** — 確保頁面有正確的 OG meta tags，部署後 Facebook 會自動抓取頁面資訊作為分享預覽。
3. **OG image 必須使用絕對路徑** — 社群平台無法解析相對路徑，必須填入完整的 `https://` URL。
4. **LINE PC 不可用 `line.me/R/share`** — 會導向 LINE 官網下載頁，PC 端改用 `social-plugins.line.me/lineit/share`。
5. **手機版必須使用 app deep link** — 手機上用 `window.open` 開網頁版分享會讓使用者離開頁面。應優先使用 `fb://`、`line://`、`instagram://` 協議直接喚起 app。
6. **手機版圖片下載用 overlay** — `<a download>` 在多數手機瀏覽器無效。改用 overlay 顯示圖片 + 「長按儲存」提示。

---

## OG Meta Tags 與分享圖（必做！兩種模式都需要）

### 🚨 必須生成專屬分享圖（og-image.png）

**每個工具/頁面完成後，都必須生成一張專屬的 OG 分享圖。** 這張圖會在 LINE、Facebook、Threads 等平台分享連結時自動顯示為預覽卡片。不可省略、不可用通用 logo 代替。

#### 步驟

1. **使用 `generate_image` 工具生成圖片**，Prompt 需包含：
   - 工具/測驗的主題視覺（如大腦、星座、動物等）
   - 中文標題文字（如「你的心理年齡是幾歲？」）
   - 尺寸指定：1200×630px 橫向
   - 風格：現代、吸睛、深色/漸變背景、霓虹 accent
   - 明確寫 `No device frames`

2. **將圖片複製到專案根目錄**，命名為 `og-image.png`：
   ```
   copy "生成的圖片路徑" "專案目錄/og-image.png"
   ```

3. **⚠️ 驗證檔案真實格式**（`generate_image` 工具產出的檔案實際上是 JPEG，但副檔名為 `.png`）：
    ```powershell
    # 檢查 magic bytes：PNG 開頭是 0x89 0x50，JPEG 開頭是 0xFF 0xD8
    $bytes = [System.IO.File]::ReadAllBytes("og-image.png")
    ($bytes[0..3] | ForEach-Object { '0x{0:X2}' -f $_ }) -join ' '
    ```
    - 若輸出為 `0xFF 0xD8 0xFF 0xE0`（JPEG），**必須將副檔名改為 `.jpg`**：
      ```
      Rename-Item "og-image.png" "og-image.jpg"
      ```
    - 然後 HTML 中的 `og:image` 路徑也必須對應改為 `.jpg`
    - **不修正會導致 LINE 無法顯示分享預覽圖**（LINE 爬蟲嚴格驗證副檔名與實際格式是否一致）

4. **在 `<head>` 中加入 OG meta tags**，`og:image` 必須用**絕對路徑**（副檔名須與實際格式一致）：
   ```html
   <!-- Open Graph / Facebook -->
   <meta property="og:type" content="website">
   <meta property="og:title" content="頁面標題 - 吸引人的副標">
   <meta property="og:description" content="2-3句吸引人的描述，讓人想點進來">
   <meta property="og:image" content="https://你的網域/og-image.jpg">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   <meta property="og:url" content="https://你的網域/">
   <meta property="twitter:card" content="summary_large_image">
   <meta property="twitter:image" content="https://你的網域/og-image.jpg">
   ```

5. **部署後到 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 貼上網址，點「Scrape Again」強制更新快取**

#### og:image 規範

| 項目 | 要求 |
|---|---|
| 尺寸 | **1200×630px**（橫向，社群預覽標準比例）|
| 格式 | PNG 或 JPG |
| 內容 | **與該工具/測驗主題直接相關**，不可用通用 logo |
| 路徑 | **必須是絕對 URL**（`https://...`），相對路徑社群平台無法抓取 |
| 文字 | 包含中文標題，字體清晰可讀 |

#### 常見錯誤

| 錯誤 | 後果 |
|---|---|
| 沒放 og-image | 分享時沒有預覽圖，或被抓到其他不相關的圖 |
| og:image 用相對路徑 `og-image.png` | Facebook/LINE 無法抓取，顯示空白 |
| 用其他專案的通用 logo | 使用者分辨不出是什麼工具，點擊率低 |
| 忘記清 Facebook 快取 | 改了圖但 FB 還是顯示舊的 |
| **🚨 `generate_image` 產出的圖存成 `.png` 但實際是 JPEG** | Facebook/Threads 能自動偵測格式所以正常，**但 LINE 爬蟲嚴格驗證副檔名與實際格式是否一致，不符就不顯示預覽圖**。必須用 magic bytes 驗證後改為正確副檔名 `.jpg` |

---

# 模式一：基本分享（不需截圖）

適用於一般工具頁面、文章頁面，只需分享連結與文字。

## HTML

```html
<div class="share-buttons">
  <button class="share-btn share-fb" onclick="shareTo('fb')" title="Facebook">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  </button>
  <button class="share-btn share-line" onclick="shareTo('line')" title="LINE">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
  </button>
  <button class="share-btn share-ig" onclick="shareTo('ig')" title="Instagram">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  </button>
  <button class="share-btn share-threads" onclick="shareTo('threads')" title="Threads">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.733 2.064-1.146 3.524-1.233 1.094-.065 2.11.044 3.043.288-.058-1.097-.393-1.93-.998-2.476-.68-.614-1.698-.926-3.032-.926h-.064c-1.076.013-1.96.272-2.625.77l-1.12-1.643c.953-.678 2.18-1.058 3.66-1.127l.147-.003c1.876 0 3.399.52 4.53 1.546.995.902 1.613 2.18 1.838 3.794.396.168.768.366 1.113.59 1.14.738 1.975 1.726 2.417 2.862.786 2.02.657 4.836-1.594 7.039C19.086 22.48 16.83 23.277 13.76 23.304zm-.9-5.918c1.161-.064 2.043-.467 2.621-1.2.463-.587.78-1.379.94-2.353-.94-.283-1.965-.418-3.062-.357-1.778.1-2.86.882-2.806 2.022.028.491.263.947.662 1.288.477.406 1.14.627 1.862.627.1 0 .243-.012.384-.027z"/></svg>
  </button>
  <button class="share-btn share-copy" onclick="shareTo('copy')" title="複製連結">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
  </button>
</div>
```

## JavaScript

```javascript
// ── 偵測 LINE 內建瀏覽器 ──
function isLineIAB() {
  return /Line/i.test(navigator.userAgent);
}

// ── 偵測手機裝置 ──
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ── 跨瀏覽器複製文字（含 LINE IAB fallback）──
function copyTextFallback(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(str).catch(() => execCopyFallback(str));
  }
  return execCopyFallback(str);
}
function execCopyFallback(str) {
  return new Promise((resolve) => {
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    resolve();
  });
}

// ── 跨瀏覽器開啟連結 ──
function openUrl(url) {
  window.open(url, '_blank');
}

// ── 分享功能（不可加 async！）──
function shareTo(platform) {
  const url = window.location.href;
  const text = '分享文字，依專案需求調整';  // ← 依專案調整
  const fullText = encodeURIComponent(text + ' ' + url);

  // ── 複製連結 ──
  if (platform === 'copy') {
    copyTextFallback(text + '\n' + url).then(() => {
      showShareToast('✅ 已複製到剪貼簿！');
    });
    return;
  }

  // ── IG：複製文字 + 提示 → 開 IG app ──
  if (platform === 'ig') {
    copyTextFallback(text + ' ' + url).then(() => {
      showShareToast('📸 文字已複製！請到 IG 限動或貼文手動貼上');
      setTimeout(() => {
        if (isMobile()) { window.location.href = 'instagram://app'; }
        else { openUrl('https://www.instagram.com/'); }
      }, 600);
    });
    return;
  }

  // ── LINE / Threads / FB ──
  let shareUrl = '';
  switch (platform) {
    case 'line':
      if (isMobile()) {
        // ★ 手機：用 line:// 協議直接開 LINE app 分享，不離開頁面
        shareUrl = `line://msg/text/${encodeURIComponent(text + '\n' + url)}`;
      } else if (isLineIAB()) {
        shareUrl = `https://line.me/R/share?text=${fullText}`;
      } else {
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      }
      break;
    case 'threads':
      shareUrl = `https://www.threads.net/intent/post?text=${fullText}`;
      break;
    case 'fb':
      if (isMobile()) {
        // ★ 手機：先嘗試 fb:// deep link 開 app
        window.location.href = `fb://share/?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        // fallback：若未安裝 FB app，1.5 秒後用網頁版
        setTimeout(() => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        }, 1500);
        return;
      }
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      break;
  }
  if (shareUrl) {
    if (platform === 'line' && isMobile()) {
      window.location.href = shareUrl;  // line:// 需用 location.href
    } else {
      openUrl(shareUrl);
    }
  }
}

// ── Toast 提示 ──
function showShareToast(msg) {
  let toast = document.getElementById('share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(13,13,26,0.95);border:1px solid rgba(167,139,250,0.3);color:#fff;padding:14px 24px;border-radius:16px;font-size:14px;z-index:9999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);text-align:center;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4000);
}
```

---

# 模式二：結果圖分享（需截圖儲存）

適用於測驗結果、產生圖片的工具。在模式一的基礎上，額外加入「儲存結果圖」功能。

## 額外 HTML（加在 share-buttons 最後）

```html
<button class="share-btn share-save" onclick="saveResultImage()" title="儲存結果圖">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
</button>
```

## 額外 CSS

```css
.share-save:hover { background: rgba(6,199,85,0.2); border-color: #06C755; }
```

## 額外 JavaScript

### 圖片下載（一般瀏覽器）

```javascript
function downloadCanvasImage(canvas, filename) {
  try {
    canvas.toBlob(function(blob) {
      if (!blob) { fallbackDataURLDownload(canvas, filename); return; }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 500);
    }, 'image/png');
  } catch(e) {
    fallbackDataURLDownload(canvas, filename);
  }
}

function fallbackDataURLDownload(canvas, filename) {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); }, 500);
}
```

### LINE IAB 圖片 Overlay（同頁顯示，不離開頁面）

**禁止使用 `window.open('', '_self')` 開新頁面顯示圖片** — 會導致無法返回結果頁。

```javascript
function showImageOverlay(dataUrl) {
  const old = document.getElementById('img-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'img-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
  overlay.innerHTML = `
    <img src="${dataUrl}" alt="結果圖" style="max-width:92%;max-height:70vh;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
    <p style="color:#ccc;margin-top:20px;font-size:15px;">📸 請長按圖片儲存</p>
    <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:16px;color:#a78bfa;font-size:14px;background:none;border:1px solid rgba(167,139,250,0.4);border-radius:999px;padding:12px 24px;cursor:pointer;">← 返回</button>
  `;
  document.body.appendChild(overlay);
}
```

> **手機版 saveResultImage 必須用 overlay**：在 `saveResultImage()` 中判斷 `isMobile() || isLineIAB()` 時使用 `showImageOverlay()`，桌面版才用 `canvas.toBlob()` + `<a download>`。

### 儲存結果圖主函式

```javascript
async function saveResultImage() {
  const btn = document.querySelector('.share-save');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> 產生中...';
  btn.disabled = true;

  try {
    const canvas = await captureResultCard(); // ← 依專案實作截圖邏輯

    if (isLineIAB()) {
      // LINE IAB 用 overlay，不離開頁面
      const dataUrl = canvas.toDataURL('image/png');
      showImageOverlay(dataUrl);
      btn.innerHTML = origHTML;
      btn.disabled = false;
      return;
    }

    // 一般瀏覽器用下載
    downloadCanvasImage(canvas, 'result.png');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> 已儲存！';
    btn.style.borderColor = '#06C755';
    setTimeout(() => { btn.innerHTML = origHTML; btn.style.borderColor = ''; btn.disabled = false; }, 2000);
  } catch (e) {
    btn.innerHTML = origHTML;
    btn.disabled = false;
    showShareToast('⚠️ 自動下載失敗，請手動截圖分享');
  }
}
```

> **`captureResultCard()`** 需依專案自行實作，回傳一個 Canvas 元素。

### html2canvas 截圖注意事項

| 規則 | 說明 |
|------|------|
| **`backgroundColor: null`** | 使用透明背景，避免圓角卡片四周出現矩形黑邊 |
| **禁用 `cloneNode` 離螢截圖** | clone 後放在 `left:-9999px` 的容器中，CSS 繼承不完整，截圖品質極差 |
| **禁用 `mix-blend-mode`** | html2canvas 不支援 blend mode，圖片若有黑底會直接顯示 |
| **裝飾圖必須透明 PNG** | 任何會出現在截圖中的裝飾圖片，必須使用真正去背的透明 PNG |
| **直接截圖原始 DOM** | 不 clone、不隱藏、不修改 overflow，直接 `html2canvas(card, { backgroundColor: null })` |

### html2canvas + SVG 雷達圖處理

若結果卡片中有 SVG 元素（如雷達圖），`html2canvas` 無法直接渲染 SVG。需在截圖前將 SVG 轉為點陣圖：

```javascript
async function rasterizeSvgInCard(card) {
  const svgEl = card.querySelector('svg');
  if (!svgEl) return null;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      // 用 base64 取代 Blob URL（避免重複渲染失效）
      const pngDataUrl = c.toDataURL('image/png');
      const replacementImg = document.createElement('img');
      replacementImg.src = pngDataUrl;
      replacementImg.style.cssText = svgEl.style.cssText || '';
      replacementImg.width = svgEl.width.baseVal.value || c.width;
      replacementImg.height = svgEl.height.baseVal.value || c.height;
      svgEl.parentNode.replaceChild(replacementImg, svgEl);
      resolve(replacementImg);
    };
    img.src = url;
  });
}
```

> **為何用 base64 而非 Blob URL？** — Blob URL 在 `cloneNode` 後失效，導致第二次截圖空白。base64 每次都能正常渲染。

### 防止重複點擊截圖

加入 `_saving` 鎖定機制，避免連續點擊導致錯誤：

```javascript
let _saving = false;
async function saveResultImage() {
  if (_saving) return;
  _saving = true;
  const btn = document.querySelector('.share-save');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '產生中...';
  btn.disabled = true;
  try {
    // ... 截圖邏輯
  } catch(e) {
    showShareToast('⚠️ 下載失敗，請手動截圖');
  } finally {
    _saving = false;
    btn.innerHTML = origHTML;
    btn.disabled = false;
  }
}
```

---

## 共用 CSS（兩種模式皆適用）

```css
.share-buttons {
  display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 16px;
}
.share-btn {
  width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.share-btn svg { width: 20px; height: 20px; flex-shrink: 0; }
.share-btn:hover { transform: translateY(-2px); }
.share-line:hover { background: #06C755; border-color: #06C755; }
.share-ig:hover { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); border-color: #dc2743; }
.share-threads:hover { background: #000; border-color: #fff; }
.share-fb:hover { background: #1877F2; border-color: #1877F2; }
.share-copy:hover { background: rgba(167,139,250,0.25); border-color: var(--accent); }
```

---

## 各平台分享 URL 格式總結

| 平台 | 桌面版 | 手機版（deep link）| 備註 |
|---|---|---|---|
| **Facebook** | `https://www.facebook.com/sharer/sharer.php?u={URL}&quote={TEXT}` | `fb://share/?link={URL}&quote={TEXT}` | 手機先嘗試 deep link，1.5s fallback 網頁版 |
| **LINE (手機)** | — | `line://msg/text/{ENCODED_TEXT}` | ★ 直接開 LINE app 分享對話框，不離開頁面 |
| **LINE (IAB)** | — | `https://line.me/R/share?text={ENCODED_TEXT_WITH_URL}` | LINE 內建瀏覽器專用 |
| **LINE (PC)** | `https://social-plugins.line.me/lineit/share?url={URL}&text={TEXT}` | — | 開啟網頁版分享介面 |
| **Instagram (手機)** | — | `instagram://app`（先複製文字）| 先複製再開 app |
| **Instagram (PC)** | `https://www.instagram.com/`（先複製文字）| — | 先複製文字再導向 |
| **Threads** | `https://www.threads.net/intent/post?text={ENCODED_TEXT}` | 同左 | 手機桌面皆可 |

> **`line://` 與 `https://line.me/R/share` 的差異**：`line://msg/text/` 會直接開啟 LINE app 的分享選擇畫面，頁面不會導航離開。而 `line.me/R/share` 會先跳轉到 LINE 網頁再開 app，使用者體驗較差。

---

## 踩坑紀錄與禁止事項

| 禁止行為 | 後果 |
|---|---|
| `shareTo` 宣告為 `async` | PC 第一次點擊被 popup blocker 擋住 |
| LINE IAB 用 `window.open('', '_self')` 開圖片頁 | 無法返回原頁面，回到首頁 |
| OG image 用相對路徑 | Facebook 無法抓取圖片 |
| PC LINE 分享用 `line.me/R/share` | 導向 LINE 官網下載頁 |
| 手機 FB 用 `window.open` 開網頁版 | 不會開啟 FB app，體驗差 |
| 手機 LINE 用 `window.open` + `line.me` 網頁 | 導航離開頁面，使用者無法返回 |
| 手機圖片下載用 `<a download>` | 多數手機瀏覽器不支援，無反應 |
| 手機 IG 導向 `instagram.com` 網頁 | 不會開啟 IG app |
| 分享內文寫死不吸引人 | 降低分享意願，應有 emoji + 互動性文字 |
