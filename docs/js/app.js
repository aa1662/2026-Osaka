/**
 * 2026 日本關西旅行互動 Web Portal - 核心前端互動腳本 (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initAccordions();
  initEveningFilters();
  initGoldenHour();
  highlightActiveNav();
});

/* ---------- 1. Toast Notification & Copy System ---------- */
let toastTimeout;

function initToasts() {
  if (!document.getElementById('toast-box')) {
    const toast = document.createElement('div');
    toast.id = 'toast-box';
    toast.className = 'toast-box';
    toast.innerHTML = '<span>✅</span> <span id="toast-msg">已複製！</span>';
    document.body.appendChild(toast);
  }
}

function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast-box');
  const msgSpan = document.getElementById('toast-msg');
  if (!toast) return;

  msgSpan.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Global function to copy Japanese place names/addresses
 * Called via onclick="copyText('びわ湖バレイ', this)"
 */
window.copyText = function(text, buttonElement) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      handleCopySuccess(text, buttonElement);
    }).catch(() => {
      fallbackCopyText(text, buttonElement);
    });
  } else {
    fallbackCopyText(text, buttonElement);
  }
};

function fallbackCopyText(text, buttonElement) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    handleCopySuccess(text, buttonElement);
  } catch (err) {
    showToast('❌ 複製失敗，請手動複製');
  }
  document.body.removeChild(textArea);
}

function handleCopySuccess(text, buttonElement) {
  showToast(`📋 已複製日文「${text}」！可直接出示給司機或貼入地圖`);
  if (buttonElement) {
    const originalHtml = buttonElement.innerHTML;
    buttonElement.innerHTML = '<span>✅ 已複製</span>';
    buttonElement.style.borderColor = 'var(--accent)';
    buttonElement.style.color = 'var(--accent)';
    setTimeout(() => {
      buttonElement.innerHTML = originalHtml;
      buttonElement.style.borderColor = '';
      buttonElement.style.color = '';
    }, 1800);
  }
}

/* ---------- 2. Collapsible Accordions ---------- */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('open');
    });
  });
}

/* ---------- 3. Instant Filter Pills (Evening Hub) ---------- */
function initEveningFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.interactive-card[data-category]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.classList.add('fade-in-up');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- 4. Golden Hour Sunset Dynamic Calculation ---------- */
function initGoldenHour() {
  const sunsetEl = document.getElementById('sunset-time-badge');
  if (sunsetEl) {
    // Osaka August 24-27 average sunset is approx 18:38 ~ 18:42
    sunsetEl.textContent = '🌅 今日大阪日落：18:40 (黃金魔幻時刻 18:15~18:55)';
  }
}

/* ---------- 5. Highlight Active Navigation ---------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Desktop Links
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile Bottom Dock Links
  document.querySelectorAll('.dock-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
