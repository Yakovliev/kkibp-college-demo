
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

  const closeMenus = (except = null) => {
    document.querySelectorAll('.has-menu.menu-open').forEach(item => {
      if (item !== except) {
        item.classList.remove('menu-open');
        item.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const setNav = (open) => {
    body.classList.toggle('nav-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    if (!open) closeMenus();
  };

  navToggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  navBackdrop?.addEventListener('click', () => setNav(false));

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
    if (window.innerWidth >= 1100 && !event.target.closest('.has-menu')) closeMenus();
  });

  document.querySelectorAll('.mega-menu a, .nav-item:not(.has-menu) a').forEach(link => {
    link.addEventListener('click', () => { if (window.innerWidth < 1100) setNav(false); });
  });

  const searchIndex = [
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
  document.querySelector('.search-open')?.addEventListener('click', openSearch);
  document.querySelector('.search-close')?.addEventListener('click', closeSearch);
  searchDialog?.addEventListener('click', e => { if (e.target === searchDialog) closeSearch(); });
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.trim().toLocaleLowerCase('uk');
    if (!q) { resultsBox.innerHTML = ''; return; }
    const matches = searchIndex.filter(item => item[0].toLocaleLowerCase('uk').includes(q) || item[1].toLocaleLowerCase('uk').includes(q)).slice(0, 6);
    resultsBox.innerHTML = matches.length ? matches.map(([title, section, href]) => `<a class="search-result" href="${href}"><span>${title}</span><small>${section}</small></a>`).join('') : '<p>Нічого не знайдено. Спробуйте інший запит.</p>';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
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
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      showToast('Дякуємо! Форму підготовлено для підключення до поштового сервісу.');
      form.reset();
    });
  });

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
      showToast('Це посилання підготовлене для майбутнього матеріалу.');
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
    if (window.innerWidth >= 1100 && body.classList.contains('nav-open')) setNav(false);
  });
})();
