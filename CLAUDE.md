# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

This is a Matrix Digital Rain message generator web application built with vanilla JavaScript, HTML5 Canvas, and CSS. No build system is required - it's designed for direct file serving.

### Local Development Setup

```bash
# Start local development server
python -m http.server 8000
# OR
npx serve .

# Access at http://localhost:8000
```

## Architecture Overview

### Core Components

**Canvas Animation System (`script.js`):**
- Stream-based Matrix rain effect using HTML5 Canvas 2D API
- Progressive message revelation: messages start as 5-character chunks and expand to full lines over 30 seconds
- Real-time character generation with Japanese katakana + ASCII character set
- 20 FPS rendering (50ms intervals) with efficient alpha-overlay canvas clearing

**Message Encoding/Sharing:**
- Base64 + UTF-8 encoding for URL parameter sharing (`?d=<encoded_data>`)
- JSON structure: `{message: "user_text"}`
- Automatic URL decoding on page load with error handling

**Application States:**
1. Input Mode: Message entry form
2. Matrix Mode: Full-screen animation with controls
3. Shared Mode: Animation-only view (accessed via URL parameter)

### Key Configuration Constants

```javascript
// In script.js - frequently modified for customization
const animationDuration = 30000;        // Message progression time
const keywordAppearanceProbability = 0.003; // Message appearance frequency  
const animationDelay = 50;              // Frame interval (20 FPS)
const fontSize = 16;                    // Character size
const keywordColor = '#FFF';            // Message color (white)
const defaultCharColor = '#0F0';        // Matrix rain color (green)
```

### File Structure

- `index.html`: Main page with OGP/Twitter Card meta tags for social sharing
- `script.js`: Complete animation engine and application logic (354 lines)
- `style.css`: Matrix-themed styling with green glow effects and responsive design
- `README.md`: Comprehensive project documentation

## Common Development Tasks

### Adding Animation Features

The animation system centers around the `streams` array where each stream represents a row of falling characters. Key functions:

- `initializeStreams()`: Set up character streams with keyword injection capability
- `draw()`: Main animation loop with progressive message revelation logic
- `generateKeywordsFromText()`: Converts user messages into displayable chunks

### Modifying Message Display

Messages appear gradually through the `calculateChunkSize()` function which increases chunk size from 5 characters to full lines over the animation duration. Multi-line messages are supported by splitting on `\n`.

### URL Sharing System

The sharing mechanism uses `?d=` parameter with Base64-encoded JSON. To modify:
- Encoding: `btoa(String.fromCharCode(...new TextEncoder().encode(jsonString)))`
- Decoding: `new TextDecoder().decode(Uint8Array.from(atob(param), c => c.charCodeAt(0)))`

## Deployment

- **Production**: Netlify auto-deploys from git pushes (https://zippy-faloodeh-d8a180.netlify.app/)
- **No build process**: Direct file serving
- **OGP images**: Must be manually uploaded to `/images/` directory for social sharing previews

## Performance Considerations

- Canvas operations are optimized with `rgba(0, 0, 0, 0.04)` overlay for efficient clearing
- Stream state is managed per-row to minimize computation
- Window resize triggers canvas reinitialization and stream recalculation
- Frame counting used for periodic keyword list updates (every 60 frames ≈ 3 seconds)

## Style System

Uses Tailwind CSS via CDN plus custom Matrix-themed CSS. Key styling areas:
- `.container`: Overlay panels with green glow effects
- `#backToHomeOverlayButtonContainer`: Positioned bottom-right for navigation
- Canvas styling: Full-screen with z-index layering for UI overlay

## Git Commit Integration

To add git commit hash logging to console, modify the end of `script.js` where `init()` is called.