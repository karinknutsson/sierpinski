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

// addConeColumn(initRadius, initX, initY, incrZ)
// add center cone column
const iRadius = 10;
const iX = 0;
const iY = -10;
addConeColumn(iRadius, iX, iY, 0);

// add six columns on top of center column
const jRadius = iRadius / 4;

addConeColumn(jRadius, -jRadius * 2, iY + jRadius * 5, 0);
addConeColumn(jRadius, jRadius * 2, iY + jRadius * 5, 0);
addConeColumn(
  jRadius,
  jRadius * 2 * Math.cos(Math.PI / 3),
  iY + jRadius * 5,
  jRadius * 2 * Math.sin(Math.PI / 3)
);
addConeColumn(
  jRadius,
  jRadius * 2 * Math.cos((2 * Math.PI) / 3),
  iY + jRadius * 5,
  jRadius * 2 * Math.sin((2 * Math.PI) / 3)
);
addConeColumn(
  jRadius,
  jRadius * 2 * Math.cos(Math.PI * (1 + 1 / 3)),
  iY + jRadius * 5,
  jRadius * 2 * Math.sin(Math.PI * (1 + 1 / 3))
);
addConeColumn(
  jRadius,
  jRadius * 2 * Math.cos(Math.PI * (1 + 2 / 3)),
  iY + jRadius * 5,
  jRadius * 2 * Math.sin(Math.PI * (1 + 2 / 3))
);

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
