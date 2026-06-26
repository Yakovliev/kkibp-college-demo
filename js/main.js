
(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const navBackdrop = document.querySelector('[data-nav-backdrop]');
  const menuButtons = [...document.querySelectorAll('.menu-toggle')];
  const searchDialog = document.querySelector('.search-dialog');
  const searchInput = document.querySelector('#site-search');
  const resultsBox = document.querySelector('#search-results');
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');
  const languageSwitches = [...document.querySelectorAll('[data-language-switch]')];
  const isEnglish = document.documentElement.lang.startsWith('en');
  const locale = isEnglish ? 'en' : 'uk';
  const ui = isEnglish
    ? {
        closeMenu: 'Close menu',
        openMenu: 'Open menu',
        noResults: 'No results found. Try another query.',
        futureLink: 'This link is prepared for a future material.'
      }
    : {
        closeMenu: 'Закрити меню',
        openMenu: 'Відкрити меню',
        noResults: 'Нічого не знайдено. Спробуйте інший запит.',
        futureLink: 'Це посилання підготовлене для майбутнього матеріалу.'
      };

  const closeMenus = (except = null) => {
    document.querySelectorAll('.has-menu.menu-open').forEach(item => {
      if (item !== except) {
        item.classList.remove('menu-open');
        item.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const closeLanguageSwitches = (except = null) => {
    languageSwitches.forEach(switcher => {
      if (switcher !== except) {
        switcher.classList.remove('is-open');
        switcher.querySelector('.language-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const setNav = (open) => {
    body.classList.toggle('nav-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? ui.closeMenu : ui.openMenu);
    if (!open) closeMenus();
  };

  navToggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  navBackdrop?.addEventListener('click', () => setNav(false));

  languageSwitches.forEach(switcher => {
    const button = switcher.querySelector('.language-toggle');
    button?.addEventListener('click', (event) => {
      event.stopPropagation();
      const opening = !switcher.classList.contains('is-open');
      closeLanguageSwitches(switcher);
      switcher.classList.toggle('is-open', opening);
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  menuButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (window.innerWidth >= 1100) return;
      event.preventDefault();
      const item = event.currentTarget.closest('.has-menu');
      const opening = !item.classList.contains('menu-open');
      closeMenus(item);
      item.classList.toggle('menu-open', opening);
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-language-switch]')) closeLanguageSwitches();
    if (window.innerWidth >= 1100 && !event.target.closest('.has-menu')) closeMenus();
  });

  document.querySelectorAll('.mega-menu a, .nav-item:not(.has-menu) a').forEach(link => {
    link.addEventListener('click', () => { if (window.innerWidth < 1100) setNav(false); });
  });

  const searchIndex = isEnglish
    ? [
        ['Admission Rules 2026', 'Applicants', 'admissions.html#documents'],
        ['Applicant Calendar', 'Applicants', 'admissions.html#timeline'],
        ['Educational Programs', 'Learning', 'admissions.html#programs'],
        ['Class Schedule', 'Students', 'students.html#schedule'],
        ['Elective Disciplines Catalog', 'Students', 'students.html#electives'],
        ['Psychological Service', 'Support', 'students.html#support'],
        ['Career Center', 'Opportunities', 'students.html#career'],
        ['Electronic Library Catalog', 'Library', 'library.html#catalog'],
        ['Academic Integrity', 'Library', 'library.html#integrity'],
        ['Research Clubs', 'Research', 'science.html#student-science'],
        ['College Contacts', 'College', 'college.html#contacts'],
        ['Public Information', 'College', 'college.html#documents']
      ]
    : [
        ['Правила прийому 2026', 'Абітурієнту', 'admissions.html#documents'],
        ['Календар вступника', 'Абітурієнту', 'admissions.html#timeline'],
        ['Освітні програми', 'Навчання', 'admissions.html#programs'],
        ['Розклад занять', 'Студенту', 'students.html#schedule'],
        ['Каталог вибіркових дисциплін', 'Студенту', 'students.html#electives'],
        ['Психологічна служба', 'Підтримка', 'students.html#support'],
        ['Центр кар’єри', 'Можливості', 'students.html#career'],
        ['Електронний каталог бібліотеки', 'Бібліотека', 'library.html#catalog'],
        ['Академічна доброчесність', 'Бібліотека', 'library.html#integrity'],
        ['Наукові гуртки', 'Наука', 'science.html#student-science'],
        ['Контакти коледжу', 'Коледж', 'college.html#contacts'],
        ['Публічна інформація', 'Коледж', 'college.html#documents']
      ];

  const openSearch = () => {
    searchDialog.hidden = false;
    body.classList.add('dialog-open');
    setTimeout(() => searchInput?.focus(), 30);
  };
  const closeSearch = () => {
    searchDialog.hidden = true;
    body.classList.remove('dialog-open');
    if (searchInput) searchInput.value = '';
    if (resultsBox) resultsBox.innerHTML = '';
  };
  document.querySelectorAll('.search-open').forEach(button => button.addEventListener('click', openSearch));
  document.querySelector('.search-close')?.addEventListener('click', closeSearch);
  searchDialog?.addEventListener('click', e => { if (e.target === searchDialog) closeSearch(); });
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLocaleLowerCase(locale);
    if (!q) { resultsBox.innerHTML = ''; return; }
    const matches = searchIndex.filter(item => item[0].toLocaleLowerCase(locale).includes(q) || item[1].toLocaleLowerCase(locale).includes(q)).slice(0, 6);
    resultsBox.innerHTML = matches.length ? matches.map(([title, section, href]) => `<a class="search-result" href="${href}"><span>${title}</span><small>${section}</small></a>`).join('') : `<p>${ui.noResults}</p>`;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      closeLanguageSwitches();
      if (body.classList.contains('nav-open')) setNav(false);
      if (searchDialog && !searchDialog.hidden) closeSearch();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });

  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
    backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.closest('.filter-bar');
      group?.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showToast(ui.futureLink);
    });
  });

  // Smooth anchor navigation, accounting for the sticky header.
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 720 && body.classList.contains('nav-open')) setNav(false);
  });
})();
