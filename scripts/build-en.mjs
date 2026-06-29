import { mkdir, readFile, writeFile } from 'node:fs/promises';

const cssVersion = 'global-header-footer-20260629';
const scriptVersion = 'smooth-menu-scroll-fix-20260629';
const files = ['index.html', 'college.html', 'admissions.html', 'students.html', 'alumni.html', 'science.html', 'library.html', 'news.html'];
const ukrainianCollegeNameMain = 'Економіко-правовий фаховий коледж';
const ukrainianCollegeNameSub = 'Київського кооперативного інституту бізнесу і права';
const ukrainianCollegeName = `${ukrainianCollegeNameMain} ${ukrainianCollegeNameSub}`;
const ukrainianCollegeBrandTitle = `<span class="brand-title-main">${ukrainianCollegeNameMain}</span> <span class="brand-title-sub">${ukrainianCollegeNameSub}</span>`;
const collegeNameMain = 'Professional College of Economics and Law';
const collegeNameSub = 'of the Kyiv Cooperative Institute of Business and Law';
const collegeName = `${collegeNameMain} ${collegeNameSub}`;
const collegeBrandTitle = `<span class="brand-title-main">${collegeNameMain}</span> <span class="brand-title-sub">${collegeNameSub}</span>`;
const arrow = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const external = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M10 14 19 5M19 13v6H5V5h6"/></svg>';
const download = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/></svg>';
const down = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>';

const pageMeta = {
  'index.html': {
    page: 'home',
    title: `Home - ${collegeName}`,
    description: 'A modern responsive website for the Professional College of Economics and Law of the Kyiv Cooperative Institute of Business and Law.'
  },
  'college.html': {
    page: 'college',
    title: `College - ${collegeName}`,
    description: 'About the college, leadership, departments, public information, campus and contacts.'
  },
  'admissions.html': {
    page: 'admissions',
    title: `Admissions - ${collegeName}`,
    description: 'Admissions campaign 2026, programs, dates, documents, tuition and admissions office contacts.'
  },
  'students.html': {
    page: 'students',
    title: `Students - ${collegeName}`,
    description: 'Class schedule, learning services, electives, student life, support and career opportunities.'
  },
  'alumni.html': {
    page: 'alumni',
    title: `Alumni - ${collegeName}`,
    description: 'Alumni association, success stories, mentoring and community meetings.'
  },
  'science.html': {
    page: 'science',
    title: `Research - ${collegeName}`,
    description: 'Research areas, projects, grants, publications and student research.'
  },
  'library.html': {
    page: 'library',
    title: `Library - ${collegeName}`,
    description: 'Electronic catalog, book collection, library space, resources for researchers and academic integrity.'
  },
  'news.html': {
    page: 'news',
    title: `News - ${collegeName}`,
    description: 'Latest news, events, research and student materials from the college.'
  }
};

const head = (file) => {
  const meta = pageMeta[file];
  return `<!doctype html>
<html lang="en" data-page="${meta.page}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${meta.description}">
  <meta name="theme-color" content="#0b2345">
  <title>${meta.title}</title>
  <link rel="alternate" hreflang="uk" href="../${file}">
  <link rel="alternate" hreflang="en" href="${file}">
  <link rel="icon" href="../assets/logo_small.gif" type="image/gif">
  <link rel="stylesheet" href="../css/styles.css?v=${cssVersion}">
  <script src="../js/main.js?v=${scriptVersion}" defer></script>
</head>`;
};

const languageSwitch = ({ current, ukHref, enHref, label }) => `<div class="language-switch" data-language-switch>
          <button class="language language-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="${label}">${current}${down}</button>
          <div class="language-menu" role="menu">
            <a class="language-option${current === 'UA' ? ' is-active' : ''}" href="${ukHref}" hreflang="uk" role="menuitem"${current === 'UA' ? ' aria-current="true"' : ''}>UA</a>
            <a class="language-option${current === 'EN' ? ' is-active' : ''}" href="${enHref}" hreflang="en" role="menuitem"${current === 'EN' ? ' aria-current="true"' : ''}>EN</a>
          </div>
        </div>`;

const navLanguageSwitch = (options) => languageSwitch(options).replace('class="language-switch"', 'class="language-switch nav-language"');
const headerLanguageSwitch = (options) => languageSwitch(options).replace('class="language-switch"', 'class="language-switch header-language"');
const ukrainianNavLanguage = (file) => navLanguageSwitch({ current: 'UA', ukHref: file, enHref: `en/${file}`, label: 'Змінити мову' });
const englishNavLanguage = (file) => navLanguageSwitch({ current: 'EN', ukHref: `../${file}`, enHref: file, label: 'Change language' });
const ukrainianHeaderLanguage = (file) => headerLanguageSwitch({ current: 'UA', ukHref: file, enHref: `en/${file}`, label: 'Змінити мову' });
const englishHeaderLanguage = (file) => headerLanguageSwitch({ current: 'EN', ukHref: `../${file}`, enHref: file, label: 'Change language' });
const instagramHref = 'https://www.instagram.com/kkibp.official/';
const facebookHref = 'https://www.facebook.com/pages/%D0%9A%D0%B8%D1%97%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9-%D0%BA%D0%BE%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%B8%D0%B9-%D1%96%D0%BD%D1%81%D1%82%D0%B8%D1%82%D1%83%D1%82-%D0%B1%D1%96%D0%B7%D0%BD%D0%B5%D1%81%D1%83-%D1%96-%D0%BF%D1%80%D0%B0%D0%B2%D0%B0/1492832900785533/';
const googleMapsHref = 'https://www.google.com/maps/search/?api=1&amp;query=%D0%95%D0%BA%D0%BE%D0%BD%D0%BE%D0%BC%D1%96%D0%BA%D0%BE-%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D0%B2%D0%B8%D0%B9%20%D1%84%D0%B0%D1%85%D0%BE%D0%B2%D0%B8%D0%B9%20%D0%BA%D0%BE%D0%BB%D0%B5%D0%B4%D0%B6%20%D0%9A%D0%B8%D1%97%D0%B2%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%20%D0%BA%D0%BE%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%96%D0%BD%D1%81%D1%82%D0%B8%D1%82%D1%83%D1%82%D1%83%20%D0%B1%D1%96%D0%B7%D0%BD%D0%B5%D1%81%D1%83%20%D1%96%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%2C%20%D0%B2%D1%83%D0%BB.%20%D0%AE%D0%BB%D1%96%D1%97%20%D0%97%D0%B4%D0%B0%D0%BD%D0%BE%D0%B2%D1%81%D1%8C%D0%BA%D0%BE%D1%97%2C%2018%2C%20%D0%9A%D0%B8%D1%97%D0%B2&amp;hl=uk';
const contactEmail = 'rector@kkibp.edu.ua';
const contactPhone = '+38 (044) 258-20-29';
const contactPhoneHref = '+380442582029';
const headerContact = ({ label }) => `<div class="header-contact" aria-label="${label}">
          <a href="mailto:${contactEmail}">${contactEmail}</a>
          <a href="tel:${contactPhoneHref}">${contactPhone}</a>
        </div>`;
const ukrainianHeaderContact = () => headerContact({ label: 'Електронна пошта та телефон' });
const englishHeaderContact = () => headerContact({ label: 'Email and phone' });
const headerSocialLinks = ({ instagramLabel, facebookLabel }) => `<a class="icon-button header-social header-social--instagram" href="${instagramHref}" aria-label="${instagramLabel}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/></svg></a>
        <a class="icon-button header-social header-social--facebook" href="${facebookHref}" aria-label="${facebookLabel}" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8h2V5h-2.4C10.9 5 9 6.8 9 9.6V12H7v3h2v6h3v-6h2.5l.5-3h-3V9.8c0-1.1.5-1.8 2-1.8Z"/></svg></a>`;
const ukrainianHeaderSocialLinks = () => headerSocialLinks({ instagramLabel: 'Instagram коледжу', facebookLabel: 'Facebook коледжу' });
const englishHeaderSocialLinks = () => headerSocialLinks({ instagramLabel: 'College Instagram', facebookLabel: 'College Facebook' });
const ukrainianNavTools = (file) => `<li class="nav-item nav-item--tool nav-item--language">${ukrainianNavLanguage(file)}</li><li class="nav-item nav-item--tool nav-item--search"><button class="icon-button search-open nav-search" type="button" aria-label="Пошук по сайту"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button></li>`;
const englishNavTools = (file) => `<li class="nav-item nav-item--tool nav-item--language">${englishNavLanguage(file)}</li><li class="nav-item nav-item--tool nav-item--search"><button class="icon-button search-open nav-search" type="button" aria-label="Search the site"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button></li>`;
const ukrainianAdmissionsCta = '<li class="nav-item nav-item--cta"><a class="nav-link nav-link--cta" href="admissions.html">Вступ</a></li>';
const englishAdmissionsCta = '<li class="nav-item nav-item--cta"><a class="nav-link nav-link--cta" href="admissions.html">Admissions</a></li>';
const ukrainianFooterQuickLinks = '<nav class="footer-quick-links" aria-label="Швидкі переходи"><a href="students.html#schedule">Розклад занять</a><a href="admissions.html#programs">Освітні програми</a><a href="admissions.html">Вступ</a><a href="admissions.html#documents">Правила прийому</a><a href="college.html#departments">Відділення</a><a href="college.html#departments">Циклові комісії</a></nav>';
const englishFooterQuickLinks = '<nav class="footer-quick-links" aria-label="Quick links"><a href="students.html#schedule">Class schedule</a><a href="admissions.html#programs">Educational programs</a><a href="admissions.html">Admissions</a><a href="admissions.html#documents">Admission rules</a><a href="college.html#departments">Departments</a><a href="college.html#departments">Subject commissions</a></nav>';
const ukrainianNavBrand = () => `<li class="nav-item nav-item--brand"><a class="nav-brand" href="index.html" aria-label="Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права – головна"><img src="assets/logo_small.gif" alt="" width="48" height="48"><span><strong>Економіко-правовий фаховий коледж</strong><small>Київського кооперативного інституту бізнесу і права</small></span></a></li>`;
const englishNavBrand = () => `<li class="nav-item nav-item--brand"><a class="nav-brand" href="index.html" aria-label="${collegeName} - home"><img src="../assets/logo_small.gif" alt="" width="48" height="48"><span><strong>${collegeNameMain}</strong><small>${collegeNameSub}</small></span></a></li>`;

