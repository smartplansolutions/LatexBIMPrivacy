import * as OBIMcreate from './OBIM_create.js';
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

const response = await fetch('./static/buildings_by_envelope.json');
const data = await response.json();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const env1 = OBIMcreate.create_buildings_from_json(data, renderer, "3D");
