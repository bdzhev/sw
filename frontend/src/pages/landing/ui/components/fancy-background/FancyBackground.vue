<script lang="ts" setup>
import { Renderer, Camera, Transform, Sphere, Program, Mesh } from 'ogl';
import { ref, onMounted, onBeforeUnmount } from 'vue';

import basicFragment from '../../../lib/shaders/basicFragment.glsl?raw';
import basicVertex from '../../../lib/shaders/basicVertex.glsl?raw';

const container = ref<HTMLDivElement | null>(null);

let renderer: Renderer;
let scene: Transform;
let camera: Camera;
let sphere: Mesh;
let program: Program;
let animationId: number;

onMounted(() => {
  if (!container.value) {
    return;
  }

  renderer = new Renderer({ antialias: false });
  const gl = renderer.gl;
  container.value.appendChild(gl.canvas);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new Camera(gl, { fov: 20, near: 0.1, far: 20 });
  camera.position.set(0, 2, 8);
  camera.lookAt([0, 0, 0]);

  scene = new Transform();

  program = new Program(gl, {
    vertex: basicVertex,
    fragment: basicFragment,
    uniforms: {
      u_time: { value: 0 },
      u_color0: { value: [0.054, 0.042, 0.129] },
      u_color1: { value: [0.052, 0.2, 0.2] },
      u_color2: { value: [0.678, 0.561, 0.819] },
    },
  });

  const geometry = new Sphere(gl, {
    radius: 4,
    widthSegments: 16,
    heightSegments: 16,
  });
  sphere = new Mesh(gl, { geometry, program });
  sphere.position.set(0, 0, 0);
  sphere.setParent(scene);

  const onResize = () => {
    camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onResize);
  onResize();

  let lastTime = performance.now();

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) * 0.001;
    lastTime = now;

    program.uniforms.u_time.value += delta;

    renderer.render({ scene, camera });
  };

  animate();

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
  });
});
</script>

<template>
  <div
    ref="container"
    class="pointer-events-none fixed top-0 z-0 h-full w-full"
  />
</template>