const mobileLanguage = ({ current, ukHref, enHref, label, title }) => `<div class="mobile-language" aria-label="${label}">
            <span class="mobile-language-title">${title}</span>
            <div class="mobile-language-options">
              <a class="mobile-language-option${current === 'UA' ? ' is-active' : ''}" href="${ukHref}" hreflang="uk"${current === 'UA' ? ' aria-current="true"' : ''}>UA</a>
              <a class="mobile-language-option${current === 'EN' ? ' is-active' : ''}" href="${enHref}" hreflang="en"${current === 'EN' ? ' aria-current="true"' : ''}>EN</a>
            </div>
          </div>`;

const ukrainianMobileLanguage = (file) => mobileLanguage({ current: 'UA', ukHref: file, enHref: `en/${file}`, label: 'Зміна мови', title: 'Мова сайту' });
const englishMobileLanguage = (file) => mobileLanguage({ current: 'EN', ukHref: `../${file}`, enHref: file, label: 'Change language', title: 'Site language' });
const ukrainianMobileNavTools = (file) => `<div class="mobile-nav-tools">
          ${ukrainianMobileLanguage(file)}
        </div>`;
const englishMobileNavTools = (file) => `<div class="mobile-nav-tools">
          ${englishMobileLanguage(file)}
        </div>`;

const header = (file) => `<body>

<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="header-main">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${collegeName} - home">
        <img class="brand-mark" src="../assets/logo_small.gif" alt="" width="56" height="56">
        <span class="brand-text"><strong>${collegeBrandTitle}</strong></span>
      </a>
      <div class="header-actions">
        ${englishHeaderContact()}
        ${englishHeaderSocialLinks()}
        <button class="icon-button search-open header-search" type="button" aria-label="Search the site"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button>
        ${englishHeaderLanguage(file)}
        <button class="icon-button nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation">
          <span class="menu-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span><span class="close-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></span>
        </button>
      </div>
    </div>
    <div class="nav-shell" id="site-navigation">
      <div class="container nav-inner">
        ${englishMobileNavTools(file)}
        <nav class="primary-nav" aria-label="Primary navigation">
          <ul class="nav-list">${englishNavBrand()}<li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-0">
            College<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-0">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="college.html">College${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups"><section class="mega-group"><h3>General Information</h3><ul><li><a href="college.html#about">About the college</a></li><li><a href="college.html#leadership">Leadership</a></li><li><a href="college.html#departments">Departments</a></li><li><a href="college.html#departments">Subject commissions</a></li><li><a href="college.html#governance">Governance and self-government bodies</a></li><li><a href="college.html#contacts">Contacts</a></li></ul></section><section class="mega-group mega-group--main-info"><h3>Key Information</h3><div class="mega-subcolumns"><ul><li><a href="college.html#documents">College charter</a></li><li><a href="college.html#documents">Development concept</a></li><li><a href="college.html#documents">Collective agreement</a></li><li><a href="college.html#documents">Local regulatory documents</a></li><li><a href="college.html#documents">Access to public information</a></li><li><a href="college.html#documents">Educational activity licenses</a></li></ul><ul><li><a href="college.html#documents">Accreditation certificates for specialties and programs</a></li><li><a href="college.html#documents">Work plan</a></li><li><a href="college.html#documents">Report</a></li><li><a href="college.html#documents">Public discussion</a></li><li><a href="college.html#documents">Vacancies</a></li></ul></div></section><section class="mega-group"><h3>Activities</h3><ul><li><a href="college.html#about">Sustainable Development Goals</a></li><li><a href="college.html#about">Inclusive learning environment</a></li><li><a href="college.html#documents">Anti-corruption activity</a></li><li><a href="students.html#support">Psychological service</a></li><li><a href="science.html#projects">International activity</a></li><li><a href="college.html#campus">Practical training</a></li><li><a href="students.html#career">Career Center</a></li></ul></section></div>
          </div>
        </li><li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-1">
            Applicants<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-1">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="admissions.html">Applicants${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups"><section class="mega-group"><h3>Admissions</h3><ul><li><a href="admissions.html#documents">Official documents</a></li><li><a href="admissions.html#documents">Admission rules</a></li><li><a href="admissions.html#timeline">Ranking lists</a></li><li><a href="admissions.html#timeline">Enrollment orders</a></li><li><a href="admissions.html#tuition">Tuition fees</a></li><li><a href="admissions.html#timeline">Important dates</a></li><li><a href="admissions.html#documents">Application documents</a></li><li><a href="admissions.html#contacts">Admissions office</a></li><li><a href="admissions.html#contacts">Contact information</a></li></ul></section><section class="mega-group"><h3>Educational Programs</h3><ul><li><a href="admissions.html#programs">Educational programs</a></li></ul></section></div>
          </div>
        </li><li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-2">
            Students<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-2">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="students.html">Students${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups"><section class="mega-group"><h3>General Information</h3><ul><li><a href="students.html#learning">Educational programs</a></li><li><a href="students.html#schedule">Academic calendar</a></li><li><a href="students.html#schedule">Class schedule</a></li><li><a href="students.html#learning">Teacher contacts</a></li><li><a href="students.html#electives">Elective components catalog</a></li><li><a href="students.html#learning">Internal regulations</a></li><li><a href="admissions.html#faq">Dormitory</a></li></ul></section><section class="mega-group"><h3>Leisure</h3><ul><li><a href="students.html#community">Student self-government</a></li><li><a href="students.html#community">Volunteering</a></li><li><a href="students.html#community">Museum of Consumer Cooperation History of Kyiv Region</a></li></ul></section><section class="mega-group"><h3>Opportunities</h3><ul><li><a href="students.html#opportunities">Art studios</a></li><li><a href="students.html#opportunities">Sports sections</a></li><li><a href="students.html#opportunities">Foreign language courses</a></li></ul></section><section class="mega-group"><h3>Social and Legal Support</h3><ul><li><a href="students.html#support">Psychological service</a></li><li><a href="students.html#support">Legal clinic</a></li><li><a href="students.html#support">Anti-corruption activity</a></li><li><a href="students.html#support">Student ombudsperson</a></li></ul></section></div>
          </div>
        </li><li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-3">
            Alumni<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-3">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="alumni.html">Alumni${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups"><section class="mega-group"><h3>Community</h3><ul><li><a href="alumni.html#association">Alumni association</a></li><li><a href="alumni.html#stories">Successful alumni</a></li><li><a href="alumni.html#events">Alumni meetings</a></li></ul></section></div>
          </div>
        </li><li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-4">
            Research<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-4">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="science.html">Research${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups"><section class="mega-group"><h3>General Information</h3><ul><li><a href="science.html#directions">Research areas</a></li><li><a href="science.html#publications">Staff research profiles</a></li><li><a href="science.html#publications">Work plan</a></li><li><a href="science.html#publications">Report</a></li></ul></section><section class="mega-group"><h3>For Researchers</h3><ul><li><a href="science.html#publications">Scientific publications</a></li><li><a href="science.html#grants">State awards, honors and scholarships</a></li><li><a href="science.html#projects">International research projects and grants</a></li><li><a href="science.html#grants">Funding competitions</a></li></ul></section><section class="mega-group"><h3>Student Research</h3><ul><li><a href="science.html#student-science">Research clubs</a></li><li><a href="science.html#events">Ukrainian and international student research contests</a></li></ul></section><section class="mega-group"><h3>Academic Integrity</h3><ul><li><a href="library.html#integrity">Official documents and recommendations on academic integrity</a></li><li><a href="library.html#integrity">College documents on academic integrity</a></li><li><a href="library.html#integrity">Work plan</a></li><li><a href="library.html#integrity">Report</a></li><li><a href="library.html#integrity">Developing a culture of academic integrity</a></li><li><a href="library.html#integrity">Surveys</a></li><li><a href="library.html#integrity">Plagiarism check</a></li></ul></section></div>
          </div>
        </li><li class="nav-item has-menu">
          <button class="nav-link menu-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-5">
            Library<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"/></svg>
          </button>
          <div class="mega-menu" id="menu-5">
            <div class="mega-intro">
              <span class="eyebrow">Section</span>
              <a class="mega-title" href="library.html">Library${arrow}</a>
              <p>Useful materials, documents and services for this section.</p>
            </div>
            <div class="mega-groups mega-groups--library"><section class="mega-group"><h3>About the Library</h3><ul><li><a href="library.html#about">Staff</a></li><li><a href="library.html#about">General information</a></li><li><a href="library.html#about">Library presentation</a></li><li><a href="library.html#about">Work plan</a></li><li><a href="library.html#about">Report</a></li><li><a href="library.html#about">Social media</a></li></ul></section><section class="mega-group"><h3>User Information</h3><ul><li><a href="library.html#about">Library rules</a></li><li><a href="library.html#about">For readers</a></li><li><a href="library.html#about">Reader form</a></li></ul></section><section class="mega-group"><h3>Book Collection</h3><ul><li><a href="library.html#catalog">Repository</a></li><li><a href="library.html#new-books">New acquisitions</a></li><li><a href="library.html#new-books">Book exhibitions</a></li><li><a href="library.html#catalog">Electronic library of textbooks</a></li></ul></section><section class="mega-group"><h3>Library Space</h3><ul><li><a href="library.html#space">Board games</a></li><li><a href="library.html#space">Library film club</a></li><li><a href="library.html#space">Healthy Library volunteering</a></li></ul></section><section class="mega-group"><h3>For Researchers</h3><ul><li><a href="library.html#researchers">For authors of scientific publications</a></li><li><a href="library.html#researchers">Scientometric indicators</a></li><li><a href="library.html#researchers">Open-access research resources</a></li><li><a href="library.html#researchers">Specialized scientific journals of Ukraine</a></li><li><a href="library.html#researchers">UDC/LBC indexes</a></li><li><a href="library.html#researchers">Staff research profiles</a></li></ul></section></div>
          </div>
        </li><li class="nav-item"><a class="nav-link" href="news.html">News</a></li>${englishAdmissionsCta}${englishNavTools(file)}</ul>
        </nav>
      </div>
    </div>
  </div>
</header>
<div class="nav-backdrop" data-nav-backdrop></div>
<div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" hidden>
  <div class="search-panel">
    <button class="icon-button search-close" type="button" aria-label="Close search"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    <span class="eyebrow">Search</span>
    <h2 id="search-title">What are you looking for?</h2>
    <label class="search-field">
      <span class="sr-only">Search query</span>
      <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="site-search" type="search" placeholder="For example, schedule or admission rules" autocomplete="off">
    </label>
    <div class="search-suggestions" aria-live="polite">
      <p class="search-hint">Popular: <a href="admissions.html#documents">admission rules</a>, <a href="students.html#schedule">class schedule</a>, <a href="library.html#catalog">electronic catalog</a>.</p>
      <div class="search-results" id="search-results"></div>
    </div>
  </div>
</div>`;

