/**
 * ============================================
 * GLOBAL EXPLORER - Country Information App
 * ============================================
 * Features:
 * - 3D Interactive Globe with Three.js
 * - Search, Filter, and Sort countries
 * - Dark Mode with persistence
 * - Geolocation support
 * - Favorites system with localStorage
 * - Responsive animations and micro-interactions
 * ============================================
 */

'use strict';

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  allCountries: [],
  filteredCountries: [],
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  currentTheme: localStorage.getItem('theme') || 'light',
  isLoading: false,
  globe: null,
  autoRotate: true,
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  loadingScreen: document.getElementById('loading-screen'),
  countriesGrid: document.getElementById('countries-grid'),
  skeletonCards: document.getElementById('skeleton-cards'),
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  regionFilter: document.getElementById('region-filter'),
  sortFilter: document.getElementById('sort-filter'),
  resultsCount: document.getElementById('results-count'),
  emptyState: document.getElementById('empty-state'),
  themeToggle: document.getElementById('theme-toggle'),
  exploreBtn: document.getElementById('explore-btn'),
  whereAmIBtn: document.getElementById('where-am-i-btn'),
  favoritesGrid: document.getElementById('favorites-grid'),
  favoritesCount: document.getElementById('favorites-count'),
  modal: document.getElementById('country-modal'),
  modalBody: document.getElementById('modal-body'),
  modalClose: document.getElementById('modal-close'),
  toast: document.getElementById('toast'),
  backToTop: document.getElementById('back-to-top'),
  scrollProgress: document.getElementById('scroll-progress'),
  header: document.getElementById('header'),
  globeCanvas: document.getElementById('globe-canvas'),
  globeLoading: document.getElementById('globe-loading'),
  resetGlobe: document.getElementById('reset-globe'),
  toggleRotation: document.getElementById('toggle-rotation'),
};

