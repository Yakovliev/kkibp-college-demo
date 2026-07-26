const { test, expect } = require('@playwright/test');

test('home page renders without horizontal overflow', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Економіко-правовий фаховий коледж/);

  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title,
    touch: 'ontouchstart' in window,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    dpr: window.devicePixelRatio
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
});

test('inner pages use the full content container without the duplicate sidebar', async ({ page }) => {
  const pages = [
    { path: '/college.html', hasHeroGuide: true },
    { path: '/college/activity/sustainable-development.html', hasHeroGuide: false },
    { path: '/students/general-info/class-schedule.html', hasHeroGuide: false },
    { path: '/en/college.html', hasHeroGuide: true }
  ];

  for (const item of pages) {
    await page.goto(item.path);

    await expect(page.locator('.anchor-nav, .anchor-card')).toHaveCount(0);
    await expect(page.locator('.page-hero-guide')).toHaveCount(item.hasHeroGuide ? 1 : 0);

    const layout = await page.locator('.content-layout').evaluate((element) => {
      const content = element.firstElementChild;
      const elementRect = element.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      return {
        display: getComputedStyle(element).display,
        elementWidth: Math.round(elementRect.width),
        contentWidth: Math.round(contentRect.width),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });

    expect(layout.display).toBe('block');
    expect(layout.contentWidth).toBeGreaterThanOrEqual(layout.elementWidth - 1);
    expect(layout.overflow).toBe(false);
  }
});

test('sustainable development page links all goals and external documents', async ({ page }) => {
  await page.goto('/college/activity/sustainable-development.html');

  const goals = page.locator('.sdg-goal-card');
  await expect(page.getByRole('heading', { name: '17 цілей сталого розвитку' })).toBeVisible();
  await expect(goals).toHaveCount(17);
  await expect(goals.locator('img')).toHaveCount(17);

  const expectedGoals = [
    ['sustainable-development/podolannia-bidnosti.html', 'Ціль 1 — Подолання бідності'],
    ['sustainable-development/podolannia-holodu.html', 'Ціль 2 — Подолання голоду'],
    ['sustainable-development/mitsne-zdorovia-i-blahopoluchchia.html', 'Ціль 3 — Міцне здоров’я і благополуччя'],
    ['sustainable-development/yakisna-osvita.html', 'Ціль 4 — Якісна освіта'],
    ['sustainable-development/henderna-rivnist.html', 'Ціль 5 — Гендерна рівність'],
    ['sustainable-development/chysta-voda-ta-nalezhni-sanitarni-umovy.html', 'Ціль 6 — Чиста вода та належні санітарні умови'],
    ['sustainable-development/dostupna-ta-chysta-enerhiia.html', 'Ціль 7 — Доступна та чиста енергія'],
    ['sustainable-development/hidna-pratsia-ta-ekonomichne-zrostannia.html', 'Ціль 8 — Гідна праця та економічне зростання'],
    ['sustainable-development/promyslovist-innovatsii-ta-infrastruktura.html', 'Ціль 9 — Промисловість, інновації та інфраструктура'],
    ['sustainable-development/skorochennia-nerivnosti.html', 'Ціль 10 — Скорочення нерівності'],
    ['sustainable-development/stalyi-rozvytok-mist-i-hromad.html', 'Ціль 11 — Сталий розвиток міст і громад'],
    ['sustainable-development/vidpovidalne-spozhyvannia-ta-vyrobnytstvo.html', 'Ціль 12 — Відповідальне споживання та виробництво'],
    ['sustainable-development/pomiakshennia-naslidkiv-zminy-klimatu.html', 'Ціль 13 — Пом’якшення наслідків зміни клімату'],
    ['sustainable-development/zberezhennia-morskykh-resursiv.html', 'Ціль 14 — Збереження морських ресурсів'],
    ['sustainable-development/zakhyst-ekosystem-sushi.html', 'Ціль 15 — Захист екосистем суші'],
    ['sustainable-development/myr-spravedlyvist-ta-sylni-instytuty.html', 'Ціль 16 — Мир, справедливість та сильні інститути'],
    ['sustainable-development/partnerstvo-zarady-staloho-rozvytku.html', 'Ціль 17 — Партнерство заради сталого розвитку']
  ];
  const goalHrefs = await goals.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const goalLabels = await goals.evaluateAll((links) => links.map((link) => link.getAttribute('aria-label')));
  const goalImageSources = await goals.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  expect(goalHrefs).toEqual(expectedGoals.map(([href]) => href));
  expect(goalLabels).toEqual(expectedGoals.map(([, label]) => label));
  expect(goalImageSources).toEqual(expectedGoals.map((_, index) => `../../assets/sdg/sdg-${String(index + 1).padStart(2, '0')}.svg`));

  for (const [index, href] of goalHrefs.entries()) {
    const url = new URL(href, page.url()).href;
    const response = await page.request.get(url);
    expect(response.ok(), `${url} should be available`).toBe(true);
    const html = await response.text();
    expect(html).toContain('<article class="sdg-article"');
    expect(html).not.toContain('sdg-placeholder-panel');
    expect(html).not.toContain('sdg-article-intro');
    expect(html).not.toContain('sdg-article-footer');
    expect(html).not.toContain('Переглянути всі 17 цілей');
    expect(html).not.toContain('Матеріали про діяльність коледжу в межах цієї цілі сталого розвитку.');
    expect(html).not.toContain('Діяльність коледжу, пов’язана з досягненням цієї цілі сталого розвитку.');
    expect(html).toContain(`<h1>${expectedGoals[index][1].replace(/^Ціль \d+ — /, '')}</h1>`);
    expect(html).toContain(`../../../assets/sdg/sdg-${String(index + 1).padStart(2, '0')}.svg`);
    expect(html).toContain(`../../../assets/sdg/content/goal-${String(index + 1).padStart(2, '0')}/`);

    const articleBodyStart = html.indexOf('<div class="sdg-article-body">');
    const articleBodyEnd = html.indexOf('</article>', articleBodyStart);
    const articleBody = html.slice(articleBodyStart, articleBodyEnd);
    expect(articleBodyStart).toBeGreaterThan(-1);
    expect(articleBodyEnd).toBeGreaterThan(articleBodyStart);
    expect(articleBody).not.toContain('ККІБП');
  }

  const documents = page.locator('.sdg-document-link');
  await expect(documents).toHaveCount(3);
  await expect(documents).toHaveText([
    /Звіт зі сталого розвитку/,
    /Таллуарська декларація/,
    /План роботи на 2025–2026 навчальний рік/
  ]);
  expect(await documents.evaluateAll((links) => links.map((link) => link.getAttribute('target')))).toEqual(['_blank', '_blank', '_blank']);

  const documentHrefs = await documents.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(documentHrefs).toEqual([
    'https://kkibp.edu.ua/images/2026year/2/Звіт_про_виконання_плану_роботиe4r5hut4rdh5y.pdf',
    'https://kkibp.edu.ua/images/2025_Year/Infa_Rector/Таллуарська_декларація.pdf',
    'https://kkibp.edu.ua/images/2025_Year/Infa_Rector/план_роботи_цілі25-26.pdf'
  ]);

  await page.goto('/college/activity/sustainable-development/podolannia-bidnosti.html');
  await expect(page.getByRole('heading', { level: 1, name: 'Подолання бідності' })).toBeVisible();
  await expect(page.locator('.page-hero-copy > p')).toHaveCount(0);
  await expect(page.locator('.sdg-article-intro')).toHaveCount(0);
  await expect(page.locator('.sdg-article-footer')).toHaveCount(0);
  await expect(page.locator('.sdg-article-goal-icon')).toHaveAttribute('src', '../../../assets/sdg/sdg-01.svg');
  await expect(page.locator('.sdg-article-body img')).toHaveCount(15);

  const layout = await page.evaluate(() => {
    const article = document.querySelector('.sdg-article').getBoundingClientRect();
    const icon = document.querySelector('.sdg-article-goal-icon').getBoundingClientRect();
    const gallery = document.querySelector('.sdg-article-gallery').getBoundingClientRect();
    const firstImage = document.querySelector('.sdg-article-media').getBoundingClientRect();
    return {
      iconRatio: icon.width / article.width,
      galleryWidth: gallery.width,
      firstImageWidth: firstImage.width,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  expect(layout.iconRatio).toBeGreaterThan(0.49);
  expect(layout.iconRatio).toBeLessThan(0.51);
  expect(layout.firstImageWidth).toBeGreaterThanOrEqual(layout.galleryWidth - 1);
  expect(layout.overflow).toBe(false);

  await page.goto('/college/activity/sustainable-development/partnerstvo-zarady-staloho-rozvytku.html');
  await expect(page.locator('.sdg-article-table-wrap')).toHaveCount(1);
  await expect(page.locator('.sdg-article-table')).toBeVisible();
  await expect(page.locator('.sdg-article-body img')).toHaveCount(25);
});

test('home about-college carousel renders and can be controlled', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('#college-about');
  const carousel = section.locator('[data-college-carousel]');
  const slides = carousel.locator('.college-photo-track img');
  const dots = carousel.locator('[data-carousel-dot]');

  await expect(section.getByRole('heading', { name: 'Коледж для впевненого професійного старту' })).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await expect(slides).toHaveCount(4);
  await expect(dots).toHaveCount(4);
  await expect(section.locator('.college-combo-more')).toHaveAttribute('href', 'college/general-info/about-college.html');

  const imageSources = await slides.evaluateAll((images) => images.map((image) => new URL(image.getAttribute('src'), window.location.href).href));
  for (const src of imageSources) {
    const response = await page.request.get(src);
    expect(response.ok(), `${src} should be available`).toBe(true);
  }

  const activeBefore = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  await carousel.getByRole('button', { name: 'Наступне фото' }).click();
  const activeAfter = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  const trackTransform = await carousel.locator('.college-photo-track').evaluate((track) => track.style.transform);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  expect(activeAfter).toBe((activeBefore + 1) % 4);
  expect(trackTransform).toBe(`translateX(-${activeAfter * 100}%)`);
  expect(overflow).toBe(false);
});

test('home main sections expose accepted navigation structure', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('.main-sections#about');
  await section.scrollIntoViewIfNeeded();

  await expect(section.getByRole('heading', { name: 'Усе важливе поруч' })).toBeVisible();
  await expect(section.locator('.main-sections-heading p')).toHaveText('Для вступників, студентів, випускників і гостей сайту: основні розділи, з яких починається знайомство з коледжем.');

  const contact = section.getByRole('link', { name: /Контакти/ });
  await expect(contact).toHaveAttribute('href', 'college/general-info/contacts.html');

  const cards = section.locator('.main-section-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h3')).toHaveText(['Коледж', 'Абітурієнту', 'Студенту', 'Випускнику', 'Наука', 'Бібліотека']);
  await expect(cards.locator('.section-card-a__marker')).toHaveText(['Про коледж', 'Вступ', 'Навчання', 'Спільнота', 'Дослідження', 'Ресурси']);

  const links = await cards.locator('a.text-link').evaluateAll((items) => items.map((item) => item.getAttribute('href')));
  expect(links).toEqual(['college.html', 'admissions.html', 'students.html', 'alumni.html', 'science.html', 'library.html']);
  await expect(section.locator('.feature-icon')).toHaveCount(0);
  await expect(section.getByRole('heading', { name: 'Публічна інформація' })).toHaveCount(0);

  const layout = await section.evaluate((element) => {
    const grid = element.querySelector('.main-section-grid');
    const heading = element.querySelector('.main-sections-heading');
    const paragraph = element.querySelector('.main-sections-heading p');
    const title = element.querySelector('.main-sections-heading h2');
    const contactLink = element.querySelector('.main-sections-contact');
    const gridColumns = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    const headingRect = heading.getBoundingClientRect();
    const paragraphRect = paragraph.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const contactRect = contactLink.getBoundingClientRect();

    return {
      contactTop: contactRect.top,
      contactBottom: contactRect.bottom,
      contactWidth: contactRect.width,
      gridColumns,
      headingWidth: headingRect.width,
      paragraphBottom: paragraphRect.bottom,
      titleBottom: titleRect.bottom,
      viewportWidth: window.innerWidth
    };
  });

  if (layout.viewportWidth < 720) {
    expect(layout.gridColumns).toBe(1);
    expect(layout.contactWidth).toBeGreaterThanOrEqual(layout.headingWidth - 1);
    expect(layout.contactTop).toBeGreaterThan(layout.paragraphBottom);
  } else if (layout.viewportWidth < 1100) {
    expect(layout.gridColumns).toBe(2);
  } else {
    expect(layout.gridColumns).toBe(3);
    expect(layout.contactTop).toBeGreaterThanOrEqual(layout.titleBottom - 1);
    expect(layout.contactTop).toBeLessThan(layout.paragraphBottom);
    expect(layout.contactBottom).toBeGreaterThan(layout.contactTop);
  }
});

test('home latest news renders exactly three newest shared cards', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('[data-news-list]').first();
  const cards = section.locator('.news-card');

  await expect(cards).toHaveCount(3);
  await expect(cards.locator('h3')).toHaveText([
    '«КОРЕНІ ТА КРИЛА: ІСТОРІЯ, ЯКА ОБ’ЄДНУЄ»: УЧАСТЬ К.І.Н., ДОЦЕНТА ЮЛІЇ РУДЕНКО У РОБОТІ ДРУГОГО МОДУЛЯ ЛІТНЬОЇ ШКОЛИ',
    'Бібліотека Приватного закладу «Київський кооперативний інститут бізнесу і права» поповнилася новими історичними виданнями',
    'Введення в дію Закону України «Про академічну доброчесність» та наслідки для закладів вищої освіти'
  ]);
  await expect(section.locator('.news-media img')).toHaveCount(3);
  await expect(section.locator('.news-meta')).toHaveCount(3);
  await expect(section.locator('.text-link')).toHaveCount(3);
  await expect(section.locator('.news-media-label')).toHaveCount(0);

  const allNews = page.getByRole('link', { name: /Усі новини/ });
  await expect(allNews).toHaveAttribute('href', 'news.html');
});

