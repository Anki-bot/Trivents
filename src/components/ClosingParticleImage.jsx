"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const IMAGE_URL = "/closing/College.jpeg";

/*
  Main controls

  IMAGE_ROWS:
  More = better image detail, more GPU work.

  START_SPREAD:
  How far the particles are scattered at the beginning.

  PARTICLE_MULTIPLIER:
  Controls how large the particles are before they form
  the final image.
*/
const IMAGE_ROWS = 150;
const START_SPREAD_X = 10;
const START_SPREAD_Y = 8;
const START_SPREAD_Z = 18;
const PARTICLE_MULTIPLIER = 2.8;

export default function ClosingParticleImage() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let destroyed = false;
    let animationFrame = 0;

    // =========================================================
    // SCENE
    // =========================================================

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    camera.position.set(
      0,
      0,
      16
    );

    // =========================================================
    // RENDERER
    // =========================================================

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setClearColor(
      0x000000,
      0
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.NoToneMapping;

    renderer.domElement.className =
      "closing-particle-canvas";

    const stage =
      document.createElement("div");

    stage.className =
      "closing-particle-stage";

    stage.appendChild(
      renderer.domElement
    );

    section.appendChild(stage);

    // =========================================================
    // IMAGE DATA
    // =========================================================

    const image = new Image();

    image.src = IMAGE_URL;

    image.decoding = "async";

    let mesh = null;
    let geometry = null;
    let material = null;

    let startPositions = [];
    let targetPositions = [];
    let particleSizes = [];

    const setup = () => {
      if (destroyed) return;

      const width =
        image.naturalWidth;

      const height =
        image.naturalHeight;

      if (!width || !height) {
        console.error(
          `ClosingParticleImage: image dimensions are unavailable for ${IMAGE_URL}`
        );

        return;
      }

      // =======================================================
      // IMAGE ASPECT RATIO
      // =======================================================

      const imageRatio =
        width / height;

      const rows =
        IMAGE_ROWS;

      const columns =
        Math.max(
          1,
          Math.round(
            rows * imageRatio
          )
        );

      // =======================================================
      // READ IMAGE PIXELS
      // =======================================================

      const pixelCanvas =
        document.createElement("canvas");

      pixelCanvas.width =
        columns;

      pixelCanvas.height =
        rows;

      const context =
        pixelCanvas.getContext(
          "2d",
          {
            willReadFrequently: true,
          }
        );

      if (!context) {
        console.error(
          "ClosingParticleImage: unable to create canvas context."
        );

        return;
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height,
        0,
        0,
        columns,
        rows
      );

      const pixels =
        context.getImageData(
          0,
          0,
          columns,
          rows
        ).data;

      // =======================================================
      // IMAGE WORLD SIZE
      // =======================================================

      const imageHeight =
        8.8;

      const imageWidth =
        imageHeight *
        imageRatio;

      const cellWidth =
        imageWidth /
        columns;

      const cellHeight =
        imageHeight /
        rows;

      // =======================================================
      // GEOMETRY
      // =======================================================

      geometry =
        new THREE.BoxGeometry(
          1,
          1,
          1
        );

      material =
        new THREE.MeshBasicMaterial({
          vertexColors: true,
        });

      const total =
        columns * rows;

      mesh =
        new THREE.InstancedMesh(
          geometry,
          material,
          total
        );

      mesh.instanceMatrix.setUsage(
        THREE.DynamicDrawUsage
      );

      scene.add(mesh);

      // =======================================================
      // BUILD PARTICLES
      // =======================================================

      const temp =
        new THREE.Object3D();

      const color =
        new THREE.Color();

      startPositions = [];
      targetPositions = [];
      particleSizes = [];

      let index = 0;

      for (
        let y = 0;
        y < rows;
        y++
      ) {
        for (
          let x = 0;
          x < columns;
          x++
        ) {
          const pixelIndex =
            index * 4;

          const r =
            pixels[pixelIndex] / 255;

          const g =
            pixels[pixelIndex + 1] / 255;

          const b =
            pixels[pixelIndex + 2] / 255;

          const alpha =
            pixels[pixelIndex + 3] / 255;

          /*
            Make transparent pixels nearly invisible.
          */
          const visible =
            alpha > 0.05;

          color.setRGB(
            visible ? r : 0,
            visible ? g : 0,
            visible ? b : 0
          );

          mesh.setColorAt(
            index,
            color
          );

          // ---------------------------------------------------
          // FINAL IMAGE POSITION
          // ---------------------------------------------------

          const targetX =
            (
              x + 0.5 -
              columns / 2
            ) *
            cellWidth;

          const targetY =
            (
              rows / 2 -
              y -
              0.5
            ) *
            cellHeight;

          const targetZ = 0;

          targetPositions.push(
            targetX,
            targetY,
            targetZ
          );

          // ---------------------------------------------------
          // STARTING POSITION
          //
          // Keep the particles dispersed,
          // but still visible inside the viewport.
          // ---------------------------------------------------

          const startX =
            targetX +
            THREE.MathUtils.randFloatSpread(
              START_SPREAD_X
            );

          const startY =
            targetY +
            THREE.MathUtils.randFloatSpread(
              START_SPREAD_Y
            );

          const startZ =
            THREE.MathUtils.randFloatSpread(
              START_SPREAD_Z
            );

          startPositions.push(
            startX,
            startY,
            startZ
          );

          // ---------------------------------------------------
          // PARTICLE SIZE
          // ---------------------------------------------------

          const baseSize =
            Math.min(
              cellWidth,
              cellHeight
            );

          particleSizes.push(
            baseSize *
              THREE.MathUtils.randFloat(
                0.75,
                1.35
              )
          );

          // Initial matrix
          temp.position.set(
            startX,
            startY,
            startZ
          );

          const startScale =
            particleSizes[index] *
            PARTICLE_MULTIPLIER;

          temp.scale.set(
            startScale,
            startScale,
            startScale
          );

          temp.rotation.set(
            THREE.MathUtils.randFloat(
              -Math.PI,
              Math.PI
            ),
            THREE.MathUtils.randFloat(
              -Math.PI,
              Math.PI
            ),
            THREE.MathUtils.randFloat(
              -Math.PI,
              Math.PI
            )
          );

          temp.updateMatrix();

          mesh.setMatrixAt(
            index,
            temp.matrix
          );

          index++;
        }
      }

      mesh.instanceColor.needsUpdate =
        true;

      mesh.instanceMatrix.needsUpdate =
        true;
    };

    image.onload = setup;

    image.onerror = () => {
      console.error(
        `ClosingParticleImage: could not load ${IMAGE_URL}`
      );
    };

    // =========================================================
    // EASING
    // =========================================================

    const easeInOutCubic = (
      value
    ) => {
      return value < 0.5
        ? 4 * value * value * value
        : 1 -
            Math.pow(
              -2 * value + 2,
              3
            ) /
              2;
    };

    // =========================================================
    // SCROLL STATE
    // =========================================================

    let targetProgress = 0;
    let currentProgress = 0;

    const calculateScroll = () => {
      const rect =
        section.getBoundingClientRect();

      const sectionHeight =
        section.offsetHeight;

      const viewportHeight =
        window.innerHeight;

      /*
        Start when the top of the particle section
        reaches the viewport.

        Finish when the bottom of the particle
        section reaches the viewport.
      */

      const start =
        viewportHeight;

      const distance =
        sectionHeight +
        viewportHeight;

      const travelled =
        start - rect.top;

      targetProgress =
        THREE.MathUtils.clamp(
          travelled / distance,
          0,
          1
        );
    };

    window.addEventListener(
      "scroll",
      calculateScroll,
      {
        passive: true,
      }
    );

    calculateScroll();

    // =========================================================
    // RESIZE
    // =========================================================

    const resize = () => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      renderer.setSize(
        width,
        height,
        false
      );

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();
    };

    window.addEventListener(
      "resize",
      resize
    );

    resize();

    // =========================================================
    // ANIMATION
    // =========================================================

    const animate = (time) => {
      if (destroyed) return;

      animationFrame =
        requestAnimationFrame(
          animate
        );

      currentProgress =
        THREE.MathUtils.lerp(
          currentProgress,
          targetProgress,
          0.08
        );

      if (mesh) {
        const temp =
          new THREE.Object3D();

        /*
          This gives the animation
          a slightly more cinematic sequence:

          0.00 → cloud
          0.35 → particles accelerate inward
          0.70 → image starts becoming readable
          1.00 → fully formed image
        */

        const progress =
          easeInOutCubic(
            currentProgress
          );

        for (
          let i = 0;
          i < mesh.count;
          i++
        ) {
          const offset =
            i * 3;

          const sx =
            startPositions[offset];

          const sy =
            startPositions[
              offset + 1
            ];

          const sz =
            startPositions[
              offset + 2
            ];

          const tx =
            targetPositions[offset];

          const ty =
            targetPositions[
              offset + 1
            ];

          const tz =
            targetPositions[
              offset + 2
            ];

          const x =
            THREE.MathUtils.lerp(
              sx,
              tx,
              progress
            );

          const y =
            THREE.MathUtils.lerp(
              sy,
              ty,
              progress
            );

          const z =
            THREE.MathUtils.lerp(
              sz,
              tz,
              progress
            );

          /*
            Extra inward depth movement.
          */

          const depth =
            Math.sin(
              progress *
              Math.PI
            );

          temp.position.set(
            x,
            y,
            z +
              depth *
                Math.sin(
                  i * 0.09
                ) *
                1.4
          );

          /*
            Big scattered particles
            become tiny image pixels.
          */

          const size =
            THREE.MathUtils.lerp(
              particleSizes[i] *
                PARTICLE_MULTIPLIER,

              particleSizes[i],

              progress
            );

          temp.scale.set(
            size,
            size,
            size
          );

          /*
            Rotation disappears
            as the image forms.
          */

          const rotationAmount =
            1 - progress;

          temp.rotation.x =
            Math.sin(
              i * 0.31 +
              time * 0.0002
            ) *
            rotationAmount *
            1.2;

          temp.rotation.y =
            Math.cos(
              i * 0.21 +
              time * 0.0002
            ) *
            rotationAmount *
            1.2;

          temp.rotation.z =
            Math.sin(
              i * 0.13
            ) *
            rotationAmount *
            0.6;

          temp.updateMatrix();

          mesh.setMatrixAt(
            i,
            temp.matrix
          );
        }

        mesh.instanceMatrix.needsUpdate =
          true;
      }

      /*
        Slight camera pull-back as
        the image forms.
      */

      camera.position.z =
        THREE.MathUtils.lerp(
          14.5,
          17,
          currentProgress
        );

      camera.position.x =
        Math.sin(
          currentProgress *
          Math.PI
        ) *
        0.08;

      camera.position.y =
        Math.cos(
          currentProgress *
          Math.PI
        ) *
        0.04;

      camera.lookAt(
        0,
        0,
        0
      );

      renderer.render(
        scene,
        camera
      );
    };

    animate(
      performance.now()
    );

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      destroyed = true;

      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "scroll",
        calculateScroll
      );

      window.removeEventListener(
        "resize",
        resize
      );

      image.onload = null;
      image.onerror = null;

      geometry?.dispose();
      material?.dispose();

      renderer.dispose();

      if (
        stage.parentNode
      ) {
        stage.parentNode.removeChild(
          stage
        );
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="closing-particle-section"
      aria-hidden="true"
    />
  );
}