// ============================================
// API CONFIGURATION
// ============================================
const API = {
  // Try multiple API endpoints as fallbacks
  ENDPOINTS: [
    'https://restcountries.com/v3.1/all',
    'https://restcountries.com/v2/all',
    'https://api.allorigins.win/raw?url=https://restcountries.com/v3.1/all',
    'https://raw.githubusercontent.com/mledoze/countries/master/countries.json',
    'https://restcountries.eu/rest/v2/all'
  ],
  BASE_URL_V2: 'https://restcountries.com/v2',
  BASE_URL_V3: 'https://restcountries.com/v3.1',
  GEOCODE_URL: 'https://api.bigdatacloud.net/data/reverse-geocode-client',

  async fetchJSON(url, errorMsg = 'Something went wrong') {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getAllCountries() {
    // Try each endpoint until one works
    for (let i = 0; i < this.ENDPOINTS.length; i++) {
      const endpoint = this.ENDPOINTS[i];
      console.log(`Trying endpoint ${i + 1}/${this.ENDPOINTS.length}: ${endpoint}`);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Check if v3.1 API (needs conversion)
        if (endpoint.includes('v3.1') || endpoint.includes('github')) {
          console.log('✅ Using v3.1 format - converting...');
          return data.map(country => {
            // Extract languages - v3.1 format is { eng: "English", fra: "French" }
            const languages = country.languages ?
              Object.values(country.languages).map(lang => ({ name: lang })) :
              [];

            // Extract currencies - v3.1 format is { USD: { name: "US Dollar", symbol: "$" } }
            const currencies = country.currencies ?
              Object.values(country.currencies).map(curr => ({
                name: curr.name || curr,
                symbol: curr.symbol || ''
              })) :
              [];

            // Generate flag URL from country code if not available
            const countryCode = (country.cca2 || country.alpha2Code || '').toLowerCase();
            const flagUrl = country.flags?.png ||
                          country.flags?.svg ||
                          (countryCode ? `https://flagcdn.com/w320/${countryCode}.png` : '');

            return {
              name: country.name?.common || country.name?.official || country.name,
              alpha2Code: country.cca2 || country.alpha2Code || '',
              alpha3Code: country.cca3 || country.alpha3Code || '',
              capital: Array.isArray(country.capital) ? country.capital[0] : (country.capital || 'N/A'),
              region: country.region || 'Unknown',
              subregion: country.subregion || 'Unknown',
              population: country.population || country.area * 1000 || 1000000, // Estimate from area if not available
              area: country.area || 0,
              flag: flagUrl,
              flags: {
                png: flagUrl,
                svg: country.flags?.svg || flagUrl
              },
              languages: languages,
              currencies: currencies,
              borders: country.borders || []
            };
          });
        }

        // v2 API - use directly
        console.log(`✅ Successfully loaded ${data.length} countries from: ${endpoint}`);
        return data;

      } catch (error) {
        console.warn(`❌ Failed to load from ${endpoint}:`, error.message);

        // If this is the last endpoint, use fallback data
        if (i === this.ENDPOINTS.length - 1) {
          console.warn('⚠️ All API endpoints failed. Using fallback data...');
          if (typeof FALLBACK_COUNTRIES !== 'undefined') {
            console.log('✅ Loaded ' + FALLBACK_COUNTRIES.length + ' countries from fallback data');
            return FALLBACK_COUNTRIES;
          }
          throw new Error('All API endpoints failed and no fallback data available. Please check your internet connection.');
        }
      }
    }
  },

  async getCountryByName(name) {
    const endpoints = [
      `${this.BASE_URL_V3}/name/${name}`,
      `${this.BASE_URL_V2}/name/${name}`,
      `https://restcountries.eu/rest/v2/name/${name}`
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) continue;

        const data = await response.json();
        console.log(`✅ Found country by name from: ${endpoint}`);

        // Convert v3.1 format if needed
        if (endpoint.includes('v3.1')) {
          return data.map(country => {
            const languages = country.languages ?
              Object.values(country.languages).map(lang => ({ name: lang })) :
              [];

            const currencies = country.currencies ?
              Object.values(country.currencies).map(curr => ({
                name: curr.name || curr,
                symbol: curr.symbol || ''
              })) :
              [];

            const countryCode = (country.cca2 || country.alpha2Code || '').toLowerCase();
            const flagUrl = country.flags?.png ||
                          country.flags?.svg ||
                          (countryCode ? `https://flagcdn.com/w320/${countryCode}.png` : '');

            return {
              name: country.name.common,
              alpha2Code: country.cca2,
              alpha3Code: country.cca3,
              capital: country.capital?.[0] || 'N/A',
              region: country.region,
              subregion: country.subregion,
              population: country.population || country.area * 1000 || 1000000,
              area: country.area,
              flag: flagUrl,
              flags: {
                png: flagUrl,
                svg: country.flags?.svg || flagUrl
              },
              languages: languages,
              currencies: currencies,
              borders: country.borders || []
            };
          });
        }

        return data;
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}`);
      }
    }
    throw new Error('Country not found in any API');
  },

  async getCountryByCode(code) {
    const endpoints = [
      `${this.BASE_URL_V3}/alpha/${code}`,
      `${this.BASE_URL_V2}/alpha/${code}`,
      `https://restcountries.eu/rest/v2/alpha/${code}`
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) continue;

        const data = await response.json();
        console.log(`✅ Found country by code from: ${endpoint}`);

        // Convert v3.1 format if needed
        if (endpoint.includes('v3.1')) {
          // v3.1 returns a single object, not array
          const country = Array.isArray(data) ? data[0] : data;

          const languages = country.languages ?
            Object.values(country.languages).map(lang => ({ name: lang })) :
            [];

          const currencies = country.currencies ?
            Object.values(country.currencies).map(curr => ({
              name: curr.name || curr,
              symbol: curr.symbol || ''
            })) :
            [];

          const countryCode = (country.cca2 || country.alpha2Code || '').toLowerCase();
          const flagUrl = country.flags?.png ||
                        country.flags?.svg ||
                        (countryCode ? `https://flagcdn.com/w320/${countryCode}.png` : '');

          return {
            name: country.name.common,
            alpha2Code: country.cca2,
            alpha3Code: country.cca3,
            capital: country.capital?.[0] || 'N/A',
            region: country.region,
            subregion: country.subregion,
            population: country.population || country.area * 1000 || 1000000,
            area: country.area,
            flag: flagUrl,
            flags: {
              png: flagUrl,
              svg: country.flags?.svg || flagUrl
            },
            languages: languages,
            currencies: currencies,
            borders: country.borders || []
          };
        }

        return data;
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}`);
      }
    }
    throw new Error('Country not found in any API');
  },

  async getGeolocation(lat, lng) {
    return this.fetchJSON(
      `${this.GEOCODE_URL}?latitude=${lat}&longitude=${lng}`,
      'Failed to get location'
    );
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const utils = {
  formatPopulation(pop) {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(1)}M`;
    } else if (pop >= 1000) {
      return `${(pop / 1000).toFixed(1)}K`;
    }
    return pop.toString();
  },

  debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  animateValue(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  },
};

