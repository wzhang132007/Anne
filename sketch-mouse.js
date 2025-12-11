/*
 * SEASONAL INTERACTION PROTOTYPE - MOUSE VERSION
 * ==============================================
 * 使用鼠标代替摄像头进行测试
 */

// Season state
let currentSeason = 'autumn';

// Mouse tracking (simulates hand tracking)
let handX = 0;
let handY = 0;
let prevHandX = 0;
let prevHandY = 0;
let handSpeed = 0;
let handSpeedX = 0;
let handSpeedY = 0;

// Autumn - Apple Picking
let apples = [];
const APPLE_COUNT = 12;
const APPLE_RADIUS = 30;
const PICK_DISTANCE = 60;
const PICK_DURATION = 0.5;
let currentHoverApple = null;
let hoverStartTime = 0;

// Summer - Wave Control
let waveAmplitude = 40;
let waveSpeed = 0.02;
let waveOffset = 0;
const MIN_WAVE_AMPLITUDE = 10;
const MAX_WAVE_AMPLITUDE = 80;
const BASE_WAVE_SPEED = 0.02;
const MAX_WAVE_SPEED = 0.08;

// Winter - Snowfall
let snowflakes = [];
let snowSpawnRate = 0.3;
const MAX_SNOWFLAKES = 200;
const MIN_SPAWN_RATE = 0.1;
const MAX_SPAWN_RATE = 0.9;

// Spring - Wind Control
let petals = [];
const PETAL_COUNT = 60;
let windX = 0;
let windY = 0;
const MAX_WIND = 3;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    initializeSeasonalElements();
    updateActiveButton();
}

function draw() {
    // Update hand position from mouse
    prevHandX = handX;
    prevHandY = handY;
    handX = mouseX;
    handY = mouseY;

    // Calculate speed
    const dx = handX - prevHandX;
    const dy = handY - prevHandY;
    handSpeed = sqrt(dx * dx + dy * dy);
    handSpeedX = dx;
    handSpeedY = dy;

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

    // Draw cursor
    drawHandCursor();

    // Update debug panel
    updateDebugPanel();
}

// ============================================
// AUTUMN SCENE
// ============================================

function initializeAutumn() {
    apples = [];
    for (let i = 0; i < APPLE_COUNT; i++) {
        const angle = random(TWO_PI);
        const radius = random(100, 250);
        const centerX = width / 2;
        const centerY = height / 3;

        apples.push({
            x: centerX + cos(angle) * radius,
            y: centerY + sin(angle) * radius * 0.6,
            radius: APPLE_RADIUS,
            picked: false,
            fallY: 0,
            falling: false
        });
    }
    currentHoverApple = null;
}

