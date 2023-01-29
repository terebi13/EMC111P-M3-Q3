import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

let startPlay = performance.now();

let stars, starGeo;
let starMaterial;
let glow = 0.5;

let endPlay = (performance.now() - startPlay);

lighting();
particles();
name();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });
  
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

}

function animateParticles() {
    if(stars.position.y < -180)
      stars.position.y = 180
    
    starGeo.verticesNeedUpdate = true;
    stars.position.y -= 0.9;
  }

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}
camera.position.set(2,1,4);

function name() {
  let text = "Debbie";
  let textMesh;
  
  const loader = new FontLoader();

  loader.load( './assets/fonts/Oswald_Bold.json', function ( font ) {
    let tGeometry = new TextGeometry( text, {
       font: font,
       size: 1.2,
       height: 0.4,
       curveSegments: 4,
       bevelEnabled: true,
       bevelThickness: 1,
       bevelSize: 0.05,
       bevelOffset: 0.02,
       bevelSegments: 3
      });
      textMesh = new THREE.Mesh(tGeometry, [
        new THREE.MeshPhongMaterial({emissive: 0xf9d71c, emissiveIntensity: glow}),
        new THREE.MeshPhongMaterial({color: 0xF43C3C})
      ]);
      scene.add(textMesh);
      textMesh.position.set(-.5,.7,0);
    });
}

function animate() {
  requestAnimationFrame(animate);
  glow = Math.random() - 0.6;
  animateParticles();

  endPlay = (performance.now() - startPlay) / 1000; 
  let endSeconds = parseInt(endPlay) 

  if ( endSeconds % 3 == 0 && endSeconds != 0){ 
    starMaterial.color.setHex(Math.random() * 0xffffff); 
  }

  renderer.render(scene, camera);
}

animate();