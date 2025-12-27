# 🚀 Quick Start & Troubleshooting Guide

## ✅ Step 1: Test the API

**Open this file first:** `test.html`

This will test all API endpoints and show you which one works. You should see:
- ✅ SUCCESS! for at least one endpoint
- Country count (usually 250+)
- Response time

**If all fail:** Your network might be blocking the API. Try:
1. Disable any ad blockers
2. Check firewall settings
3. Try a different network

---

## ✅ Step 2: Open the Main App

**Open:** `index.html`

### What You Should See:

1. **Loading Screen** (2 seconds) with spinner
2. **Hero Section** with gradient background and animated globe emoji
3. **3D Globe Section** (may take 5-10 seconds to load texture)
4. **Country Cards** appearing in a grid

### Browser Console (F12):

You should see these logs:
```
🚀 App initializing...
🎨 Initializing theme...
📜 Initializing scroll effects...
🔢 Initializing counters...
💀 Showing skeleton cards...
🌍 Fetching countries...
Trying endpoint 1/3: https://restcountries.com/v2/all
✅ Successfully loaded from: https://restcountries.com/v2/all
✅ Loaded 250 countries
🎨 Rendering countries...
⭐ Updating favorites...
👂 Initializing event listeners...
🌐 Initializing 3D globe...
✅ App initialized successfully!
```

---

## 🧪 Step 3: Test Each Feature

### 1. **Dark Mode Toggle** 🌙
- Click the moon/sun button in top-right corner
- Background should change from light to dark
- Theme preference is saved in localStorage

**If not working:**
- Open console and type: `theme.toggle()`
- Check if button exists in DOM

### 2. **Search** 🔍
- Type "brazil" in the search box
- Countries should filter instantly
- Counter should update (e.g., "Showing 1 countries")
- Clear button (×) should appear

**If not working:**
- Check console for errors
- Try: `search.filter()`

### 3. **Filter by Region** 🌍
- Select "Americas" from region dropdown
- Only American countries should show
- Try other regions: Africa, Asia, Europe, Oceania

### 4. **Sort** ↕️
- Select different sort options
- Watch countries reorder
- Options: Name (A-Z/Z-A), Population (High-Low/Low-High)

### 5. **Country Cards** 🃏
- Click any country card
- Modal should open with details
- Click bordering countries to navigate
- Press Escape or click × to close

### 6. **Favorites** ⭐
- Click the star icon on any country card
- Star should fill and glow
- Badge counter in navigation should increase
- Scroll to "My Favorites" section to see saved countries

### 7. **Geolocation** 📍
- Click "Where Am I?" button
- Browser will ask for location permission
- Your country should open in a modal
- Toast notification should show your country name

### 8. **3D Globe** 🌐
- Scroll to "Interactive 3D Globe" section
- Wait for Earth texture to load (5-10 seconds)
- Drag to rotate
- Scroll to zoom
- Click "Reset View" to center
- Click "Pause Rotation" to stop auto-rotation

**If globe not loading:**
- Check console: `console.log('THREE:', window.THREE)`
- If undefined: Three.js didn't load from CDN
- Try opening in a different browser

### 9. **Scroll Features** 📜
- Scroll down the page
- Progress bar should fill at the top
- Back to top button (↑) should appear
- Header stays sticky

---

## ❌ Common Issues & Fixes

### Issue 1: "Countries not loading"

**Symptoms:** Skeleton cards showing indefinitely

**Fix:**
```javascript
// Open console (F12) and run:
fetch('https://restcountries.com/v2/all')
  .then(r => r.json())
  .then(d => console.log('Countries:', d.length))
  .catch(e => console.error('API Error:', e))
```

If this fails, your network is blocking the API.

**Solutions:**
- Use a VPN
- Try mobile hotspot
- Contact network admin

### Issue 2: "Dark mode not working"

**Fix:**
```javascript
// Open console and type:
document.documentElement.setAttribute('data-theme', 'dark')
```

If this works, the button might not be connected. Refresh the page.

### Issue 3: "Search not responding"

