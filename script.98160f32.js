//SCRIPT COMUNI

const hamburger = document.querySelector('.hamburger');
const dropdown = document.querySelector('.dropdown');

function closeDropdown() {
  dropdown.classList.remove('open');
  dropdown.classList.add('closing');
  hamburger.classList.remove('active');
  setTimeout(() => dropdown.classList.remove('closing'), 500);
}

hamburger.onclick = () => {
  if (dropdown.classList.contains('open')) {
    closeDropdown();
  } else {
    dropdown.classList.add('open');
    hamburger.classList.add('active');
  }
};

document.addEventListener('click', function (event) {
  const isClickInsideMenu = dropdown.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideMenu && !isClickOnHamburger && dropdown.classList.contains('open')) {
    closeDropdown();
  }
});

const nav = document.querySelector('nav');

// Funzione per calcolare soglia dinamica
function getScrollThreshold() {
  const width = window.innerWidth;
  if (width < 576) return 80;     // mobile
  if (width < 992) return 150;    // tablet
  return 250;                     // desktop
}

let lastScrollTop = 0;
let threshold = getScrollThreshold();

// Ricalcola soglia se cambia larghezza (responsive)
window.addEventListener('resize', () => {
  threshold = getScrollThreshold();
});

// Scroll handler
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > threshold) {
    nav.style.top = '-70px'; // nascondi
  } else {
    nav.style.top = '0';     // mostra
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


//btn apertura
const indicatoreAperturaElement = document.getElementById('indicatore-apertura');
const pageName = (window.location.pathname.split('/').pop() || 'index.html');
const isEnglishPage = window.location.pathname.includes('/en/');

function getLanguageHref(language) {
  if (language === 'en') {
    return isEnglishPage ? pageName : `en/${pageName}`;
  }

  return isEnglishPage ? `../${pageName}` : pageName;
}

function injectLanguageSwitcher() {
  const headerContainer = document.querySelector('header .container');
  if (!headerContainer || document.querySelector('.language-switcher')) {
    return;
  }

  const switcher = document.createElement('div');
  switcher.className = 'language-switcher';
  switcher.innerHTML = `
    <a class="${isEnglishPage ? '' : 'active'}" href="${getLanguageHref('it')}" lang="it" aria-label="Italiano">IT</a>
    <a class="${isEnglishPage ? 'active' : ''}" href="${getLanguageHref('en')}" lang="en" aria-label="English">EN</a>
  `;

  headerContainer.appendChild(switcher);
}

function isFestivita(data) {
  const festivita = [
    { mese: 1, giorno: 1 }, // Capodanno
    { mese: 1, giorno: 6 }, // Epifania
    { mese: 4, giorno: 25 }, // Festa della Liberazione
    { mese: 5, giorno: 1 }, // Festa dei Lavoratori
    { mese: 6, giorno: 2 }, // Festa della Repubblica
    { mese: 8, giorno: 15 }, // Ferragosto
    { mese: 11, giorno: 1 }, // Ognissanti
    { mese: 12, giorno: 8 }, // Immacolata Concezione
    { mese: 12, giorno: 25 }, // Natale
    { mese: 12, giorno: 26 } // Santo Stefano
  ];

  const pasqua = calcPasqua(data.getFullYear());
  const pasquetta = new Date(pasqua.getTime() + 86400000);
    
  if (data.getMonth() + 1 === pasqua.getMonth() + 1 && data.getDate() === pasqua.getDate()) { 
    return true; // Pasqua
  } else if (data.getMonth() + 1 === pasquetta.getMonth() && data.getDate() === pasquetta.getDate()) {
    return true; // Pasquetta
  } else {
    for (const festivitaItem of festivita) {
      if (data.getMonth() + 1 === festivitaItem.mese && data.getDate() === festivitaItem.giorno) {
        return true; // Altra festività
     }
    }
  }
  return false; // Non è una festività
}

function calcPasqua(anno) {
  const a = anno % 19;
  const b = Math.floor(anno / 100);
  const c = anno % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  const pasqua = new Date(anno, n-1, p + 1);
  return pasqua;
}

injectLanguageSwitcher();

const openingLabels = {
  it: {
    open: 'Aperto ora',
    closed: 'Chiuso ora',
    hours: 'Orari'
  },
  en: {
    open: 'Open now',
    closed: 'Closed now',
    hours: 'Hours'
  }
};

function updateOpeningLabel(text) {
  const openingLabel = document.getElementById('stato-apertura');
  if (openingLabel) {
    openingLabel.innerHTML = '<i class="fas fa-clock"></i> ' + text;
  }
}

setInterval(() => {
  const oraAttuale = new Date();
  const giorno = oraAttuale.getDay();
  const ora = oraAttuale.getHours();

  let statoApertura = ' ';
  const language = isEnglishPage ? 'en' : 'it';

  if (isFestivita(oraAttuale)) {
    statoApertura = openingLabels[language].closed;
    indicatoreAperturaElement.style.background = 'red';
  } else if (giorno >= 1 && giorno <= 5) {
    if (ora >= 8 && ora < 19) {
      statoApertura = openingLabels[language].open;
      indicatoreAperturaElement.style.background = 'green';
    } else {
      statoApertura = openingLabels[language].closed;
      indicatoreAperturaElement.style.background = 'red';
    }
  } else {//Sabato e Domenica//
    statoApertura = openingLabels[language].closed;
    indicatoreAperturaElement.style.background = 'red';
  }

  indicatoreAperturaElement.textContent=statoApertura;
  indicatoreAperturaElement.style.color='#fff';
}, 1000);
//Fine btn-apertura





document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".topnav a").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});










//FINE SCRIPT COMUNI



