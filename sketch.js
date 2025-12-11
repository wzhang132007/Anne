/*
 * SEASONAL WEBCAM INTERACTION PROTOTYPE
 * =====================================
 *
 * An interactive prototype demonstrating camera-based motion input
 * across four seasonal scenes: Spring, Summer, Autumn, Winter
 *
 * HOW TO USE:
 * - Press 1-4 or click buttons to switch seasons
 * - Move your hand to control each season's interaction:
 *   • Spring: Control wind speed and direction with hand movement
 *   • Summer: Control wave height with vertical hand position
 *   • Autumn: Pick apples by reaching up and hovering over them
 *   • Winter: Control snowfall density with hand movement speed
 *
 * TECHNICAL SETUP:
 * - Uses p5.js for rendering
 * - Uses MediaPipe Hands for hand tracking
 * - Maps camera coordinates (0-1) to canvas coordinates
 * - Tracks hand speed for motion-based interactions
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

// Season state
let currentSeason = 'autumn'; // Start with autumn
let seasonTransitioning = false;

// Hand tracking variables
let hands;
let videoElement;
let handDetected = false;
let handX = 0;
let handY = 0;
let prevHandX = 0;
let prevHandY = 0;
let handSpeed = 0;
let handSpeedX = 0;
let handSpeedY = 0;

// Tracking initialization
let modelLoaded = false;
let cameraReady = false;

// ============================================
// AUTUMN VARIABLES - Apple Picking
// ============================================
let apples = [];
const APPLE_COUNT = 12;
const APPLE_RADIUS = 30;
const PICK_DISTANCE = 60; // Distance threshold for picking
const PICK_DURATION = 0.5; // Seconds to hover before picking
let currentHoverApple = null;
let hoverStartTime = 0;

// ============================================
// SUMMER VARIABLES - Wave Control
// ============================================
let waveAmplitude = 40;
let waveSpeed = 0.02;
let waveOffset = 0;
const MIN_WAVE_AMPLITUDE = 10;
const MAX_WAVE_AMPLITUDE = 80;
const BASE_WAVE_SPEED = 0.02;
const MAX_WAVE_SPEED = 0.08;

// ============================================
// WINTER VARIABLES - Snowfall Control
// ============================================
let snowflakes = [];
let snowSpawnRate = 0.3; // Probability per frame
const MAX_SNOWFLAKES = 200;
const MIN_SPAWN_RATE = 0.1;
const MAX_SPAWN_RATE = 0.9;

// ============================================
// SPRING VARIABLES - Wind Control
// ============================================
let petals = [];
const PETAL_COUNT = 60;
let windX = 0;
let windY = 0;
const MAX_WIND = 3;

// ============================================
// P5.JS SETUP
// ============================================

function setup() {
    // Create canvas
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    // Initialize webcam with constraints
    const constraints = {
        video: {
            width: 640,
            height: 480
        },
        audio: false
    };

    videoElement = createCapture(constraints, videoReady);
    videoElement.size(640, 480);
    videoElement.hide(); // Hide the default video element

    // Add error handling
    videoElement.elt.addEventListener('loadedmetadata', function() {
        console.log('Camera loaded successfully');
        cameraReady = true;
        initializeHandTracking();
    });

    // Initialize seasonal elements
    initializeSeasonalElements();

    // Set initial active button
    updateActiveButton();

    // Show helpful message
    console.log('请允许摄像头访问权限');
}

// ============================================
// WEBCAM & HAND TRACKING INITIALIZATION
// ============================================

function videoReady() {
    console.log('Video ready callback triggered');
}

function initializeHandTracking() {
    try {
        console.log('Initializing MediaPipe Hands...');

        // Initialize MediaPipe Hands
        hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onHandResults);

        modelLoaded = true;
        console.log('✓ 手部追踪已初始化');

        // Update loading message
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.innerHTML = '<div>✓ 摄像头已就绪</div><div style="font-size: 14px; margin-top: 10px; color: #666;">挥动你的手开始互动！</div>';
        }
    } catch (error) {
        console.error('Error initializing hand tracking:', error);
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.innerHTML = '<div>❌ 初始化失败</div><div style="font-size: 14px; margin-top: 10px; color: #666;">请刷新页面重试</div>';
        }
    }
}

// ============================================
// HAND TRACKING RESULTS CALLBACK
// ============================================

function onHandResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Get first hand
        const landmarks = results.multiHandLandmarks[0];

        // Use index finger tip (landmark 8) for primary tracking
        // Alternative: palm center would be landmark 0
        const indexTip = landmarks[8];

        // Store previous position
        prevHandX = handX;
        prevHandY = handY;

        // Map from normalized coordinates (0-1) to canvas coordinates
        // Mirror X coordinate for natural interaction (flip horizontally)
        handX = (1 - indexTip.x) * width;
        handY = indexTip.y * height;

        // Calculate speed (distance moved between frames)
        const dx = handX - prevHandX;
        const dy = handY - prevHandY;
        handSpeed = sqrt(dx * dx + dy * dy);
        handSpeedX = dx;
        handSpeedY = dy;

        handDetected = true;
    } else {
        handDetected = false;
    }
}

// ============================================
// P5.JS DRAW LOOP
// ============================================

function draw() {
    // Process hand tracking from video
    if (cameraReady && modelLoaded && videoElement.elt.readyState === 4) {
        hands.send({image: videoElement.elt});

        // Hide loading message once ready
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }

    // Draw current season
    switch(currentSeason) {
        case 'spring':
            drawSpringScene();
            break;
        case 'summer':
            drawSummerScene();
            break;
        case 'autumn':
            drawAutumnScene();
            break;
        case 'winter':
            drawWinterScene();
            break;
    }

    // Draw hand cursor if detected
    if (handDetected) {
        drawHandCursor();
    }

    // Update debug panel
    updateDebugPanel();
}

// ============================================
// AUTUMN SCENE - APPLE PICKING
// ============================================

function initializeAutumn() {
    apples = [];

    // Create apples on a tree
    // Arrange them in a tree-like pattern
    for (let i = 0; i < APPLE_COUNT; i++) {
        // Create a simple tree crown pattern
        const angle = random(TWO_PI);
        const radius = random(100, 250);
        const centerX = width / 2;
        const centerY = height / 3;

        apples.push({
            x: centerX + cos(angle) * radius,
            y: centerY + sin(angle) * radius * 0.6, // Flatten vertically
            radius: APPLE_RADIUS,
            picked: false,
            fallY: 0,
            falling: false
        });
    }

    currentHoverApple = null;
    hoverStartTime = 0;
}

function drawAutumnScene() {
    // Background - autumn colors
    background(255, 240, 220);

    // Draw simple ground
    fill(139, 90, 60);
    noStroke();
    rect(0, height * 0.85, width, height * 0.15);

    // Draw tree trunk
    fill(101, 67, 33);
    rect(width/2 - 40, height/3, 80, height * 0.52);

    // Draw tree crown (background foliage)
    fill(218, 165, 32, 150);
    ellipse(width/2, height/3, 550, 350);
    fill(184, 134, 11, 120);
    ellipse(width/2, height/3, 450, 280);

    // Draw and update apples
    for (let apple of apples) {
        if (!apple.picked) {
            // Check if hand is hovering over this apple
            if (handDetected) {
                const d = dist(handX, handY, apple.x, apple.y);

                if (d < PICK_DISTANCE) {
                    // Start or continue hover
                    if (currentHoverApple !== apple) {
                        currentHoverApple = apple;
                        hoverStartTime = millis();
                    }

                    // Check if hover duration met
                    const hoverDuration = (millis() - hoverStartTime) / 1000;

                    // Draw hover indicator
                    noFill();
                    stroke(100, 255, 100, 200);
                    strokeWeight(3);
                    const hoverProgress = min(hoverDuration / PICK_DURATION, 1);
                    arc(apple.x, apple.y, PICK_DISTANCE * 2, PICK_DISTANCE * 2,
                        -HALF_PI, -HALF_PI + TWO_PI * hoverProgress);

                    if (hoverDuration >= PICK_DURATION) {
                        // Pick the apple!
                        apple.picked = true;
                        apple.falling = true;
                        currentHoverApple = null;
                    }
                } else if (currentHoverApple === apple) {
                    currentHoverApple = null;
                }
            }

            // Draw apple
            fill(220, 20, 60);
            stroke(139, 0, 0);
            strokeWeight(2);
            ellipse(apple.x, apple.y, apple.radius * 2);

            // Stem
            stroke(101, 67, 33);
            strokeWeight(3);
            line(apple.x, apple.y - apple.radius, apple.x, apple.y - apple.radius - 8);
        } else if (apple.falling) {
            // Animate falling
            apple.fallY += 5;
            const fallAlpha = map(apple.fallY, 0, 200, 255, 0);

            fill(220, 20, 60, fallAlpha);
            stroke(139, 0, 0, fallAlpha);
            strokeWeight(2);
            ellipse(apple.x, apple.y + apple.fallY, apple.radius * 2);

            if (apple.fallY > 200) {
                apple.falling = false;
            }
        }
    }

    // Instructions
    drawInstructions("🍎 Reach up and hover over apples to pick them!");

    // Update debug info
    const pickedCount = apples.filter(a => a.picked).length;
    updateDebugExtra(`Apples picked: ${pickedCount}/${APPLE_COUNT}`);
}

// ============================================
// SUMMER SCENE - WAVE CONTROL
// ============================================

function drawSummerScene() {
    // Sky gradient
    drawGradient(
        color(135, 206, 250),
        color(255, 250, 205)
    );

    // Map hand Y position to wave amplitude
    // Higher hand = bigger waves
    if (handDetected) {
        const targetAmplitude = map(handY, 0, height, MAX_WAVE_AMPLITUDE, MIN_WAVE_AMPLITUDE);
        waveAmplitude = lerp(waveAmplitude, targetAmplitude, 0.1);

        // Map hand speed to wave animation speed
        const targetSpeed = map(handSpeed, 0, 50, BASE_WAVE_SPEED, MAX_WAVE_SPEED);
        waveSpeed = lerp(waveSpeed, targetSpeed, 0.1);
    }

    // Update wave offset
    waveOffset += waveSpeed;

    // Draw ocean waves
    const baseHeight = height * 0.6;

    // Multiple wave layers for depth
    drawWaveLayer(baseHeight + 60, waveAmplitude * 0.3, waveOffset * 0.5, color(30, 144, 255, 100));
    drawWaveLayer(baseHeight + 30, waveAmplitude * 0.5, waveOffset * 0.7, color(65, 105, 225, 150));
    drawWaveLayer(baseHeight, waveAmplitude, waveOffset, color(0, 105, 148));

    // Ocean fill
    fill(0, 105, 148);
    noStroke();
    rect(0, baseHeight + waveAmplitude + 20, width, height);

    // Sun
    fill(255, 223, 0);
    noStroke();
    ellipse(width * 0.8, height * 0.2, 80);

    // Instructions
    drawInstructions("🌊 Move your hand up/down to control wave height, faster for more energy!");

    // Update debug info
    updateDebugExtra(`Wave amplitude: ${waveAmplitude.toFixed(1)}\nWave speed: ${(waveSpeed * 100).toFixed(1)}`);
}

function drawWaveLayer(baseY, amplitude, offset, col) {
    fill(col);
    noStroke();
    beginShape();
    vertex(0, height);

    for (let x = 0; x <= width; x += 10) {
        const y = baseY + sin(x * 0.01 + offset) * amplitude;
        vertex(x, y);
    }

    vertex(width, height);
    endShape(CLOSE);
}

// ============================================
// WINTER SCENE - SNOWFALL CONTROL
// ============================================

function initializeWinter() {
    snowflakes = [];
}

function drawWinterScene() {
    // Dark winter sky
    background(20, 24, 82);

    // Stars
    drawStars();

    // Map hand speed to snow spawn rate
    if (handDetected) {
        const targetSpawnRate = map(handSpeed, 0, 30, MIN_SPAWN_RATE, MAX_SPAWN_RATE);
        snowSpawnRate = lerp(snowSpawnRate, targetSpawnRate, 0.1);
    } else {
        // Gentle default snow
        snowSpawnRate = lerp(snowSpawnRate, 0.2, 0.1);
    }

    // Spawn new snowflakes based on spawn rate
    if (snowflakes.length < MAX_SNOWFLAKES && random() < snowSpawnRate) {
        snowflakes.push({
            x: random(width),
            y: -10,
            speedY: random(1, 3),
            size: random(3, 8),
            wobble: random(TWO_PI)
        });
    }

    // Update and draw snowflakes
    fill(255);
    noStroke();
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        const flake = snowflakes[i];

        // Update position
        flake.y += flake.speedY;
        flake.wobble += 0.05;
        flake.x += sin(flake.wobble) * 0.5;

        // Draw snowflake
        ellipse(flake.x, flake.y, flake.size);

        // Remove if off screen
        if (flake.y > height + 10) {
            snowflakes.splice(i, 1);
        }
    }

    // Snow intensity label
    let intensityLabel = "Light Snow";
    if (snowSpawnRate > 0.6) {
        intensityLabel = "Heavy Snow";
    } else if (snowSpawnRate > 0.35) {
        intensityLabel = "Moderate Snow";
    }

    fill(255);
    textAlign(CENTER, TOP);
    textSize(24);
    text(intensityLabel, width/2, 50);

    // Instructions
    drawInstructions("❄️ Move your hand faster to create heavier snowfall!");

    // Update debug info
    updateDebugExtra(`Snowflakes: ${snowflakes.length}\nSpawn rate: ${(snowSpawnRate * 100).toFixed(0)}%`);
}

function drawStars() {
    fill(255, 255, 200);
    noStroke();
    randomSeed(12345); // Consistent stars
    for (let i = 0; i < 100; i++) {
        const x = random(width);
        const y = random(height * 0.7);
        const size = random(1, 3);
        ellipse(x, y, size);
    }
    randomSeed(millis()); // Reset random seed
}

// ============================================
// SPRING SCENE - WIND CONTROL
// ============================================

function initializeSpring() {
    petals = [];

    // Create initial petals
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(createPetal());
    }
}

function createPetal() {
    return {
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(0.5, 2),
        size: random(8, 15),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        color: random() > 0.5 ? color(255, 182, 193) : color(255, 240, 245)
    };
}

function drawSpringScene() {
    // Spring sky gradient
    drawGradient(
        color(135, 206, 235),
        color(152, 251, 152)
    );

    // Calculate wind from hand movement
    if (handDetected) {
        // Horizontal movement controls wind direction and strength
        const targetWindX = constrain(handSpeedX * 0.3, -MAX_WIND, MAX_WIND);
        windX = lerp(windX, targetWindX, 0.2);

        // Slight vertical influence
        const targetWindY = constrain(handSpeedY * 0.1, -1, 1);
        windY = lerp(windY, targetWindY, 0.2);
    } else {
        // Gentle breeze when no hand
        windX = lerp(windX, sin(frameCount * 0.02) * 0.5, 0.1);
        windY = lerp(windY, 0, 0.1);
    }

    // Update and draw petals
    for (let petal of petals) {
        // Apply wind
        petal.vx = lerp(petal.vx, windX, 0.1);
        petal.vy += windY * 0.1;

        // Update position
        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.rotation += petal.rotationSpeed;

        // Wrap around screen
        if (petal.x < -20) petal.x = width + 20;
        if (petal.x > width + 20) petal.x = -20;
        if (petal.y > height + 20) {
            petal.y = -20;
            petal.x = random(width);
        }
        if (petal.y < -20) petal.y = height + 20;

        // Draw petal
        push();
        translate(petal.x, petal.y);
        rotate(petal.rotation);
        fill(petal.color);
        noStroke();

        // Simple petal shape (ellipse)
        ellipse(0, 0, petal.size, petal.size * 1.5);
        pop();
    }

    // Draw wind indicator
    drawWindIndicator();

    // Instructions
    drawInstructions("🌸 Move your hand left/right to control wind direction and strength!");

    // Update debug info
    updateDebugExtra(`Wind X: ${windX.toFixed(2)}\nWind Y: ${windY.toFixed(2)}`);
}

function drawWindIndicator() {
    // Arrow showing wind direction and strength
    const arrowX = 100;
    const arrowY = 100;
    const arrowLength = abs(windX) * 20;
    const arrowAngle = windX > 0 ? 0 : PI;

    push();
    translate(arrowX, arrowY);
    rotate(arrowAngle);

    // Arrow line
    stroke(100, 200, 100, 200);
    strokeWeight(3);
    line(0, 0, arrowLength, 0);

    // Arrow head
    fill(100, 200, 100, 200);
    noStroke();
    triangle(
        arrowLength, 0,
        arrowLength - 10, -5,
        arrowLength - 10, 5
    );

    pop();

    // Label
    fill(100, 200, 100);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text("Wind", arrowX - 30, arrowY + 15);
}

// ============================================
// HELPER FUNCTIONS - DRAWING
// ============================================

function drawGradient(c1, c2) {
    noStroke();
    for (let y = 0; y < height; y++) {
        const inter = map(y, 0, height, 0, 1);
        const c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function drawHandCursor() {
    // Draw a simple cursor at hand position
    push();
    noFill();
    stroke(0, 255, 0, 200);
    strokeWeight(3);
    ellipse(handX, handY, 30);

    // Crosshair
    line(handX - 15, handY, handX + 15, handY);
    line(handX, handY - 15, handX, handY + 15);
    pop();
}

function drawInstructions(text) {
    fill(0, 0, 0, 100);
    noStroke();
    rect(0, height - 60, width, 60);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(text, width/2, height - 30);
}

// ============================================
// DEBUG PANEL UPDATES
// ============================================

function updateDebugPanel() {
    document.getElementById('debug-season').textContent = currentSeason.toUpperCase();
    document.getElementById('debug-x').textContent = handDetected ? handX.toFixed(0) : 'N/A';
    document.getElementById('debug-y').textContent = handDetected ? handY.toFixed(0) : 'N/A';
    document.getElementById('debug-speed').textContent = handDetected ? handSpeed.toFixed(1) : 'N/A';
    document.getElementById('debug-status').textContent = handDetected ? 'Hand Detected ✓' : 'No Hand';
}

function updateDebugExtra(text) {
    document.getElementById('debug-extra').innerHTML = text.replace(/\n/g, '<br>');
}

// ============================================
// SEASON SWITCHING
// ============================================

function switchSeason(season) {
    if (currentSeason === season) return;

    currentSeason = season;
    initializeSeasonalElements();
    updateActiveButton();
}

function initializeSeasonalElements() {
    // Reset/initialize elements for current season
    switch(currentSeason) {
        case 'spring':
            initializeSpring();
            break;
        case 'summer':
            // Summer uses continuous variables, no reset needed
            waveOffset = 0;
            break;
        case 'autumn':
            initializeAutumn();
            break;
        case 'winter':
            initializeWinter();
            break;
    }
}

function updateActiveButton() {
    // Remove active class from all buttons
    document.querySelectorAll('.season-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to current season
    document.getElementById(`${currentSeason}-btn`).classList.add('active');
}

// ============================================
// KEYBOARD CONTROLS
// ============================================

function keyPressed() {
    switch(key) {
        case '1':
            switchSeason('spring');
            break;
        case '2':
            switchSeason('summer');
            break;
        case '3':
            switchSeason('autumn');
            break;
        case '4':
            switchSeason('winter');
            break;
    }
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Reinitialize elements for new canvas size
    initializeSeasonalElements();
}
