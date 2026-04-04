/* ============================================================
   Live Korean — Core JavaScript
   Handles: language, bookmarks, toast, terms, shared utils
   ============================================================ */

/* ── Storage Keys ──────────────────────────────────────────── */
var LK_KEYS = {
  agreed:    'lk_agreed',
  bookmarks: 'lk_bookmarks',
  lang:      'lk_lang',
};

/* ── Language System ───────────────────────────────────────── */
function detectDeviceLang() {
  var nav = (navigator.language || navigator.userLanguage || '');
  return nav.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

function getLang() {
  try {
    return localStorage.getItem(LK_KEYS.lang) || detectDeviceLang();
  } catch (e) {
    return detectDeviceLang();
  }
}

function saveLang(lang) {
  try { localStorage.setItem(LK_KEYS.lang, lang); } catch (e) {}
}

function setLang(lang) {
  saveLang(lang);
  document.documentElement.lang = lang;
  /* Refresh the topbar lang toggle so active state updates */
  var wrap = document.getElementById('topbar-lang-wrap');
  if (wrap) wrap.innerHTML = buildLangToggle();
  document.body.classList.toggle('ko-active', lang === 'ko');
  /* Page-specific language update (drama descriptions, episode labels, etc.) */
  if (typeof applyPageLang === 'function') applyPageLang();
  applyLang();
  if (typeof buildExpressions === 'function') buildExpressions();
  /* Rebuild episode grid with cleared guard so labels update */
  if (typeof buildEpisodeGrid === 'function') {
    var grid = document.getElementById('episodeGrid');
    if (grid) { grid.innerHTML = ''; buildEpisodeGrid(); }
  }
  if (typeof syncBookmarkButtons === 'function') syncBookmarkButtons();
  if (typeof renderBookmarkBar === 'function' && document.getElementById('bookmarkBar')) renderBookmarkBar();
}

function applyLang() {
  var lang = getLang();
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (LK_I18N[lang] && LK_I18N[lang][key]) {
      el.innerHTML = LK_I18N[lang][key];
    } else if (LK_I18N['en'][key]) {
      el.innerHTML = LK_I18N['en'][key];
    }
  });
  document.querySelectorAll('[data-lang-en]').forEach(function(el) {
    el.style.display = (lang === 'en') ? '' : 'none';
  });
  document.querySelectorAll('[data-lang-ko]').forEach(function(el) {
    el.style.display = (lang === 'ko') ? '' : 'none';
  });
}

function buildLangToggle() {
  var lang = getLang();
  return '<div class="topbar-lang">'
    + '<button id="topbar-lang-en" class="topbar-lang-btn' + (lang === 'en' ? ' active' : '') + '"'
    + ' onclick="setLang(\'en\')" title="English">EN</button>'
    + '<button id="topbar-lang-ko" class="topbar-lang-btn' + (lang === 'ko' ? ' active' : '') + '"'
    + ' onclick="setLang(\'ko\')" title="한국어">KO</button>'
    + '</div>';
}

