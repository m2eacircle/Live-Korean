/* ============================================================
   Live Korea — Core JavaScript
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
  var btnEn = document.getElementById('topbar-lang-en');
  var btnKo = document.getElementById('topbar-lang-ko');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnKo) btnKo.classList.toggle('active', lang === 'ko');
  document.body.classList.toggle('ko-active', lang === 'ko');
  applyLang();
  if (typeof buildExpressions === 'function') buildExpressions();
  if (typeof buildEpisodeGrid === 'function') buildEpisodeGrid();
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
    'home.hero.title': '🎬 Learn Korean with <span class="hero-accent">K-Drama</span>',
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
    + '<div class="topbar-logo"><span class="logo-live">Live</span><div class="logo-dot"></div><span class="logo-korea">Korea</span></div>'
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
    '<div class="footer-copy" data-i18n="footer.copy">© 2025 m2ea Labs. All rights reserved.</div>'
    + '<div><button class="footer-terms" data-i18n="footer.terms" onclick="showTermsModal()">Terms of Use</button></div>';
}

function showTermsModal() {
  var modal = document.getElementById('termsModal');
  if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
}
function closeTermsModal() {
  var modal = document.getElementById('termsModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