test('news page paginates all 53 materials in chronological order', async ({ page }) => {
  await page.goto('/news.html');

  const grid = page.locator('[data-news-list]');
  const cards = grid.locator('.news-card');
  const sdgFilterLabels = [
    'ЦСР 1 - Подолання бідності',
    'ЦСР 2 - Подолання голоду',
    'ЦСР 3 - Міцне здоров’я і благополуччя',
    'ЦСР 4 - Якісна освіта',
    'ЦСР 5 - Гендерна рівність',
    'ЦСР 6 - Чиста вода та належні санітарні умови',
    'ЦСР 7 - Доступна та чиста енергія',
    'ЦСР 8 - Гідна праця та економічне зростання',
    'ЦСР 9 - Промисловість, інновації та інфраструктура',
    'ЦСР 10 - Скорочення нерівності',
    'ЦСР 11 - Сталий розвиток міст і громад',
    'ЦСР 12 - Відповідальне споживання та виробництво',
    'ЦСР 13 - Пом’якшення наслідків зміни клімату',
    'ЦСР 14 - Збереження морських ресурсів',
    'ЦСР 15 - Захист екосистем суші',
    'ЦСР 16 - Мир, справедливість та сильні інститути',
    'ЦСР 17 - Партнерство заради сталого розвитку'
  ];

  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await expect(page.locator('.news-filter__group-title')).toHaveText(['Циклові комісії', 'Цілі сталого розвитку']);
  await expect(page.locator('.news-filter__btn--sdg')).toHaveCount(17);
  await expect(page.locator('.news-filter__btn--sdg')).toHaveText(sdgFilterLabels);
  const departmentFilter = page.locator('.news-filter__btn--department').first();
  const sdgFilter = page.locator('.news-filter__btn--sdg').first();
  const filterColors = locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      border: style.borderColor,
      color: style.color
    };
  });
  expect(await filterColors(sdgFilter)).toEqual(await filterColors(departmentFilter));
  if ((page.viewportSize()?.width || 0) >= 1100) {
    await departmentFilter.hover();
    await page.waitForTimeout(250);
    const departmentHoverColors = await filterColors(departmentFilter);
    await sdgFilter.hover();
    await page.waitForTimeout(250);
    expect(await filterColors(sdgFilter)).toEqual(departmentHoverColors);
  }
  await expect(cards).toHaveCount(9);
  await expect(cards.locator('h3')).toHaveText([
    '«КОРЕНІ ТА КРИЛА: ІСТОРІЯ, ЯКА ОБ’ЄДНУЄ»: УЧАСТЬ К.І.Н., ДОЦЕНТА ЮЛІЇ РУДЕНКО У РОБОТІ ДРУГОГО МОДУЛЯ ЛІТНЬОЇ ШКОЛИ',
    'Бібліотека Приватного закладу «Київський кооперативний інститут бізнесу і права» поповнилася новими історичними виданнями',
    'Введення в дію Закону України «Про академічну доброчесність» та наслідки для закладів вищої освіти',
    'К.І.Н., ДОЦЕНТ ЮЛІЯ РУДЕНКО ЗАВЕРШИЛА КУРС «СИЛА У РІЗНОМАНІТТІ: ПРАВА КОРІННИХ НАРОДІВ ТА НАЦІОНАЛЬНИХ СПІЛЬНОТ»',
    'Викладачі кафедри фінансів і обліку долучилися до Великого бухгалтерського семінару',
    'Сучасні підходи до оцінювання вартості бізнесу: професійний розвиток к.е.н., доцентки, проректорки Інни Райковської',
    'Soft skills як ресурс професійного розвитку: участь викладачів кафедри фінансів і обліку в освітньому семінарі',
    'УЧАСНИКИ ОСВІТНЬОГО ПРОЦЕСУ ДОЛУЧИЛИСЯ ДО АКЦІЇ «ВОРОГАМ – КРИШКА»',
    'К.І.Н., ДОЦЕНТ ЮЛІЯ РУДЕНКО ВЗЯЛА УЧАСТЬ У П’ЯТІЙ МІЖНАРОДНІЙ ЛІТНІЙ НАУКОВО-ПРОФІЛЬНІЙ ШКОЛІ З МУЗЕЙНОЇ ПЕДАГОГІКИ'
  ]);
  await expect(grid.locator('.news-media img')).toHaveCount(9);
  await expect(grid.locator('.news-meta')).toHaveCount(9);
  await expect(grid.locator('.text-link')).toHaveCount(9);
  await expect(grid.locator('.news-media-label')).toHaveCount(0);
  await expect(page.locator('[data-news-pagination] a')).toHaveText(['1', '2', '3', '4', '5', '6']);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('1');

  const firstLink = grid.locator('.text-link').first();
  await expect(firstLink).toHaveAttribute('href', /news-4893-.*\.html$/);

  await page.getByRole('link', { name: 'ЦСР 16 - Мир, справедливість та сильні інститути', exact: true }).click();
  await expect(page).toHaveURL(/news\.html\?tag=sdg-16$/);
  await expect(cards).toHaveCount(9);
  await expect(cards.locator('h3').first()).toHaveText('«КОРЕНІ ТА КРИЛА: ІСТОРІЯ, ЯКА ОБ’ЄДНУЄ»: УЧАСТЬ К.І.Н., ДОЦЕНТА ЮЛІЇ РУДЕНКО У РОБОТІ ДРУГОГО МОДУЛЯ ЛІТНЬОЇ ШКОЛИ');
  await expect(page.locator('[data-news-pagination] a')).toHaveText(['1', '2', '3']);

  await page.goto('/news.html?page=6');
  const lastPageCards = page.locator('[data-news-list] .news-card');
  await expect(lastPageCards).toHaveCount(8);
  await expect(lastPageCards.locator('h3')).toHaveText([
    'Практичне заняття рестораторів: поєднання естетики та креативності',
    'ПРАКТИЧНІ ЗАНЯТТЯ У РЕСТОРАТОРІВ',
    'Відбувся круглий стіл на тему «Гендерна рівність у праві та економіці: сучасні виклики»',
    'Участь у національному форумі «Women-Led Recovery: Гроші. Рішення. Вплив»',
    'Класика світового кіно про кризу та надію',
    'Мистецтво проти насильства та мови ненависті',
    'Право на життя: міжнародно-правовий захист довкілля під час війни',
    'ФОТОВИСТАВКА «ТОРГІВЛЯ ЛЮДЬМИ: НЕБЕЗПЕКА ПОРУЧ»'
  ]);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('6');
});

