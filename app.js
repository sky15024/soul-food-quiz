let currentQ = 0;
let answers = [];

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startQuiz() {
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  answers = new Array(_qs.length).fill(null);
  showScreen('quiz');
  renderQuestion(0);
}

function renderQuestion(idx) {
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  const q = _qs[idx];
  currentQ = idx;

  const _ui = window.__i18n && window.__i18n.ui[window.__lang];
  document.getElementById('q-count').textContent = _ui ? _ui.q_count(idx + 1, _qs.length) : `第 ${idx + 1} 題，共 ${_qs.length} 題`;
  
  const pct = Math.round((idx / _qs.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';

  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-hint').textContent = q.hint;

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

  document.getElementById('btn-prev').disabled = idx === 0;

  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  card.offsetHeight; // force reflow
  card.style.animation = 'fadeUp 0.35s ease';
}

function selectOption(oi) {
  answers[currentQ] = oi;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === oi);
  });

  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  setTimeout(() => {
    if (currentQ < _qs.length - 1) {
      renderQuestion(currentQ + 1);
    } else {
      calculateResult();
    }
  }, 400);
}

function prevQ() {
  if (currentQ > 0) renderQuestion(currentQ - 1);
}

function calculateResult() {
  const scoreMap = {};
  const _qs = (window.__i18n && window.__i18n.questions[window.__lang]) || questions;
  
  answers.forEach((ai, qi) => {
    if (ai !== null) {
      const optionScores = _qs[qi].options[ai].scores;
      for (const key in optionScores) {
        scoreMap[key] = (scoreMap[key] || 0) + optionScores[key];
      }
    }
  });

  let topPower = 'hotpot';
  let maxScore = -1;
  for (const key in scoreMap) {
    if (scoreMap[key] > maxScore) {
      maxScore = scoreMap[key];
      topPower = key;
    }
  }

  window.__pendingResultKey = topPower;
  const res = window.__getResult ? window.__getResult(topPower) : null;
  if(res) {
    renderResult(res, true);
  }
}

function renderResult(res, showAd = false) {
  document.getElementById('res-title').innerHTML = res.title;
  document.getElementById('res-subtitle').innerHTML = res.subtitle;
  document.getElementById('res-desc').innerHTML = res.desc;

  const heroImg = document.getElementById('result-hero-img');
  if (heroImg && res.image) {
    heroImg.src = res.image;
    heroImg.alt = res.title;
  }

  // Render matches
  const match1 = window.__getResult(res.match1);
  if (match1) {
    document.getElementById('match1-img').src = match1.image;
    document.getElementById('match1-img').style.display = 'block';
    document.getElementById('match1-title').textContent = match1.title;
    document.getElementById('match1-reason').textContent = res.match1_desc;
  }
  const match2 = window.__getResult(res.match2);
  if (match2) {
    document.getElementById('match2-img').src = match2.image;
    document.getElementById('match2-img').style.display = 'block';
    document.getElementById('match2-title').textContent = match2.title;
    document.getElementById('match2-reason').textContent = res.match2_desc;
  }

  showScreen('result');
  
  setTimeout(() => {
    drawRadar(res.scores);
  }, 100);

  setTimeout(() => {
    if (showAd && typeof showAdInterstitial === 'function') {
      showAdInterstitial();
    }
  }, 3000);
}

