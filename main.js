import "./style.css";

import * as THREE from "three"; // importing three.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // it is used to make the scene more interactive
import { Material, TetrahedronGeometry } from "three";

// U need to set up scence camera and renderer first

const scene = new THREE.Scene(); // setting up the scene

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // setting up the camera
// Perspective camera (field of view, Aspect ratio ,view frustum - to control which objects are visible relative to camera itself)

const renderer = new THREE.WebGL1Renderer({
  // renderer  - to render out the actual graphics
  canvas: document.querySelector("#bg"), // renderer must know which dom element to use
});

renderer.setPixelRatio(window.devicePixelRatio); // setting the pixel ratio to windows pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); // setting the the renderer size to window size (making it full screen)
camera.position.setZ(30); // by default the camera is set up in the middle  so we move it along the z axis

renderer.render(scene, camera); // we need to pass the scene and camera inside the render method render == draw

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); // geometry - u need the {x,y,z} points that makeup a shape
const material = new THREE.MeshStandardMaterial({ color: 0x0269ff }); // material - its like a wrapping paper for a geometry
const torus = new THREE.Mesh(geometry, material); // Mesh - Geometry + Material

scene.add(torus); // Adding Scenes to torus

const pointLight = new THREE.PointLight(0xffffff); // A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb
pointLight.position.set(8, 8, 8);

const ambientLight = new THREE.AmbientLight(0xffffff); //This light globally illuminates all objects in the scene equally.
scene.add(pointLight, ambientLight); // adding pointLight and ambientLight to scenes

// const lightHelper = new THREE.PointLightHelper(pointLight)  // three.js has helpers to work with lights, lightHelper shows the location of the pointLight

// const gridHelper = new THREE.GridHelper(200, 5); // it draws a 2d grid in the browser
// scene.add(lightHelper,gridHelper)

const controls = new OrbitControls(camera, renderer.domElement); // it creates a 3d environment where u can hold and move the element

function addStar() {
  const geometry = new THREE.SphereGeometry(0.24, 24, 24); //geometry of icosahedron
  const material1 = new THREE.MeshStandardMaterial({ color: 0xffffff }); //material around that geometry
  const star = new THREE.Mesh(geometry, material1); // adding the material around the geometry

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); // genrating a random position for the star to appear

  star.position.set(x, y, z); //setting the position which keeps changing
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

//Avatar

const avatarTexture = new THREE.TextureLoader().load("matt.png");
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);

//Moon

const moonTexture = new THREE.TextureLoader().load("marsmap1K.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 25, 25),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30; // to position an element
//or
moon.position.setX(-10);

function moveCamera() {
  // Animating the scenes on scroll
  const t = document.body.getBoundingClientRect().top; // check the position of user on scroll
  moon.rotation.x += 0.05; // making the moon to rotate on scroll
  moon.rotation.y += 0.08;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01; // Rotating the avatar on scroll
  avatar.rotation.z += 0.01;
  avatar.position.x += 0.01;
  torus.position.x += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.002;
  camera.position.y = t * -0.002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate); // the method animate call the requestAnimationFrame that tells the browser that u want to animate

  torus.rotation.x += 0.01; // each geometry has properties like rotation position and scale
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera); // calling the render() to update the Ui
}

animate();
