import * as OBIMcreate from './OBIM_create.js';
import * as THREE from './three.module.js';

const response = await fetch('../buildings_by_envelope.json');
const data = await response.json();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.body.appendChild(renderer.domElement);

const env1 = OBIMcreate.create_buildings_from_json(data, renderer, "3D");