function drawAutumnScene() {
    background(255, 240, 220);

    // Ground
    fill(139, 90, 60);
    noStroke();
    rect(0, height * 0.85, width, height * 0.15);

    // Tree trunk
    fill(101, 67, 33);
    rect(width/2 - 40, height/3, 80, height * 0.52);

    // Tree crown
    fill(218, 165, 32, 150);
    ellipse(width/2, height/3, 550, 350);
    fill(184, 134, 11, 120);
    ellipse(width/2, height/3, 450, 280);

    // Apples
    for (let apple of apples) {
        if (!apple.picked) {
            const d = dist(handX, handY, apple.x, apple.y);

            if (d < PICK_DISTANCE) {
                if (currentHoverApple !== apple) {
                    currentHoverApple = apple;
                    hoverStartTime = millis();
                }

                const hoverDuration = (millis() - hoverStartTime) / 1000;

                noFill();
                stroke(100, 255, 100, 200);
                strokeWeight(3);
                const hoverProgress = min(hoverDuration / PICK_DURATION, 1);
                arc(apple.x, apple.y, PICK_DISTANCE * 2, PICK_DISTANCE * 2,
                    -HALF_PI, -HALF_PI + TWO_PI * hoverProgress);

                if (hoverDuration >= PICK_DURATION) {
                    apple.picked = true;
                    apple.falling = true;
                    currentHoverApple = null;
                }
            } else if (currentHoverApple === apple) {
                currentHoverApple = null;
            }

            fill(220, 20, 60);
            stroke(139, 0, 0);
            strokeWeight(2);
            ellipse(apple.x, apple.y, apple.radius * 2);

            stroke(101, 67, 33);
            strokeWeight(3);
            line(apple.x, apple.y - apple.radius, apple.x, apple.y - apple.radius - 8);
        } else if (apple.falling) {
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

    drawInstructions("🍎 移动鼠标悬停在苹果上采摘！");

    const pickedCount = apples.filter(a => a.picked).length;
    updateDebugExtra(`已采摘: ${pickedCount}/${APPLE_COUNT}`);
}

// ============================================
// SUMMER SCENE
// ============================================

function drawSummerScene() {
    drawGradient(color(135, 206, 250), color(255, 250, 205));

    const targetAmplitude = map(handY, 0, height, MAX_WAVE_AMPLITUDE, MIN_WAVE_AMPLITUDE);
    waveAmplitude = lerp(waveAmplitude, targetAmplitude, 0.1);

    const targetSpeed = map(handSpeed, 0, 50, BASE_WAVE_SPEED, MAX_WAVE_SPEED);
    waveSpeed = lerp(waveSpeed, targetSpeed, 0.1);

    waveOffset += waveSpeed;

    const baseHeight = height * 0.6;
    drawWaveLayer(baseHeight + 60, waveAmplitude * 0.3, waveOffset * 0.5, color(30, 144, 255, 100));
    drawWaveLayer(baseHeight + 30, waveAmplitude * 0.5, waveOffset * 0.7, color(65, 105, 225, 150));
    drawWaveLayer(baseHeight, waveAmplitude, waveOffset, color(0, 105, 148));

    fill(0, 105, 148);
    noStroke();
    rect(0, baseHeight + waveAmplitude + 20, width, height);

    fill(255, 223, 0);
    ellipse(width * 0.8, height * 0.2, 80);

    drawInstructions("🌊 上下移动鼠标控制波浪高度，快速移动增加能量！");
    updateDebugExtra(`波浪振幅: ${waveAmplitude.toFixed(1)}\n波浪速度: ${(waveSpeed * 100).toFixed(1)}`);
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
// WINTER SCENE
// ============================================

function initializeWinter() {
    snowflakes = [];
}

function drawWinterScene() {
    background(20, 24, 82);
    drawStars();

    const targetSpawnRate = map(handSpeed, 0, 30, MIN_SPAWN_RATE, MAX_SPAWN_RATE);
    snowSpawnRate = lerp(snowSpawnRate, targetSpawnRate, 0.1);

    if (snowflakes.length < MAX_SNOWFLAKES && random() < snowSpawnRate) {
        snowflakes.push({
            x: random(width),
            y: -10,
            speedY: random(1, 3),
            size: random(3, 8),
            wobble: random(TWO_PI)
        });
    }

    fill(255);
    noStroke();
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        const flake = snowflakes[i];
        flake.y += flake.speedY;
        flake.wobble += 0.05;
        flake.x += sin(flake.wobble) * 0.5;
        ellipse(flake.x, flake.y, flake.size);

        if (flake.y > height + 10) {
            snowflakes.splice(i, 1);
        }
    }

    let intensityLabel = "小雪";
    if (snowSpawnRate > 0.6) intensityLabel = "大雪";
    else if (snowSpawnRate > 0.35) intensityLabel = "中雪";

    fill(255);
    textAlign(CENTER, TOP);
    textSize(24);
    text(intensityLabel, width/2, 50);

    drawInstructions("❄️ 快速移动鼠标制造大雪！");
    updateDebugExtra(`雪花数量: ${snowflakes.length}\n生成率: ${(snowSpawnRate * 100).toFixed(0)}%`);
}

function drawStars() {
    fill(255, 255, 200);
    noStroke();
    randomSeed(12345);
    for (let i = 0; i < 100; i++) {
        ellipse(random(width), random(height * 0.7), random(1, 3));
    }
    randomSeed(millis());
}

// ============================================
// SPRING SCENE
// ============================================

function initializeSpring() {
    petals = [];
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
    drawGradient(color(135, 206, 235), color(152, 251, 152));

    const targetWindX = constrain(handSpeedX * 0.3, -MAX_WIND, MAX_WIND);
    windX = lerp(windX, targetWindX, 0.2);

    const targetWindY = constrain(handSpeedY * 0.1, -1, 1);
    windY = lerp(windY, targetWindY, 0.2);

    for (let petal of petals) {
        petal.vx = lerp(petal.vx, windX, 0.1);
        petal.vy += windY * 0.1;

        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.rotation += petal.rotationSpeed;

        if (petal.x < -20) petal.x = width + 20;
        if (petal.x > width + 20) petal.x = -20;
        if (petal.y > height + 20) {
            petal.y = -20;
            petal.x = random(width);
        }
        if (petal.y < -20) petal.y = height + 20;

        push();
        translate(petal.x, petal.y);
        rotate(petal.rotation);
        fill(petal.color);
        noStroke();
        ellipse(0, 0, petal.size, petal.size * 1.5);
        pop();
    }

    drawWindIndicator();
    drawInstructions("🌸 左右移动鼠标控制风向和风力！");
    updateDebugExtra(`风力 X: ${windX.toFixed(2)}\n风力 Y: ${windY.toFixed(2)}`);
}

function drawWindIndicator() {
    const arrowX = 100;
    const arrowY = 100;
    const arrowLength = abs(windX) * 20;
    const arrowAngle = windX > 0 ? 0 : PI;

    push();
    translate(arrowX, arrowY);
    rotate(arrowAngle);

    stroke(100, 200, 100, 200);
    strokeWeight(3);
    line(0, 0, arrowLength, 0);

    fill(100, 200, 100, 200);
    noStroke();
    triangle(arrowLength, 0, arrowLength - 10, -5, arrowLength - 10, 5);
    pop();

    fill(100, 200, 100);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    text("风", arrowX - 20, arrowY + 15);
}

// ============================================
// HELPER FUNCTIONS
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
    push();
    noFill();
    stroke(0, 255, 0, 200);
    strokeWeight(3);
    ellipse(handX, handY, 30);
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

function updateDebugPanel() {
    document.getElementById('debug-season').textContent = currentSeason.toUpperCase();
    document.getElementById('debug-x').textContent = handX.toFixed(0);
    document.getElementById('debug-y').textContent = handY.toFixed(0);
    document.getElementById('debug-speed').textContent = handSpeed.toFixed(1);
}

function updateDebugExtra(text) {
    document.getElementById('debug-extra').innerHTML = text.replace(/\n/g, '<br>');
}

function switchSeason(season) {
    if (currentSeason === season) return;
    currentSeason = season;
    initializeSeasonalElements();
    updateActiveButton();
}

function initializeSeasonalElements() {
    switch(currentSeason) {
        case 'spring':
            initializeSpring();
            break;
        case 'summer':
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
    document.querySelectorAll('.season-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${currentSeason}-btn`).classList.add('active');
}

function keyPressed() {
    switch(key) {
        case '1': switchSeason('spring'); break;
        case '2': switchSeason('summer'); break;
        case '3': switchSeason('autumn'); break;
        case '4': switchSeason('winter'); break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initializeSeasonalElements();
}