test('news articles use zero to three SDG tags without the legacy icon footer', async ({ page }) => {
  await page.goto('/news.html');

  const assignments = await page.evaluate(() => window.COLLEGE_NEWS.map(item => ({
    url: item.url,
    sdgTags: item.tags.filter(tag => tag.startsWith('sdg-')),
    hasLegacySdgField: Object.hasOwn(item, 'sdgs') || Object.hasOwn(item, 'sdg')
  })));

  expect(assignments).toHaveLength(53);
  expect(assignments.slice(0, 16).map(item => item.sdgTags)).toEqual([
    ['sdg-04', 'sdg-11', 'sdg-16'],
    ['sdg-04', 'sdg-11', 'sdg-17'],
    ['sdg-04', 'sdg-16'],
    ['sdg-04', 'sdg-10', 'sdg-16'],
    ['sdg-04', 'sdg-08', 'sdg-16'],
    ['sdg-04', 'sdg-08'],
    ['sdg-03', 'sdg-04', 'sdg-08'],
    ['sdg-12', 'sdg-16'],
    ['sdg-04', 'sdg-11'],
    ['sdg-04', 'sdg-16'],
    ['sdg-04'],
    ['sdg-04', 'sdg-09', 'sdg-16'],
    ['sdg-04', 'sdg-11', 'sdg-16'],
    ['sdg-03', 'sdg-04'],
    ['sdg-04', 'sdg-11', 'sdg-17'],
    ['sdg-04', 'sdg-08', 'sdg-09']
  ]);
  expect(assignments.slice(-5).map(item => item.sdgTags)).toEqual([
    ['sdg-05', 'sdg-08', 'sdg-10'],
    ['sdg-01', 'sdg-04', 'sdg-08'],
    ['sdg-05', 'sdg-10', 'sdg-16'],
    ['sdg-13', 'sdg-15', 'sdg-16'],
    ['sdg-05', 'sdg-10', 'sdg-16']
  ]);
  expect(Object.fromEntries(Array.from({ length: 17 }, (_, index) => {
    const tag = `sdg-${String(index + 1).padStart(2, '0')}`;
    return [tag, assignments.filter(item => item.sdgTags.includes(tag)).length];
  }))).toEqual({
    'sdg-01': 2,
    'sdg-02': 5,
    'sdg-03': 5,
    'sdg-04': 38,
    'sdg-05': 5,
    'sdg-06': 0,
    'sdg-07': 0,
    'sdg-08': 12,
    'sdg-09': 8,
    'sdg-10': 10,
    'sdg-11': 6,
    'sdg-12': 5,
    'sdg-13': 6,
    'sdg-14': 0,
    'sdg-15': 4,
    'sdg-16': 24,
    'sdg-17': 5
  });
  expect(assignments.every(item => item.sdgTags.length <= 3)).toBe(true);
  expect(assignments.every(item => item.hasLegacySdgField === false)).toBe(true);

  for (const item of [...assignments.slice(0, 16), ...assignments.slice(-5)]) {
    await page.goto(`/${item.url}`);
    await expect(page.locator('.news-article-sdg, .sdg-icon, .sdg-badges')).toHaveCount(0);
    await expect(page.locator('.news-article-tags .news-tag--sdg')).toHaveCount(item.sdgTags.length);
    await expect(page.locator('.news-article-body img')).not.toHaveCount(0);
  }
});

