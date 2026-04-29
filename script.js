import * as THREE from 'three';

// --- setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 4, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- lights ---
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
mainLight.position.set(5, 10, 7);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const backLight = new THREE.PointLight(0x4466ff, 1);
backLight.position.set(-3, 2, 10);
scene.add(backLight);

const colorLight1 = new THREE.PointLight(0xff44aa, 1.5);
colorLight1.position.set(4, 3, 5);
scene.add(colorLight1);

const colorLight2 = new THREE.PointLight(0x44ffaa, 1.5);
colorLight2.position.set(-4, 2, 6);
scene.add(colorLight2);

// --- stars background ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3000;
const starPositions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 400;
    starPositions[i + 1] = (Math.random() - 0.5) * 400;
    starPositions[i + 2] = (Math.random() - 0.5) * 400;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// --- floating balloons ---
function createBalloon(color, x, y, z) {
    const group = new THREE.Group();

    const bodyGeom = new THREE.SphereGeometry(0.9, 32, 32);
    const bodyMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: new THREE.Color(color).multiplyScalar(0.2),
        shininess: 40,
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.scale.set(1, 1.2, 1);
    body.castShadow = true;
    group.add(body);

    const stringGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -0.8, 0),
        new THREE.Vector3(0.2, -2, 0.1),
        new THREE.Vector3(-0.1, -2.8, -0.1)
    ]);
    const stringMat = new THREE.LineBasicMaterial({ color: 0x888888 });
    const string = new THREE.Line(stringGeom, stringMat);
    group.add(string);

    group.position.set(x, y, z);
    return group;
}

const balloons = [];
const balloonColors = [0xff4d4d, 0xffb84d, 0xff4da6, 0x4dffb8, 0x4da6ff, 0xb84dff];
const balloonPositions = [
    [-5, 2, -3], [4, 4, -2], [-3, 3, 4], [5, 1, 3], [-4, 5, 1], [3, 2, -4], [-2, 4, -4], [2, 3, 4]
];

balloonPositions.forEach((pos, i) => {
    const balloon = createBalloon(balloonColors[i % balloonColors.length], pos[0], pos[1], pos[2]);
    scene.add(balloon);
    balloons.push(balloon);
});

// --- cake with candles ---
const cakeGroup = new THREE.Group();

// cake layers
const layerMat1 = new THREE.MeshPhongMaterial({ color: 0xffb6c1, emissive: 0x331111 });
const layerMat2 = new THREE.MeshPhongMaterial({ color: 0xffdab9, emissive: 0x332211 });
const layerMat3 = new THREE.MeshPhongMaterial({ color: 0xffefd5, emissive: 0x332211 });

const layer1 = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.8, 32), layerMat1);
layer1.position.y = 0.4;
cakeGroup.add(layer1);

const layer2 = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.9, 32), layerMat2);
layer2.position.y = 1.3;
cakeGroup.add(layer2);

const layer3 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1.0, 32), layerMat3);
layer3.position.y = 2.3;
cakeGroup.add(layer3);

// plate
const plate = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32), new THREE.MeshPhongMaterial({ color: 0xeeeeee }));
plate.position.y = 0;
cakeGroup.add(plate);

// candles array
const candleList = [];

function addCandle(x, z, color = 0xffaa44) {
    const candleGroup = new THREE.Group();

    const candleGeom = new THREE.CylinderGeometry(0.25, 0.27, 1.0, 10);
    const candleMat = new THREE.MeshPhongMaterial({ color: 0xfff44f });
    const candle = new THREE.Mesh(candleGeom, candleMat);
    candle.position.y = 0.5;
    candleGroup.add(candle);

    const flameGeom = new THREE.ConeGeometry(0.18, 0.4, 8);
    const flameMat = new THREE.MeshPhongMaterial({ color: 0xff6600, emissive: 0xff3300 });
    const flame = new THREE.Mesh(flameGeom, flameMat);
    flame.position.y = 1.05;
    candleGroup.add(flame);

    const light = new THREE.PointLight(0xff5500, 0.8, 3);
    light.position.y = 0.9;
    candleGroup.add(light);

    candleGroup.position.set(x, 2.8, z);
    cakeGroup.add(candleGroup);

    candleList.push({ group: candleGroup, light, flame });
}

// initial candles
addCandle(0, 0.6);
addCandle(0.7, -0.3);
addCandle(-0.7, -0.3);
addCandle(0.3, -0.8);
addCandle(-0.4, 0.7);

cakeGroup.position.set(0, -1, 0);
scene.add(cakeGroup);

// --- confetti system ---
const confettiCount = 1000;
const confettiGeom = new THREE.BufferGeometry();
const confettiPositions = new Float32Array(confettiCount * 3);
const confettiColors = new Float32Array(confettiCount * 3);

for (let i = 0; i < confettiCount; i++) {
    confettiPositions[i * 3] = (Math.random() - 0.5) * 40;
    confettiPositions[i * 3 + 1] = Math.random() * 30;
    confettiPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

    const hue = Math.random();
    const color = new THREE.Color().setHSL(hue, 1, 0.6);
    confettiColors[i * 3] = color.r;
    confettiColors[i * 3 + 1] = color.g;
    confettiColors[i * 3 + 2] = color.b;
}

