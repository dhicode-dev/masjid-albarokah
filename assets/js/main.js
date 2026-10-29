document.addEventListener('DOMContentLoaded', function () {
  let translations = { id: {}, en: {} };

  // Load translations from i18n.json
  const i18nPath = window.location.pathname.includes('/berita/')
    ? '../data/i18n.json'
    : 'data/i18n.json';
  fetch(i18nPath)
    .then(response => response.json())
    .then(data => {
      translations = data;
      const storedLang = localStorage.getItem('langPreference') || 'id';
      applyLanguage(storedLang);
    })
    .catch(error => {
      console.warn('Failed to load translations:', error);
      const storedLang = localStorage.getItem('langPreference') || 'id';
      applyLanguage(storedLang);
    });

  const applyLanguage = function (language) {
    const current = translations[language] || translations.id;
    document.documentElement.lang = language;

    // Apply translations to elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      const key = element.dataset.i18n;
      if (current[key]) {
        element.textContent = current[key];
      }
    });

    // Apply translations to navbar links
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      const href = link.getAttribute('href');
      const map = {
        'index.html': 'navHome',
        'profil.html': 'navProfile',
        'jadwal-salat.html': 'navSchedule',
        'kegiatan.html': 'navActivities',
        'berita.html': 'navNews',
        'pengumuman.html': 'navAnnouncement',
        'galeri.html': 'navGallery',
        'pengurus.html': 'navCommittee',
        'fasilitas.html': 'navFacilities',
        'kontak.html': 'navContact',
        'donasi.html': 'navDonate'
      };
      const key = map[href];
      if (key && current[key]) {
        link.textContent = current[key];
      }
    });

    // Apply translation to donate button
    const donateButton = document.querySelector('.nav-actions .btn-primary');
    if (donateButton && current.navDonate) {
      donateButton.textContent = current.navDonate;
    }
  };

  const storedLang = localStorage.getItem('langPreference') || 'id';
  const menu = document.querySelector('.nav-links');
  const toggleButton = document.querySelector('.nav-toggle');

  if (toggleButton && menu) {
    toggleButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  const navActions = document.querySelector('.nav-actions');
  if (navActions && !navActions.querySelector('.lang-switch')) {
    const langSwitch = document.createElement('div');
    langSwitch.className = 'lang-switch';
    ['id', 'en'].forEach(function (lang) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lang-option';
      button.textContent = lang.toUpperCase();
      button.dataset.lang = lang;
      if (lang === storedLang) {
        button.classList.add('active');
      }
      button.addEventListener('click', function () {
        localStorage.setItem('langPreference', lang);
        document.querySelectorAll('.lang-option').forEach(function (item) {
          item.classList.toggle('active', item.dataset.lang === lang);
        });
        applyLanguage(lang);
      });
      langSwitch.appendChild(button);
    });
    navActions.insertBefore(langSwitch, navActions.firstChild);
  }

  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Apply initial language after a short delay to ensure i18n.json is loaded
  setTimeout(() => {
    applyLanguage(storedLang);
  }, 100);
});