const footer = () => `
<footer class="site-footer" id="footer">
  <div class="container footer-grid">
    <div class="footer-brand"><a class="brand" href="index.html" aria-label="${collegeName} - home">
        <img class="brand-mark" src="../assets/logo_small.gif" alt="" width="56" height="56">
        <span class="brand-text"><strong>${collegeBrandTitle}</strong></span>
      </a>${englishFooterQuickLinks}</div>
    <div><h3>Navigation</h3><ul><li><a href="college.html">College</a></li><li><a href="admissions.html">Applicants</a></li><li><a href="students.html">Students</a></li><li><a href="alumni.html">Alumni</a></li><li><a href="science.html">Research</a></li><li><a href="library.html">Library</a></li><li><a href="news.html">News</a></li></ul></div>
    <div><h3>Contacts</h3><ul class="contact-list"><li>18 Yulii Zdanovskoi St., Kyiv, 03022</li><li><a href="tel:+380442582029">+38 (044) 258-20-29</a></li><li><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></li><li>Mon-Fri, 08:00-17:00</li><li><a href="${googleMapsHref}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></li></ul><div class="footer-social"><div class="social-links"><a class="social-link social-link--instagram" href="${instagramHref}" aria-label="College Instagram" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/></svg></a><a class="social-link social-link--facebook" href="${facebookHref}" aria-label="College Facebook" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8h2V5h-2.4C10.9 5 9 6.8 9 9.6V12H7v3h2v6h3v-6h2.5l.5-3h-3V9.8c0-1.1.5-1.8 2-1.8Z"/></svg></a></div></div></div>
  </div>
  <div class="container footer-bottom"><p>© <span data-year></span> ${collegeName}.</p><div><a href="#">Privacy policy</a></div></div>
</footer>
<button class="back-to-top" type="button" aria-label="Back to top">↑</button>
<div class="toast" role="status" aria-live="polite"></div>

</body>
</html>`;

const ukrainianFooter = () => `
<footer class="site-footer" id="footer">
  <div class="container footer-grid">
    <div class="footer-brand"><a class="brand" href="index.html" aria-label="${ukrainianCollegeName} – головна">
        <img class="brand-mark" src="assets/logo_small.gif" alt="" width="56" height="56">
        <span class="brand-text"><strong>${ukrainianCollegeBrandTitle}</strong></span>
      </a>${ukrainianFooterQuickLinks}</div>
    <div><h3>Навігація</h3><ul><li><a href="college.html">Коледж</a></li><li><a href="admissions.html">Абітурієнту</a></li><li><a href="students.html">Студенту</a></li><li><a href="alumni.html">Випускнику</a></li><li><a href="science.html">Наука</a></li><li><a href="library.html">Бібліотека</a></li><li><a href="news.html">Новини</a></li></ul></div>
    <div><h3>Контакти</h3><ul class="contact-list"><li>вул. Юлії Здановської, 18, м. Київ, 03022</li><li><a href="tel:${contactPhoneHref}">${contactPhone}</a></li><li><a href="mailto:${contactEmail}">${contactEmail}</a></li><li>Пн-Пт, 08:00–17:00</li><li><a href="${googleMapsHref}" target="_blank" rel="noopener noreferrer">Відкрити на Google Maps</a></li></ul><div class="footer-social"><div class="social-links"><a class="social-link social-link--instagram" href="${instagramHref}" aria-label="Instagram коледжу" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/></svg></a><a class="social-link social-link--facebook" href="${facebookHref}" aria-label="Facebook коледжу" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8h2V5h-2.4C10.9 5 9 6.8 9 9.6V12H7v3h2v6h3v-6h2.5l.5-3h-3V9.8c0-1.1.5-1.8 2-1.8Z"/></svg></a></div></div></div>
  </div>
  <div class="container footer-bottom"><p>© <span data-year></span> ${ukrainianCollegeName}.</p><div><a href="#">Політика конфіденційності</a></div></div>
</footer>
<button class="back-to-top" type="button" aria-label="Повернутися вгору">↑</button>
<div class="toast" role="status" aria-live="polite"></div>

</body>
</html>`;

const newsCardsHome = `<div class="news-grid">
    <article class="news-card"><div class="news-media news-media--image"><img src="../assets/news/znovu-vidnovliuiemos-2026.jpg" alt="Учасники освітнього тренінгу ЗНОвУ відновлюємось 2026" loading="lazy"><span class="news-media-label">Наука</span></div><div class="news-content"><div class="news-meta"><span>15-18 червня 2026</span><span>Освітній тренінг</span></div><h3>Юлія Руденко взяла участь у тренінгу «ЗНОвУ відновлюємось 2026»</h3><p>Викладачка долучилася до програми професійної підтримки педагогів, які працюють з учнями, що постраждали від війни.</p><a class="text-link" href="news.html#znovu-vidnovliuiemos-2026">Read ${arrow}</a></div></article>
    <article class="news-card"><div class="news-media news-media--image"><img src="../assets/news/pershokursnyky-rik-potomu.jpg" alt="Творчий звіт студентів першого курсу" loading="lazy"><span class="news-media-label">Подія</span></div><div class="news-content"><div class="news-meta"><span>18 червня 2026</span><span>Студентське життя</span></div><h3>«Першокурсники: рік по тому»: творчий звіт студентів</h3><p>Академічні групи першого курсу представили концертну програму про адаптацію, згуртованість і студентське зростання.</p><a class="text-link" href="news.html#pershokursnyky-rik-potomu">Read ${arrow}</a></div></article>
    <article class="news-card"><div class="news-media news-media--image"><img src="../assets/news/praktyka-oblik.jpg" alt="Захист виробничої практики студентів спеціальності Облік і оподаткування" loading="lazy"><span class="news-media-label">Практика</span></div><div class="news-content"><div class="news-meta"><span>15 червня 2026</span><span>Навчання</span></div><h3>Захист виробничої практики студентів спеціальності «Облік і оподаткування»</h3><p>Третьокурсники презентували результати практики, професійні навички та досвід роботи з обліковими процесами.</p><a class="text-link" href="news.html#praktyka-oblik">Read ${arrow}</a></div></article>
  </div>`;

