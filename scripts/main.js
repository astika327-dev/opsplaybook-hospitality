
// Mobile nav (simple enhancement if needed later)

// Hero checklist progress
// Smooth page transitions (Chrome/Edge/Safari modern)
if (document.startViewTransition) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const url = new URL(a.href, location.href);
    const sameOrigin = url.origin === location.origin;
    const isNav = a.getAttribute('href') && !a.getAttribute('href').startsWith('#');
    const newTab = a.target && a.target !== '_self';
    if (!sameOrigin || !isNav || newTab) return;

    e.preventDefault();
    document.startViewTransition(() => { location.href = url.href; });
  });
}

//ini agar smooth di atas codenya
(() => {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  if (!progressBar || !progressText) return;

  const checkboxes = document.querySelectorAll('#quick-checklist input[type="checkbox"]');

  function updateProgress() {
    const total = checkboxes.length;
    const done = [...checkboxes].filter(c => c.checked).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `${done}/${total} tasks`;
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
  updateProgress();
})();

// Modal open/close
document.querySelectorAll('[data-open-modal="roomInspection"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('roomInspectionModal').setAttribute('aria-hidden', 'false');
  });
});
document.querySelectorAll('[data-close-modal="roomInspection"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('roomInspectionModal').setAttribute('aria-hidden', 'true');
  });
});

// Incident Report — save to localStorage
const form = document.getElementById('incidentForm');
const table = document.getElementById('incidentTable')?.querySelector('tbody');
const KEY = 'opsplaybook_incidents_v1';

function loadIncidents() {
  const data = JSON.parse(localStorage.getItem(KEY) || '[]');
  table.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.date}</td><td>${row.villa}</td><td>${row.severity}</td><td>${row.issue}</td><td>${row.description}</td>`;
    table.appendChild(tr);
  });
}

if (form && table) {
  loadIncidents();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const row = {
      villa: formData.get('villa'),
      date: formData.get('date'),
      severity: formData.get('severity'),
      issue: formData.get('issue'),
      description: formData.get('description')
    };
    const data = JSON.parse(localStorage.getItem(KEY) || '[]');
    data.unshift(row);
    localStorage.setItem(KEY, JSON.stringify(data));
    form.reset();
    loadIncidents();
    alert('Incident submitted (saved locally).');
  });
}

// Hamburger menu (mobile)
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();