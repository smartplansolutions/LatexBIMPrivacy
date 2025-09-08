import * as OBIMcreate from './OBIM_create.js';
import * as THREE from './three.module.js';

async function init() {
    try {
        const response = await fetch('/static/buildings_by_envelope.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        document.body.appendChild(renderer.domElement);

        OBIMcreate.create_buildings_from_json(data, renderer, "3D");
    } catch (err) {
        console.error('Failed to load buildings data:', err);
    }
}

init();
