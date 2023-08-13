import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// draw cone
function drawCone(cone) {
  const geometry = new THREE.ConeGeometry(
    cone.radius,
    cone.radius * 2,
    cone.segments
  );

  const material = new THREE.MeshStandardMaterial({
    color: "#e666ed",
    roughness: 0.2,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(cone.x, cone.y, cone.z);
  mesh.rotation.x = Math.PI;
  scene.add(mesh);
}

// create cone
function createCone(radius, x, y, z) {
  const cone = {
    radius: radius,
    segments: 50,
    x: x,
    y: y,
    z: z,
  };
  drawCone(cone);
  return cone;
}

// create and draw 1 cone on top and 6 around, half the size
function createCones(parentRadius, parentY) {
  const radius = parentRadius / 2;
  const cones = [];

  // cone on top
  cones.push(createCone(radius, 0, parentY + parentRadius * 1.5, 0));

  // 6 cones around
  cones.push(
    createCone(radius, -radius * 2, parentY - parentRadius * 0.484, 0)
  );
  cones.push(createCone(radius, radius * 2, parentY - parentRadius * 0.484, 0));
  cones.push(
    createCone(
      radius,
      radius * 2 * Math.cos(Math.PI / 3),
      parentY - parentRadius * 0.484,
      radius * 2 * Math.sin(Math.PI / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      radius * 2 * Math.cos((2 * Math.PI) / 3),
      parentY - parentRadius * 0.484,
      radius * 2 * Math.sin((2 * Math.PI) / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      radius * 2 * Math.cos(Math.PI * (1 + 1 / 3)),
      parentY - parentRadius * 0.484,
      radius * 2 * Math.sin(Math.PI * (1 + 1 / 3))
    )
  );
  cones.push(
    createCone(
      radius,
      radius * 2 * Math.cos(Math.PI * (1 + 2 / 3)),
      parentY - parentRadius * 0.484,
      radius * 2 * Math.sin(Math.PI * (1 + 2 / 3))
    )
  );

  return cones;
}

const initCone = createCone(10, 0, -10, 0);
const childCones = createCones(initCone.radius, initCone.y);

// light
const highLight = new THREE.PointLight(0xff6600, 1, 100);
highLight.position.set(10, 0, 20);
scene.add(highLight);
const ambientLight = new THREE.AmbientLight(0x6666ff);
scene.add(ambientLight);

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
