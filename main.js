import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// setup and create cones
function addConeColumn(initRadius, initX, initY, incrZ) {
  const cones = [];

  function createCone(radius, x, y, z) {
    return {
      radius: radius,
      height: radius * 2,
      segments: 50,
      x: x,
      y: y,
      z: z,
    };
  }

  let radius = initRadius;
  let x = initX;
  let y = initY;
  let z = incrZ;

  for (let i = 0; i < 10; i++) {
    cones.push(createCone(radius, x, y, z));
    y += radius * 2 * 0.75;
    radius /= 2;
  }

  cones.forEach((cone) => {
    const geometry = new THREE.ConeGeometry(
      cone.radius,
      cone.height,
      cone.segments
    );
    const material = new THREE.MeshStandardMaterial({
      color: "#e666ed",
      roughness: 0.2,
    });
    const m = new THREE.Mesh(geometry, material);
    m.position.set(cone.x, cone.y, cone.z);
    m.rotation.x = Math.PI;
    scene.add(m);
  });
}

addConeColumn(10, 0, 0, 0);
addConeColumn(2.5, -5, 12.5, 0);
addConeColumn(2.5, 5, 12.5, 0);
addConeColumn(2.5, -2.5, 12.5, 4);
addConeColumn(2.5, 2.5, 12.5, 4);

// light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(-5, 20, 20);
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 100;
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 5;

// update canvas size, camera and renderer on resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  //  light.position.z += 0.02;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// timeline
// const tl = gsap.timeline({ defaults: { duration: 1 } } );
// tl.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