function drawRadar(scores) {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2 + 10;
  const radius = Math.min(w, h) / 2 - 40;

  ctx.clearRect(0, 0, w, h);

  const isEn = window.__lang === 'en';
  const labels = isEn ? ['Sweet', 'Spicy', 'Warm', 'Sophistication', 'Versatile'] : ['甘甜度', '辛辣度', '溫暖度', '精緻度', '百搭度'];
  const keys = ['sweet', 'spicy', 'warm', 'soph', 'flex'];
  
  const sides = 5;
  const angleStep = (Math.PI * 2) / sides;

  // Draw background grids
  ctx.strokeStyle = 'rgba(44,36,22,0.1)';
  ctx.lineWidth = 1;
  for (let level = 1; level <= 4; level++) {
    const r = radius * (level / 4);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw axes
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#7a6650';
    ctx.font = 'bold 18px "Quicksand", "微軟正黑體", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lx = cx + Math.cos(angle) * (radius + 25);
    const ly = cy + Math.sin(angle) * (radius + 25);
    ctx.fillText(labels[i], lx, ly);
  }

  // Draw data polygon
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const val = scores[keys[i]] || 20;
    const r = radius * (val / 100);
    const angle = i * angleStep - Math.PI / 2;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(232,137,106,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#e8896a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw points
  for (let i = 0; i < sides; i++) {
    const val = scores[keys[i]] || 20;
    const r = radius * (val / 100);
    const angle = i * angleStep - Math.PI / 2;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
  }
}

function resetQuiz() {
  currentQ = 0;
  answers = [];
  showScreen('intro');
}

// ── Ads ──
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

// ── Social Share ──
function isLineIAB() { return /Line/i.test(navigator.userAgent); }
function isMobile() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }

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

function openUrl(url) { window.open(url, '_blank'); }

function showShareToast(msg) {
  let toast = document.getElementById('share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(13,13,26,0.95);border:1px solid rgba(167,139,250,0.3);color:#fff;padding:14px 24px;border-radius:16px;font-size:14px;z-index:9999;opacity:0;transition:all 0.3s;backdrop-filter:blur(12px);text-align:center;max-width:320px;';
    document.body.appendChild(toast);
  }
  // Force a reflow so the transition will trigger if it was just added
  void toast.offsetWidth;
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  if (toast._timer) clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4000);
}

function shareTo(platform) {
  const url = window.location.href;
  const res = window.__getResult(window.__pendingResultKey);
  const _shareUI = window.__i18n && window.__i18n.ui[window.__lang];
  const text = _shareUI ? _shareUI.share_text(res) : '我的靈魂美食是「' + res.title + '」！\n' + url;
  const fullText = encodeURIComponent(text + '\n' + url);

  if (platform === 'copy') {
    copyTextFallback(text + '\n' + url).then(() => {
      const toastText = _shareUI ? _shareUI.copy_toast : '✓ 已複製！';
      showShareToast(toastText);
    });
    return;
  }

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

  let shareUrl = '';
  switch (platform) {
    case 'line':
      if (isMobile()) {
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
        window.location.href = `fb://share/?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
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
      window.location.href = shareUrl;
    } else {
      openUrl(shareUrl);
    }
  }
}

// ── Save Image ──
function showImageOverlay(dataUrl) {
  const old = document.getElementById('img-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'img-overlay';
  overlay.innerHTML = `
    <img src="${dataUrl}" alt="Result" style="max-width:92%;max-height:70vh;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.5);">
    <p style="color:#ccc;margin-top:20px;font-size:15px;font-weight:700;">📸 請長按圖片儲存</p>
    <button onclick="document.getElementById('img-overlay').remove()" style="margin-top:16px;color:#fff;font-size:15px;font-weight:700;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:12px 32px;cursor:pointer;">← 返回</button>
  `;
  document.body.appendChild(overlay);
}

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

let _saving = false;
async function saveResultImage() {
  if (_saving) return;
  _saving = true;
  const btn = document.querySelector('.share-save');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '產生中...';
  btn.disabled = true;

  try {
    const card = document.getElementById('result-card-capture');
    const canvas = await html2canvas(card, { backgroundColor: null, scale: 2 });
    
    if (isMobile() || isLineIAB()) {
      const dataUrl = canvas.toDataURL('image/png');
      showImageOverlay(dataUrl);
      btn.innerHTML = origHTML;
      btn.disabled = false;
    } else {
      downloadCanvasImage(canvas, 'soul-food-result.png');
      btn.innerHTML = '✓ 已儲存！';
      btn.style.borderColor = '#06C755';
      btn.style.color = '#06C755';
      setTimeout(() => { btn.innerHTML = origHTML; btn.style.borderColor = ''; btn.style.color = ''; btn.disabled = false; }, 2000);
    }
  } catch (e) {
    btn.innerHTML = origHTML;
    btn.disabled = false;
    showShareToast('⚠️ 下載失敗，請手動截圖分享');
  } finally {
    _saving = false;
  }
}