// ============================================
// LOADING & UI STATE
// ============================================
const ui = {
  hideLoadingScreen() {
    setTimeout(() => {
      elements.loadingScreen?.classList.add('hidden');
    }, 1000);
  },

  showSkeletonCards() {
    if (elements.skeletonCards) {
      elements.skeletonCards.style.display = 'contents';
    }
  },

  hideSkeletonCards() {
    if (elements.skeletonCards) {
      elements.skeletonCards.style.display = 'none';
    }
  },

  showEmptyState() {
    if (elements.emptyState) {
      elements.emptyState.style.display = 'block';
    }
  },

  hideEmptyState() {
    if (elements.emptyState) {
      elements.emptyState.style.display = 'none';
    }
  },

  updateResultsCount(count) {
    if (elements.resultsCount) {
      elements.resultsCount.textContent = count;
    }
  },

  showToast(message, icon = '✓') {
    if (!elements.toast) return;

    const toastIcon = elements.toast.querySelector('.toast__icon');
    const toastMessage = elements.toast.querySelector('.toast__message');

    if (toastIcon) toastIcon.textContent = icon;
    if (toastMessage) toastMessage.textContent = message;

    elements.toast.classList.add('active');

    setTimeout(() => {
      elements.toast.classList.remove('active');
    }, 3000);
  },
};

// ============================================
// THEME MANAGEMENT
// ============================================
const theme = {
  init() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    this.updateThemeIcon();
  },

  toggle() {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    localStorage.setItem('theme', state.currentTheme);
    this.updateThemeIcon();
  },

  updateThemeIcon() {
    const icon = elements.themeToggle?.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = state.currentTheme === 'light' ? '🌙' : '☀️';
    }
  },
};

