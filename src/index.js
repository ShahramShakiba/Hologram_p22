//===================================================
/* "It is not an actual project; therefore,
I rely on comments to assess the code." */
//===================================================
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import * as THREE from 'three';

const canvas = document.querySelector('canvas.webgl');
const gui = new GUI().close();
const scene = new THREE.Scene();

let width = window.innerWidth;
let height = window.innerHeight;
const clock = new THREE.Clock();

//============= Loaders ==================
const gltfLoader = new GLTFLoader();

//============= Camera ===================
const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
camera.position.set(7, 7, 7);
scene.add(camera);

//========= Orbit Controls ===============
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//============ Renderer ==================
const rendererParameters = {};
rendererParameters.clearColor = '#1d1f2a';

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor(rendererParameters.clearColor);
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//===== Debug GUI
gui.addColor(rendererParameters, 'clearColor').onChange(() => {
  renderer.setClearColor(rendererParameters.clearColor);
});

//============ Objects ===================
const material = new THREE.MeshBasicMaterial();

//===== Torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material
);
torusKnot.position.x = 3;
scene.add(torusKnot);

//===== Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

//===== Suzanne
let suzanne = null;
gltfLoader.load('./suzanne.glb', (gltf) => {
  suzanne = gltf.scene;
  suzanne.traverse((child) => {
    if (child.isMesh) child.material = material;
  });
  scene.add(suzanne);
});

//========== Resize Listener ==============
let resizeTimeout;

const onWindowResize = () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, 200);
};

window.addEventListener('resize', onWindowResize);

//============== Animate ==================
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //===== Rotate objects
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.1;
    suzanne.rotation.y = elapsedTime * 0.2;
  }

  sphere.rotation.x = -elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.2;

  torusKnot.rotation.x = -elapsedTime * 0.1;
  torusKnot.rotation.y = elapsedTime * 0.2;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
