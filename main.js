import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// keep track of created cones
let conesInCurrentMesh = [];
let conesInPreviousMesh = [];

// draw cones
function drawCones(cones) {
  const length = cones.length;

  const material = new THREE.MeshStandardMaterial({
    color: "#e666ed",
    roughness: 0.2,
  });

  const mesh = new THREE.InstancedMesh(
    new THREE.ConeGeometry(cones[0].radius, cones[0].height, cones[0].segments),
    material,
    length
  );

  scene.add(mesh);

  let dummy = new THREE.Object3D();

  for (let i = 0; i < length; i++) {
    dummy.position.set(cones[i].x, cones[i].y, cones[i].z);
    dummy.rotation.x = Math.PI;
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
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

// create 1 cone on top and 6 around, half the size
function createChildren(cone) {
  const radius = cone.radius / 2;
  const height = radius * 2;
  const segments = 346 - 42 * stepCount;
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

// start building cones
let stepCount = 1;
const firstCone = createCone(15, 30, 304, 0, -10, 0);
conesInCurrentMesh.push(firstCone);
drawCones(conesInCurrentMesh);

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
  if (stepCount < 7 && e.key === "ArrowUp") {
    conesInPreviousMesh = conesInCurrentMesh;
    const children = [];
    conesInCurrentMesh.forEach((cone) => children.push(createChildren(cone)));
    conesInCurrentMesh = children.flat();
    drawCones(conesInCurrentMesh);
    stepCount += 1;
  } else if (stepCount > 1 && e.key === "ArrowDown") {
    conesInCurrentMesh = conesInPreviousMesh;
    scene.children.splice(3 + stepCount, 1);
    stepCount -= 1;
  } else if (stepCount === 1 && e.key === "ArrowDown") {
    conesInCurrentMesh = [firstCone];
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