test('TikTok replaces the theme toggle on desktop and stays hidden with other header socials below desktop', async ({ page }) => {
  await page.goto('/news-4873-rozvytok-tsyfrovykh-kompetentnostei-vykladachi-ta-zdobuvachi-osvity-mahisterskoi-opp-komertsiia-ta-torhivlia-uspishno-zavershyly-pidvyshchennia-kvalifikatsii-u-mezhakh-proiektu-prof2it.html');
  await page.locator('.header-tiktok').waitFor({ state: 'attached' });
  await expect(page.locator('.header-theme')).toHaveCount(0);
  await expect(page.locator('.header-tiktok')).toHaveAttribute('href', 'https://www.tiktok.com/@studparliament_kkibp');
  await expect(page.locator('.header-tiktok path')).toHaveAttribute('d', 'M16.5 3c.2 1.9 1.4 3.5 3.5 4.1v3.2a8.3 8.3 0 0 1-3.5-1v5.3a5.9 5.9 0 1 1-5.1-5.8V12a2.7 2.7 0 1 0 1.9 2.6V3h3.2Z');
  await expect(page.locator('.footer-social .social-link--tiktok')).toHaveAttribute('href', 'https://www.tiktok.com/@studparliament_kkibp');
  await expect(page.locator('.footer-social .social-links a')).toHaveCount(3);
  await expect(page.locator('.news-article-sdg, .sdg-icon, .sdg-badges')).toHaveCount(0);

  const boxes = await page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { width, height, top } = element.getBoundingClientRect();
      return {
        width: Math.round(width),
        height: Math.round(height),
        top: Math.round(top)
      };
    };

    return {
      search: rect('.header-search'),
      tiktok: rect('.header-tiktok'),
      language: rect('.header-language .language'),
      time: rect('.news-article-meta time'),
      tags: rect('.news-article-tags'),
      viewportWidth: window.innerWidth,
      tiktokDisplay: getComputedStyle(document.querySelector('.header-tiktok')).display,
      headerSocialsHidden: Array.from(document.querySelectorAll('.header-actions .header-social'))
        .every((element) => getComputedStyle(element).display === 'none'),
      languageVisible: getComputedStyle(document.querySelector('.header-language')).display !== 'none',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  if (boxes.viewportWidth >= 1100) {
    expect(boxes.tiktok).toEqual(boxes.search);
  } else {
    expect(boxes.tiktokDisplay).toBe('none');
    expect(boxes.tiktok.width).toBe(0);
    expect(boxes.tiktok.height).toBe(0);
    expect(boxes.headerSocialsHidden).toBe(true);
  }
  if (boxes.languageVisible) expect(boxes.language).toEqual(boxes.search);
  await expect(page.locator('.news-article-tags .news-tag')).toHaveCount(6);
  await expect(page.locator('.news-article-tags .news-tag--sdg')).toHaveText([
    'ЦСР 4 - Якісна освіта',
    'ЦСР 8 - Гідна праця та економічне зростання',
    'ЦСР 9 - Промисловість, інновації та інфраструктура'
  ]);
  expect(boxes.tags.top).toBeGreaterThan(boxes.time.top);
  expect(boxes.overflow).toBe(false);
  await expect(page.locator('.news-article-neighbors span')).toHaveText(['Наступна новина', 'Попередня новина']);
});