const newsCardsPage = `<div class="news-grid">
<article class="news-card" id="znovu-vidnovliuiemos-2026" data-category="science"><div class="news-media news-media--image"><img src="../assets/news/znovu-vidnovliuiemos-2026.jpg" alt="Учасники освітнього тренінгу ЗНОвУ відновлюємось 2026" loading="lazy"><span class="news-media-label">Наука</span></div><div class="news-content"><div class="news-meta"><span>15-18 червня 2026</span><span>Освітній тренінг</span></div><h3>К.і.н., доцент Юлія Руденко взяла участь в освітньому тренінгу «ЗНОвУ відновлюємось 2026»</h3><p>Юлія Руденко долучилася до тренінгу громадської організації «ЗНОвУ», присвяченого підтримці педагогів, психологічній стійкості, профілактиці вигорання та роботі з учнями, які зазнали впливу війни.</p><a class="text-link" href="https://kkibp.edu.ua/uk/news/4863-k-i-n-dotsent-yuliya-rudenko-vzyala-uchast-v-osvitnomu-treninhu-znovu-vidnovlyuyemos-2026" target="_blank" rel="noopener noreferrer">Read in full ${external}</a></div></article>
<article class="news-card" id="pershokursnyky-rik-potomu" data-category="events"><div class="news-media news-media--image"><img src="../assets/news/pershokursnyky-rik-potomu.jpg" alt="Творчий звіт студентів першого курсу" loading="lazy"><span class="news-media-label">Подія</span></div><div class="news-content"><div class="news-meta"><span>18 червня 2026</span><span>Студентське життя</span></div><h3>«Першокурсники: рік по тому»: творчий звіт студентів</h3><p>У коледжі відбувся звітний концерт академічних груп першого курсу. Програма поєднала хореографічно-театральні постановки, кавер-номери, вокальні виступи та привітання студентської спільноти.</p><a class="text-link" href="https://kkibp.edu.ua/uk/news/4862-pershokursnyky-rik-po-tomu-tvorchyi-zvit-studentiv" target="_blank" rel="noopener noreferrer">Read in full ${external}</a></div></article>
<article class="news-card" id="praktyka-oblik" data-category="education"><div class="news-media news-media--image"><img src="../assets/news/praktyka-oblik.jpg" alt="Захист виробничої практики студентів спеціальності Облік і оподаткування" loading="lazy"><span class="news-media-label">Навчання</span></div><div class="news-content"><div class="news-meta"><span>15 червня 2026</span><span>Виробнича практика</span></div><h3>Захист виробничої практики студентів спеціальності «Облік і оподаткування»</h3><p>Студенти третього курсу презентували результати практики, описали бази практики, виконані завдання та набуті професійні навички у сфері бухгалтерського обліку й фінансової звітності.</p><a class="text-link" href="https://kkibp.edu.ua/uk/news/4861-zakhyst-vyrobnychoi-praktyky-studentiv-spetsialnosti-oblik-i-opodatkuvannia-pidsumky-profesiinoho-stanovlennia" target="_blank" rel="noopener noreferrer">Read in full ${external}</a></div></article>
<article class="news-card" id="syla-v-iednosti" data-category="community"><div class="news-media news-media--image"><img src="../assets/news/syla-v-iednosti.jpg" alt="Нагорода від Повітряного командування Центр" loading="lazy"><span class="news-media-label">Спільнота</span></div><div class="news-content"><div class="news-meta"><span>червень 2026</span><span>Волонтерство</span></div><h3>Сила в єдності: інститут відзначено нагородою від Повітряного командування «Центр»</h3><p>Підтримка захисників України отримала офіційне визнання. Нагороду пов’язано із системною допомогою Збройним Силам України та волонтерською роботою спільноти інституту.</p><a class="text-link" href="https://kkibp.edu.ua/uk/news/4851-syla-v-iednosti-instytut-vidznacheno-nahorodoiu-vid-povitrianoho-komanduvannia-tsentr" target="_blank" rel="noopener noreferrer">Read in full ${external}</a></div></article>
</div>`;