/* ── i18n strings ──────────────────────────────────────────── */
var LK_I18N = {
  en: {
    'home.hero.title': '🎬 Learn Korean with <span class="hero-accent">K-Dramas</span>',
    'home.hero.sub': 'Watch real YouTube Shorts from your favourite Korean dramas and learn natural Korean expressions — one clip at a time.',
    'home.shows.label': '📺 Dramas',
    'guardian.meta': '16 Episodes · 480 Shorts · Fantasy Romance',
    'glory.meta': '16 Episodes · 480 Shorts · Thriller Drama',
    'aouad.meta': '12 Episodes · 360 Shorts · Zombie Thriller',
    'bm.bar.title': 'Bookmarks — Jump back in',
    'bm.empty': 'No bookmarks yet. Tap 🔖 to save your spot.',
    'bm.toast.added': '🔖 Bookmarked!',
    'bm.toast.removed': 'Bookmark removed',
    'bm.bookmark': '🔖 Save',
    'bm.bookmarked': '✓ Saved',
    'footer.copy': '© 2025 m2ea Labs. All rights reserved.',
    'footer.terms': 'Terms of Use',
  },
  ko: {
    'home.hero.title': '🎬 K-드라마로 <span class="hero-kr">한국어</span> 배우기',
    'home.hero.sub': '좋아하는 한국 드라마의 YouTube 쇼츠를 보며 자연스러운 한국어 표현을 배워보세요.',
    'home.shows.label': '📺 드라마',
    'guardian.meta': '16화 · 480개 쇼츠 · 판타지 로맨스',
    'glory.meta': '16화 · 480개 쇼츠 · 스릴러 드라마',
    'aouad.meta': '12화 · 360개 쇼츠 · 좀비 스릴러',
    'bm.bar.title': '북마크 — 이어보기',
    'bm.empty': '아직 북마크가 없습니다. 🔖 버튼으로 저장하세요.',
    'bm.toast.added': '🔖 북마크 저장됨!',
    'bm.toast.removed': '북마크 삭제됨',
    'bm.bookmark': '🔖 저장',
    'bm.bookmarked': '✓ 저장됨',
    'footer.copy': '© 2025 m2ea Labs. 모든 권리 보유.',
    'footer.terms': '이용약관',
  }
};

function t(key) {
  var lang = getLang();
  return (LK_I18N[lang] && LK_I18N[lang][key]) || LK_I18N['en'][key] || key;
}

/* ── Terms / Agreement ─────────────────────────────────────── */
function hasAgreed() {
  try { return localStorage.getItem(LK_KEYS.agreed) === '1'; } catch (e) { return false; }
}
function setAgreed() {
  try { localStorage.setItem(LK_KEYS.agreed, '1'); } catch (e) {}
}

/* ── App root detection ────────────────────────────────────── */
function getAppRoot() {
  var path = window.location.pathname;
  var markers = ['/dramas/guardian/', '/dramas/glory/', '/dramas/all-of-us-are-dead/', '/dramas/'];
  for (var i = 0; i < markers.length; i++) {
    var idx = path.indexOf(markers[i]);
    if (idx !== -1) {
      return window.location.href.substring(0, window.location.href.indexOf(markers[i])) + '/';
    }
  }
  return window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
}

function goToBookmark(relUrl) {
  var root = getAppRoot();
  var clean = relUrl.replace(/^\/+/, '');
  window.location.href = root + clean;
}

/* ── Bookmarks ─────────────────────────────────────────────── */
function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(LK_KEYS.bookmarks) || '[]');
  } catch (e) { return []; }
}

function saveBookmarks(bms) {
  try { localStorage.setItem(LK_KEYS.bookmarks, JSON.stringify(bms)); }
  catch (e) { console.warn('localStorage unavailable'); }
}

function isBookmarked(id) {
  return getBookmarks().some(function(b) { return b.id === id; });
}

function toggleBookmark(type, id, label, url) {
  var bms = getBookmarks();
  var idx = bms.findIndex(function(b) { return b.id === id; });
  if (idx > -1) {
    bms.splice(idx, 1);
    showToast(t('bm.toast.removed'));
  } else {
    bms.unshift({ type: type, id: id, label: label, url: url, ts: Date.now() });
    showToast(t('bm.toast.added'));
  }
  saveBookmarks(bms);
  document.querySelectorAll('[data-bm-id="' + id + '"]').forEach(function(el) {
    var saved = isBookmarked(id);
    el.classList.toggle('saved', saved);
    if (el.classList.contains('btn-bm')) {
      el.innerHTML = saved ? t('bm.bookmarked') : t('bm.bookmark');
    }
    if (el.classList.contains('bm-corner')) {
      el.title = saved ? t('bm.bookmarked') : t('bm.bookmark');
    }
  });
  if (document.getElementById('bookmarkBar')) renderBookmarkBar();
}