test('english home mirrors the accepted home structure', async ({ page }) => {
  await page.goto('/en/index.html');

  const about = page.locator('#college-about');
  await expect(about.getByRole('heading', { name: 'A college for a confident professional start' })).toBeVisible();
  await expect(about.locator('.college-photo-track img')).toHaveCount(4);

  const mainSections = page.locator('.main-sections#about');
  const cards = mainSections.locator('.main-section-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h3')).toHaveText(['College', 'Applicants', 'Students', 'Alumni', 'Research', 'Library']);
  await expect(mainSections.locator('.feature-icon')).toHaveCount(0);
  await expect(mainSections.getByRole('heading', { name: 'Public Information' })).toHaveCount(0);
  await expect(mainSections.getByRole('link', { name: /Contacts/ })).toHaveAttribute('href', 'college.html#contacts');

  const allSpecialties = page.getByRole('link', { name: /All specialties/ });
  await expect(allSpecialties).toHaveClass(/main-sections-contact--filled/);
  await expect(page.locator('.program-card .program-meta')).toHaveCount(0);

  const news = page.locator('[data-news-list]').first();
  await expect(news.locator('.news-card')).toHaveCount(3);
  await expect(news.locator('.news-media-label')).toHaveCount(0);
  await expect(news.locator('.news-meta')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /All news/ })).toHaveClass(/main-sections-contact--filled/);
});

