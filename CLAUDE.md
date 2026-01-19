# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple HTML5 guitar tuner that uses the Web Audio API for pitch detection. The project consists of two main files:
- `index.html` - Main application with embedded JavaScript for audio capture and UI
- `correlation_worker.js` - Web Worker for computing frequency correlations

## Architecture

The tuner uses a correlation-based pitch detection algorithm:
1. **Audio Capture** - Uses `getUserMedia()` to access microphone and `AudioContext` with `ScriptProcessorNode` to capture audio samples
2. **Frequency Detection** - Web Worker computes correlations between captured audio and test frequencies using complex number calculations
3. **Note Identification** - Main thread analyzes correlation results to identify the dominant frequency and displays note name

### Key Technical Details

- **Test Frequencies**: Generates 90 test frequencies (30 notes × 3 variations each: flat, in-tune, sharp) starting from C2 (65.41 Hz)
- **Correlation Algorithm**: Uses complex number accumulation [real, imaginary] for each test frequency
- **Confidence Threshold**: Only displays notes when magnitude is 10× above average (empirical value)
- **Firefox Workaround**: Stores microphone reference globally to prevent garbage collection (Bug #934512)

## Development

This is a static HTML application with vitest for testing:
- **Testing**: Run `npm test` to execute vitest tests, or open `index.html` directly in a web browser for manual testing
- **Test UI**: Run `npm run test:ui` for interactive test interface
- **Coverage**: Run `npm run test:coverage` for test coverage report
- **Local Development**: Use any static file server or open directly in browser
- **Deployment**: Can be hosted as static files on GitHub Pages or any web server

### Test Structure

- `tests/correlation_worker.test.js` - Tests for the correlation algorithm and frequency detection
- `tests/main_logic.test.js` - Tests for test frequency generation and result interpretation

### Browser Compatibility

Uses prefixed versions of `getUserMedia()` for cross-browser support:
- `navigator.getUserMedia`
- `navigator.webkitGetUserMedia`  
- `navigator.mozGetUserMedia`

## Additional Features

- **Reference Note**: Includes a button to play an E note (82.41 Hz) for tuning reference
- **Visual Display**: Shows detected note name and frequency in Hz