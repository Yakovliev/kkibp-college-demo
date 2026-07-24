
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
  // Department (циклова комісія) tags — the "Циклова комісія" prefix is intentionally dropped.
  const DEPARTMENT_NEWS_TAGS = [
    { id: 'oblik-finance', kind: 'department', uk: 'Обліково-фінансові дисципліни', en: 'Accounting and Finance' },
    { id: 'economics-trade', kind: 'department', uk: 'Економіка, торгівля та маркетинг', en: 'Economics, Trade and Marketing' },
    { id: 'social-law', kind: 'department', uk: 'Соціально-гуманітарні та правознавчі дисципліни', en: 'Social, Humanities and Law' },
    { id: 'it-science', kind: 'department', uk: 'Інформаційно-технічні та природничі дисципліни', en: 'IT and Natural Sciences' },
    { id: 'food-hospitality', kind: 'department', uk: 'Харчові технології, організація готельно-ресторанного бізнесу', en: 'Food Technology and Hospitality' }
  ];
  const SDG_NEWS_TAGS = [
    { id: 'sdg-01', kind: 'sdg', uk: 'ЦСР 1 - Подолання бідності', en: 'SDG 1 - No Poverty' },
    { id: 'sdg-02', kind: 'sdg', uk: 'ЦСР 2 - Подолання голоду', en: 'SDG 2 - Zero Hunger' },
    { id: 'sdg-03', kind: 'sdg', uk: 'ЦСР 3 - Міцне здоров’я і благополуччя', en: 'SDG 3 - Good Health and Well-being' },
    { id: 'sdg-04', kind: 'sdg', uk: 'ЦСР 4 - Якісна освіта', en: 'SDG 4 - Quality Education' },
    { id: 'sdg-05', kind: 'sdg', uk: 'ЦСР 5 - Гендерна рівність', en: 'SDG 5 - Gender Equality' },
    { id: 'sdg-06', kind: 'sdg', uk: 'ЦСР 6 - Чиста вода та належні санітарні умови', en: 'SDG 6 - Clean Water and Sanitation' },
    { id: 'sdg-07', kind: 'sdg', uk: 'ЦСР 7 - Доступна та чиста енергія', en: 'SDG 7 - Affordable and Clean Energy' },
    { id: 'sdg-08', kind: 'sdg', uk: 'ЦСР 8 - Гідна праця та економічне зростання', en: 'SDG 8 - Decent Work and Economic Growth' },
    { id: 'sdg-09', kind: 'sdg', uk: 'ЦСР 9 - Промисловість, інновації та інфраструктура', en: 'SDG 9 - Industry, Innovation and Infrastructure' },
    { id: 'sdg-10', kind: 'sdg', uk: 'ЦСР 10 - Скорочення нерівності', en: 'SDG 10 - Reduced Inequalities' },
    { id: 'sdg-11', kind: 'sdg', uk: 'ЦСР 11 - Сталий розвиток міст і громад', en: 'SDG 11 - Sustainable Cities and Communities' },
    { id: 'sdg-12', kind: 'sdg', uk: 'ЦСР 12 - Відповідальне споживання та виробництво', en: 'SDG 12 - Responsible Consumption and Production' },
    { id: 'sdg-13', kind: 'sdg', uk: 'ЦСР 13 - Пом’якшення наслідків зміни клімату', en: 'SDG 13 - Climate Action' },
    { id: 'sdg-14', kind: 'sdg', uk: 'ЦСР 14 - Збереження морських ресурсів', en: 'SDG 14 - Life Below Water' },
    { id: 'sdg-15', kind: 'sdg', uk: 'ЦСР 15 - Захист екосистем суші', en: 'SDG 15 - Life on Land' },
    { id: 'sdg-16', kind: 'sdg', uk: 'ЦСР 16 - Мир, справедливість та сильні інститути', en: 'SDG 16 - Peace, Justice and Strong Institutions' },
    { id: 'sdg-17', kind: 'sdg', uk: 'ЦСР 17 - Партнерство заради сталого розвитку', en: 'SDG 17 - Partnerships for the Goals' }
  ];
  const NEWS_TAG_GROUPS = [
    { id: 'departments', uk: 'Циклові комісії', en: 'Departments', tags: DEPARTMENT_NEWS_TAGS },
    { id: 'sdg', uk: 'Цілі сталого розвитку', en: 'Sustainable Development Goals', tags: SDG_NEWS_TAGS }
  ];
  const NEWS_TAGS = [...DEPARTMENT_NEWS_TAGS, ...SDG_NEWS_TAGS];
  const NEWS_TAG_MAP = Object.fromEntries(NEWS_TAGS.map(t => [t.id, t]));
  const newsTagLabel = (id) => {
    const tag = NEWS_TAG_MAP[id];
    return tag ? (isEnglish ? tag.en : tag.uk) : '';
  };
  const renderNewsTagLink = (id) => {
    const tag = NEWS_TAG_MAP[id];
    const label = newsTagLabel(id);
    if (!tag || !label) return '';
    const href = resolveSiteHref(`news.html?tag=${encodeURIComponent(id)}`);
    return `<a class="news-tag news-tag--${tag.kind}" href="${escapeHtml(href)}" title="${escapeHtml(label)}">${escapeHtml(label)}</a>`;
  };
  // Card view: keep tags on a single line — first tag (truncated if needed) plus a "+N" chip.
  const renderNewsTagsCompact = (tags) => {
    const list = (Array.isArray(tags) ? tags : []).filter(id => NEWS_TAG_MAP[id]);
    if (!list.length) return '';
    const rest = list.slice(1).map(newsTagLabel);
    const moreChip = rest.length
      ? `<span class="news-tag news-tag--more" title="${escapeHtml(rest.join(', '))}">+${rest.length}</span>`
      : '';
    return `<div class="news-tags">${renderNewsTagLink(list[0])}${moreChip}</div>`;
  };
  // Article view: show every tag on its own metadata row.
  const renderNewsTagsAll = (tags) => {
    const links = (Array.isArray(tags) ? tags : [])
      .map(renderNewsTagLink)
      .join('');
    return links ? `<div class="news-article-tags">${links}</div>` : '';
  };

  const renderNewsCard = (item, excerptLength) => {
    const href = resolveSiteHref(item.url || '#');
    const linkAttrs = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    const idAttr = item.id ? ` id="${escapeHtml(item.id)}"` : '';
    const image = item.image
      ? `<div class="news-media news-media--image"><img src="${escapeHtml(resolveNewsAsset(item.image))}" alt="${escapeHtml(item.alt || item.title)}" loading="lazy"></div>`
      : '<div class="news-media" aria-hidden="true"></div>';
    const excerpt = item.excerpt || item.content || item.body || '';
    const tags = renderNewsTagsCompact(item.tags);
    const meta = (item.publishedLabel || tags)
      ? `<div class="news-meta">${item.publishedLabel ? `<span>${escapeHtml(item.publishedLabel)}</span>` : ''}${tags}</div>`
      : '';

    return `<article class="news-card"${idAttr}>${image}<div class="news-content">${meta}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(truncateNewsText(excerpt, excerptLength))}</p><a class="text-link" href="${escapeHtml(href)}"${linkAttrs}>${ui.readFull} <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M10 14 19 5M19 13v6H5V5h6"/></svg></a></div></article>`;
  };
  const renderNewsPagination = (container, currentPage, totalPages, activeTag = '') => {
    if (!container) return;
    if (totalPages <= 1) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }

    const tagQuery = activeTag ? `tag=${encodeURIComponent(activeTag)}` : '';
    container.hidden = false;
    container.innerHTML = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      const params = [tagQuery, page === 1 ? '' : `page=${page}`].filter(Boolean).join('&');
      const href = params ? `news.html?${params}` : 'news.html';
      const active = page === currentPage ? ' class="is-active" aria-current="page"' : '';
      return `<a href="${href}"${active}>${page}</a>`;
    }).join('');
  };

  if (newsItems.length) {
    const orderedNews = [...newsItems].sort((a, b) => normalizeNewsDate(b) - normalizeNewsDate(a));
    let activeTag = '';
    const syncTagFromUrl = () => {
      const tag = new URLSearchParams(window.location.search).get('tag');
      activeTag = NEWS_TAG_MAP[tag] ? tag : '';
    };
    syncTagFromUrl();
    const hasTag = (item) => Array.isArray(item.tags) && item.tags.includes(activeTag);
    const filterBars = [...document.querySelectorAll('[data-news-filter]')];
    const newsGrids = [...document.querySelectorAll('[data-news-list]')];

    // Tag filter bar (rendered only where a container opts in, e.g. the news page).
    const renderFilterBars = () => {
      const button = (id, label, isActive) => {
        const href = resolveSiteHref(id ? `news.html?tag=${encodeURIComponent(id)}` : 'news.html');
        const kind = id ? NEWS_TAG_MAP[id]?.kind : 'all';
        const cls = `news-filter__btn news-filter__btn--${kind}${isActive ? ' is-active' : ''}`;
        const current = isActive ? ' aria-current="true"' : '';
        return `<a class="${cls}" href="${escapeHtml(href)}"${current}>${escapeHtml(label)}</a>`;
      };
      filterBars.forEach(bar => {
        const heading = isEnglish ? 'Filter news by tag' : 'Фільтрувати новини за тегом';
        const allLabel = isEnglish ? 'All news' : 'Усі новини';
        const groups = NEWS_TAG_GROUPS.map(group => {
          const label = isEnglish ? group.en : group.uk;
          const buttons = group.tags
            .map(tag => button(tag.id, isEnglish ? tag.en : tag.uk, activeTag === tag.id))
            .join('');
          return `<div class="news-filter__group" role="group" aria-label="${escapeHtml(label)}"><span class="news-filter__group-title">${escapeHtml(label)}</span><div class="news-filter__options">${buttons}</div></div>`;
        }).join('');
        bar.innerHTML = `<div class="news-filter__toolbar"><span class="news-filter__heading">${heading}</span>${button('', allLabel, !activeTag)}</div>${groups}`;
      });
    };

    const renderGrids = () => {
      newsGrids.forEach(grid => {
        const filtered = activeTag ? orderedNews.filter(hasTag) : orderedNews;
        const limit = Number(grid.dataset.newsLimit) || filtered.length;
        const excerptLength = Number(grid.dataset.newsExcerptLength) || 185;
        const pageSize = Number(grid.dataset.newsPageSize) || 0;
        const items = filtered.slice(0, limit);
        const totalPages = pageSize ? Math.max(1, Math.ceil(items.length / pageSize)) : 1;
        const requestedPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
        const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
        const visibleItems = pageSize
          ? items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          : items;

        grid.innerHTML = visibleItems.length
          ? visibleItems.map(item => renderNewsCard(item, excerptLength)).join('')
          : `<p class="news-empty">${isEnglish ? 'No news with this tag yet.' : 'Поки немає новин із цим тегом.'}</p>`;
        renderNewsPagination(grid.parentElement?.querySelector('[data-news-pagination]'), currentPage, totalPages, activeTag);
      });
      document.querySelectorAll('[data-news-count]').forEach(element => {
        element.textContent = (activeTag ? orderedNews.filter(hasTag) : orderedNews).length;
      });
    };

    const renderFeed = () => { renderFilterBars(); renderGrids(); };
    renderFeed();

    // On the news page, filter/paginate in place (no reload, no jump to top).
    if (filterBars.length) {
      const scrollToFeed = () => {
        const y = filterBars[0].getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      };
      document.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
        const link = event.target.closest('.news-filter__btn, .news-tag, [data-news-pagination] a');
        if (!link) return;
        event.preventDefault();
        window.history.pushState({}, '', link.href);
        syncTagFromUrl();
        renderFeed();
        if (!link.classList.contains('news-filter__btn')) scrollToFeed();
      });
      window.addEventListener('popstate', () => { syncTagFromUrl(); renderFeed(); });
    }

    // Full news article: show all assigned taxonomy tags in the standard metadata area.
    const current = newsItems.find(item => (item.url || '').split('/').pop() === window.location.pathname.split('/').pop());
    const articleMeta = document.querySelector('.news-article-meta');
    if (current && articleMeta && !articleMeta.querySelector('.news-tag')) {
      const tags = renderNewsTagsAll(current.tags);
      if (tags) articleMeta.insertAdjacentHTML('beforeend', tags);
    }
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
      const photoLabel = isEnglish ? 'Photo' : 'Фото';
      dotsWrap.innerHTML = slides.map((_, index) => `<button type="button" aria-label="${photoLabel} ${index + 1}" data-carousel-dot></button>`).join('');
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

  /*
  // Day / night theme — disabled by the approved administration decision of 2026-07-24.
  // The implementation is kept as a comment for project history.
  (() => {
    const root = document.documentElement;
    // Only 'night' (or empty = day) is supported; ignore any legacy stored theme.
    const stored = localStorage.getItem('site-theme') === 'night' ? 'night' : '';
    const apply = (id) => { if (id) root.dataset.theme = id; else delete root.dataset.theme; };
    apply(stored);

    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'icon-button header-theme';
    toggle.innerHTML = `
      <svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      <svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>`;
    const searchBtn = headerActions.querySelector('.header-search');
    headerActions.insertBefore(toggle, searchBtn || headerActions.firstChild);

    const sync = (id) => {
      const night = id === 'night';
      const text = night
        ? (isEnglish ? 'Switch to day theme' : 'Увімкнути денну тему')
        : (isEnglish ? 'Switch to night theme' : 'Увімкнути нічну тему');
      toggle.setAttribute('aria-pressed', String(night));
      toggle.setAttribute('aria-label', text);
      toggle.title = text;
    };
    sync(stored);

    toggle.addEventListener('click', () => {
      const id = root.dataset.theme === 'night' ? '' : 'night';
      apply(id);
      localStorage.setItem('site-theme', id);
      sync(id);
    });
  })();
  */
})();