const mains = {
  'index.html': `<main id="main">
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <h1>Education that opens <span>opportunities</span></h1>
      <p class="lead">Practical programs, lecturer support and an active student community for a confident professional start.</p>
      <div class="hero-actions"><a class="button button--accent" href="admissions.html#apply">Become a student ${arrow}</a><a class="button button--outline" href="#programs">Choose a specialty</a></div>
      <div class="hero-trust"><p><strong>Real college community</strong>Lecturers and students work together through learning, practice and events.</p></div>
    </div>
    <div class="hero-visual">
      <div class="hero-image-card"><img src="../assets/college_logo_official.gif" alt="Official logo of Kyiv Cooperative Institute of Business and Law" width="3376" height="4219"></div>
    </div>
  </div>
</section>
<div class="quick-links"><div class="container quick-links-grid">
  <a class="quick-link" href="admissions.html#programs"><span><strong>Educational Programs</strong><span>specialties and choice</span></span>${arrow}</a>
  <a class="quick-link" href="admissions.html#documents"><span><strong>Admission Rules</strong><span>rules and documents</span></span>${arrow}</a>
  <a class="quick-link" href="admissions.html"><span><strong>Admissions</strong><span>applicant steps</span></span>${arrow}</a>
  <a class="quick-link" href="admissions.html#contacts"><span><strong>Contacts</strong><span>admissions office</span></span>${arrow}</a>
</div></div>
<section class="section" id="about"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Main Sections</span><h2>Everything important is close at hand</h2></div><a class="text-link" href="college.html">Learn about the college ${arrow}</a></div>
  <div class="card-grid">
    <article class="feature-card"><div class="feature-icon">01</div><h3>Applicants</h3><p>Admission rules, educational programs, tuition fees and the applicant calendar.</p><a class="text-link" href="admissions.html">Open ${arrow}</a></article>
    <article class="feature-card"><div class="feature-icon">02</div><h3>Students</h3><p>Schedule, electives, student life, support and career opportunities.</p><a class="text-link" href="students.html">Open ${arrow}</a></article>
    <article class="feature-card"><div class="feature-icon">03</div><h3>Research</h3><p>Research clubs, conferences, grants, international projects and publications.</p><a class="text-link" href="science.html">Open ${arrow}</a></article>
    <article class="feature-card"><div class="feature-icon">04</div><h3>Library</h3><p>Electronic catalog, new acquisitions, repository and academic integrity resources.</p><a class="text-link" href="library.html">Open ${arrow}</a></article>
    <article class="feature-card"><div class="feature-icon">05</div><h3>Alumni</h3><p>Alumni association, success stories, mentoring and community meetings.</p><a class="text-link" href="alumni.html">Open ${arrow}</a></article>
    <article class="feature-card"><div class="feature-icon">06</div><h3>Public Information</h3><p>Charter, licenses, educational programs, reports and open-access documents.</p><a class="text-link" href="college.html#documents">Open ${arrow}</a></article>
  </div>
</div></section>
<section class="section section--soft" id="programs"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Educational Programs</span><h2>Choose a direction that inspires</h2><p>Programs combine fundamental knowledge, project work and practice with partner organizations.</p></div><a class="button button--outline" href="admissions.html#programs">All specialties</a></div>
  <div class="program-grid">
    <article class="program-card"><span class="tag tag--light">IT and Digital Solutions</span><h3>Computer Science</h3><p>Web development, programming, databases, UX and team IT projects.</p><div class="program-meta"><span>2 years 10 months</span><span>full-time</span></div><a class="text-link" href="admissions.html#programs">Details ${arrow}</a></article>
    <article class="program-card"><span class="tag tag--light">Business and Management</span><h3>Entrepreneurship and Trade</h3><p>Marketing, e-commerce, financial literacy and students' own startups.</p><div class="program-meta"><span>2 years 10 months</span><span>full-time</span></div><a class="text-link" href="admissions.html#programs">Details ${arrow}</a></article>
    <article class="program-card"><span class="tag tag--light">Communications</span><h3>Design and Media</h3><p>Visual communication, content, graphic design and creative campaigns.</p><div class="program-meta"><span>3 years 10 months</span><span>full-time</span></div><a class="text-link" href="admissions.html#programs">Details ${arrow}</a></article>
  </div>
</div></section>
<section class="stats-band"><div class="container stats-grid"><div class="stat"><strong>Education</strong><span>professional training with practical substance</span></div><div class="stat"><strong>Practice</strong><span>learning tasks, projects and first professional trials</span></div><div class="stat"><strong>Support</strong><span>lecturers, mentors and the student community nearby</span></div><div class="stat"><strong>Community</strong><span>events, initiatives and an environment for growth</span></div></div></section>
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Latest News</span><h2>College Life</h2><p>Real events, learning practice, creative reports and volunteer initiatives from the community.</p></div><a class="text-link" href="news.html">All news ${arrow}</a></div>
  ${newsCardsHome}
</div></section>
</main>`,
  'college.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>College</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">College</span><h1>A place where professional futures are shaped</h1><p>We combine a strong academic foundation, practical learning and a culture of mutual support.</p></div><div class="page-hero-card"><strong>42 years</strong><span>working for education and community growth</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#about"><span>About the college</span><span>→</span></a><a href="#history"><span>History</span><span>→</span></a><a href="#leadership"><span>Leadership</span><span>→</span></a><a href="#departments"><span>Departments</span><span>→</span></a><a href="#governance"><span>Governance</span><span>→</span></a><a href="#documents"><span>Documents</span><span>→</span></a><a href="#campus"><span>Facilities</span><span>→</span></a><a href="#contacts"><span>Contacts</span><span>→</span></a></nav></aside>
<div>
  <section class="content-block" id="about"><span class="eyebrow">About the College</span><h2>Education focused on economics, law and practice</h2><p class="lead">${collegeName} is a distinct educational space within Kyiv Cooperative Institute of Business and Law, combining professional training, practical learning and support for student development.</p><div class="three-col"><article class="info-card info-card--teal"><div class="icon-badge">F</div><h3>Our founder</h3><p>Kyiv Cooperative Institute of Business and Law supports the academic foundation, partnerships and development of the college.</p></article><article class="info-card info-card--gold"><div class="icon-badge">M</div><h3>Educational mission</h3><p>To train specialists for economics, law, services, food technologies and entrepreneurship.</p></article><article class="info-card info-card--soft"><div class="icon-badge">E</div><h3>Environment</h3><p>Practical training, student self-government, psychological support and career opportunities.</p></article></div></section>
  <section class="content-block" id="history"><span class="eyebrow">History</span><h2>From a training center to a modern college</h2><div class="timeline"><article class="timeline-item"><div class="timeline-dot">1984</div><div><time>Start</time><h3>Training center founded</h3><p>The first programs focused on economics, trade and production organization.</p></div></article><article class="timeline-item"><div class="timeline-dot">2002</div><div><time>Growth</time><h3>Status and programs updated</h3><p>The IT direction was opened, classrooms were modernized and employer partnerships expanded.</p></div></article><article class="timeline-item"><div class="timeline-dot">2018</div><div><time>Campus</time><h3>Media lab opened</h3><p>Students gained a space for projects, podcasts, design and digital production.</p></div></article><article class="timeline-item"><div class="timeline-dot">2026</div><div><time>Today</time><h3>Flexible learning model</h3><p>Practice-oriented modules, mentoring and individual educational paths.</p></div></article></div></section>
  <section class="content-block" id="leadership"><span class="eyebrow">Administration</span><h2>College Leadership</h2><p class="lead">The leadership team is responsible for strategic development, educational quality and academic-methodical work.</p><div class="profile-grid profile-grid--leadership"><article class="profile-card"><div class="profile-photo profile-photo--image"><img src="../assets/people/vitalii-hidzhelitskyi.jpg" alt="Vitalii Hidzhelitskyi" loading="lazy"></div><h3>Vitalii Hidzhelitskyi</h3><p>Director, Candidate of Technical Sciences, Associate Professor</p><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></article><article class="profile-card"><div class="profile-photo profile-photo--image"><img src="../assets/people/inna-raikovska.jpg" alt="Inna Raikovska" loading="lazy"></div><h3>Inna Raikovska</h3><p>Deputy Director for Academic and Methodical Work, Candidate of Economic Sciences, Associate Professor</p><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></article></div></section>
  <section class="content-block" id="departments"><span class="eyebrow">Structure</span><h2>Departments and subject commissions</h2><div class="three-col"><article class="info-card info-card--teal"><h3>Departments</h3><ul class="check-list"><li>Economics and Law Department</li><li>Department of Food Technologies and Commodity Studies</li></ul></article><article class="info-card"><h3>Subject commissions</h3><ul class="check-list"><li>Accounting and finance disciplines</li><li>Economics, trade and marketing</li><li>Social, humanities and legal disciplines</li></ul></article><article class="info-card"><h3>Professional training</h3><ul class="check-list"><li>Information technology and natural sciences</li><li>Food technologies and hotel-restaurant business organization</li><li>Practical training and the Career Center</li></ul></article></div></section>
  <section class="content-block" id="governance"><span class="eyebrow">Governance Bodies</span><h2>Quality, self-government and collegial decisions</h2><div class="two-col"><article class="info-card"><h3>Collegial bodies</h3><ul class="check-list"><li>Labor collective conference</li><li>Methodical council</li><li>Pedagogical council</li></ul></article><article class="info-card info-card--gold"><h3>Quality and self-government</h3><ul class="check-list"><li>Education quality assurance center</li><li>Student self-government</li><li>Student ombudsperson</li></ul></article></div></section>
  <section class="content-block" id="documents"><span class="eyebrow">Open Data</span><h2>Documents and public information</h2><div class="document-list"><div class="document-item"><div><strong>College charter</strong><small>Official document</small></div><a href="#" aria-label="Download the charter">${download}</a></div><div class="document-item"><div><strong>Development concept</strong><small>Strategic development principles</small></div><a href="#" aria-label="Download the concept">${download}</a></div><div class="document-item"><div><strong>Collective agreement</strong><small>Terms of cooperation within the team</small></div><a href="#" aria-label="Download the collective agreement">${download}</a></div><div class="document-item"><div><strong>Local regulatory documents</strong><small>Regulations, rules and procedures</small></div><a href="#" aria-label="Open local documents">${external}</a></div><div class="document-item"><div><strong>Access to public information</strong><small>Requests, open data and reporting</small></div><a href="#" aria-label="Open public information">${external}</a></div><div class="document-item"><div><strong>Licenses and accreditation certificates</strong><small>Educational activity, specialties and programs</small></div><a href="#" aria-label="Open licenses archive">${external}</a></div><div class="document-item"><div><strong>Work plan and report</strong><small>Current academic year</small></div><a href="#" aria-label="Download the plan and report">${download}</a></div><div class="document-item"><div><strong>Public discussion and vacancies</strong><small>Announcements, consultations and open positions</small></div><a href="#" aria-label="Open announcements">${external}</a></div></div></section>
  <section class="content-block" id="campus"><span class="eyebrow">Campus</span><h2>Spaces for learning and creativity</h2><div class="three-col"><article class="info-card"><div class="icon-badge">12</div><h3>Multimedia classrooms</h3><p>Flexible spaces for lectures, teamwork and presentations.</p></article><article class="info-card"><div class="icon-badge">4</div><h3>Computer labs</h3><p>Modern equipment, training servers and prototyping studios.</p></article><article class="info-card"><div class="icon-badge">2</div><h3>Coworking spaces</h3><p>Areas for independent work, meetings and student initiatives.</p></article></div></section>
  <section class="content-block" id="contacts"><span class="eyebrow">Contacts</span><h2>Visit us</h2><div class="contact-grid"><div class="contact-card"><h3>${collegeName}</h3><p>Contacts are based on the current institute and college website.</p><ul><li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>18 Yulii Zdanovskoi St., Kyiv, 03022</span></li><li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 3.8 9 8.2 6.9 10c1.3 3 3.1 4.8 6.1 6.1L14.8 14l4.4 2.4-1 4.1c-.2.8-.9 1.3-1.7 1.3C8.7 21.3 2.7 15.3 2.2 7.5c0-.8.5-1.5 1.3-1.7l3.1-2Z"/></svg><a href="tel:+380442582029">+38 (044) 258-20-29</a></li><li><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></li></ul></div><div class="map-placeholder" aria-label="Schematic map of the college location"><div class="map-pin"><span>C</span></div></div></div></section>
</div></div></section>
</main>`,
  'admissions.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>Applicants</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">Applicants</span><h1>Admissions 2026: your next step</h1><p>A clear route from choosing a program to your first student day.</p></div><div class="page-hero-card"><strong>12</strong><span>educational programs for applicants after grades 9 and 11</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#apply"><span>How to apply</span><span>→</span></a><a href="#timeline"><span>Calendar</span><span>→</span></a><a href="#programs"><span>Programs</span><span>→</span></a><a href="#documents"><span>Documents</span><span>→</span></a><a href="#tuition"><span>Tuition</span><span>→</span></a><a href="#faq"><span>Questions</span><span>→</span></a><a href="#contacts"><span>Admissions office</span><span>→</span></a></nav></aside>
<div>
  <section class="content-block" id="apply"><span class="eyebrow">Step by Step</span><h2>How to become a student</h2><div class="three-col"><article class="info-card info-card--teal"><div class="icon-badge">1</div><h3>Choose a program</h3><p>Review curricula, professional prospects and the study format.</p></article><article class="info-card info-card--gold"><div class="icon-badge">2</div><h3>Prepare documents</h3><p>Create an applicant e-cabinet and upload the required materials.</p></article><article class="info-card info-card--soft"><div class="icon-badge">3</div><h3>Submit an application</h3><p>Track the ranking and complete enrollment requirements on time.</p></article></div></section>
  <section class="content-block" id="timeline"><span class="eyebrow">Applicant Calendar</span><h2>Key dates</h2><div class="timeline"><article class="timeline-item"><div class="timeline-dot">01</div><div><time>May 15</time><h3>Consultations begin</h3><p>Online meetings with the admissions office and presentations of educational programs.</p></div></article><article class="timeline-item"><div class="timeline-dot">02</div><div><time>July 1</time><h3>E-cabinet registration</h3><p>Create an applicant profile and upload documents.</p></div></article><article class="timeline-item"><div class="timeline-dot">03</div><div><time>July 8-22</time><h3>Application period</h3><p>Submit applications for state-funded or contract-based study.</p></div></article><article class="timeline-item"><div class="timeline-dot">04</div><div><time>August 5</time><h3>Recommendations published</h3><p>Check ranking lists and complete enrollment requirements.</p></div></article></div></section>
  <section class="content-block" id="programs"><span class="eyebrow">Educational Programs</span><h2>Specialties</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Program</th><th>Entry basis</th><th>Duration</th><th>Format</th></tr></thead><tbody><tr><td><strong>Computer Science</strong></td><td>Grades 9 / 11</td><td>2 y. 10 mo.</td><td><span class="status">Full-time</span></td></tr><tr><td><strong>Entrepreneurship and Trade</strong></td><td>Grades 9 / 11</td><td>2 y. 10 mo.</td><td><span class="status">Full-time</span></td></tr><tr><td><strong>Accounting and Taxation</strong></td><td>Grades 9 / 11</td><td>2 y. 10 mo.</td><td><span class="status">Full-time</span></td></tr><tr><td><strong>Graphic Design</strong></td><td>Grade 9</td><td>3 y. 10 mo.</td><td><span class="status status--gold">Full-time</span></td></tr><tr><td><strong>Law</strong></td><td>Grade 11</td><td>1 y. 10 mo.</td><td><span class="status">Full-time</span></td></tr></tbody></table></div></section>
  <section class="content-block" id="documents"><span class="eyebrow">Documents</span><h2>What to prepare</h2><div class="two-col"><article class="info-card"><h3>For the e-cabinet</h3><ul class="check-list"><li>Identity document</li><li>Education document and supplement</li><li>Digital photo</li><li>Benefit documents, if applicable</li></ul></article><article class="info-card"><h3>After recommendation</h3><ul class="check-list"><li>Originals or qualified e-signature copies of documents</li><li>Enrollment application</li><li>Study agreement</li><li>Medical certificate for selected programs</li></ul></article></div><div class="document-list" style="margin-top:24px"><div class="document-item"><div><strong>Admission Rules 2026</strong><small>PDF · 1.8 MB</small></div><a href="#" aria-label="Download admission rules">${download}</a></div><div class="document-item"><div><strong>List of competitive subjects</strong><small>PDF · 640 KB</small></div><a href="#" aria-label="Download subject list">${download}</a></div></div></section>
  <section class="content-block" id="tuition"><span class="eyebrow">Financial Terms</span><h2>Tuition fees</h2><div class="three-col"><article class="info-card"><span class="tag">from</span><h3 style="font-size:2rem;margin-top:18px">UAH 27,900</h3><p>per academic year for economics programs.</p></article><article class="info-card"><span class="tag">from</span><h3 style="font-size:2rem;margin-top:18px">UAH 31,500</h3><p>per academic year for IT and digital programs.</p></article><article class="info-card info-card--gold"><span class="tag tag--gold">Support</span><h3 style="margin-top:18px">Installment payments</h3><p>Option to agree on an individual payment schedule.</p></article></div></section>
  <section class="content-block" id="faq"><span class="eyebrow">FAQ</span><h2>Answers for applicants</h2><details class="faq"><summary>Can I apply after grade 9?</summary><p>Yes. Most programs allow admission based on basic secondary education. Specific conditions are listed in the program table.</p></details><details class="faq"><summary>Are there state-funded places?</summary><p>Yes. The number of state or regional order places is published before the application period begins.</p></details><details class="faq"><summary>Is a dormitory available?</summary><p>A limited number of places is available for nonresident applicants. Indicate this need when submitting documents.</p></details><details class="faq"><summary>How can I get an individual consultation?</summary><p>Call or email the admissions office during working hours.</p></details></section>
  <section class="content-block" id="contacts"><span class="eyebrow">Admissions Office</span><h2>Ask a question</h2><div class="contact-grid"><div class="contact-card"><h3>Applicant contacts</h3><p>Mon-Fri, 09:00-17:00</p><ul><li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 3.8 9 8.2 6.9 10c1.3 3 3.1 4.8 6.1 6.1L14.8 14l4.4 2.4-1 4.1c-.2.8-.9 1.3-1.7 1.3C8.7 21.3 2.7 15.3 2.2 7.5c0-.8.5-1.5 1.3-1.7l3.1-2Z"/></svg><a href="tel:+380442582029">+38 (044) 258-20-29</a></li><li><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></li><li><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>room 101, main building</span></li></ul></div><article class="info-card"><h3>How to get an answer</h3><p>Contact the admissions office by phone or email during working hours.</p><ul class="check-list"><li><a href="tel:+380442582029">+38 (044) 258-20-29</a></li><li><a href="mailto:rector@kkibp.edu.ua">rector@kkibp.edu.ua</a></li><li>room 101, main building</li></ul></article></div></section>
</div></div></section>
</main>`,
  'students.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>Students</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">Students</span><h1>Learning, opportunities and support</h1><p>Fast access to the schedule, learning services, student life and career resources.</p></div><div class="page-hero-card"><strong>18</strong><span>student communities and clubs</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#learning"><span>Learning</span><span>→</span></a><a href="#schedule"><span>Schedule</span><span>→</span></a><a href="#electives"><span>Electives</span><span>→</span></a><a href="#community"><span>Leisure</span><span>→</span></a><a href="#opportunities"><span>Opportunities</span><span>→</span></a><a href="#support"><span>Support</span><span>→</span></a><a href="#career"><span>Career</span><span>→</span></a></nav></aside>
<div>
  <section class="content-block" id="learning"><span class="eyebrow">Learning Process</span><h2>Learning services</h2><div class="three-col"><article class="feature-card"><div class="feature-icon">S</div><h3>Class schedule</h3><p>Current weekly schedule, substitutions and classrooms.</p><a class="text-link" href="#schedule">View ${arrow}</a></article><article class="feature-card"><div class="feature-icon">E</div><h3>E-learning</h3><p>Course materials, assignments and communication with lecturers.</p><a class="text-link" href="#">Log in ${external}</a></article><article class="feature-card"><div class="feature-icon">C</div><h3>Course catalog</h3><p>Description of elective components and rules for building an individual path.</p><a class="text-link" href="#electives">Open ${arrow}</a></article></div></section>
  <section class="content-block" id="schedule"><span class="eyebrow">Today</span><h2>Class schedule</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Time</th><th>Group</th><th>Discipline</th><th>Lecturer</th><th>Room</th></tr></thead><tbody><tr><td>08:30-09:50</td><td>CS-21</td><td><strong>Algorithms and Data Structures</strong></td><td>O. Bondar</td><td>312</td></tr><tr><td>10:05-11:25</td><td>ET-22</td><td><strong>Marketing Communications</strong></td><td>N. Sydorenko</td><td>205</td></tr><tr><td>11:40-13:00</td><td>GD-11</td><td><strong>Composition Basics</strong></td><td>A. Hnatiuk</td><td>Media Lab</td></tr><tr><td>13:30-14:50</td><td>AT-31</td><td><strong>Financial Accounting</strong></td><td>L. Petrenko</td><td>118</td></tr></tbody></table></div><p style="margin-top:14px;font-size:.85rem">Temporary schedule data. On the live site this table can be connected to an API or Google Sheets.</p></section>
  <section class="content-block" id="electives"><span class="eyebrow">Individual Path</span><h2>Elective disciplines</h2><div class="two-col"><article class="info-card"><span class="tag">Digital Skills</span><h3 style="margin-top:16px">Web Design Basics</h3><p>Prototyping, UI components, responsive layouts and accessibility.</p><p><strong>3 credits · 30 places</strong></p></article><article class="info-card"><span class="tag tag--gold">Communications</span><h3 style="margin-top:16px">Public Speaking</h3><p>Speech structure, audience work and visual support.</p><p><strong>3 credits · 24 places</strong></p></article><article class="info-card"><span class="tag">Business</span><h3 style="margin-top:16px">Finance for Life</h3><p>Personal budget, taxes, loans, savings and risks.</p><p><strong>3 credits · 30 places</strong></p></article><article class="info-card"><span class="tag tag--gold">Language</span><h3 style="margin-top:16px">English for Careers</h3><p>CVs, interviews, professional vocabulary and workplace correspondence.</p><p><strong>4 credits · 20 places</strong></p></article></div></section>
  <section class="content-block" id="community"><span class="eyebrow">Leisure</span><h2>Student community</h2><div class="three-col"><article class="info-card info-card--teal"><div class="icon-badge">SG</div><h3>Self-government</h3><p>Representation of student interests, events and initiatives.</p></article><article class="info-card info-card--gold"><div class="icon-badge">V</div><h3>Volunteering</h3><p>Volunteer projects for community support and mutual aid.</p></article><article class="info-card info-card--soft"><div class="icon-badge">M</div><h3>History museum</h3><p>Archive, oral histories and student research projects.</p></article></div></section>
  <section class="content-block" id="opportunities"><span class="eyebrow">Opportunities</span><h2>Develop your talents</h2><div class="two-col"><article class="info-card"><h3>Art studios</h3><ul class="check-list"><li>Vocal studio</li><li>Theater workshop</li><li>Photo and video club</li><li>Design laboratory</li></ul></article><article class="info-card"><h3>Sports and languages</h3><ul class="check-list"><li>Volleyball and basketball</li><li>Table tennis</li><li>English speaking club</li><li>Polish for beginners</li></ul></article></div></section>
  <section class="content-block" id="support"><span class="eyebrow">Social and Legal Support</span><h2>You are not alone</h2><div class="three-col"><article class="info-card"><div class="icon-badge">P</div><h3>Psychological service</h3><p>Confidential consultations, trainings and adaptation support.</p><a class="text-link" href="mailto:rector@kkibp.edu.ua">Write ${arrow}</a></article><article class="info-card"><div class="icon-badge">L</div><h3>Legal clinic</h3><p>Basic consultations on educational, labor and social rights.</p><a class="text-link" href="mailto:rector@kkibp.edu.ua">Write ${arrow}</a></article><article class="info-card"><div class="icon-badge">O</div><h3>Student ombudsperson</h3><p>An independent channel for appeals about rights and a safe environment.</p><a class="text-link" href="mailto:rector@kkibp.edu.ua">Write ${arrow}</a></article></div></section>
  <section class="content-block" id="career"><span class="eyebrow">Career Center</span><h2>From the first CV to the first job</h2><div class="cta-panel"><div><h2 style="font-size:2.2rem">Career consultation</h2><p>CV, portfolio, interview, internship and search for partner employers.</p></div><div class="cta-actions"><a class="button button--accent" href="mailto:rector@kkibp.edu.ua">Write</a><a class="button button--ghost-light" href="college.html#documents">Vacancies</a></div></div></section>
</div></div></section>
</main>`,
  'alumni.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>Alumni</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">Alumni</span><h1>A community that stays close</h1><p>Stay connected with the college, share experience and support the next generation of students.</p></div><div class="page-hero-card"><strong>8,600+</strong><span>alumni in the professional community</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#association"><span>Association</span><span>→</span></a><a href="#stories"><span>Stories</span><span>→</span></a><a href="#mentoring"><span>Mentoring</span><span>→</span></a><a href="#events"><span>Meetings</span><span>→</span></a></nav></aside>
<div>
<section class="content-block" id="association"><span class="eyebrow">Alumni Association</span><h2>Connections that work for years</h2><p class="lead">The association brings together alumni of different years, creates professional contacts, supports student initiatives and contributes to college development.</p><div class="three-col"><article class="info-card info-card--teal"><div class="icon-badge">01</div><h3>Networking</h3><p>Professional meetings, thematic clubs and opportunity exchange.</p></article><article class="info-card info-card--gold"><div class="icon-badge">02</div><h3>Mentoring</h3><p>Advice for students, portfolio reviews and career consultations.</p></article><article class="info-card info-card--soft"><div class="icon-badge">03</div><h3>Support</h3><p>Scholarships, equipment and participation in developing educational spaces.</p></article></div></section>
<section class="content-block" id="stories"><span class="eyebrow">Successful Alumni</span><h2>Stories that inspire</h2><div class="profile-grid"><article class="profile-card"><div class="profile-photo"></div><h3>Maria Levchenko</h3><p>Product designer, class of 2019</p><a href="#">Read the story</a></article><article class="profile-card"><div class="profile-photo"></div><h3>Dmytro Romaniuk</h3><p>Entrepreneur, class of 2016</p><a href="#">Read the story</a></article><article class="profile-card"><div class="profile-photo"></div><h3>Sofia Kravets</h3><p>Data analyst, class of 2021</p><a href="#">Read the story</a></article></div></section>
<section class="content-block" id="mentoring"><span class="eyebrow">Mentoring Program</span><h2>Pass the experience forward</h2><div class="two-col"><article class="info-card"><h3>Become a mentor</h3><p>Help a student define goals, prepare a portfolio and better understand the profession.</p><ul class="check-list"><li>1 meeting per month</li><li>Program duration is 4 months</li><li>Methodical support from the coordinator</li></ul><a class="button button--primary" href="mailto:rector@kkibp.edu.ua" style="margin-top:20px">Apply</a></article><article class="info-card info-card--gold"><h3>Invite an intern</h3><p>Offer practice or a short project for senior students.</p><ul class="check-list"><li>Preselection of candidates</li><li>Support from the Career Center</li><li>Flexible cooperation format</li></ul><a class="button button--outline" href="mailto:rector@kkibp.edu.ua" style="margin-top:20px">Contact us</a></article></div></section>
<section class="content-block" id="events"><span class="eyebrow">Meetings</span><h2>Events for alumni</h2><div class="event-list"><article class="event-item"><div class="event-date">24<small>May</small></div><div><h3>Annual alumni meeting</h3><p>15:00 · college campus</p></div><a href="#">${arrow}</a></article><article class="event-item"><div class="event-date">13<small>Jun</small></div><div><h3>Career club: moving into management</h3><p>18:30 · online</p></div><a href="#">${arrow}</a></article></div></section>
</div></div></section>
</main>`,
  'science.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>Research</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">Research</span><h1>Research that turns into practice</h1><p>We support faculty and student projects, open science and international cooperation.</p></div><div class="page-hero-card"><strong>34</strong><span>active research and applied projects</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#directions"><span>Areas</span><span>→</span></a><a href="#projects"><span>Projects</span><span>→</span></a><a href="#grants"><span>Grants</span><span>→</span></a><a href="#publications"><span>Publications</span><span>→</span></a><a href="#student-science"><span>Student research</span><span>→</span></a><a href="#events"><span>Events</span><span>→</span></a></nav></aside>
<div>
<section class="content-block" id="directions"><span class="eyebrow">Research Activity</span><h2>Priority areas</h2><div class="three-col"><article class="info-card"><div class="icon-badge">DX</div><h3>Digital transformation</h3><p>Educational technologies, data, automation and digital services for communities.</p></article><article class="info-card"><div class="icon-badge">SE</div><h3>Social economy</h3><p>Entrepreneurship, cooperation, local development and financial inclusion.</p></article><article class="info-card"><div class="icon-badge">ED</div><h3>Innovation in education</h3><p>Competency-based learning, assessment and personalized paths.</p></article></div></section>
<section class="content-block" id="projects"><span class="eyebrow">International Cooperation</span><h2>Current projects</h2><div class="two-col"><article class="info-card info-card--teal"><span class="tag">2025-2027</span><h3 style="margin-top:18px">Digital Skills Bridge</h3><p>Micro-courses in digital competencies for students and lecturers.</p><p><strong>Partners:</strong> Ukraine, Poland, Lithuania</p></article><article class="info-card info-card--gold"><span class="tag tag--gold">2026</span><h3 style="margin-top:18px">Green Campus Lab</h3><p>Student research on energy efficiency and sustainable solutions for the campus.</p><p><strong>Format:</strong> applied laboratory</p></article></div></section>
<section class="content-block" id="grants"><span class="eyebrow">Opportunities</span><h2>Grants, awards and scholarships</h2><div class="document-list"><div class="document-item"><div><strong>Mini-grants for student research</strong><small>Up to UAH 20,000 · deadline April 30</small></div><a href="#">${external}</a></div><div class="document-item"><div><strong>Young researchers competition</strong><small>Individual and team projects</small></div><a href="#">${external}</a></div><div class="document-item"><div><strong>Academic mobility scholarship</strong><small>Summer school at a partner college</small></div><a href="#">${external}</a></div></div></section>
<section class="content-block" id="publications"><span class="eyebrow">Scientific Publications</span><h2>Publications and repository</h2><div class="three-col"><article class="info-card"><div class="icon-badge">J</div><h3>Professional journal</h3><p>Applied research in education, economics and digital technologies.</p><a class="text-link" href="library.html#catalog">Open ${arrow}</a></article><article class="info-card"><div class="icon-badge">R</div><h3>Repository</h3><p>Articles, conference abstracts, learning materials and student works.</p><a class="text-link" href="library.html#catalog">Go ${arrow}</a></article><article class="info-card"><div class="icon-badge">P</div><h3>Researcher profiles</h3><p>ORCID, Google Scholar, bibliometric data and areas of expertise.</p><a class="text-link" href="#">View ${arrow}</a></article></div></section>
<section class="content-block" id="student-science"><span class="eyebrow">Student Research</span><h2>Clubs and research teams</h2><div class="two-col"><article class="info-card"><h3>DataLab</h3><p>Data analytics, visualization and applied research for city services.</p><span class="status">Wednesdays · 16:00</span></article><article class="info-card"><h3>StartUp Studio</h3><p>Business idea validation, user research and prototyping.</p><span class="status status--gold">Thursdays · 15:30</span></article><article class="info-card"><h3>Media Research</h3><p>Digital communications, audience behavior and media literacy.</p><span class="status">Tuesdays · 16:20</span></article><article class="info-card"><h3>EcoTrack</h3><p>Campus resource monitoring and sustainable development solutions.</p><span class="status status--gold">Fridays · 14:30</span></article></div></section>
<section class="content-block" id="events"><span class="eyebrow">Calendar</span><h2>Research events</h2><div class="event-list"><article class="event-item"><div class="event-date">17<small>Apr</small></div><div><h3>Student research conference</h3><p>10:00 · building B</p></div><a href="#">${arrow}</a></article><article class="event-item"><div class="event-date">06<small>May</small></div><div><h3>Grant proposal workshop</h3><p>15:00 · online</p></div><a href="#">${arrow}</a></article></div></section>
</div></div></section>
</main>`,
  'library.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>Library</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">Library</span><h1>Knowledge in a convenient format</h1><p>Learning literature, electronic resources, research support and space for collaboration.</p></div><div class="page-hero-card"><strong>48,000+</strong><span>printed and electronic publications</span></div></div></div></section>
<section class="section"><div class="container content-layout">
<aside class="anchor-nav"><nav class="anchor-card" aria-label="Page navigation"><h2>On this page</h2><a href="#about"><span>About library</span><span>→</span></a><a href="#catalog"><span>Catalog</span><span>→</span></a><a href="#new-books"><span>New arrivals</span><span>→</span></a><a href="#space"><span>Space</span><span>→</span></a><a href="#researchers"><span>For researchers</span><span>→</span></a><a href="#integrity"><span>Integrity</span><span>→</span></a></nav></aside>
<div>
<section class="content-block" id="about"><span class="eyebrow">About the Library</span><h2>More than books</h2><p class="lead">The library supports learning, research and reading culture. It helps find sources, format references, check work and organize events.</p><div class="three-col"><article class="info-card info-card--teal"><div class="icon-badge">48K</div><h3>Collection</h3><p>Textbooks, professional editions, fiction and digital collections.</p></article><article class="info-card info-card--gold"><div class="icon-badge">62</div><h3>Workplaces</h3><p>Quiet area, coworking space, computers and rooms for team meetings.</p></article><article class="info-card info-card--soft"><div class="icon-badge">24/7</div><h3>E-resources</h3><p>Access to the catalog, repository and selected learning materials.</p></article></div></section>
<section class="content-block" id="catalog"><span class="eyebrow">Book Collection</span><h2>Electronic catalog</h2><div class="cta-panel"><div><h2 style="font-size:2.2rem">Find the publication you need</h2><p>Search by author, title, topic or academic discipline.</p></div><div class="cta-actions"><a class="button button--accent" href="#">Open catalog ${external}</a></div></div><div class="two-col" style="margin-top:24px"><article class="info-card"><h3>Repository</h3><p>Educational-methodical materials, articles, abstracts and qualification papers.</p><a class="text-link" href="#">Go ${arrow}</a></article><article class="info-card"><h3>Electronic library</h3><p>Selections of open textbooks, periodicals and learning platforms.</p><a class="text-link" href="#">Go ${arrow}</a></article></div></section>
<section class="content-block" id="new-books"><span class="eyebrow">New Acquisitions</span><h2>Recommended reading</h2><div class="three-col"><article class="info-card"><span class="tag">IT</span><h3 style="margin-top:16px">Clean Code: Practice Book</h3><p>Updated learning edition for programming beginners.</p><small class="muted">Code: 004.4 / C-68</small></article><article class="info-card"><span class="tag tag--gold">Business</span><h3 style="margin-top:16px">Entrepreneurial Thinking</h3><p>From problem discovery to business model validation.</p><small class="muted">Code: 658 / E-32</small></article><article class="info-card"><span class="tag">Design</span><h3 style="margin-top:16px">Visual Communication Systems</h3><p>Grids, typography and digital product design.</p><small class="muted">Code: 766 / V-40</small></article></div></section>
<section class="content-block" id="space"><span class="eyebrow">Library Space</span><h2>Work the way that suits you</h2><div class="two-col"><article class="info-card info-card--teal"><h3>Quiet reading room</h3><p>40 seats, individual lighting, power outlets and Wi-Fi.</p><span class="status">Mon-Fri · 08:30-18:00</span></article><article class="info-card info-card--gold"><h3>Coworking</h3><p>Team tables, presentation screen and room booking.</p><span class="status status--gold">Mon-Fri · 09:00-20:00</span></article></div></section>
<section class="content-block" id="researchers"><span class="eyebrow">For Researchers</span><h2>Information support for research</h2><div class="document-list"><div class="document-item"><div><strong>Scientometric indicators</strong><small>Overview of Scopus, Web of Science, Google Scholar</small></div><a href="#">${external}</a></div><div class="document-item"><div><strong>Open research resources</strong><small>Catalog of verified databases and journals</small></div><a href="#">${external}</a></div><div class="document-item"><div><strong>Creating an ORCID profile</strong><small>Step-by-step guide</small></div><a href="#">${download}</a></div></div></section>
<section class="content-block" id="integrity"><span class="eyebrow">Academic Integrity</span><h2>Writing and researching responsibly</h2><div class="two-col"><article class="info-card"><h3>Useful materials</h3><ul class="check-list"><li>Citation and source formatting rules</li><li>How to avoid unintentional plagiarism</li><li>Recommendations for using AI</li><li>Academic integrity policy</li></ul></article><article class="info-card info-card--gold"><h3>Work checking</h3><p>Students can submit work for a preliminary check through a lecturer or library consultant.</p><a class="button button--primary" href="mailto:rector@kkibp.edu.ua">Ask a librarian</a></article></div></section>
</div></div></section>
</main>`,
  'news.html': `<main id="main"><section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">Home</a><span>News</span></nav><div class="page-hero-grid"><div><span class="eyebrow eyebrow--light">News</span><h1>Events, people and achievements</h1><p>Follow learning projects, partnerships, student initiatives and announcements.</p></div><div class="page-hero-card"><strong>4</strong><span>current materials in the updated feed</span></div></div></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">News Feed</span><h2>Latest materials</h2><p>A selection of current materials about learning, research, student life and support for Ukraine's defenders.</p></div></div><div class="filter-bar" role="group" aria-label="News filter"><button class="filter-button is-active" data-filter="all">All</button><button class="filter-button" data-filter="education">Learning</button><button class="filter-button" data-filter="events">Events</button><button class="filter-button" data-filter="science">Research</button><button class="filter-button" data-filter="community">Community</button></div>${newsCardsPage}</div></section>
</main>`
};

