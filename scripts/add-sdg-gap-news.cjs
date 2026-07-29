const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const publicBase = 'https://yakovliev.github.io/kkibp-college-demo/';

const articles = [
  {
    id: '4898-plastyk-bez-kordoniv-iak-zberehty-vodni-ekosystemy',
    loadedAt: '2026-07-29T15:00:00+03:00',
    publishedLabel: '29 липня 2026',
    title: 'У коледжі відбулася відкрита дискусія «Пластик без кордонів: як зберегти водні екосистеми»',
    excerpt: 'Студенти й викладачі обговорили вплив пластикових відходів на водні екосистеми та запропонували практичні екологічні ініціативи.',
    image: 'assets/news/latest/4898-plastyk-bez-kordoniv-01.jpg',
    alt: 'Учасники відкритої дискусії про збереження водних екосистем',
    url: 'news-4898-plastyk-bez-kordoniv-iak-zberehty-vodni-ekosystemy.html',
    tags: ['it-science', 'sdg-14', 'sdg-12', 'sdg-06'],
    body: `<p><img src="assets/news/latest/4898-plastyk-bez-kordoniv-01.jpg" alt="Учасники відкритої дискусії про збереження водних екосистем" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права 5 травня 2026 року відбулася відкрита дискусія «Пластик без кордонів: як зберегти водні екосистеми», присвячена актуальній проблемі пластикового забруднення морів, океанів, річок, озер та інших водних ресурсів.</p>
<p>Захід об’єднав здобувачів освіти, викладачів та представників академічної спільноти навколо важливої теми - збереження водних екосистем і формування відповідального ставлення до використання пластику в повсякденному житті. Учасники обговорили, як пластикові відходи впливають на стан довкілля, біорізноманіття, якість води, безпеку харчових ланцюгів та здоров’я людини.</p>
<p>Під час дискусії було розглянуто міжнародні практики скорочення пластикових відходів, зокрема обмеження використання одноразового пластику, розвиток системи роздільного збирання сміття, повторне використання матеріалів, екологічне маркування продукції та популяризацію культури відповідального споживання.</p>
<p>Особливу увагу приділено ролі молоді у збереженні водних екосистем. Студенти наголосили, що екологічна відповідальність починається з простих щоденних дій: відмови від зайвого пакування, використання багаторазових пляшок і торбинок, сортування відходів, участі в екологічних акціях та поширення екосвідомих практик серед однолітків.</p>
<p>У межах заходу здобувачі освіти презентували власні екологічні ініціативи, спрямовані на зменшення використання одноразового пластику в освітньому середовищі, популяризацію сортування відходів, проведення інформаційних кампаній та залучення студентської молоді до природоохоронних заходів. Серед запропонованих ідей - встановлення додаткових контейнерів для сортування, проведення тематичних екотижнів, створення інформаційних плакатів, організація студентських флешмобів та челенджів із відмови від одноразового пластику.</p>
<p>Відкрита дискусія стала майданчиком для обміну думками, практичними ідеями та пропозиціями щодо формування екологічно відповідальної поведінки в академічному середовищі. Учасники дійшли висновку, що збереження водних ресурсів потребує не лише глобальних рішень, а й особистої участі кожного.</p>
<p>Проведення заходу відповідає Цілі сталого розвитку 14 «Збереження морських ресурсів» та є складовою екологічної політики коледжу, спрямованої на розвиток екологічної культури, відповідального споживання та підтримку принципів сталого розвитку.</p>
<p><img src="assets/news/latest/4898-plastyk-bez-kordoniv-02.jpg" alt="Обговорення способів зменшення пластикового забруднення" loading="lazy"></p>`
  },
  {
    id: 'sdg-14-ekolohichna-aktsiia-proty-plastykovoho-zabrudnennia-vodoim',
    loadedAt: '2026-07-29T14:00:00+03:00',
    publishedLabel: '29 липня 2026',
    title: 'Екологічна акція зі зменшення пластикового забруднення водойм',
    excerpt: 'Студенти й працівники коледжу долучилися до збору пластикових кришечок і обговорили вплив пластикових відходів на водні екосистеми.',
    image: 'assets/news/latest/4897-plastykove-zabrudnennia-vodoim-01.jpg',
    alt: 'Студентки коледжу зі зібраними пластиковими кришечками',
    url: 'news-sdg-14-ekolohichna-aktsiia-proty-plastykovoho-zabrudnennia-vodoim.html',
    tags: ['it-science', 'sdg-14', 'sdg-12', 'sdg-13'],
    body: `<p><img src="assets/news/latest/4897-plastykove-zabrudnennia-vodoim-01.jpg" alt="Студентки коледжу зі зібраними пластиковими кришечками" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права 27 квітня 2026 року відбулася екологічна акція, спрямована на популяризацію відповідального поводження з відходами та збереження водних екосистем.</p>
<p>Студенти, викладачі та працівники коледжу долучилися до збору пластикових кришечок для подальшої переробки, а також взяли участь у тематичній дискусії щодо впливу пластикових відходів на річкові та морські екосистеми.</p>
<p>Учасники обговорили сучасні підходи до сортування сміття, принципи циркулярної економіки та роль молоді у збереженні природного середовища. Подібні ініціативи формують екологічно відповідальне мислення, сприяють поширенню культури сталого споживання та демонструють активну громадянську позицію академічної спільноти.</p>
<p>Захід реалізовано в межах підтримки Цілі сталого розвитку 14 «Збереження морських ресурсів», яка спрямована на захист водних екосистем і зменшення забруднення Світового океану.</p>
<p><img src="assets/news/latest/4897-plastykove-zabrudnennia-vodoim-02.jpg" alt="Учасники екологічної акції зі збирання пластикових кришечок" loading="lazy"></p>`
  },
  {
    id: '4896-enerhiia-vidpovidalnosti-informatsiina-kampaniia-z-enerhooshchadnosti',
    loadedAt: '2026-07-29T13:00:00+03:00',
    publishedLabel: '29 липня 2026',
    title: '«Енергія відповідальності»: у коледжі стартувала інформаційна кампанія з енергоощадності',
    excerpt: 'Кампанія об’єднала інформаційну роботу, практичні рекомендації та моніторинг енергоспоживання для формування культури енергоощадності.',
    image: 'assets/news/latest/4896-enerhiia-vidpovidalnosti-01.jpg',
    alt: 'Презентація ініціатив із відповідального споживання ресурсів',
    url: 'news-4896-enerhiia-vidpovidalnosti-informatsiina-kampaniia-z-enerhooshchadnosti.html',
    tags: ['it-science', 'sdg-07', 'sdg-12', 'sdg-13'],
    body: `<p><img src="assets/news/latest/4896-enerhiia-vidpovidalnosti-01.jpg" alt="Презентація ініціатив із відповідального споживання ресурсів" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права розпочато інформаційну кампанію «Енергія відповідальності», спрямовану на формування культури ощадливого використання енергетичних ресурсів серед здобувачів освіти, педагогічних працівників та адміністративного персоналу.</p>
<p>Ініціатива має на меті привернути увагу академічної спільноти до важливості раціонального споживання електроенергії, відповідального ставлення до ресурсів та особистого внеску кожного в енергетичну безпеку й екологічну сталість. У сучасних умовах питання енергоефективності набуває особливої актуальності, адже ощадливе використання ресурсів є не лише економічною необхідністю, а й складовою екологічної свідомості та соціальної відповідальності.</p>
<p>У межах кампанії в навчальних корпусах розміщено інформаційні матеріали з практичними рекомендаціями щодо ефективного використання електроенергії. Зокрема, увагу зосереджено на простих, але важливих щоденних діях: вимиканні освітлення після завершення занять, раціональному використанні комп’ютерної техніки, енергоощадному режимі роботи обладнання, відповідальному користуванні електроприладами та дотриманні принципів економного споживання ресурсів у навчальному й робочому середовищі.</p>
<p>Також проведено тематичні зустрічі зі студентами, під час яких обговорено значення енергоощадності для сталого розвитку, роль молоді у формуванні екологічно відповідальної поведінки та можливості впровадження простих енергоефективних практик у повсякденному житті. Учасники зустрічей наголосили, що культура відповідального споживання починається з особистої поведінки кожного - в аудиторії, кабінеті, гуртожитку, вдома та в громадському просторі.</p>
<p>Окремим напрямом кампанії стало започаткування щомісячного моніторингу енергоспоживання структурних підрозділів. Такий підхід дозволить аналізувати динаміку використання енергетичних ресурсів, виявляти можливості для їх оптимізації та формувати більш ефективну систему внутрішнього енергоменеджменту в закладі освіти.</p>
<p>Кампанія «Енергія відповідальності» покликана не лише зменшити нераціональне використання енергетичних ресурсів, а й сформувати сталу модель поведінки, у якій енергоощадність стає частиною щоденної культури академічної спільноти. Такі ініціативи сприяють підвищенню екологічної відповідальності, розвитку свідомого ставлення до ресурсів та залученню студентської молоді до практичної реалізації принципів сталого розвитку.</p>
<p>Реалізація інформаційної кампанії відповідає Цілі сталого розвитку 7 «Доступна та чиста енергія» та є складовою екологічної політики коледжу. Коледж послідовно підтримує ініціативи, спрямовані на раціональне використання ресурсів, екологічну просвіту, відповідальне управління та формування сталого освітнього середовища.</p>
<p><img src="assets/news/latest/4896-enerhiia-vidpovidalnosti-02.jpg" alt="Інформаційні матеріали кампанії «Енергія відповідальності»" loading="lazy"></p>`
  },
  {
    id: 'sdg-07-enerhoefektyvnist-v-osvitnomu-seredovyshchi',
    loadedAt: '2026-07-29T12:00:00+03:00',
    publishedLabel: '29 липня 2026',
    title: 'Коледж продовжує впроваджувати принципи енергоефективності в освітньому середовищі',
    excerpt: 'Коледж послідовно модернізує освітлення, оптимізує споживання електроенергії та розвиває культуру відповідального енергоспоживання.',
    image: 'assets/news/latest/4895-enerhoefektyvnist-01.jpg',
    alt: 'Студенти в оновленому освітньому просторі з енергоощадним освітленням',
    url: 'news-sdg-07-enerhoefektyvnist-v-osvitnomu-seredovyshchi.html',
    tags: ['it-science', 'sdg-07', 'sdg-09', 'sdg-13'],
    body: `<p><img src="assets/news/latest/4895-enerhoefektyvnist-01.jpg" alt="Студенти в оновленому освітньому просторі з енергоощадним освітленням" loading="lazy"></p>
<p>Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права послідовно впроваджує сучасні підходи до раціонального використання енергетичних ресурсів та створення комфортного освітнього середовища.</p>
<p>У межах розвитку інфраструктури закладу здійснюється поетапна модернізація систем освітлення із використанням енергоощадних LED-світильників, оптимізується споживання електроенергії в навчальних корпусах, а також проводиться інформаційно-просвітницька робота серед здобувачів освіти та працівників щодо культури відповідального енергоспоживання.</p>
<p>Енергоефективність сьогодні є не лише економічною необхідністю, а й важливим внеском у збереження природних ресурсів, скорочення викидів парникових газів та формування екологічно відповідальної академічної спільноти.</p>
<p>Реалізація таких ініціатив відповідає Цілі сталого розвитку 7 «Доступна та чиста енергія» та підтверджує прагнення коледжу інтегрувати принципи сталого розвитку в освітню, наукову й адміністративну діяльність.</p>
<p><img src="assets/news/latest/4895-enerhoefektyvnist-02.jpg" alt="Енергоощадне освітлення в приміщенні коледжу" loading="lazy"></p>`
  },
  {
    id: 'sdg-06-vsesvitnii-den-vody-vidpovidalne-vodokorystuvannia',
    loadedAt: '2026-07-29T11:00:00+03:00',
    publishedLabel: '29 липня 2026',
    title: 'У коледжі відзначили Всесвітній день води: формуємо культуру відповідального водокористування',
    excerpt: '22 березня у коледжі відбувся просвітницький захід до Всесвітнього дня води, присвячений відповідальному використанню водних ресурсів.',
    image: 'assets/news/latest/4894-vsesvitnii-den-vody-01.jpg',
    alt: 'Учасники заходу до Всесвітнього дня води біля питного бювету',
    url: 'news-sdg-06-vsesvitnii-den-vody-vidpovidalne-vodokorystuvannia.html',
    tags: ['it-science', 'sdg-06', 'sdg-04', 'sdg-12'],
    body: `<p><img src="assets/news/latest/4894-vsesvitnii-den-vody-01.jpg" alt="Учасники заходу до Всесвітнього дня води біля питного бювету" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права 22 березня 2026 року відбувся просвітницький захід, присвячений Всесвітньому дню води. Його метою стало підвищення екологічної свідомості здобувачів освіти та популяризація принципів відповідального використання водних ресурсів.</p>
<p>Учасники заходу ознайомилися з глобальними викликами у сфері забезпечення населення якісною питною водою, обговорили сучасні підходи до ощадливого використання водних ресурсів та роль кожної людини у збереженні довкілля. Під час дискусії студенти презентували власні ідеї щодо впровадження екологічних практик у повсякденному житті та навчальному середовищі.</p>
<p>Захід став ще одним кроком у формуванні екологічної культури академічної спільноти та підтвердив прагнення коледжу долучатися до реалізації Цілі сталого розвитку 6 «Чиста вода та належні санітарні умови», що передбачає забезпечення доступу до безпечної води та раціонального використання водних ресурсів.</p>
<p>Коледж і надалі підтримуватиме освітні ініціативи, спрямовані на розвиток екологічної відповідальності та сталого розвитку суспільства.</p>
<p><img src="assets/news/latest/4894-vsesvitnii-den-vody-02.jpg" alt="Учасники заходу обговорюють відповідальне використання водних ресурсів" loading="lazy"></p>
<p><img src="assets/news/latest/4894-vsesvitnii-den-vody-03.jpg" alt="Просвітницький захід до Всесвітнього дня води" loading="lazy"></p>`
  },
  {
    id: '3357-publichna-lektsiia-alternatyvna-enerhetyka-ta-ii-rol-v-enerhetychnii-nezalezhnosti-derzhavy',
    loadedAt: '2024-02-29T12:00:00+02:00',
    publishedLabel: '29 лютого 2024',
    title: 'Публічна лекція «Альтернативна енергетика та її роль в енергетичній незалежності держави»',
    excerpt: 'Професор Олександр Серьогін розповів студентам і викладачам про відновлювані джерела енергії та їхнє значення для енергетичної незалежності держави.',
    image: 'assets/news/latest/3357-alternatyvna-enerhetyka-01.jpg',
    alt: 'Публічна лекція про альтернативну енергетику',
    url: 'news-3357-publichna-lektsiia-alternatyvna-enerhetyka-ta-ii-rol-v-enerhetychnii-nezalezhnosti-derzhavy.html',
    tags: ['it-science', 'sdg-07', 'sdg-04', 'sdg-13'],
    body: `<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-01.jpg" alt="Публічна лекція про альтернативну енергетику" loading="lazy"></p>
<p>29 лютого за ініціативи Ради молодих вчених Економіко-правового фахового коледжу Київського кооперативного інституту бізнесу і права організовано проведення публічної лекції. Спікер заходу - доктор технічних наук, професор, професор кафедри харчових технологій Олександр Серьогін. Тема його лекції - «Альтернативна енергетика та її роль в енергетичній незалежності держави».</p>
<p>Альтернативною називають усю енергетику, яка не надходить від традиційних джерел: нафти, газу або вугілля. Також вона відома як відновлювальна, або «зелена», оскільки її отримують з поновлюваних ресурсів. Ці ресурси або існують постійно, або періодично з’являються у природі, наприклад, енергія сонця, вітру або води. Альтернативна енергетика не має шкідливих відходів і не руйнує екосистему.</p>
<p>Слухачі лекції - студенти та викладачі навчального закладу - щиро вдячні доповідачу за цікаву інформацію та заряд позитивної енергії.</p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-02.jpg" alt="Учасники публічної лекції про альтернативну енергетику" loading="lazy"></p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-03.jpg" alt="Виступ професора Олександра Серьогіна" loading="lazy"></p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-04.jpg" alt="Обговорення альтернативних джерел енергії" loading="lazy"></p>`
  }
];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function loadCurrentNews() {
  const source = fs.readFileSync(path.join(root, 'js/news-data.js'), 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  return Array.isArray(context.window.COLLEGE_NEWS) ? context.window.COLLEGE_NEWS : [];
}

function imageType(image) {
  if (image.endsWith('.svg')) return 'image/svg+xml';
  if (image.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
}

function updateMeta(html, article) {
  const description = escapeHtml(article.excerpt);
  const pageTitle = escapeHtml(`${article.title} – Новини – Економіко-правовий фаховий коледж ККІБП`);
  const absoluteUrl = `${publicBase}${article.url}`;
  const absoluteImage = `${publicBase}${article.image}`;
  const imageAlt = escapeHtml(article.alt || article.title);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${absoluteUrl}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${absoluteImage}">`)
    .replace(/<meta property="og:image:type" content="[^"]*">/, `<meta property="og:image:type" content="${imageType(article.image)}">`)
    .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${imageAlt}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${absoluteImage}">`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*">/, `<meta name="twitter:image:alt" content="${imageAlt}">`);
}

function neighborLinks(article, orderedNews) {
  const currentIndex = orderedNews.findIndex((item) => item.id === article.id);
  const newer = orderedNews[currentIndex - 1];
  const older = orderedNews[currentIndex + 1];
  return [
    newer ? `<a href="${newer.url}"><span>Наступна новина</span><strong>${escapeHtml(newer.title)}</strong></a>` : '',
    older ? `<a href="${older.url}"><span>Попередня новина</span><strong>${escapeHtml(older.title)}</strong></a>` : ''
  ].filter(Boolean).join('');
}

function buildArticleMain(article, orderedNews) {
  const articleNav = neighborLinks(article, orderedNews);
  return `<main id="main"><section class="page-hero page-hero--solo news-article-hero"><div class="container"><nav class="breadcrumbs" aria-label="Хлібні крихти"><a href="index.html">Головна</a><a href="news.html">Новини</a><span>${escapeHtml(article.title)}</span></nav><div class="page-hero-grid"><div class="page-hero-copy"><span class="eyebrow eyebrow--light">Новина</span><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p></div></div></div></section>
<section class="section news-article-section"><div class="container news-article-layout"><article class="news-article-card"><div class="news-article-meta"><span>Новини коледжу</span><time datetime="${escapeHtml(article.loadedAt)}">${escapeHtml(article.publishedLabel)}</time></div><div class="news-article-body">${article.body}</div></article><aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${articleNav ? `<div class="news-article-neighbors">${articleNav}</div>` : ''}</aside></div></section>
</main>`;
}

const newIds = new Set(articles.map((article) => article.id));
const tagUpdates = {
  '4885-uchasnyky-osvitnoho-protsesu-doluchylysya-do-aktsiyi-voroham-kryshka': ['sdg-12', 'sdg-14', 'sdg-16'],
  '4872-predstavnyky-instytutu-vzialy-uchast-u-mizhnarodnii-naukovo-praktychnii-konferentsii-z-pytan-ievropeiskoi-zelenoi-polityky-ta-stalykh-finansiv': ['sdg-07', 'sdg-13', 'sdg-17']
};

const currentNews = loadCurrentNews()
  .filter((article) => !newIds.has(article.id))
  .map((article) => {
    const sdgTags = tagUpdates[article.id];
    if (!sdgTags) return article;
    const departmentTags = article.tags.filter((tag) => !tag.startsWith('sdg-'));
    return { ...article, tags: [...departmentTags, ...sdgTags] };
  });
const orderedNews = [...currentNews, ...articles]
  .sort((a, b) => Date.parse(b.loadedAt) - Date.parse(a.loadedAt));

const template = fs.readFileSync(path.join(root, 'news.html'), 'utf8');
for (const article of articles) {
  const main = buildArticleMain(article, orderedNews);
  const page = updateMeta(template.replace(/<main id="main">[\s\S]*?<\/main>/, main), article);
  fs.writeFileSync(path.join(root, article.url), page.replace(/[ \t]+$/gm, ''));
}

for (const article of orderedNews) {
  if (newIds.has(article.id)) continue;
  const articlePath = path.join(root, article.url);
  let page = fs.readFileSync(articlePath, 'utf8');
  const links = neighborLinks(article, orderedNews);
  page = page.replace(
    /<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини<\/a>(?:<div class="news-article-neighbors">[\s\S]*?<\/div>)?<\/aside>/,
    `<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${links ? `<div class="news-article-neighbors">${links}</div>` : ''}</aside>`
  );
  fs.writeFileSync(articlePath, page.replace(/[ \t]+$/gm, ''));
}

fs.writeFileSync(
  path.join(root, 'js/news-data.js'),
  `window.COLLEGE_NEWS = ${JSON.stringify(orderedNews.map(({ body, ...article }) => article), null, 2)};\n`
);

const newsDataVersion = 'news-4894-4898-20260729';
const pagesWithNewsData = [
  'index.html',
  'news.html',
  'en/index.html',
  'en/news.html',
  ...orderedNews.map((article) => article.url)
];

for (const pageName of pagesWithNewsData) {
  const pagePath = path.join(root, pageName);
  const page = fs.readFileSync(pagePath, 'utf8');
  fs.writeFileSync(
    pagePath,
    page.replace(/js\/news-data\.js\?v=[^"]+/g, `js/news-data.js?v=${newsDataVersion}`)
  );
}

console.log(`Prepared ${articles.length} SDG-focused articles.`);
console.log(`News archive now contains ${orderedNews.length} articles.`);
