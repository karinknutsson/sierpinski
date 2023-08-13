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
function createChildren(cone) {
  const radius = cone.radius / 2;
  const cones = [];

  // cone on top
  cones.push(createCone(radius, cone.x, cone.y + cone.radius * 1.484, cone.z));

  // 6 cones around
  cones.push(
    createCone(
      radius,
      cone.x - radius * 2,
      cone.y - cone.radius * 0.484,
      cone.z
    )
  );
  cones.push(
    createCone(
      radius,
      cone.x + radius * 2,
      cone.y - cone.radius * 0.484,
      cone.z
    )
  );
  cones.push(
    createCone(
      radius,
      cone.x + radius * 2 * Math.cos(Math.PI / 3),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      cone.x + radius * 2 * Math.cos((2 * Math.PI) / 3),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin((2 * Math.PI) / 3)
    )
  );
  cones.push(
    createCone(
      radius,
      cone.x + radius * 2 * Math.cos(Math.PI * (1 + 1 / 3)),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI * (1 + 1 / 3))
    )
  );
  cones.push(
    createCone(
      radius,
      cone.x + radius * 2 * Math.cos(Math.PI * (1 + 2 / 3)),
      cone.y - cone.radius * 0.484,
      cone.z + radius * 2 * Math.sin(Math.PI * (1 + 2 / 3))
    )
  );

  return cones;
}

// recursive function for generating children according to amount of steps
function generateChildArray(parents, steps) {
  if (steps <= 0) {
    return;
  }
  const children = [];
  parents.forEach((cones) =>
    cones.forEach((cone) => children.push(createChildren(cone)))
  );

  generateChildArray(children, steps - 1);
}

// setup first cone & amount of steps
let steps = 1;
const parent = createCone(15, 0, -10, 0);
generateChildArray([[parent]], steps);

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

// keyboard controls for steps
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    steps += 1;
    renderer.clear();
    //generateChildArray([[parent]], steps);
  } else if (e.key === "ArrowDown") {
    console.log(e);
    steps -= 1;
    renderer.clear();
    //generateChildArray([[parent]], steps);
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