confettiGeom.setAttribute('position', new THREE.BufferAttribute(confettiPositions, 3));
confettiGeom.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));

const confettiMat = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending
});
const confetti = new THREE.Points(confettiGeom, confettiMat);
scene.add(confetti);

// --- floating gifts/sparkles ---
const sparkleGeom = new THREE.BufferGeometry();
const sparkleCount = 200;
const sparklePositions = new Float32Array(sparkleCount * 3);
for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePositions[i] = (Math.random() - 0.5) * 30;
    sparklePositions[i + 1] = (Math.random() - 0.5) * 20;
    sparklePositions[i + 2] = (Math.random() - 0.5) * 30;
}
sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
const sparkleMat = new THREE.PointsMaterial({ color: 0xffaa88, size: 0.15, blending: THREE.AdditiveBlending });
const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
scene.add(sparkles);

// --- automatic show controller ---
const features = [
    { name: '🎈 BALLOON RISE', duration: 6000 },
    { name: '🕯️ CANDLE LIGHT', duration: 5000 },
    { name: '✨ CONFETTI STORM', duration: 7000 },
    { name: '🎆 FIREWORKS', duration: 6000 },
    { name: '⭐ SPARKLE WAVES', duration: 5000 },
    { name: '🌈 COLOR PULSE', duration: 4000 }
];

let featureIndex = 0;
const featureElement = document.getElementById('current-feature');

// auto cycle features
setInterval(() => {
    featureIndex = (featureIndex + 1) % features.length;
    featureElement.textContent = features[featureIndex].name;
    featureElement.style.borderLeftColor = `hsl(${featureIndex * 60}, 80%, 60%)`;

    // create floating emoji
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.textContent = ['🎂', '🎈', '🎉', '🎊', '✨', '🕯️'][featureIndex];
    emoji.style.left = Math.random() * 100 + '%';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 4000);

}, 8000);

// special effects timeline
let time = 0;
let lastBurst = 0;

// animation loop
function animate() {
    requestAnimationFrame(animate);

    time += 0.01;

    // rotate camera slowly
    const radius = 18;
    camera.position.x = Math.sin(time * 0.15) * radius;
    camera.position.z = Math.cos(time * 0.15) * radius;
    camera.position.y = 5 + Math.sin(time * 0.2) * 2;
    camera.lookAt(0, 2, 0);

    // animate stars
    stars.rotation.y += 0.0002;
    stars.rotation.x += 0.0001;

    // animate balloons (bobbing)
    balloons.forEach((balloon, i) => {
        balloon.position.y += Math.sin(time * 2 + i) * 0.005;
    });

    // animate candles flicker
    candleList.forEach((candle, i) => {
        if (candle.flame) {
            candle.flame.scale.setScalar(1 + Math.sin(time * 20 + i) * 0.2);
        }
        candle.light.intensity = 0.7 + Math.sin(time * 15 + i) * 0.3;
    });

    // animate confetti
    const positions = confetti.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.03; // fall
        positions[i - 1] += Math.sin(time + i) * 0.01; // sway

        if (positions[i] < -5) {
            positions[i] = 25;
            positions[i - 1] = (Math.random() - 0.5) * 30;
            positions[i + 1] = (Math.random() - 0.5) * 30;
        }
    }
    confetti.geometry.attributes.position.needsUpdate = true;

    // animate sparkles
    sparkles.rotation.y += 0.001;

    // automatic burst effects based on time
    if (Math.floor(time * 2) % 10 === 0 && lastBurst !== Math.floor(time * 2)) {
        lastBurst = Math.floor(time * 2);

        // massive confetti burst
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 5;
            positions[i + 1] += Math.random() * 3;
        }

        // change background color momentarily
        scene.background.setHSL(Math.random(), 0.8, 0.1);
        setTimeout(() => {
            scene.background.setHex(0x050510);
        }, 200);

        // create countdown effect
        if (Math.random() > 0.7) {
            const countEl = document.createElement('div');
            countEl.className = 'countdown';
            countEl.textContent = '🎉';
            document.body.appendChild(countEl);
            setTimeout(() => countEl.remove(), 800);
        }
    }

    // auto candle addition (every 15 seconds)
    if (Math.floor(time) % 15 === 0 && Math.floor(time) !== lastCandleAdd) {
        lastCandleAdd = Math.floor(time);
        if (candleList.length < 12) {
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * 1.2;
            const z = Math.sin(angle) * 1.2;
            addCandle(x, z);
        }
    }

    renderer.render(scene, camera);
}

let lastCandleAdd = 0;
animate();

// resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// create floating emojis periodically
setInterval(() => {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = ['🎂', '🎈', '🎉', '🎊', '✨', '🕯️', '🎆', '🌈'][Math.floor(Math.random() * 8)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDuration = (3 + Math.random() * 3) + 's';
            emoji.style.fontSize = (2 + Math.random() * 3) + 'rem';
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 6000);
        }, i * 200);
    }
}, 3000);

// initial feature
featureElement.textContent = features[0].name;