**Fix:**
```javascript
// Check if countries loaded:
console.log('Countries loaded:', state.allCountries.length)

// If 0, countries didn't load
// If >0, try filtering manually:
search.filter()
```

### Issue 4: "Globe shows loading forever"

**Possible causes:**
1. Three.js didn't load
2. Texture URL blocked
3. WebGL not supported

**Check:**
```javascript
console.log('THREE:', !!window.THREE)
console.log('WebGL:', !!document.createElement('canvas').getContext('webgl'))
```

**Fix:**
- Try Chrome or Firefox (better WebGL support)
- Update graphics drivers
- Disable hardware acceleration in browser settings

### Issue 5: "Modal not opening"

**Fix:**
```javascript
// Click a country card, then check:
console.log('Modal active:', elements.modal.classList.contains('active'))

// Force open modal for testing:
const testCountry = state.allCountries[0]
modal.open(testCountry)
```

---

## 🎯 Performance Check

### Run Lighthouse Audit:

1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select all categories
4. Click "Generate report"

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## 🔧 Manual Testing Checklist

- [ ] Loading screen appears and disappears
- [ ] Hero section displays with animated elements
- [ ] Stats counters animate (195, 7900, 180)
- [ ] "Start Exploring" button scrolls to countries
- [ ] "Where Am I?" asks for permission
- [ ] Dark mode toggles correctly
- [ ] Search filters countries instantly
- [ ] Region filter works
- [ ] Sort changes order
- [ ] Country cards have hover effects
- [ ] Clicking card opens modal
- [ ] Modal shows correct data
- [ ] Bordering countries navigation works
- [ ] Star button adds to favorites
- [ ] Favorites badge updates
- [ ] Favorites section shows saved countries
- [ ] 3D globe rotates and is interactive
- [ ] Reset globe button works
- [ ] Pause rotation button works
- [ ] Back to top button appears on scroll
- [ ] Scroll progress bar fills
- [ ] Everything responsive on mobile (test at 375px width)
- [ ] No console errors

---

## 📱 Mobile Testing

### Resize browser to 375px width:

1. Open DevTools (F12)
2. Click device toggle (phone icon)
3. Select iPhone or custom size
4. Check:
   - Navigation is readable
   - Buttons are touch-friendly
   - Cards stack vertically
   - Search bar is full width
   - Globe scales down
   - Modal fits screen

---

## 🐛 Still Having Issues?

### Get Detailed Logs:

Open console and run:
```javascript
// Check state
console.log('State:', {
  countriesLoaded: state.allCountries.length,
  filteredCount: state.filteredCountries.length,
  favorites: state.favorites.length,
  theme: state.currentTheme
})

// Check elements
console.log('Elements:', {
  searchInput: !!elements.searchInput,
  countriesGrid: !!elements.countriesGrid,
  themeToggle: !!elements.themeToggle,
  modal: !!elements.modal
})

// Test features
console.log('Features:', {
  themeWorks: typeof theme.toggle === 'function',
  searchWorks: typeof search.filter === 'function',
  favoritesWorks: typeof favorites.add === 'function'
})
```

Copy the output and check:
- Are all elements found?
- Are countries loaded?
- Are functions available?

---

## ✅ Success Indicators

If everything works, you should be able to:

1. ✅ See 250+ country cards
2. ✅ Toggle dark mode smoothly
3. ✅ Search and find "Brazil" instantly
4. ✅ Filter to only "Americas" (35 countries)
5. ✅ Star countries and see them in Favorites
6. ✅ Rotate the 3D globe with mouse
7. ✅ Open country modals with details
8. ✅ Navigate between bordering countries
9. ✅ Use "Where Am I?" to detect location
10. ✅ Scroll smoothly with progress bar

---

## 💡 Tips

- **Best browsers:** Chrome, Firefox, Edge (latest versions)
- **Minimum screen:** 320px width
- **Internet:** Required for API and CDN resources
- **JavaScript:** Must be enabled
- **Cookies:** Required for localStorage (theme, favorites)

---

**Need more help? Check the browser console for specific error messages!** 🔍