// ============================================
// FAVORITES MANAGEMENT
// ============================================
const favorites = {
  add(countryCode) {
    if (!state.favorites.includes(countryCode)) {
      state.favorites.push(countryCode);
      this.save();
      ui.showToast('Added to favorites', '⭐');
      this.updateUI();
    }
  },

  remove(countryCode) {
    state.favorites = state.favorites.filter((code) => code !== countryCode);
    this.save();
    ui.showToast('Removed from favorites', '🗑️');
    this.updateUI();
  },

  toggle(countryCode) {
    if (state.favorites.includes(countryCode)) {
      this.remove(countryCode);
    } else {
      this.add(countryCode);
    }
  },

  isFavorite(countryCode) {
    return state.favorites.includes(countryCode);
  },

  save() {
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  },

  updateUI() {
    if (elements.favoritesCount) {
      elements.favoritesCount.textContent = state.favorites.length;
    }
    this.renderFavorites();
  },

  renderFavorites() {
    if (!elements.favoritesGrid) return;

    if (state.favorites.length === 0) {
      elements.favoritesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⭐</div>
          <h3 class="empty-state__title">No favorites yet</h3>
          <p class="empty-state__text">Click the star icon on any country card to add it to your favorites</p>
        </div>
      `;
      return;
    }

    const favoriteCountries = state.allCountries.filter((country) =>
      state.favorites.includes(country.alpha3Code)
    );

    elements.favoritesGrid.innerHTML = favoriteCountries
      .map((country) => countryCard.create(country))
      .join('');
  },
};

// ============================================
// COUNTRY CARD COMPONENT
// ============================================
const countryCard = {
  create(country) {
    const isFav = favorites.isFavorite(country.alpha3Code);

    return `
      <article class="country-card" data-country="${country.alpha3Code}" style="animation-delay: ${Math.random() * 0.3}s">
        <img
          class="country-card__flag"
          src="${country.flag || country.flags?.png}"
          alt="${country.name} flag"
          loading="lazy"
        />
        <div class="country-card__content">
          <div class="country-card__header">
            <div>
              <h3 class="country-card__name">${country.name}</h3>
            </div>
            <button
              class="country-card__favorite ${isFav ? 'active' : ''}"
              data-code="${country.alpha3Code}"
              aria-label="${isFav ? 'Remove from' : 'Add to'} favorites"
            >
              ${isFav ? '⭐' : '☆'}
            </button>
          </div>
          <span class="country-card__region">${country.region}</span>
          <div class="country-card__info">
            <div class="country-card__row">
              <span class="country-card__icon">👫</span>
              <span>${utils.formatPopulation(country.population)} people</span>
            </div>
            <div class="country-card__row">
              <span class="country-card__icon">🗣️</span>
              <span>${country.languages?.[0]?.name || 'N/A'}</span>
            </div>
            <div class="country-card__row">
              <span class="country-card__icon">💰</span>
              <span>${country.currencies?.[0]?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  },
};

// ============================================
// COUNTRY MODAL
// ============================================
const modal = {
  open(country) {
    if (!elements.modal || !elements.modalBody) return;

    const borderingCountries = country.borders
      ? state.allCountries.filter((c) => country.borders.includes(c.alpha3Code))
      : [];

    elements.modalBody.innerHTML = `
      <img
        src="${country.flag || country.flags?.png}"
        alt="${country.name} flag"
        style="width: 100%; height: 300px; object-fit: cover; border-radius: 1rem; margin-bottom: 2rem;"
      />
      <h2 id="modal-title" style="font-family: var(--font-heading); font-size: 3.5rem; margin-bottom: 1rem;">${country.name}</h2>
      <p style="font-size: 1.8rem; color: var(--color-text-light); margin-bottom: 3rem;">${country.region} • ${country.subregion || 'N/A'}</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <div>
          <h3 style="font-size: 1.6rem; color: var(--color-text-light); margin-bottom: 1rem;">Capital</h3>
          <p style="font-size: 2rem; font-weight: 600;">${country.capital || 'N/A'}</p>
        </div>
        <div>
          <h3 style="font-size: 1.6rem; color: var(--color-text-light); margin-bottom: 1rem;">Population</h3>
          <p style="font-size: 2rem; font-weight: 600;">${country.population.toLocaleString()}</p>
        </div>
        <div>
          <h3 style="font-size: 1.6rem; color: var(--color-text-light); margin-bottom: 1rem;">Area</h3>
          <p style="font-size: 2rem; font-weight: 600;">${country.area?.toLocaleString() || 'N/A'} km²</p>
        </div>
        <div>
          <h3 style="font-size: 1.6rem; color: var(--color-text-light); margin-bottom: 1rem;">Languages</h3>
          <p style="font-size: 2rem; font-weight: 600;">${country.languages?.map(l => l.name).join(', ') || 'N/A'}</p>
        </div>
      </div>

      ${borderingCountries.length > 0 ? `
        <div style="margin-top: 3rem;">
          <h3 style="font-size: 2rem; margin-bottom: 2rem;">Bordering Countries</h3>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${borderingCountries.map(c => `
              <button
                class="btn btn--secondary"
                style="padding: 1rem 2rem; font-size: 1.4rem;"
                onclick="modal.openByCode('${c.alpha3Code}')"
              >
                ${c.name}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    elements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!elements.modal) return;
    elements.modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  async openByCode(code) {
    try {
      const country = state.allCountries.find((c) => c.alpha3Code === code);
      if (country) {
        this.open(country);
      }
    } catch (error) {
      ui.showToast('Failed to load country details', '❌');
    }
  },
};

// ============================================
// SEARCH & FILTER
// ============================================
const search = {
  filter() {
    const searchTerm = elements.searchInput?.value.toLowerCase() || '';
    const region = elements.regionFilter?.value || 'all';
    const sortBy = elements.sortFilter?.value || 'name';

    let filtered = [...state.allCountries];

    // Search
    if (searchTerm) {
      filtered = filtered.filter((country) =>
        country.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by region
    if (region !== 'all') {
      filtered = filtered.filter((country) => country.region === region);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'population':
          return b.population - a.population;
        case 'population-asc':
          return a.population - b.population;
        default:
          return 0;
      }
    });

    state.filteredCountries = filtered;
    this.render();
    this.updateClearButton();
  },

  render() {
    if (!elements.countriesGrid) return;

    ui.hideSkeletonCards();

    if (state.filteredCountries.length === 0) {
      ui.showEmptyState();
      ui.updateResultsCount(0);
      return;
    }

    ui.hideEmptyState();
    ui.updateResultsCount(state.filteredCountries.length);

    const html = state.filteredCountries
      .map((country) => countryCard.create(country))
      .join('');

    elements.countriesGrid.innerHTML = html;
  },

  updateClearButton() {
    if (!elements.searchClear || !elements.searchInput) return;

    if (elements.searchInput.value) {
      elements.searchClear.classList.add('visible');
    } else {
      elements.searchClear.classList.remove('visible');
    }
  },

  clear() {
    if (elements.searchInput) {
      elements.searchInput.value = '';
    }
    this.updateClearButton();
    this.filter();
  },
};

// ============================================
// GEOLOCATION
// ============================================
const geolocation = {
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },

  async findMyCountry() {
    try {
      console.log('📍 Starting geolocation...');
      ui.showToast('Getting your location...', '📍');

      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      console.log(`📍 Got coordinates: ${latitude}, ${longitude}`);

      const geoData = await API.getGeolocation(latitude, longitude);
      console.log('📍 Geolocation data:', geoData);

      const countryCode = geoData.countryCode;
      const countryName = geoData.countryName;
      console.log('📍 Country code:', countryCode);
      console.log('📍 Country name:', countryName);

      if (!countryCode && !countryName) {
        throw new Error('Could not determine country from location');
      }

      // Try to find country by code (case-insensitive)
      let country = state.allCountries.find((c) => {
        const alpha2Match = c.alpha2Code && c.alpha2Code.toUpperCase() === countryCode?.toUpperCase();
        const alpha3Match = c.alpha3Code && c.alpha3Code.toUpperCase() === countryCode?.toUpperCase();
        return alpha2Match || alpha3Match;
      });

      // If not found by code, try by name
      if (!country && countryName) {
        console.log('📍 Trying to find by name:', countryName);
        country = state.allCountries.find((c) =>
          c.name.toLowerCase() === countryName.toLowerCase() ||
          c.name.toLowerCase().includes(countryName.toLowerCase()) ||
          countryName.toLowerCase().includes(c.name.toLowerCase())
        );
      }

      if (country) {
        console.log('✅ Found country:', country.name);
        ui.showToast(`You are in ${country.name}!`, '🌍');
        modal.open(country);

        // Scroll to countries section
        setTimeout(() => {
          document.getElementById('countries')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        console.error('❌ Country not found in database. Code:', countryCode, 'Name:', countryName);
        console.log('📊 Available countries:', state.allCountries.length);
        console.log('📊 First country sample:', state.allCountries[0]);
        throw new Error(`Country "${countryName || countryCode}" not found in database`);
      }
    } catch (error) {
      console.error('❌ Geolocation error:', error);

      let errorMessage = 'Failed to get your location';

      if (error.code === 1 || error.message.includes('denied')) {
        errorMessage = 'Please allow location access in your browser';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out';
      } else if (error.message) {
        errorMessage = error.message;
      }

      ui.showToast(errorMessage, '❌');
    }
  },
};

// ============================================
// 3D GLOBE WITH THREE.JS
// ============================================
const globe = {
  scene: null,
  camera: null,
  renderer: null,
  globe: null,
  controls: null,
  animationId: null,

  init() {
    console.log('🌐 Globe.init() called');
    console.log('THREE available?', !!window.THREE);
    console.log('Canvas element?', !!elements.globeCanvas);

    if (!window.THREE) {
      console.error('❌ THREE.js not loaded');
      if (elements.globeLoading) {
        elements.globeLoading.innerHTML = '<p style="color: var(--color-text-light);">3D Globe library not loaded. Please check your internet connection.</p>';
      }
      return;
    }

    if (!elements.globeCanvas) {
      console.error('❌ Globe canvas not found');
      return;
    }

    try {
      console.log('✅ Starting globe initialization...');

      // Scene setup
      this.scene = new THREE.Scene();

      // Set background based on theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      this.scene.background = new THREE.Color(isDark ? 0x0f0f1e : 0xf8f9fa);
      console.log('✅ Scene created');

      // Camera setup
      const width = elements.globeCanvas.parentElement.clientWidth;
      const height = elements.globeCanvas.parentElement.clientHeight;
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.z = 2.5;

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        canvas: elements.globeCanvas,
        antialias: true,
        alpha: true,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Create globe
      const geometry = new THREE.SphereGeometry(1, 64, 64);

      // Load Earth texture
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
        () => {
          // Hide loading when texture is loaded
          console.log('✅ Globe texture loaded successfully');
          elements.globeLoading?.classList.add('hidden');
        },
        undefined,
        (error) => {
          console.error('❌ Failed to load globe texture:', error);
          if (elements.globeLoading) {
            elements.globeLoading.innerHTML = '<p style="color: var(--color-text-light);">Failed to load 3D globe texture</p>';
          }
        }
      );

      const material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpScale: 0.05,
        shininess: 5,
      });

      this.globe = new THREE.Mesh(geometry, material);
      this.scene.add(this.globe);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      pointLight.position.set(5, 3, 5);
      this.scene.add(pointLight);

      // OrbitControls
      console.log('OrbitControls available?', !!window.THREE.OrbitControls);
      if (window.THREE.OrbitControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        console.log('✅ OrbitControls initialized');
      } else {
        console.warn('⚠️ OrbitControls not available');
      }

      // Start animation
      console.log('✅ Starting globe animation...');
      this.animate();

      // Handle resize
      window.addEventListener('resize', () => this.onResize());

      console.log('✅ Globe initialization complete!');

    } catch (error) {
      console.error('❌ Globe initialization error:', error);
      if (elements.globeLoading) {
        elements.globeLoading.innerHTML = `<p style="color: var(--color-danger);">Error: ${error.message}</p>`;
      }
    }
  },

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  onResize() {
    if (!this.camera || !this.renderer || !elements.globeCanvas) return;

    const width = elements.globeCanvas.parentElement.clientWidth;
    const height = elements.globeCanvas.parentElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  reset() {
    if (!this.camera || !this.controls) return;

    this.camera.position.set(0, 0, 2.5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    ui.showToast('Globe view reset', '🔄');
  },

  toggleRotation() {
    if (!this.controls) return;

    state.autoRotate = !state.autoRotate;
    this.controls.autoRotate = state.autoRotate;

    const btn = elements.toggleRotation;
    if (btn) {
      btn.innerHTML = `<span>${state.autoRotate ? '⏸️ Pause' : '▶️ Play'} Rotation</span>`;
    }
  },

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
};

// ============================================
// SCROLL EFFECTS
// ============================================
const scrollEffects = {
  init() {
    this.updateScrollProgress();
    this.updateBackToTop();
    this.updateHeader();

    window.addEventListener('scroll', () => {
      this.updateScrollProgress();
      this.updateBackToTop();
      this.updateHeader();
    });
  },

  updateScrollProgress() {
    if (!elements.scrollProgress) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    elements.scrollProgress.style.transform = `scaleX(${progress / 100})`;
  },

  updateBackToTop() {
    if (!elements.backToTop) return;

    if (window.pageYOffset > 500) {
      elements.backToTop.classList.add('visible');
    } else {
      elements.backToTop.classList.remove('visible');
    }
  },

  updateHeader() {
    if (!elements.header) return;

    const scrollTop = window.pageYOffset;

    if (scrollTop > 100) {
      elements.header.style.background = 'var(--glass-bg)';
    } else {
      elements.header.style.background = 'var(--glass-bg)';
    }
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
};

// ============================================
// ANIMATED COUNTERS
// ============================================
const counters = {
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            utils.animateValue(entry.target, 0, target, 2000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat__number').forEach((el) => {
      observer.observe(el);
    });
  },
};

// ============================================
// EVENT LISTENERS
// ============================================
const events = {
  init() {
    // Theme toggle
    elements.themeToggle?.addEventListener('click', () => theme.toggle());

    // Search
    elements.searchInput?.addEventListener(
      'input',
      utils.debounce(() => search.filter())
    );
    elements.searchClear?.addEventListener('click', () => search.clear());

    // Filters
    elements.regionFilter?.addEventListener('change', () => search.filter());
    elements.sortFilter?.addEventListener('change', () => search.filter());

    // Buttons
    elements.exploreBtn?.addEventListener('click', () => {
      document.getElementById('countries')?.scrollIntoView({ behavior: 'smooth' });
    });
    elements.whereAmIBtn?.addEventListener('click', () => geolocation.findMyCountry());

    // Globe controls
    elements.resetGlobe?.addEventListener('click', () => globe.reset());
    elements.toggleRotation?.addEventListener('click', () => globe.toggleRotation());

    // Modal
    elements.modalClose?.addEventListener('click', () => modal.close());
    elements.modal?.querySelector('.modal__overlay')?.addEventListener('click', () => modal.close());

    // Back to top
    elements.backToTop?.addEventListener('click', () => scrollEffects.scrollToTop());

    // Smooth scroll for nav links
    document.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Event delegation for country cards
    document.addEventListener('click', (e) => {
      // Favorite button
      if (e.target.closest('.country-card__favorite')) {
        e.stopPropagation();
        const btn = e.target.closest('.country-card__favorite');
        const code = btn.dataset.code;
        favorites.toggle(code);

        // Update button
        const isFav = favorites.isFavorite(code);
        btn.classList.toggle('active', isFav);
        btn.textContent = isFav ? '⭐' : '☆';
        btn.setAttribute('aria-label', `${isFav ? 'Remove from' : 'Add to'} favorites`);
      }

      // Country card
      if (e.target.closest('.country-card') && !e.target.closest('.country-card__favorite')) {
        const card = e.target.closest('.country-card');
        const code = card.dataset.country;
        const country = state.allCountries.find((c) => c.alpha3Code === code);
        if (country) modal.open(country);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
        modal.close();
      }
    });
  },
};

// ============================================
// INITIALIZATION
// ============================================
const app = {
  async init() {
    console.log('🚀 App initializing...');

    try {
      // Initialize theme
      console.log('🎨 Initializing theme...');
      theme.init();

      // Initialize scroll effects
      console.log('📜 Initializing scroll effects...');
      scrollEffects.init();

      // Initialize animated counters
      console.log('🔢 Initializing counters...');
      counters.init();

      // Show skeleton cards
      console.log('💀 Showing skeleton cards...');
      ui.showSkeletonCards();

      // Fetch all countries
      console.log('🌍 Fetching countries...');
      state.allCountries = await API.getAllCountries();
      state.filteredCountries = [...state.allCountries];
      console.log(`✅ Loaded ${state.allCountries.length} countries`);

      // Render countries
      console.log('🎨 Rendering countries...');
      search.render();

      // Update favorites UI
      console.log('⭐ Updating favorites...');
      favorites.updateUI();

      // Initialize event listeners
      console.log('👂 Initializing event listeners...');
      events.init();

      // Initialize 3D globe
      console.log('🌐 Initializing 3D globe...');
      setTimeout(() => {
        globe.init();
      }, 500);

      // Hide loading screen
      console.log('✅ App initialized successfully!');
      ui.hideLoadingScreen();

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      ui.hideLoadingScreen();
      ui.showToast('Failed to load countries. Please refresh.', '❌');

      // Show error in the UI
      if (elements.countriesGrid) {
        elements.countriesGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 5rem;">
            <h2 style="color: var(--color-danger); font-size: 3rem; margin-bottom: 2rem;">⚠️ Error Loading Countries</h2>
            <p style="font-size: 1.8rem; color: var(--color-text-light); margin-bottom: 2rem;">${error.message}</p>
            <button onclick="location.reload()" style="padding: 1.5rem 3rem; font-size: 1.6rem; background: var(--gradient-primary); color: white; border: none; border-radius: 1rem; cursor: pointer;">
              🔄 Reload Page
            </button>
          </div>
        `;
      }
    }
  },
};

// ============================================
// START APPLICATION
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  globe.destroy();
});
