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
  console.log(cone);
  const geometry = new THREE.ConeGeometry(
    cone.radius,
    cone.height,
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

// draw cones
function drawCones(children) {
  const cones = children.flat();

  const material = new THREE.MeshStandardMaterial({
    color: "#e666ed",
    roughness: 0.2,
  });

  const mesh = new THREE.InstancedMesh(
    new THREE.ConeGeometry(cones[0].radius, cones[0].height, cones[0].segments),
    material,
    cones.length
  );

  // cones.forEach((cone) => {
  //   const geometry = new THREE.ConeGeometry(
  //     cone.radius,
  //     cone.height,
  //     cone.segments
  //   );
}

// create cone
function createCone(radius, height, segments, x, y, z) {
  const cone = {
    radius: radius,
    height: height,
    segments: segments,
    x: x,
    y: y,
    z: z,
  };
  //drawCone(cone);
  return cone;
}

// create and draw 1 cone on top and 6 around, half the size
function createChildren(cone) {
  const radius = cone.radius / 2;
  const height = radius * 2;
  const segments = radius * 20;
  const cones = [];

  // cone on top
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x,
      cone.y + cone.radius * 1.484,
      cone.z
    )
  );

  // 6 cones around
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x - radius * 2,
      cone.y - cone.radius * 0.484,
      cone.z
    )
  );
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x + radius * 2,
      cone.y - cone.radius * 0.484,
      cone.z
    )
  );
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x + radius * 2 * Math.cos(Math.PI / 3),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x + radius * 2 * Math.cos((2 * Math.PI) / 3),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin((2 * Math.PI) / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x + radius * 2 * Math.cos(Math.PI * (1 + 1 / 3)),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI * (1 + 1 / 3))
    )
  );
  cones.push(
    createCone(
      radius,
      height,
      segments,
      cone.x + radius * 2 * Math.cos(Math.PI * (1 + 2 / 3)),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI * (1 + 2 / 3))
    )
  );

  return cones;
}

// recursive function for generating children according to amount of stepCount
function generateChildArray(parents, stepCount) {
  if (stepCount <= 0) {
    return;
  }
  const children = [];
  parents.forEach((cones) =>
    cones.forEach((cone) => children.push(createChildren(cone)))
  );

  console.log(children);
  drawCones(children);

  generateChildArray(children, stepCount - 1);
}

// setup first cone & amount of stepCount
function setupCones(stepCount) {
  const parent = createCone(15, 30, 15 * 20, 0, -10, 0);
  generateChildArray([[parent]], stepCount);
}

// start building cones
let stepCount = 1;
setupCones(stepCount);

// light
const highLight = new THREE.PointLight(0xffff00, 1, 100);
highLight.position.set(10, 10, 20);
scene.add(highLight);
const medLight = new THREE.PointLight(0xff0000, 1, 300);
medLight.position.set(-20, -20, 20);
scene.add(medLight);
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

// keyboard controls for stepCount
document.addEventListener("keydown", (e) => {
  if (stepCount < 5 && e.key === "ArrowUp") {
    stepCount += 1;
    const filtered = scene.children.filter((child) => !child.isMesh);
    scene.children = filtered;
    setupCones(stepCount);
  } else if (stepCount > 0 && e.key === "ArrowDown") {
    stepCount -= 1;
    const filtered = scene.children.filter((child) => !child.isMesh);
    scene.children = filtered;
    setupCones(stepCount);
  }
});

// update canvas size, camera and renderer on resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