function removeBookmark(id, event) {
  if (event) event.stopPropagation();
  saveBookmarks(getBookmarks().filter(function(b) { return b.id !== id; }));
  showToast(t('bm.toast.removed'));
  if (document.getElementById('bookmarkBar')) renderBookmarkBar();
}

function renderBookmarkBar() {
  var bar = document.getElementById('bookmarkBar');
  var container = document.getElementById('bookmarkChips');
  if (!bar || !container) return;
  var bms = getBookmarks();
  if (bms.length === 0) {
    bar.classList.remove('has-bookmarks');
    return;
  }
  bar.classList.add('has-bookmarks');
  var head = bar.querySelector('.bookmark-bar-head span:last-child');
  if (head) head.innerHTML = t('bm.bar.title');
  container.innerHTML = bms.map(function(b) {
    return '<div class="bm-chip" onclick="goToBookmark(\'' + b.url + '\')">'
      + '<span>🔖</span><span>' + b.label + '</span>'
      + '<button class="bm-chip-remove" onclick="removeBookmark(\'' + b.id + '\', event)" title="Remove">×</button>'
      + '</div>';
  }).join('');
}

function syncBookmarkButtons() {
  document.querySelectorAll('[data-bm-id]').forEach(function(el) {
    var id = el.getAttribute('data-bm-id');
    var saved = isBookmarked(id);
    el.classList.toggle('saved', saved);
    if (el.classList.contains('btn-bm')) {
      el.innerHTML = saved ? t('bm.bookmarked') : t('bm.bookmark');
    }
    if (el.classList.contains('bm-corner')) {
      el.title = saved ? t('bm.bookmarked') : t('bm.bookmark');
    }
  });
}

/* ── Toast ─────────────────────────────────────────────────── */
var _toastTimer = null;
function showToast(msg) {
  var el = document.getElementById('lkToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lkToast';
    el.className = 'lk-toast';
    document.body.appendChild(el);
  }
  el.innerHTML = msg;
  el.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { el.classList.remove('show'); }, 2200);
}