const htmlPage = (file) => `${head(file)}
${header(file)}

${mains[file]}

${footer()}`;

const updateUkrainianPage = async (file) => {
  let source = await readFile(file, 'utf8');
  source = source
    .replace(/css\/styles\.css\?v=[^"]+/g, `css/styles.css?v=${cssVersion}`)
    .replace(/js\/main\.js\?v=[^"]+/g, `js/main.js?v=${scriptVersion}`);

  source = source.replace(/\n  <div class="topbar">[\s\S]*?\n  <div class="header-main">/, '\n  <div class="header-main">');

  const headerActionsStart = source.indexOf('      <div class="header-actions">');
  const searchButtonMarker = '        <button class="icon-button search-open';
  let searchButtonStart = source.indexOf(searchButtonMarker, headerActionsStart);
  if (headerActionsStart !== -1) {
    source = source.replace(/\n        <div class="header-contact"[\s\S]*?\n        <\/div>/, '');
    source = source.replace(/\n        <div class="language-switch header-language"[\s\S]*?\n        <\/div>/, '');
    source = source.replace(/\n        <a class="icon-button header-social[\s\S]*?header-social--facebook[\s\S]*?<\/a>/, '');
    searchButtonStart = source.indexOf(searchButtonMarker, headerActionsStart);
  }
  if (headerActionsStart !== -1 && searchButtonStart !== -1) {
    source = source.replace('class="icon-button search-open"', 'class="icon-button search-open header-search"');
    source = `${source.slice(0, searchButtonStart)}        ${ukrainianHeaderContact()}\n        ${ukrainianHeaderSocialLinks()}\n${source.slice(searchButtonStart)}`;
    const searchButtonEnd = source.indexOf('</button>', searchButtonStart);
    if (searchButtonEnd !== -1) {
      const insertionPoint = searchButtonEnd + '</button>'.length;
      source = `${source.slice(0, insertionPoint)}\n        ${ukrainianHeaderLanguage(file)}${source.slice(insertionPoint)}`;
    }
  }

  const navInnerStart = source.indexOf('      <div class="container nav-inner">');
  const primaryNavMarker = '        <nav class="primary-nav"';
  const primaryNavStart = source.indexOf(primaryNavMarker, navInnerStart);
  const mobileToolsStart = source.indexOf('        <div class="mobile-nav-tools"', navInnerStart);
  if (navInnerStart !== -1 && primaryNavStart !== -1) {
    if (mobileToolsStart !== -1 && mobileToolsStart < primaryNavStart) {
      source = `${source.slice(0, mobileToolsStart)}        ${ukrainianMobileNavTools(file)}\n${source.slice(primaryNavStart)}`;
    } else {
      source = `${source.slice(0, primaryNavStart)}        ${ukrainianMobileNavTools(file)}\n${source.slice(primaryNavStart)}`;
    }
  }

  source = source.replace(/<li class="nav-item nav-item--brand">[\s\S]*?<\/li>/, '');
  source = source.replace('<ul class="nav-list">', `<ul class="nav-list">${ukrainianNavBrand()}`);

  source = source.replace(/<li class="nav-item nav-item--cta"><a class="nav-link nav-link--cta" href="admissions\.html">Вступ<\/a><\/li>/g, '');

  const newsItem = '<li class="nav-item"><a class="nav-link" href="news.html">Новини</a></li>';
  const activeNewsItem = '<li class="nav-item is-active"><a class="nav-link" href="news.html">Новини</a></li>';
  const newsStart = source.indexOf(newsItem);
  const activeNewsStart = source.indexOf(activeNewsItem);
  const navListEnd = newsStart !== -1 ? source.indexOf('</ul>', newsStart) : -1;
  const activeNavListEnd = activeNewsStart !== -1 ? source.indexOf('</ul>', activeNewsStart) : -1;
  if (newsStart !== -1 && navListEnd !== -1) {
    source = `${source.slice(0, newsStart)}${newsItem}${ukrainianAdmissionsCta}${ukrainianNavTools(file)}${source.slice(navListEnd)}`;
  } else if (activeNewsStart !== -1 && activeNavListEnd !== -1) {
    source = `${source.slice(0, activeNewsStart)}${activeNewsItem}${ukrainianAdmissionsCta}${ukrainianNavTools(file)}${source.slice(activeNavListEnd)}`;
  }

  source = source.replace(/\n        <div class="mobile-nav-footer">[\s\S]*?\n        <\/div>(?=\n      <\/div>\n    <\/div>\n  <\/div>\n<\/header>)/, '');

  if (!source.includes('rel="alternate" hreflang="en"')) {
    source = source.replace(
      '  <link rel="icon" href="assets/logo_small.gif" type="image/gif">',
      `  <link rel="alternate" hreflang="uk" href="${file}">\n  <link rel="alternate" hreflang="en" href="en/${file}">\n  <link rel="icon" href="assets/logo_small.gif" type="image/gif">`
    );
  }

  source = source.replace(/\n<footer class="site-footer"[\s\S]*?<\/html>\s*$/, ukrainianFooter());

  await writeFile(file, source);
};

await mkdir('en', { recursive: true });
await Promise.all(files.map((file) => writeFile(`en/${file}`, htmlPage(file))));
await Promise.all(files.map(updateUkrainianPage));