test('english news page uses the shared card feed without legacy filters', async ({ page }) => {
  await page.goto('/en/news.html');

  const grid = page.locator('[data-news-list]');
  await expect(page.locator('[data-news-count]')).toHaveText('53');
  await expect(page.locator('.filter-bar')).toHaveCount(0);
  await expect(grid.locator('.news-card')).toHaveCount(9);
  await expect(grid.locator('.news-media img')).toHaveCount(9);
  await expect(grid.locator('.news-media-label')).toHaveCount(0);
  await expect(grid.locator('.news-meta')).toHaveCount(9);
  await expect(page.locator('[data-news-pagination] a')).toHaveText(['1', '2', '3', '4', '5', '6']);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('1');
  await expect(grid.locator('.text-link').first()).toContainText('Read in full');
  await expect(grid.locator('.text-link').first()).toHaveAttribute('href', /\.\.\/news-4893-.*\.html$/);

  await page.goto('/en/news.html?page=6');
  const lastPageCards = page.locator('[data-news-list] .news-card');
  await expect(lastPageCards).toHaveCount(8);
  await expect(page.locator('[data-news-pagination] a[aria-current="page"]')).toHaveText('6');
});

test('english section pages use the current hub template', async ({ page }) => {
  const pages = [
    'college.html',
    'admissions.html',
    'students.html',
    'alumni.html',
    'science.html',
    'library.html'
  ];

  for (const pageName of pages) {
    await page.goto(`/en/${pageName}`);

    await expect(page.locator('.page-hero.page-hero--guide')).toHaveCount(1);
    await expect(page.locator('.page-hero-guide')).toBeVisible();
    await expect(page.locator('main .page-hero-card')).toHaveCount(0);
    await expect(page.locator('#apply, #timeline, #tuition, #faq')).toHaveCount(0);
    await expect(page.locator('.subpage-link-card').first()).toBeVisible();

    const mainText = await page.locator('main').innerText();
    expect(mainText).not.toMatch(/[А-Яа-яІіЇїЄєҐґ]/);
  }
});