/* ── YouTube Modal ─────────────────────────────────────────── */
function openVideoModal(videoId, korean, english, isShorts) {
  var overlay = document.getElementById('videoModal');
  if (!overlay) return;
  var titleEl = overlay.querySelector('.modal-title');
  var titleKrEl = overlay.querySelector('.modal-title-kr');
  var videoWrap = overlay.querySelector('.modal-video');
  var iframe = overlay.querySelector('iframe');

  if (titleEl) titleEl.textContent = english;
  if (titleKrEl) titleKrEl.textContent = korean;

  // Shorts use portrait embed
  if (videoWrap) {
    videoWrap.classList.toggle('shorts-format', !!isShorts);
  }

  if (iframe) {
    var params = 'autoplay=1&rel=0';
    if (isShorts) params += '&playsinline=1';
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?' + params;
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  var overlay = document.getElementById('videoModal');
  if (!overlay) return;
  var iframe = overlay.querySelector('iframe');
  if (iframe) iframe.src = '';
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Build standard topbar ─────────────────────────────────── */
function buildTopbar(homeUrl) {
  var root = document.getElementById('lk-topbar');
  if (!root) return;
  root.innerHTML =
    '<div class="topbar-left">'
    + '<button class="btn-topbar-home" onclick="window.location.href=\'' + (homeUrl||'index.html') + '\'" title="Home" aria-label="Home">🏠</button>'
    + '<div class="topbar-logo"><span class="logo-live">Live</span><div class="logo-dot"></div><span class="logo-korea">Korean</span></div>'
    + '</div>'
    + '<div class="topbar-right">'
    + buildLangToggle()
    + '<a class="m2ea-link" href="https://www.m2eacircle.com" target="_blank" rel="noopener" title="m2ea Circle">'
    + '<span>🌐</span><span class="label">m2ea Circle</span>'
    + '</a>'
    + '</div>';
}

/* ── Shared video modal HTML ───────────────────────────────── */
function injectVideoModal() {
  if (document.getElementById('videoModal')) return;
  var div = document.createElement('div');
  div.id = 'videoModal';
  div.className = 'modal-overlay';
  div.innerHTML =
    '<div class="modal-box">'
    + '<div class="modal-header">'
    + '<div><div class="modal-title"></div><div class="modal-title-kr"></div></div>'
    + '<button class="modal-close" onclick="closeVideoModal()">✕</button>'
    + '</div>'
    + '<div class="modal-video shorts-format"><iframe allowfullscreen allow="autoplay; encrypted-media"></iframe></div>'
    + '<div class="modal-footer">YouTube Shorts · Video rights belong to respective owners</div>'
    + '</div>';
  div.addEventListener('click', function(e) { if (e.target === div) closeVideoModal(); });
  document.body.appendChild(div);
}

/* ── Footer ────────────────────────────────────────────────── */
function buildFooter() {
  var el = document.getElementById('lk-footer');
  if (!el) return;
  el.innerHTML =
    '<div class="footer-copy">\u00a9 2025 m2ea Labs. All rights reserved.</div>'
    + '<div><button class="footer-terms" onclick="showTermsModal()">Terms of Use / \uc774\uc6a9\uc57d\uad00</button></div>';
  injectTermsModal();
}

/* ── Full bilingual Terms modal — injected once per page ───── */
function injectTermsModal() {
  if (document.getElementById('termsModal')) return;

  var div = document.createElement('div');
  div.id = 'termsModal';
  div.style.cssText = 'display:none;position:fixed;inset:0;z-index:900;background:rgba(26,19,51,0.6);backdrop-filter:blur(6px);overflow-y:auto;';

  div.innerHTML = [
    '<div style="max-width:600px;margin:40px auto;padding:0 16px 60px;">',
    '<div style="background:var(--card);border:1.5px solid var(--border);border-radius:var(--radius);padding:28px 24px;position:relative;box-shadow:var(--shadow-lg);">',

    /* close button */
    '<button onclick="closeTermsModal()" style="position:absolute;top:14px;right:16px;background:var(--card2);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:var(--muted);cursor:pointer;line-height:1;">\u2715</button>',

    /* lang toggle */
    '<div style="display:flex;justify-content:center;margin-bottom:24px;">',
    '<div style="display:flex;background:var(--card2);border:1.5px solid var(--border);border-radius:30px;padding:3px;gap:2px;">',
    '<button id="tm-btn-en" onclick="setTermsModalLang(\'en\')" style="background:none;border:none;border-radius:24px;padding:7px 22px;font-size:0.82rem;font-weight:700;font-family:\'DM Sans\',sans-serif;color:var(--muted);cursor:pointer;transition:all 0.2s;">\ud83c\uddfa\ud83c\uddf8 EN</button>',
    '<button id="tm-btn-ko" onclick="setTermsModalLang(\'ko\')" style="background:none;border:none;border-radius:24px;padding:7px 22px;font-size:0.82rem;font-weight:700;font-family:\'DM Sans\',sans-serif;color:var(--muted);cursor:pointer;transition:all 0.2s;">\ud83c\uddf0\ud83c\uddf7 KO</button>',
    '</div></div>',

    /* ── ENGLISH content ── */
    '<div id="tm-content-en">',
    '<div style="text-align:center;margin-bottom:20px;">',
    '<div style="font-size:2.4rem;margin-bottom:10px;">\ud83c\udfa5</div>',
    '<div style="font-family:\'Syne\',sans-serif;font-size:1.25rem;font-weight:800;color:var(--accent);">Live Korean</div>',
    '<div style="font-size:0.76rem;color:var(--muted);margin-top:4px;">by m2ea Labs &mdash; Terms of Use</div>',
    '</div>',

    /* agreed badge */
    '<div id="tm-agreed-en" style="display:none;background:rgba(5,150,105,0.08);border:1.5px solid var(--green);border-radius:10px;padding:11px 16px;margin-bottom:16px;">',
    '<div style="font-size:0.85rem;font-weight:700;color:var(--green);">\u2705 You have agreed to these Terms of Use.</div>',
    '<div style="font-size:0.76rem;color:var(--muted);margin-top:3px;">Your agreement is saved on this device. Thank you for using Live Korean responsibly.</div>',
    '</div>',

    _tmCard('Welcome',
      '<p>Welcome to <strong>Live Korean</strong> \u2014 learn Korean through real YouTube Shorts from your favourite K-dramas. Each short connects to a natural Korean expression used in the show.</p>'),

    _tmCard('Terms of Use',
      '<ul style="list-style:none;padding:0;margin:0;">'
      + _tmLi('This app is for <strong>personal study purposes only</strong>. All video content rights belong to their respective copyright owners. If any rights holder requests removal, content may be taken down without prior notice.')
      + _tmLi('You <strong>may not use this content for any commercial, redistribution, or other non-personal purpose</strong>. Use is strictly limited to personal Korean language study.')
      + _tmLi('All study notes and language explanations <strong>may contain errors or inaccuracies</strong>. All content represents the opinion of <strong>m2ea Labs</strong>. If you disagree with any explanation, your interpretation may be correct \u2014 always use your own judgment.')
      + _tmLi('YouTube Shorts embedded in this app <strong>may include ads served by YouTube</strong>. These are not controlled by m2ea Labs.')
      + '</ul>'),

    _tmCard('About Live Korean',
      '<p>Live Korean links YouTube Shorts from popular Korean dramas to natural Korean expressions. Each episode features 30 expressions with short video clips to show them in context.</p>'
      + '<p style="margin-top:8px;">This app covers: <strong>Guardian: The Lonely and Great God</strong>, <strong>The Glory</strong>, and <strong>All of Us Are Dead</strong>. More dramas coming soon.</p>'
      + '<p style="margin-top:8px;">Operated by <strong>m2ea Labs</strong> as a language study project. All video content remains the property of its original owners.</p>'),

    '<button onclick="closeTermsModal()" style="width:100%;background:linear-gradient(135deg,var(--accent),#c01850);color:#fff;border:none;border-radius:var(--radius-sm);padding:13px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:\'DM Sans\',sans-serif;margin-top:6px;">Close \u00d7</button>',
    '</div>',

    /* ── KOREAN content ── */
    '<div id="tm-content-ko" style="display:none;font-family:\'Noto Sans KR\',\'DM Sans\',sans-serif;word-break:keep-all;">',
    '<div style="text-align:center;margin-bottom:20px;">',
    '<div style="font-size:2.4rem;margin-bottom:10px;">\ud83c\udfa5</div>',
    '<div style="font-family:\'Syne\',sans-serif;font-size:1.25rem;font-weight:800;color:var(--accent);">Live Korean</div>',
    '<div style="font-size:0.76rem;color:var(--muted);margin-top:4px;">m2ea Labs &mdash; \uc774\uc6a9\uc57d\uad00</div>',
    '</div>',

    '<div id="tm-agreed-ko" style="display:none;background:rgba(5,150,105,0.08);border:1.5px solid var(--green);border-radius:10px;padding:11px 16px;margin-bottom:16px;">',
    '<div style="font-size:0.85rem;font-weight:700;color:var(--green);">\u2705 \uc774\uc6a9\uc57d\uad00\uc5d0 \ub3d9\uc758\ud558\uc168\uc2b5\ub2c8\ub2e4.</div>',
    '<div style="font-size:0.76rem;color:var(--muted);margin-top:3px;">\ub3d9\uc758 \ub0b4\uc6a9\uc774 \uc774 \uae30\uae30\uc5d0 \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4. Live Korean\uc744 \uc787\uc74c\ubaa9\uac8c \uc774\uc6a9\ud574 \uc8fc\uc154\uc11c \uac10\uc0ac\ud569\ub2c8\ub2e4.</div>',
    '</div>',

    _tmCard('\ud83d\udc4b \ud658\uc601\ud569\ub2c8\ub2e4',
      '<p><strong>Live Korean</strong>\uc5d0 \uc624\uc2e0 \uac83\uc744 \ud658\uc601\ud569\ub2c8\ub2e4. \uc88b\uc544\ud558\ub294 K-\ub4dc\ub77c\ub9c8\uc758 YouTube \uc264\uce20\ub97c \ud1b5\ud574 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4 \ud45c\ud604\uc744 \uc7ac\ubbf8\uc788\uac8c \ubc30\uc6b8 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</p>'),

    _tmCard('\ud83d\udccc \uc774\uc6a9\uc57d\uad00',
      '<ul style="list-style:none;padding:0;margin:0;">'
      + _tmLi('\uc774 \uc571\uc740 <strong>\uac1c\uc778 \ud559\uc2b5 \ubaa9\uc801\uc73c\ub85c\ub9cc</strong> \uc0ac\uc6a9 \uac00\ub2a5\ud569\ub2c8\ub2e4. \ubaa8\ub4e0 \uc601\uc0c1 \ucf58\ud150\uce20\uc758 \uc800\uc791\uad8c\uc740 \uac01 \uc6d0\uc800\uc791\uc790\uc5d0\uac8c \uc788\uc73c\uba70, \uc800\uc791\uad8c\uc790\uc758 \uc694\uccad \uc2dc <strong>\uc608\uace0 \uc5c6\uc774 \ucf58\ud150\uce20\uac00 \uc0ad\uc81c\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</strong>')
      + _tmLi('\uc774 \ucf58\ud150\uce20\ub294 <strong>\uc0c1\uc5c5\uc801 \uc774\uc6a9, \uc7ac\ubc30\ud3ec \ubc0f \uae30\ud0c0 \ube44\uac1c\uc778\uc801 \ubaa9\uc801\uc73c\ub85c \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.</strong> \uac1c\uc778 \ud55c\uad6d\uc5b4 \ud559\uc2b5 \ubaa9\uc801\uc5d0 \ud55c\ud574\uc11c\ub9cc \uc774\uc6a9 \uac00\ub2a5\ud569\ub2c8\ub2e4.')
      + _tmLi('\ubaa8\ub4e0 \ud559\uc2b5 \ub0b4\uc6a9\uacfc \uc5b8\uc5b4 \uc124\uba85\uc740 <strong>\uc624\ub958\ub098 \ubd80\uc815\ud655\ud55c \uc815\ubcf4\ub97c \ud3ec\ud568\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</strong> \ubaa8\ub4e0 \ub0b4\uc6a9\uc740 <strong>m2ea Labs\uc758 \uc758\uacac</strong>\uc785\ub2c8\ub2e4.')
      + _tmLi('\uc571\uc5d0 \uc0bd\uc785\ub41c YouTube \uc264\uce20\uc5d0\ub294 <strong>YouTube\uac00 \uc81c\uacf5\ud558\ub294 \uad11\uace0\uac00 \ud3ec\ud568\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</strong> \uc774\ub294 m2ea Labs\uc640 \ubb34\uad00\ud569\ub2c8\ub2e4.')
      + '</ul>'),

    _tmCard('\u2139\ufe0f \uc571 \uc18c\uac1c',
      '<p>Live Korean\uc740 \uc778\uae30 \ud55c\uad6d \ub4dc\ub77c\ub9c8\uc758 YouTube \uc264\uce20\ub97c \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud55c\uad6d\uc5b4 \ud45c\ud604\uacfc \uc5f0\uacb0\ud558\uc5ec \uc81c\uacf5\ud569\ub2c8\ub2e4.</p>'
      + '<p style="margin-top:8px;">\ud604\uc7ac \uc81c\uacf5 \ub4dc\ub77c\ub9c8: <strong>\ub3c4\uae68\ube44</strong>, <strong>\ub354 \uae00\ub85c\ub9ac</strong>, <strong>\uc9c0\uae08 \uc6b0\ub9ac \ud559\uad50\ub294</strong>. \ub354 \ub9ce\uc740 \ub4dc\ub77c\ub9c8\uac00 \ucd94\uac00\ub420 \uc608\uc815\uc785\ub2c8\ub2e4.</p>'
      + '<p style="margin-top:8px;">\uc774 \uc571\uc740 <strong>m2ea Labs</strong>\uc5d0\uc11c \ud55c\uad6d\uc5b4 \ud559\uc2b5 \ud504\ub85c\uc81d\ud2b8\ub85c \uc6b4\uc601\ud569\ub2c8\ub2e4.</p>'),

    '<button onclick="closeTermsModal()" style="width:100%;background:linear-gradient(135deg,var(--accent),#c01850);color:#fff;border:none;border-radius:var(--radius-sm);padding:13px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:\'Noto Sans KR\',sans-serif;margin-top:6px;">\ub2eb\uae30 \u00d7</button>',
    '</div>',

    '</div></div>'
  ].join('');

  div.addEventListener('click', function(e) { if (e.target === div) closeTermsModal(); });
  document.body.appendChild(div);
}

/* helpers for modal card and list-item HTML */
function _tmCard(title, body) {
  return '<div style="background:var(--card2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px 18px;margin-bottom:14px;">'
    + '<div style="font-family:\'Syne\',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--accent2);margin-bottom:10px;">' + title + '</div>'
    + '<div style="font-size:0.86rem;color:var(--text);line-height:1.75;">' + body + '</div>'
    + '</div>';
}
function _tmLi(html) {
  return '<li style="padding:7px 0 7px 18px;border-bottom:1px solid var(--border);position:relative;line-height:1.75;"><span style="position:absolute;left:0;color:var(--accent);">\u25b8</span>' + html + '</li>';
}

function setTermsModalLang(lang) {
  var enBtn = document.getElementById('tm-btn-en');
  var koBtn = document.getElementById('tm-btn-ko');
  var enContent = document.getElementById('tm-content-en');
  var koContent = document.getElementById('tm-content-ko');
  if (!enBtn) return;

  var activeStyle = 'background:var(--accent);color:#fff;border-radius:24px;box-shadow:0 2px 10px rgba(232,36,92,0.3);';
  var inactiveStyle = 'background:none;border-radius:24px;';

  if (lang === 'en') {
    enBtn.style.cssText += activeStyle;
    koBtn.style.cssText += inactiveStyle;
    koBtn.style.background = 'none';
    koBtn.style.color = 'var(--muted)';
    enBtn.style.background = 'var(--accent)';
    enBtn.style.color = '#fff';
    enContent.style.display = 'block';
    koContent.style.display = 'none';
  } else {
    koBtn.style.background = 'var(--accent)';
    koBtn.style.color = '#fff';
    enBtn.style.background = 'none';
    enBtn.style.color = 'var(--muted)';
    koContent.style.display = 'block';
    enContent.style.display = 'none';
  }

  /* show agreed badge in active panel */
  var agreed = hasAgreed();
  var enBadge = document.getElementById('tm-agreed-en');
  var koBadge = document.getElementById('tm-agreed-ko');
  if (enBadge) enBadge.style.display = (agreed && lang === 'en') ? 'block' : 'none';
  if (koBadge) koBadge.style.display = (agreed && lang === 'ko') ? 'block' : 'none';
}

function showTermsModal() {
  injectTermsModal();
  var modal = document.getElementById('termsModal');
  if (!modal) return;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  /* open in current app language */
  setTermsModalLang(getLang());
}

function closeTermsModal() {
  var modal = document.getElementById('termsModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
