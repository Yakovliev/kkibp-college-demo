
(() => {
  const body = document.body;
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const navBackdrop = document.querySelector('[data-nav-backdrop]');
  const navShell = document.querySelector('.nav-shell');
  const menuButtons = [...document.querySelectorAll('.menu-toggle')];
  const searchDialog = document.querySelector('.search-dialog');
  const searchInput = document.querySelector('#site-search');
  const resultsBox = document.querySelector('#search-results');
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');
  const languageSwitches = [...document.querySelectorAll('[data-language-switch]')];
  const isEnglish = document.documentElement.lang.startsWith('en');
  const locale = isEnglish ? 'en' : 'uk';
  const siteRoot = root.dataset.siteRoot || (isEnglish ? '../' : '');
  let lockedNavScrollY = 0;
  let restoringNavScroll = false;
  const ui = isEnglish
    ? {
        closeMenu: 'Close menu',
        openMenu: 'Open menu',
        noResults: 'No results found. Try another query.',
        futureLink: 'This link is prepared for a future material.',
        readFull: 'Read in full'
      }
    : {
        closeMenu: 'Закрити меню',
        openMenu: 'Відкрити меню',
        noResults: 'Нічого не знайдено. Спробуйте інший запит.',
        futureLink: 'Це посилання підготовлене для майбутнього матеріалу.',
        readFull: 'Читати повністю'
  };
  let navTouchY = 0;
  const mobileAccordionQuery = window.matchMedia('(max-width: 719px)');
  const accordionTimers = new WeakMap();
  const resolveSiteHref = (href = '') => {
    if (!href || /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/.test(href)) return href;
    return `${siteRoot}${href}`;
  };

  const isMobileAccordion = () => mobileAccordionQuery.matches;
  const getMenuPanel = (item) => item?.querySelector('.mega-menu');

  const setMenuPanelAccess = (panel, open) => {
    if (!panel) return;
    panel.setAttribute('aria-hidden', String(!open));
    if ('inert' in panel) panel.inert = !open;
  };

  const updateAccordionHeight = (panel) => {
    if (!panel || !isMobileAccordion()) return;
    panel.style.setProperty('--accordion-height', `${panel.scrollHeight}px`);
  };

  const clearAccordionTimer = (item) => {
    const timer = accordionTimers.get(item);
    if (timer) window.clearTimeout(timer);
    accordionTimers.delete(item);
  };

  const setMenuOpen = (item, open) => {
    if (!item) return;
    const panel = getMenuPanel(item);
    const button = item.querySelector('.menu-toggle');
    clearAccordionTimer(item);

    if (isMobileAccordion()) {
      item.classList.remove('menu-settled');
      updateAccordionHeight(panel);
      if (!open && panel) panel.offsetHeight;
    } else {
      item.classList.remove('menu-settled');
      panel?.style.removeProperty('--accordion-height');
    }

    setMenuPanelAccess(panel, open);
    item.classList.toggle('menu-open', open);
    button?.setAttribute('aria-expanded', String(open));

    if (open) {
      requestAnimationFrame(() => {
        updateAccordionHeight(panel);
        if (isMobileAccordion()) {
          const timer = window.setTimeout(() => {
            if (item.classList.contains('menu-open') && isMobileAccordion()) {
              item.classList.add('menu-settled');
            }
            accordionTimers.delete(item);
          }, 300);
          accordionTimers.set(item, timer);
        }
      });
    }
  };

  const closeMenus = (except = null) => {
    document.querySelectorAll('.has-menu.menu-open').forEach(item => {
      if (item !== except) setMenuOpen(item, false);
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

  const lockPageScroll = (lockClass = 'nav-open') => {
    if (!body.classList.contains('nav-scroll-locked')) lockedNavScrollY = window.scrollY;
    root.classList.add(lockClass);
    body.classList.add(lockClass, 'nav-scroll-locked');
  };

  const unlockPageScroll = () => {
    root.classList.remove('nav-open', 'mega-open');
    body.classList.remove('nav-open', 'mega-open', 'nav-scroll-locked');
    lockedNavScrollY = window.scrollY;
  };

  const restoreLockedPageScroll = () => {
    if (!body.classList.contains('nav-scroll-locked') || restoringNavScroll) return false;
    if (Math.abs(window.scrollY - lockedNavScrollY) <= 1) return false;
    restoringNavScroll = true;
    window.scrollTo(0, lockedNavScrollY);
    requestAnimationFrame(() => { restoringNavScroll = false; });
    return true;
  };

  const getActiveMegaMenu = () => document.querySelector('.has-menu.menu-open > .mega-menu');

  const getLockedScrollContainer = (target) => {
    if (body.classList.contains('nav-open')) {
      return navShell?.contains(target) ? navShell : null;
    }
    if (body.classList.contains('mega-open')) {
      const menu = getActiveMegaMenu();
      return menu?.contains(target) ? menu : null;
    }
    return null;
  };

  const shouldStopScroll = (container, deltaY) => {
    if (!container || container.scrollHeight <= container.clientHeight) return true;
    const atTop = container.scrollTop <= 0;
    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
    return (atTop && deltaY < 0) || (atBottom && deltaY > 0);
  };

  const setNav = (open) => {
    if (open) lockPageScroll();
    body.classList.toggle('nav-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    navToggle?.setAttribute('aria-label', open ? ui.closeMenu : ui.openMenu);
    if (!open) {
      closeMenus();
      unlockPageScroll();
    }
  };

  navToggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  navBackdrop?.addEventListener('click', () => setNav(false));
  navShell?.addEventListener('touchstart', (event) => {
    navTouchY = event.touches[0]?.clientY || 0;
  }, { passive: true });
  document.addEventListener('touchmove', (event) => {
    if (!body.classList.contains('nav-scroll-locked')) return;
    const scrollContainer = getLockedScrollContainer(event.target);
    if (!scrollContainer) {
      event.preventDefault();
      return;
    }
    const currentY = event.touches[0]?.clientY || navTouchY;
    if (shouldStopScroll(scrollContainer, navTouchY - currentY)) event.preventDefault();
  }, { passive: false, capture: true });
  document.addEventListener('wheel', (event) => {
    if (!body.classList.contains('nav-scroll-locked')) return;
    const scrollContainer = getLockedScrollContainer(event.target);
    if (scrollContainer && !shouldStopScroll(scrollContainer, event.deltaY)) return;
    event.preventDefault();
  }, { passive: false, capture: true });

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

  document.querySelectorAll('.has-menu').forEach(item => {
    const open = item.classList.contains('menu-open');
    setMenuPanelAccess(getMenuPanel(item), open);
    if (open) updateAccordionHeight(getMenuPanel(item));
  });

  menuButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const item = event.currentTarget.closest('.has-menu');
      const opening = !item.classList.contains('menu-open');
      closeMenus(item);
      setMenuOpen(item, opening);
      if (window.innerWidth >= 720) {
        if (opening) {
          lockPageScroll('mega-open');
        } else if (!getActiveMegaMenu()) {
          unlockPageScroll();
        }
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.has-menu.menu-open > .mega-menu').forEach(panel => {
      if (isMobileAccordion()) {
        updateAccordionHeight(panel);
      } else {
        panel.style.removeProperty('--accordion-height');
        panel.closest('.has-menu')?.classList.remove('menu-settled');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-language-switch]')) closeLanguageSwitches();
    if (window.innerWidth >= 720 && !event.target.closest('.has-menu')) {
      closeMenus();
      if (body.classList.contains('mega-open')) unlockPageScroll();
    }
  });

  document.querySelectorAll('.mega-menu a, .nav-item:not(.has-menu) a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenus();
      if (window.innerWidth < 720 && body.classList.contains('nav-open')) {
        setNav(false);
      } else if (body.classList.contains('mega-open')) {
        unlockPageScroll();
      }
    });
  });

  const searchIndex = isEnglish
    ? [
        ['Admission Rules 2026', 'Applicants', 'admissions/admission-info/admission-rules.html'],
        ['Applicant Calendar', 'Applicants', 'admissions/admission-info/important-dates.html'],
        ['Educational Programs', 'Learning', 'admissions/educational-programs/educational-programs.html'],
        ['Class Schedule', 'Students', 'students/general-info/class-schedule.html'],
        ['Elective Disciplines Catalog', 'Students', 'students/general-info/elective-components-catalog.html'],
        ['Psychological Service', 'Support', 'students/social-support/psychological-service.html'],
        ['Career Center', 'Opportunities', 'college/activity/career-center.html'],
        ['Electronic Library Catalog', 'Library', 'library/book-fund/electronic-library.html'],
        ['Academic Integrity', 'Research', 'science/academic-integrity/official-documents-recommendations.html'],
        ['Research Clubs', 'Research', 'science/student-science/research-clubs.html'],
        ['College Contacts', 'College', 'college/general-info/contacts.html'],
        ['Public Information', 'College', 'college/main-info/public-information.html']
      ]
    : [
        ['Правила прийому 2026', 'Абітурієнту', 'admissions/admission-info/admission-rules.html'],
        ['Календар вступника', 'Абітурієнту', 'admissions/admission-info/important-dates.html'],
        ['Освітні програми', 'Навчання', 'admissions/educational-programs/educational-programs.html'],
        ['Розклад занять', 'Студенту', 'students/general-info/class-schedule.html'],
        ['Каталог вибіркових дисциплін', 'Студенту', 'students/general-info/elective-components-catalog.html'],
        ['Психологічна служба', 'Підтримка', 'students/social-support/psychological-service.html'],
        ['Центр кар’єри', 'Можливості', 'college/activity/career-center.html'],
        ['Електронний каталог бібліотеки', 'Бібліотека', 'library/book-fund/electronic-library.html'],
        ['Академічна доброчесність', 'Наука', 'science/academic-integrity/official-documents-recommendations.html'],
        ['Наукові гуртки', 'Наука', 'science/student-science/research-clubs.html'],
        ['Контакти коледжу', 'Коледж', 'college/general-info/contacts.html'],
        ['Публічна інформація', 'Коледж', 'college/main-info/public-information.html']
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
    resultsBox.innerHTML = matches.length ? matches.map(([title, section, href]) => `<a class="search-result" href="${resolveSiteHref(href)}"><span>${title}</span><small>${section}</small></a>`).join('') : `<p>${ui.noResults}</p>`;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      closeLanguageSwitches();
      if (body.classList.contains('nav-open')) setNav(false);
      if (body.classList.contains('mega-open')) unlockPageScroll();
      if (searchDialog && !searchDialog.hidden) closeSearch();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });

  const onScroll = () => {
    if (restoreLockedPageScroll()) return;
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
    const collapseOffset = window.innerWidth >= 720
      ? header?.querySelector('.header-inner')?.offsetHeight || 0
      : Number.POSITIVE_INFINITY;
    header?.classList.toggle('is-condensed', window.scrollY >= collapseOffset);
    backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const newsItems = Array.isArray(window.COLLEGE_NEWS) ? window.COLLEGE_NEWS : [];
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
  const normalizeNewsDate = (item) => Date.parse(item.loadedAt || item.publishedAt || '') || 0;
  const resolveNewsAsset = (path) => {
    if (!path || /^(https?:|\/|\.\/|\.\.\/)/.test(path)) return path;
    return `${siteRoot}${path}`;
  };
  const truncateNewsText = (value, maxLength) => {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    const slice = text.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(' ');
    const end = lastSpace > maxLength * 0.65 ? lastSpace : maxLength;
    return `${text.slice(0, end).replace(/[.,;:!?…]+$/, '')}...`;
  };
  const renderNewsCard = (item, excerptLength) => {
    const href = resolveSiteHref(item.url || '#');
    const linkAttrs = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    const idAttr = item.id ? ` id="${escapeHtml(item.id)}"` : '';
    const image = item.image
      ? `<div class="news-media news-media--image"><img src="${escapeHtml(resolveNewsAsset(item.image))}" alt="${escapeHtml(item.alt || item.title)}" loading="lazy"></div>`
      : '<div class="news-media" aria-hidden="true"></div>';
    const excerpt = item.excerpt || item.content || item.body || '';
    const meta = item.publishedLabel ? `<div class="news-meta"><span>${escapeHtml(item.publishedLabel)}</span></div>` : '';

    return `<article class="news-card"${idAttr}>${image}<div class="news-content">${meta}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(truncateNewsText(excerpt, excerptLength))}</p><a class="text-link" href="${escapeHtml(href)}"${linkAttrs}>${ui.readFull} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M10 14 19 5M19 13v6H5V5h6"/></svg></a></div></article>`;
  };
  const renderNewsPagination = (container, currentPage, totalPages) => {
    if (!container) return;
    if (totalPages <= 1) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }

    container.hidden = false;
    container.innerHTML = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      const href = page === 1 ? 'news.html' : `news.html?page=${page}`;
      const active = page === currentPage ? ' class="is-active" aria-current="page"' : '';
      return `<a href="${href}"${active}>${page}</a>`;
    }).join('');
  };

  if (newsItems.length) {
    const orderedNews = [...newsItems].sort((a, b) => normalizeNewsDate(b) - normalizeNewsDate(a));
    document.querySelectorAll('[data-news-list]').forEach(grid => {
      const limit = Number(grid.dataset.newsLimit) || orderedNews.length;
      const excerptLength = Number(grid.dataset.newsExcerptLength) || 185;
      const pageSize = Number(grid.dataset.newsPageSize) || 0;
      const items = orderedNews.slice(0, limit);
      const totalPages = pageSize ? Math.ceil(items.length / pageSize) : 1;
      const requestedPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
      const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
      const visibleItems = pageSize
        ? items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : items;

      grid.innerHTML = visibleItems.map(item => renderNewsCard(item, excerptLength)).join('');
      renderNewsPagination(grid.parentElement?.querySelector('[data-news-pagination]'), currentPage, totalPages);
    });
    document.querySelectorAll('[data-news-count]').forEach(element => {
      element.textContent = orderedNews.length;
    });
  }

  document.querySelectorAll('[data-college-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.college-photo-track');
    const slides = [...carousel.querySelectorAll('.college-photo-track img')];
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('.college-carousel-dots');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
    let active = 0;
    let timer = null;

    if (!track || slides.length <= 1) return;

    if (dotsWrap && dots.length !== slides.length) {
      dotsWrap.innerHTML = slides.map((_, index) => `<button type="button" aria-label="Фото ${index + 1}" data-carousel-dot></button>`).join('');
      dots = [...dotsWrap.querySelectorAll('[data-carousel-dot]')];
    }

    const setActiveSlide = (index) => {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${active * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        slide.setAttribute('aria-hidden', String(slideIndex !== active));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === active;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (reduceMotion || timer) return;
      timer = window.setInterval(() => setActiveSlide(active + 1), 5200);
    };

    prev?.addEventListener('click', () => {
      setActiveSlide(active - 1);
      stop();
      start();
    });
    next?.addEventListener('click', () => {
      setActiveSlide(active + 1);
      stop();
      start();
    });
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setActiveSlide(index);
        stop();
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    setActiveSlide(0);
    start();
  });

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
    if ((window.innerWidth < 720 || window.innerWidth >= 1100) && body.classList.contains('mega-open')) {
      closeMenus();
      unlockPageScroll();
    }
    onScroll();
  });

  // Demo theme switcher — lets reviewers preview color directions live.
  // Self-contained UI tool: remove this block (and the matching CSS) for production.
  (() => {
    const themes = [
      { id: '', uk: 'Основна', en: 'Primary', swatch: 'linear-gradient(135deg,#0b2345,#4ca0d8)' },
      { id: 'night', uk: 'Нічний режим', en: 'Night mode', swatch: 'linear-gradient(135deg,#071420,#38aee5)' },
      { id: 'purple', uk: 'Фіолетова', en: 'Royal Purple', swatch: 'linear-gradient(135deg,#2a0f49,#9a6ee6)' },
      { id: 'burgundy', uk: 'Бордова', en: 'Burgundy', swatch: 'linear-gradient(135deg,#3d0d1c,#d6a23f)' }
    ];
    const root = document.documentElement;
    const stored = localStorage.getItem('demo-theme') || '';
    const apply = (id) => { if (id) root.dataset.theme = id; else delete root.dataset.theme; };
    apply(stored);

    const label = isEnglish ? 'Theme' : 'Тема';
    const wrap = document.createElement('div');
    wrap.className = 'theme-demo';
    wrap.innerHTML = `
      <div class="theme-demo__panel" role="menu">
        <span class="theme-demo__title">${label}</span>
        ${themes.map(t => `<button class="theme-demo__opt" type="button" role="menuitemradio" data-theme-id="${t.id}"><span class="theme-demo__sw" style="background:${t.swatch}"></span>${isEnglish ? t.en : t.uk}</button>`).join('')}
      </div>
      <button class="theme-demo__toggle" type="button" aria-haspopup="true" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 1 0-9 4.5 4.5 0 0 0 0-9Z"/></svg>${label}
      </button>`;
    document.body.appendChild(wrap);

    const toggle = wrap.querySelector('.theme-demo__toggle');
    const options = [...wrap.querySelectorAll('.theme-demo__opt')];
    const setActive = (id) => options.forEach(b => {
      const on = b.dataset.themeId === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    setActive(stored);

    toggle.addEventListener('click', () => {
      const open = !wrap.classList.contains('is-open');
      wrap.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    options.forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.themeId;
      apply(id);
      localStorage.setItem('demo-theme', id);
      setActive(id);
    }));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.theme-demo')) {
        wrap.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();
})();
