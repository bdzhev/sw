<script lang="ts" setup>
import {
  useDocumentVisibility,
  useEventListener,
  usePreferredReducedMotion,
} from '@vueuse/core';
import { Renderer, Camera, Transform, Sphere, Program, Mesh } from 'ogl';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import { useBreakpoint } from '@shared/lib/ui';

import basicFragment from '../../lib/shaders/basicFragment.glsl?raw';
import basicVertex from '../../lib/shaders/basicVertex.glsl?raw';

/**
 * What is visible here is the shader, not the silhouette, so a phone can afford
 * a coarser sphere.
 */
const SEGMENTS = 16;
const MOBILE_SEGMENTS = 10;

const container = ref<HTMLDivElement | null>(null);

const { isMobile } = useBreakpoint();
const visibility = useDocumentVisibility();
const preferredMotion = usePreferredReducedMotion();

let renderer: Renderer | null = null;
let scene: Transform;
let camera: Camera;
let sphere: Mesh;
let program: Program;
let animationId: number | null = null;
let lastTime = 0;
let lastWidth = 0;

const stopLoop = () => {
  if (animationId === null) {
    return;
  }

  cancelAnimationFrame(animationId);
  animationId = null;
};

const runLoop = () => {
  const activeRenderer = renderer;

  if (!activeRenderer || animationId !== null) {
    return;
  }

  lastTime = performance.now();

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) * 0.001;
    lastTime = now;

    program.uniforms.u_time.value += delta;

    activeRenderer.render({ scene, camera });
  };

  animate();
};

const handleResize = () => {
  if (!renderer) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  /**
   * On mobile every browser-chrome collapse fires a resize with an unchanged
   * width. Re-projecting on those makes the sphere visibly shift mid-scroll, so
   * only a real width change counts there.
   */
  if (isMobile.value && width === lastWidth) {
    return;
  }

  lastWidth = width;

  camera.perspective({ aspect: width / height });
  renderer.setSize(width, height);
};

onMounted(() => {
  /**
   * The background is pure decoration and it animates continuously, so reduced
   * motion means not mounting it at all — the layout's radial gradient still
   * carries the look.
   */
  if (!container.value || preferredMotion.value === 'reduce') {
    return;
  }

  renderer = new Renderer({ antialias: false });
  const gl = renderer.gl;
  container.value.appendChild(gl.canvas);

  camera = new Camera(gl, { fov: 20, near: 0.1, far: 20 });
  camera.position.set(0, 2, 8);
  camera.lookAt([0, 0, 0]);

  scene = new Transform();

  program = new Program(gl, {
    vertex: basicVertex,
    fragment: basicFragment,
    uniforms: {
      u_time: { value: 0 },
      /* sRGB 0..1. u_color2 is --color-branding (#fe6e00); keep them in step. */
      u_color0: { value: [0.054, 0.042, 0.129] },
      u_color1: { value: [0.052, 0.2, 0.2] },
      u_color2: { value: [0.996, 0.431, 0.0] },
    },
  });

  const segments = isMobile.value ? MOBILE_SEGMENTS : SEGMENTS;

  const geometry = new Sphere(gl, {
    radius: 4,
    widthSegments: segments,
    heightSegments: segments,
  });
  sphere = new Mesh(gl, { geometry, program });
  sphere.position.set(0, 0, 0);
  sphere.setParent(scene);

  handleResize();
  runLoop();
});

useEventListener(window, 'resize', handleResize);

/**
 * A backgrounded tab has no reason to keep a render loop alive.
 */
watch(visibility, (state) => {
  if (state === 'visible') {
    runLoop();

    return;
  }

  stopLoop();
});

onBeforeUnmount(() => {
  stopLoop();
  renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
  renderer = null;
});
</script>

<template>
  <div ref="container" class="pointer-events-none fixed top-0 z-0 h-full w-full" />
</template>