test('primary menu toggles submenus without navigating', async ({ page }) => {
  await page.goto('/index.html');

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) await navToggle.click();

  const startUrl = page.url();
  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(page).toHaveURL(startUrl);
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();
  await expect(collegeMenu.locator('a[href*="college/"]')).toHaveCount(24);
  await expect(collegeMenu.getByRole('link', { name: 'Про коледж' })).toHaveAttribute('href', 'college/general-info/about-college.html');
  await expect(collegeMenu.getByRole('link', { name: 'Статут коледжу' })).toHaveAttribute('href', 'college/main-info/statute.html');
  await expect(collegeMenu.getByRole('link', { name: 'Центр кар’єри' })).toHaveAttribute('href', 'college/activity/career-center.html');

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  await applicantsToggle.click();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(applicantsMenu).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/mega-open/);

  await expect(page.getByRole('link', { name: 'Новини' }).first()).toHaveAttribute('href', 'news.html');
});

test('mobile submenu uses measured accordion motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile accordion motion is specific to the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();
  await page.waitForTimeout(320);

  const openMetrics = await collegeMenu.evaluate((menu) => {
    const style = getComputedStyle(menu);
    return {
      ariaHidden: menu.getAttribute('aria-hidden'),
      customHeight: style.getPropertyValue('--accordion-height').trim(),
      inert: menu.inert,
      maxHeight: style.maxHeight,
      overflowY: style.overflowY,
      pointerEvents: style.pointerEvents,
      settled: menu.closest('.has-menu').classList.contains('menu-settled'),
      scrollHeight: menu.scrollHeight,
      transitionProperty: style.transitionProperty
    };
  });

  expect(openMetrics.ariaHidden).toBe('false');
  expect(openMetrics.inert).toBe(false);
  expect(openMetrics.maxHeight).toBe('none');
  expect(openMetrics.overflowY).toBe('visible');
  expect(openMetrics.pointerEvents).toBe('auto');
  expect(openMetrics.settled).toBe(true);
  expect(openMetrics.transitionProperty).toContain('max-height');
  expect(Math.abs(parseFloat(openMetrics.customHeight) - openMetrics.scrollHeight)).toBeLessThanOrEqual(2);

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  const closedMetrics = await collegeMenu.evaluate((menu) => ({
    ariaHidden: menu.getAttribute('aria-hidden'),
    inert: menu.inert,
    maxHeight: getComputedStyle(menu).maxHeight,
    pointerEvents: getComputedStyle(menu).pointerEvents,
    settled: menu.closest('.has-menu').classList.contains('menu-settled')
  }));

  expect(closedMetrics.ariaHidden).toBe('true');
  expect(closedMetrics.inert).toBe(true);
  expect(parseFloat(closedMetrics.maxHeight)).toBeLessThanOrEqual(1);
  expect(closedMetrics.pointerEvents).toBe('none');
  expect(closedMetrics.settled).toBe(false);
});

