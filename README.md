# 🌍 Global Explorer - Interactive Country Information Platform

A stunning, high-performance web application for exploring countries around the world with an interactive 3D globe, real-time data, and modern UI/UX design.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Performance](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen.svg)

## ✨ Features

### 🎨 **Visual Excellence**
- **3D Interactive Globe** powered by Three.js with auto-rotation and zoom controls
- **Modern Glassmorphism Design** with gradient backgrounds and depth effects
- **Smooth Animations** with Intersection Observer for scroll-triggered effects
- **Micro-interactions** on hover, click, and scroll events
- **Responsive Design** optimized for all devices (320px to 2560px+)
- **Dark Mode** with persistent theme preference
- **Loading Skeletons** for enhanced perceived performance
- **Toast Notifications** for user feedback

### 🔍 **Advanced Functionality**
- **Real-time Search** with debounced input for instant country filtering
- **Multi-level Filtering** by region (Africa, Americas, Asia, Europe, Oceania)
- **Flexible Sorting** by name or population (ascending/descending)
- **Geolocation Support** - "Where Am I?" feature to detect user's current country
- **Favorites System** with localStorage persistence
- **Detailed Modal Views** with country statistics and bordering countries
- **Keyboard Navigation** with Escape key support

### ⚡ **Performance Optimized**
- **Lazy Loading** for images with native loading="lazy"
- **Code Splitting** with modular JavaScript architecture
- **Debounced Search** to minimize API calls and re-renders
- **Optimized Animations** using CSS transforms and GPU acceleration
- **Font Preloading** for critical web fonts
- **Resource Preconnect** for faster API requests
- **Efficient DOM Manipulation** with template literals and event delegation

### ♿ **Accessibility (WCAG 2.1 AA)**
- **ARIA Labels** on all interactive elements
- **Keyboard Navigation** throughout the application
- **Skip to Content** link for screen readers
- **Focus Management** in modals and interactive components
- **Semantic HTML5** structure
- **High Color Contrast** ratios (4.5:1 minimum)
- **Alt Text** for all images

### 🔒 **SEO Optimized**
- **Meta Tags** (title, description, keywords)
- **Open Graph** tags for social media sharing
- **Twitter Card** support
- **Structured Data** (JSON-LD) for search engines
- **Canonical URLs** to prevent duplicate content
- **Semantic HTML** for better crawling
- **Mobile-Friendly** design

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls and CDN resources

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/global-explorer.git
   cd global-explorer
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve

   # Using PHP
   php -S localhost:8000
   ```

3. **Access the application**
   - Navigate to `http://localhost:8000`

## 📁 Project Structure

```
global-explorer/
├── index.html          # Main HTML structure
├── style.css           # Comprehensive CSS with animations
├── script.js           # Modular JavaScript application
├── README.md          # Documentation (you are here)
└── img/               # Image assets (optional)
```

## 🛠️ Technologies Used

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables, Grid, Flexbox
- **JavaScript ES6+** - Async/await, modules, classes

### Libraries & APIs
- **Three.js** (v0.160.0) - 3D globe rendering
- **REST Countries API** - Real-time country data
- **BigDataCloud API** - Geolocation services
- **Google Fonts** - Inter & Poppins typefaces

### Key Features Implementation
- **State Management** - Centralized state object
- **Event Delegation** - Efficient event handling
- **Intersection Observer** - Scroll animations
- **LocalStorage API** - Favorites & theme persistence
- **Geolocation API** - User location detection
- **Fetch API** - Async data fetching

## 🎯 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 📊 Performance Metrics

### Lighthouse Scores (Target)
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 95+

### Core Web Vitals
- **FCP (First Contentful Paint):** < 1.5s
- **TTI (Time to Interactive):** < 3s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1

## 🎨 Design System

### Color Palette
```css
Primary: #667eea → #764ba2 (Gradient)
Secondary: #f093fb → #f5576c (Gradient)
Success: #00d4aa
Warning: #ffd93d
Danger: #ff6b6b

Light Theme:
  Background: #f8f9fa
  Surface: #ffffff
  Text: #2d3436

Dark Theme:
  Background: #0f0f1e
  Surface: #1a1a2e
  Text: #eee
```

### Typography
- **Headings:** Poppins (600, 700, 800)
- **Body:** Inter (300, 400, 500, 600)
- **Base Size:** 62.5% (1rem = 10px)

### Spacing Scale
- XS: 0.5rem (5px)
- SM: 1rem (10px)
- MD: 2rem (20px)
- LG: 3rem (30px)
- XL: 5rem (50px)

## 🔧 Customization

### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #color1, #color2);
}
```

### Modifying API Endpoints
Edit API configuration in `script.js`:
```javascript
const API = {
  BASE_URL: 'https://your-api-endpoint',
  // ...
};
```

### Adding New Features
The modular architecture makes it easy to extend:
```javascript
// Example: Add a new feature module
const newFeature = {
  init() {
    // Initialize feature
  },

  // Add methods
};
```

## 🐛 Known Issues

1. **Three.js OrbitControls** - Loading from CDN may occasionally fail. Consider self-hosting for production.
2. **API Rate Limits** - REST Countries API has rate limits. Implement caching for production use.
3. **Safari Backdrop Filter** - May not render perfectly on older Safari versions.

## 🔮 Future Enhancements

- [ ] Add country comparison tool
- [ ] Implement data visualizations (charts, graphs)
- [ ] Add language translations (i18n)
- [ ] Create Progressive Web App (PWA) version
- [ ] Add offline support with Service Workers
- [ ] Implement infinite scroll for countries grid
- [ ] Add advanced search with autocomplete
- [ ] Create print-friendly layouts

## 📝 API Reference

### REST Countries API
```
GET https://restcountries.com/v2/all
GET https://restcountries.com/v2/name/{name}
GET https://restcountries.com/v2/alpha/{code}
```

### BigDataCloud Geolocation API
```
GET https://api.bigdatacloud.net/data/reverse-geocode-client
  ?latitude={lat}&longitude={lng}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **REST Countries API** - For providing comprehensive country data
- **Three.js** - For the amazing 3D rendering library
- **BigDataCloud** - For geolocation services
- **Google Fonts** - For beautiful typography

## 📞 Contact

- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Email:** your.email@example.com
- **Website:** https://yourwebsite.com

## 🌟 Show Your Support

Give a ⭐ if this project helped you!

---

**Built with ❤️ using modern web technologies**

*Last Updated: December 2025*
