import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

// Scene setup
let scene, camera, renderer, controls;
let trophy, textMesh;
let font;

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    const container = document.getElementById('canvas-container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    // Create trophy
    createTrophy();
    
    // Load font for text
    const loader = new FontLoader();
    loader.load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function(loadedFont) {
        font = loadedFont;
        console.log('Font loaded successfully');
    });
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Setup UI controls
    setupControls();
    
    // Start animation loop
    animate();
}

// Create a trophy model
function createTrophy() {
    const trophyGroup = new THREE.Group();
    
    // Base
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.15;
    base.castShadow = true;
    base.receiveShadow = true;
    trophyGroup.add(base);
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 32);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1.05;
    stem.castShadow = true;
    stem.receiveShadow = true;
    trophyGroup.add(stem);
    
    // Cup
    const cupGeometry = new THREE.CylinderGeometry(1.2, 0.8, 1.8, 32);
    const cupMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.y = 2.7;
    cup.castShadow = true;
    cup.receiveShadow = true;
    trophyGroup.add(cup);
    
    // Handles
    const handleGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 32, Math.PI);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-1.1, 2.7, 0);
    leftHandle.rotation.y = Math.PI / 2;
    leftHandle.rotation.z = Math.PI / 2;
    leftHandle.castShadow = true;
    leftHandle.receiveShadow = true;
    trophyGroup.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(1.1, 2.7, 0);
    rightHandle.rotation.y = -Math.PI / 2;
    rightHandle.rotation.z = Math.PI / 2;
    rightHandle.castShadow = true;
    rightHandle.receiveShadow = true;
    trophyGroup.add(rightHandle);
    
    trophy = trophyGroup;
    scene.add(trophy);
}

// Setup UI controls
function setupControls() {
    // Add text button
    document.getElementById('add-text').addEventListener('click', addText);
    
    // Font size control
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    fontSizeSlider.addEventListener('input', function() {
        fontSizeValue.textContent = this.value;
        if (textMesh) {
            const scale = parseFloat(this.value);
            textMesh.scale.set(scale, scale, scale);
        }
    });
    
    // Position controls
    setupSlider('pos-x', 'pos-x-value', (value) => {
        if (textMesh) textMesh.position.x = parseFloat(value);
    });
    
    setupSlider('pos-y', 'pos-y-value', (value) => {
        if (textMesh) textMesh.position.y = parseFloat(value);
    });
    
    setupSlider('pos-z', 'pos-z-value', (value) => {
        if (textMesh) textMesh.position.z = parseFloat(value);
    });
    
    // Rotation controls
    setupSlider('rot-x', 'rot-x-value', (value) => {
        if (textMesh) textMesh.rotation.x = parseFloat(value);
    });
    
    setupSlider('rot-y', 'rot-y-value', (value) => {
        if (textMesh) textMesh.rotation.y = parseFloat(value);
    });
    
    setupSlider('rot-z', 'rot-z-value', (value) => {
        if (textMesh) textMesh.rotation.z = parseFloat(value);
    });
    
    // Export STL button
    document.getElementById('export-stl').addEventListener('click', exportSTL);
}

// Helper function to setup sliders
function setupSlider(sliderId, valueId, callback) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    slider.addEventListener('input', function() {
        const value = this.value;
        valueDisplay.textContent = parseFloat(value).toFixed(1);
        callback(value);
    });
}

// Add text to the scene
function addText() {
    if (!font) {
        alert('Font is still loading, please wait a moment and try again.');
        return;
    }
    
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Please enter some text.');
        return;
    }
    
    // Remove existing text mesh if any
    if (textMesh) {
        scene.remove(textMesh);
        textMesh.geometry.dispose();
        textMesh.material.dispose();
    }
    
    // Create text geometry
    const textGeometry = new TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    
    // Center the text geometry
    textGeometry.computeBoundingBox();
    const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    textGeometry.translate(centerOffset, 0, 0);
    
    const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2196f3,
        metalness: 0.3,
        roughness: 0.4
    });
    
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    // Set initial position from sliders
    textMesh.position.x = parseFloat(document.getElementById('pos-x').value);
    textMesh.position.y = parseFloat(document.getElementById('pos-y').value);
    textMesh.position.z = parseFloat(document.getElementById('pos-z').value);
    
    // Set initial rotation from sliders
    textMesh.rotation.x = parseFloat(document.getElementById('rot-x').value);
    textMesh.rotation.y = parseFloat(document.getElementById('rot-y').value);
    textMesh.rotation.z = parseFloat(document.getElementById('rot-z').value);
    
    // Set initial scale from font size slider
    const scale = parseFloat(document.getElementById('font-size').value);
    textMesh.scale.set(scale, scale, scale);
    
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    
    scene.add(textMesh);
}

// Export the scene to STL
function exportSTL() {
    const exporter = new STLExporter();
    
    // Create a group with all meshes to export
    const exportGroup = new THREE.Group();
    
    // Add trophy meshes
    trophy.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            const clonedMesh = child.clone();
            exportGroup.add(clonedMesh);
        }
    });
    
    // Add text mesh if it exists
    if (textMesh) {
        const clonedText = textMesh.clone();
        exportGroup.add(clonedText);
    }
    
    // Export to STL
    const stlString = exporter.parse(exportGroup, { binary: false });
    
    // Download the file
    const blob = new Blob([stlString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'trophy.stl';
    link.click();
    
    console.log('STL file exported successfully');
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Start the application
init();
