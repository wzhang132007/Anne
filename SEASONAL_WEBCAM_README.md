# Seasonal Webcam Interaction Prototype

## Overview
An interactive browser-based prototype demonstrating camera-based motion input across four seasonal scenes. Built for interaction design and prototyping coursework.

## How to Run
1. Open `seasonal-webcam.html` in a modern web browser (Chrome, Firefox, or Edge recommended)
2. Allow camera access when prompted
3. Move your hand in front of the webcam to interact with the scenes
4. Press keys 1-4 or click buttons to switch between seasons

## System Requirements
- Modern web browser with WebRTC support
- Webcam access
- Internet connection (for loading libraries from CDN)

## Interactions by Season

### 🍂 Autumn - Apple Picking (Key: 3)
**Concept:** Pick apples from a tree using hand gestures

**How it works:**
- Move your hand to position the green cursor over an apple
- Hold your hand steady over an apple for 0.5 seconds
- A green progress ring appears showing hover progress
- When the ring completes, the apple is picked and falls
- Track your progress: X/12 apples picked

**Data Mapping:**
- Hand position (x, y) → Cursor position on screen
- Hover duration → Pick trigger (using time threshold)
- Distance calculation → Collision detection with apples

**Tweakable Parameters** (in sketch.js):
- `APPLE_COUNT` (line 55) - Number of apples on the tree
- `APPLE_RADIUS` (line 56) - Size of each apple
- `PICK_DISTANCE` (line 57) - How close hand must be to pick
- `PICK_DURATION` (line 58) - Seconds to hover before picking

---

### 🌊 Summer - Wave Control (Key: 2)
**Concept:** Control ocean wave height and energy with hand movement

**How it works:**
- Move your hand up → Waves become taller and stronger
- Move your hand down → Waves become calmer and smaller
- Move your hand faster → Waves animate faster and become more chaotic
- Multiple wave layers create depth effect

**Data Mapping:**
- Hand Y position → Wave amplitude (higher hand = bigger waves)
- Hand speed (velocity) → Wave animation speed
- Continuous mapping with smooth interpolation (lerp)

**Tweakable Parameters** (in sketch.js):
- `MIN_WAVE_AMPLITUDE` (line 66) - Minimum wave height
- `MAX_WAVE_AMPLITUDE` (line 67) - Maximum wave height
- `BASE_WAVE_SPEED` (line 68) - Slowest wave animation speed
- `MAX_WAVE_SPEED` (line 69) - Fastest wave animation speed

---

### ❄️ Winter - Snowfall Density Control (Key: 4)
**Concept:** Control snowfall intensity through hand movement

**How it works:**
- Move your hand slowly → Light snowfall with few flakes
- Move your hand at medium speed → Moderate snowfall
- Move your hand quickly → Heavy snowfall with many flakes
- Snowflakes fall and respawn at the top
- On-screen label shows: "Light Snow" / "Moderate Snow" / "Heavy Snow"

**Data Mapping:**
- Hand speed (distance per frame) → Snowflake spawn rate
- Spawn rate controls probability of new flakes each frame
- Maximum cap prevents performance issues

**Tweakable Parameters** (in sketch.js):
- `MAX_SNOWFLAKES` (line 75) - Maximum number of snowflakes
- `MIN_SPAWN_RATE` (line 76) - Minimum spawn probability
- `MAX_SPAWN_RATE` (line 77) - Maximum spawn probability
- Snowflake size range in `drawWinterScene()` (line 419)

---

### 🌸 Spring - Wind Control (Key: 1)
**Concept:** Control wind direction and strength with hand movement

**How it works:**
- Move your hand left → Wind blows petals to the left
- Move your hand right → Wind blows petals to the right
- Move faster → Stronger wind force
- Move slower → Gentle breeze
- Wind indicator arrow shows current wind direction and strength

**Data Mapping:**
- Horizontal hand speed (delta X) → Wind direction and strength
- Positive/negative velocity → Wind direction (left/right)
- Magnitude of velocity → Wind strength
- Wind force applied to petal particle physics

**Tweakable Parameters** (in sketch.js):
- `PETAL_COUNT` (line 83) - Number of floating petals
- `MAX_WIND` (line 85) - Maximum wind force
- Petal size range in `createPetal()` (line 479)
- Wind responsiveness (lerp factor in line 502)

---

## Technical Architecture

### Libraries Used
- **p5.js** - Canvas rendering and animation framework
- **MediaPipe Hands** - Real-time hand tracking via webcam
- HTML5 + CSS3 for UI and layout

### Coordinate Mapping
```
Camera coordinates (0-1 normalized)
        ↓
Mirrored horizontally (for natural interaction)
        ↓
Mapped to canvas size (width × height)
        ↓
Used for screen interactions
```

### Hand Tracking Details
- Tracks index finger tip (MediaPipe landmark #8)
- Updates at ~30-60 fps depending on device
- Calculates velocity by comparing position between frames
- Speed = √(Δx² + Δy²)

### Debug Panel
The green debug panel (bottom right) shows:
- Current season
- Hand X/Y coordinates
- Hand movement speed
- Hand detection status
- Season-specific metrics (apples picked, wave amplitude, etc.)

## Troubleshooting

**Camera not working:**
- Ensure browser has camera permissions
- Try refreshing the page
- Check if another app is using the camera

**Hand not detected:**
- Ensure good lighting
- Keep hand clearly visible to camera
- Try moving hand closer to camera
- Look for "Hand Detected ✓" in debug panel

**Laggy performance:**
- Close other browser tabs
- Try reducing browser window size
- Check CPU usage

**Libraries not loading:**
- Ensure internet connection is active
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

## Design Notes

This prototype demonstrates several interaction design principles:

1. **Direct Manipulation:** Hand position directly maps to on-screen effects
2. **Immediate Feedback:** Visual cursor and real-time responses
3. **Progressive Disclosure:** Debug panel for technical users
4. **Affordances:** Instructions and visual cues guide interaction
5. **Consistency:** Similar hand tracking across all seasons
6. **Variety:** Different interaction metaphors per season

## Credits
Created as an interaction design prototype for demonstration and educational purposes.

**Technologies:**
- p5.js Creative Coding Framework
- MediaPipe Hands (Google)
- HTML5 Canvas & WebRTC
