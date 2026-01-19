# Accessible Guitar Tuner 🎸

An accessible, browser-based guitar tuner designed with blind and visually impaired users in mind. Built with the Web Audio API for accurate pitch detection and comprehensive screen reader support.

## ✨ Features

### 🎯 Core Functionality
- **Accurate Pitch Detection** - Uses correlation-based algorithm for precise frequency analysis
- **Real-time Note Identification** - Automatically detects and announces notes as you play
- **Confidence Meter** - Shows detection reliability to help you tune more accurately
- **Reference Tone** - Built-in E note (82.41 Hz) for comparison tuning

### ♿ Accessibility Features (Optimized for Blind Users)
- **Screen Reader Announcements** - Automatic audio announcements of detected notes and frequencies
- **ARIA Live Regions** - Dynamic updates properly announced to assistive technologies
- **Semantic HTML Structure** - Proper heading hierarchy and landmarks for navigation
- **Keyboard Accessible** - Full keyboard navigation with visible focus indicators
- **Error Announcements** - Clear audio feedback for microphone access issues
- **High Contrast Support** - Enhanced visibility in high contrast mode
- **Reduced Motion** - Respects prefers-reduced-motion settings
- **Dark Mode Support** - Automatic dark theme based on system preferences

### 🎨 Modern Design
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Pico.css Styling** - Clean, modern interface with minimal footprint
- **Mobile-First Design** - Optimized touch targets and responsive typography
- **Visual Feedback** - Clear status indicators for listening, errors, and note detection

## 🚀 Live Demo

**Try it now:** [https://barakplasma.github.io/Accessible-guitar-tuner/](https://barakplasma.github.io/Accessible-guitar-tuner/)

## 🛠️ Technical Details

### Algorithm
- Uses correlation-based pitch detection for accurate frequency analysis
- Tests 90 frequencies across 30 notes (C2 to C5) with sharp/flat variations
- Confidence threshold prevents false positives
- Complex number calculations for precise phase correlation

### Technologies
- **Vanilla JavaScript** - No frameworks or dependencies required
- **Web Audio API** - Browser-native audio processing
- **Web Workers** - Offloads computation to prevent UI blocking
- **Pico.css** - Lightweight CSS framework for accessibility
- **Vitest** - Comprehensive test suite (44 tests, 100% passing)

## 📖 How to Use

1. **Allow Microphone Access** - Grant permission when prompted
2. **Play a Note** - Strum a string on your guitar or other instrument
3. **Listen for Announcement** - The tuner will announce the detected note and frequency
4. **Tune Your Instrument** - Adjust until you hear the correct note
5. **Reference Tone** (Optional) - Use the E note button for comparison

### For Screen Reader Users
- Enable your screen reader before opening the tuner
- Make sure note announcements are enabled in your screen reader settings
- The tuner will automatically announce each detected note
- Status updates will inform you of initialization, listening state, and any errors

## 🧪 Development

### Running Tests
```bash
npm test                # Run all tests
npm run test:ui         # Interactive test interface
npm run test:coverage   # Coverage report
```

### Local Development
Simply open `index.html` in a web browser, or use any static file server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# Then open http://localhost:8000
```

### Test Coverage
- **Correlation Algorithm Tests** - Validates pitch detection accuracy
- **Main Logic Tests** - Tests frequency generation and confidence calculation
- **Accessibility Tests** - Ensures screen reader compatibility and keyboard navigation

## 🌐 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires microphone access and Web Audio API support

## 🔧 Customization

### Adjust Sensitivity
Modify the `confidence_threshold` in `index.html` (currently set to 10):
- Lower values = more sensitive (may detect false positives)
- Higher values = less sensitive (may miss weak signals)

### Change Reference Note
Modify the frequency calculation in the `toggle_playing_note()` function

### Adjust Test Frequencies
Edit the frequency generation loop to change the note range or add more variations

## 📝 Architecture

- **`index.html`** - Main application with embedded JavaScript and CSS
- **`correlation_worker.js`** - Web Worker for pitch detection calculations
- **`tests/`** - Comprehensive test suite for all functionality

## 🤝 Contributing

Contributions are welcome! Please ensure all tests pass and maintain accessibility standards.

## 📄 License

MIT License - See [LICENSE.md](LICENSE.md) for details

## 🙏 Acknowledgments

- Based on the original guitar tuner by [Jonathan Bergknoff](http://jonathan.bergknoff.com/journal/making-a-guitar-tuner-html5)
- Enhanced with comprehensive accessibility features
- Styled with [Pico.css](https://picocss.com/)

## 🌟 Key Accessibility Improvements Over Original

- **Screen reader announcements** for all dynamic updates
- **Proper ARIA attributes** throughout the interface
- **Keyboard navigation** with visible focus states
- **Semantic HTML structure** with landmarks
- **Error handling** with accessible messages
- **Status announcements** for initialization and state changes
- **Mobile-responsive** design with accessible touch targets
- **High contrast and reduced motion** support

This accessible version transforms a visual tool into an inclusive experience that works perfectly for blind and visually impaired musicians.