test('mobile drawer remains scrollable with a long submenu open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile drawer scroll regression runs on the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');
  const navShell = page.locator('.nav-shell');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();
  await page.waitForTimeout(320);

  const metrics = await navShell.evaluate((shell) => ({
    clientHeight: shell.clientHeight,
    overflowY: getComputedStyle(shell).overflowY,
    panelMaxHeight: getComputedStyle(shell.querySelector('#menu-5')).maxHeight,
    panelOverflowY: getComputedStyle(shell.querySelector('#menu-5')).overflowY,
    scrollHeight: shell.scrollHeight,
    scrollTop: shell.scrollTop
  }));

  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.panelMaxHeight).toBe('none');
  expect(metrics.panelOverflowY).toBe('visible');
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const touchMove = await navShell.evaluate((shell) => {
    const target = shell.querySelector('#menu-5 a') || shell;
    const createTouchEvent = (type, clientY) => {
      const event = new Event(type, {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(event, 'touches', {
        value: [{ clientY }],
        configurable: true
      });
      return event;
    };

    target.dispatchEvent(createTouchEvent('touchstart', 520));

    const moveEvent = createTouchEvent('touchmove', 220);
    target.dispatchEvent(moveEvent);

    return {
      defaultPrevented: moveEvent.defaultPrevented,
      supported: true
    };
  });

  expect(touchMove.supported).toBe(true);
  expect(touchMove.defaultPrevented).toBe(false);

  const afterScroll = await navShell.evaluate((shell) => {
    shell.scrollTop = 0;
    shell.scrollBy(0, 420);
    return shell.scrollTop;
  });
  expect(afterScroll).toBeGreaterThan(metrics.scrollTop);
});

test('navigation remains visible when opened after page scroll', async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY > 400);

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) {
    await navToggle.click();

    const navShell = page.locator('.nav-shell');
    await expect(navShell).toBeVisible();

    const shellMetrics = await navShell.evaluate((shell) => {
      const rect = shell.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
        viewportHeight: window.innerHeight
      };
    });

    expect(shellMetrics.bottom).toBeGreaterThan(0);
    expect(shellMetrics.top).toBeLessThan(shellMetrics.viewportHeight);

    const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
    await collegeToggle.click();
    await expect(page.locator('#menu-0')).toBeVisible();
    return;
  }

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const collegeMenu = page.locator('#menu-0');

  await collegeToggle.click();
  await expect(collegeMenu).toBeVisible();

  const menuMetrics = await collegeMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      top: rect.top,
      viewportHeight: window.innerHeight
    };
  });

  expect(menuMetrics.bottom).toBeGreaterThan(0);
  expect(menuMetrics.top).toBeGreaterThanOrEqual(0);
  expect(menuMetrics.top).toBeLessThan(menuMetrics.viewportHeight);
});

test('mega menu scrolls inside a compact laptop viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-laptop', 'compact laptop scroll check runs once');

  await page.setViewportSize({ width: 1280, height: 480 });
  await page.goto('/index.html');

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();

  const metrics = await libraryMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    const style = getComputedStyle(menu);
    return {
      bottom: rect.bottom,
      clientHeight: menu.clientHeight,
      overflowY: style.overflowY,
      scrollHeight: menu.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const box = await libraryMenu.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + Math.min(80, box.height - 10));
  const beforeScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(100);
  const afterScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  expect(afterScroll).toBeGreaterThan(beforeScroll);

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(libraryMenu).toBeHidden();
});
