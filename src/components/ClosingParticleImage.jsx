"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ClosingParticleImage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer = null;
    let scene = null;
    let camera = null;
    let points = null;
    let geometry = null;
    let material = null;
    let raf = null;
    let destroyed = false;

    // =========================================================
    // EASY SETTINGS
    // =========================================================

    // Lower = fewer image pixels
    const SAMPLE_WIDTH = 240;

    // VERY SUBTLE VISIBILITY
    // 0.12 = 12%
    const MAX_OPACITY = 0.12;

    // How far the image pixels scatter
    const SCATTER_DISTANCE = 950;

    // Pixel size
    // Increase to 5.0 for even chunkier pixels
    const PIXEL_SIZE_MULTIPLIER = 4.0;

    // =========================================================
    // HELPERS
    // =========================================================

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    const ease = (value) => {
      const t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    };

    const randomFromIndex = (index) => {
      const x =
        Math.sin(index * 12.9898) *
        43758.5453123;

      return x - Math.floor(x);
    };

    // =========================================================
    // THREE SETUP
    // =========================================================

    const setup = () => {
      scene = new THREE.Scene();

      camera = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2,
        -3000,
        3000
      );

      camera.position.z = 1000;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      renderer.setClearColor(0x000000, 0);

      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "none";

      container.appendChild(
        renderer.domElement
      );
    };

    // =========================================================
    // BUILD IMAGE PIXELS
    // =========================================================

    const buildParticles = (image) => {
      const imageBox =
        document.querySelector(
          ".contact-image-box"
        );

      if (!imageBox) return;

      const boxRect =
        imageBox.getBoundingClientRect();

      const boxAspect =
        boxRect.width /
        Math.max(1, boxRect.height);

      const sourceAspect =
        image.width /
        Math.max(1, image.height);

      const sampleWidth =
        SAMPLE_WIDTH;

      const sampleHeight =
        Math.max(
          1,
          Math.round(
            sampleWidth / boxAspect
          )
        );

      const canvas =
        document.createElement("canvas");

      canvas.width = sampleWidth;
      canvas.height = sampleHeight;

      const ctx =
        canvas.getContext("2d", {
          willReadFrequently: true,
        });

      if (!ctx) return;

      // =======================================================
      // MATCH OBJECT-FIT: COVER
      // =======================================================

      let sx = 0;
      let sy = 0;
      let sw = image.width;
      let sh = image.height;

      if (sourceAspect > boxAspect) {
        // Crop left/right
        sw =
          image.height * boxAspect;

        sx =
          (image.width - sw) / 2;
      } else {
        // Crop top/bottom
        sh =
          image.width / boxAspect;

        sy =
          (image.height - sh) / 2;
      }

      ctx.drawImage(
        image,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        sampleWidth,
        sampleHeight
      );

      const pixelData =
        ctx.getImageData(
          0,
          0,
          sampleWidth,
          sampleHeight
        ).data;

      const targetPositions = [];
      const scatteredPositions = [];
      const colors = [];

      // =======================================================
      // ONE PARTICLE = ONE IMAGE PIXEL
      // =======================================================

      for (
        let y = 0;
        y < sampleHeight;
        y += 1
      ) {
        for (
          let x = 0;
          x < sampleWidth;
          x += 1
        ) {
          const index =
            (y * sampleWidth + x) * 4;

          const r =
            pixelData[index] / 255;

          const g =
            pixelData[index + 1] / 255;

          const b =
            pixelData[index + 2] / 255;

          const a =
            pixelData[index + 3] / 255;

          if (a < 0.05) continue;

          // Exact image position
          targetPositions.push(
            x / (sampleWidth - 1),
            y / (sampleHeight - 1)
          );

          // Exact color from photograph
          colors.push(r, g, b);

          // ===================================================
          // SCATTER THIS SAME IMAGE PIXEL
          // ===================================================

          const seed =
            index + 1;

          const rx =
            randomFromIndex(
              seed + 11
            );

          const ry =
            randomFromIndex(
              seed + 73
            );

          const rz =
            randomFromIndex(
              seed + 137
            );

          const angle =
            rx * Math.PI * 2;

          const radius =
            180 +
            Math.pow(ry, 0.55) *
              SCATTER_DISTANCE;

          scatteredPositions.push(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            (rz - 0.5) * 800
          );
        }
      }

      const count =
        targetPositions.length / 2;

      // =======================================================
      // CLEAN OLD OBJECTS
      // =======================================================

      if (geometry) {
        geometry.dispose();
      }

      if (material) {
        material.dispose();
      }

      if (points) {
        scene.remove(points);
      }

      // =======================================================
      // GEOMETRY
      // =======================================================

      geometry =
        new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          new Float32Array(
            count * 3
          ),
          3
        )
      );

      geometry.setAttribute(
        "aTarget",
        new THREE.Float32BufferAttribute(
          targetPositions,
          2
        )
      );

      geometry.setAttribute(
        "aScatter",
        new THREE.Float32BufferAttribute(
          scatteredPositions,
          3
        )
      );

      geometry.setAttribute(
        "aColor",
        new THREE.Float32BufferAttribute(
          colors,
          3
        )
      );

      // =======================================================
      // PIXEL MATERIAL
      // =======================================================

      material =
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          depthTest: false,

          uniforms: {
            uOpacity: {
              value: 0,
            },

            uPixelSize: {
              value: 1,
            },
          },

          vertexShader: `
            precision highp float;

            attribute vec3 aColor;

            uniform float uPixelSize;

            varying vec3 vColor;

            void main() {
              vColor = aColor;

              vec4 mvPosition =
                modelViewMatrix *
                vec4(position, 1.0);

              gl_Position =
                projectionMatrix *
                mvPosition;

              /*
               * Square pixel.
               * No circular particle falloff.
               */
              gl_PointSize = uPixelSize;
            }
          `,

          fragmentShader: `
            precision highp float;

            varying vec3 vColor;

            uniform float uOpacity;

            void main() {
              /*
               * HARD SQUARE IMAGE PIXEL
               */
              gl_FragColor =
                vec4(
                  vColor,
                  uOpacity
                );
            }
          `,
        });

      points =
        new THREE.Points(
          geometry,
          material
        );

      scene.add(points);

      console.log(
        `ClosingParticleImage: ${count} image pixels created`
      );
    };

    // =========================================================
    // LOAD IMAGE
    // =========================================================

    const loadImage = () => {
      const imageElement =
        document.querySelector(
          ".contact-image-box img"
        );

      if (!imageElement) {
        console.error(
          "ClosingParticleImage: .contact-image-box img not found"
        );
        return;
      }

      const src =
        imageElement.currentSrc ||
        imageElement.src;

      const image =
        new Image();

      image.onload = () => {
        if (destroyed) return;

        buildParticles(image);
      };

      image.onerror = () => {
        console.error(
          "ClosingParticleImage: failed to load",
          src
        );
      };

      image.src = src;
    };

    // =========================================================
    // UPDATE
    // =========================================================

    const update = () => {
      if (
        destroyed ||
        !renderer
      ) {
        return;
      }

      /*
       * Keep animation running while image loads.
       */
      if (!geometry) {
        renderer.render(
          scene,
          camera
        );

        raf =
          requestAnimationFrame(
            update
          );

        return;
      }

      const whyUs =
        document.querySelector(
          "#why-us"
        );

      const contact =
        document.querySelector(
          "#contact"
        );

      const imageBox =
        document.querySelector(
          ".contact-image-box"
        );

      if (
        !whyUs ||
        !contact ||
        !imageBox
      ) {
        renderer.render(
          scene,
          camera
        );

        raf =
          requestAnimationFrame(
            update
          );

        return;
      }

      const whyRect =
        whyUs.getBoundingClientRect();

      const contactRect =
        contact.getBoundingClientRect();

      const imageRect =
        imageBox.getBoundingClientRect();

      // =======================================================
      // DOCUMENT POSITIONS
      // =======================================================

      const whyDocumentTop =
        window.scrollY +
        whyRect.top;

      const contactDocumentTop =
        window.scrollY +
        contactRect.top;

      // =======================================================
      // ANIMATION RANGE
      // =======================================================

      /*
       * START:
       * Late in Why Us.
       */
      const start =
        whyDocumentTop +
        whyRect.height * 0.55;

      /*
       * END:
       * Before Contact enters.
       *
       * This guarantees the image is already
       * reconstructed when Contact appears.
       */
      const end =
        contactDocumentTop -
        window.innerHeight * 0.15;

      const range =
        Math.max(
          1,
          end - start
        );

      const rawProgress =
        (
          window.scrollY -
          start
        ) / range;

      const p =
        clamp(
          rawProgress,
          0,
          1
        );

      // =======================================================
      // VISIBILITY
      // =======================================================

      /*
       * Very subtle.
       *
       * 0.00 - 0.15  invisible
       * 0.15 - 0.35  fade in
       * 0.35 - 0.82  12%
       * 0.82 - 1.00  fade out
       */

      let particleOpacity = 0;

      if (
        p >= 0.15 &&
        p < 0.35
      ) {
        particleOpacity =
          ease(
            (p - 0.15) / 0.20
          ) *
          MAX_OPACITY;
      } else if (
        p >= 0.35 &&
        p < 0.82
      ) {
        particleOpacity =
          MAX_OPACITY;
      } else if (
        p >= 0.82 &&
        p <= 1
      ) {
        particleOpacity =
          (
            1 -
            ease(
              (p - 0.82) / 0.18
            )
          ) *
          MAX_OPACITY;
      }

      material.uniforms.uOpacity.value =
        particleOpacity;

      // =======================================================
      // PIXEL SIZE
      // =======================================================

      /*
       * Size based on the actual image width.
       * Still represents sampled pixels.
       */
      const pixelScale =
        imageRect.width /
        SAMPLE_WIDTH;

      const dpr =
        renderer.getPixelRatio();

      material.uniforms.uPixelSize.value =
        Math.max(
          1,
          pixelScale *
            dpr *
            PIXEL_SIZE_MULTIPLIER
        );

      // =======================================================
      // REAL IMAGE
      // =======================================================

      const realImage =
        imageBox.querySelector(
          "img"
        );

      if (realImage) {
        let imageOpacity = 0;

        /*
         * Start revealing the real image
         * after the particle reconstruction.
         */
        if (p >= 0.86) {
          imageOpacity =
            ease(
              (p - 0.86) / 0.14
            );
        }

        realImage.style.opacity =
          String(
            clamp(
              imageOpacity,
              0,
              1
            )
          );
      }

      // =======================================================
      // RECONSTRUCTION
      // =======================================================

      /*
       * 0.00 - 0.20
       * Stay scattered.
       *
       * 0.20 - 1.00
       * Slowly return to exact image coordinates.
       *
       * At p = 1 the image is COMPLETELY reconstructed.
       */
      const reconstruction =
        ease(
          clamp(
            (p - 0.20) / 0.80,
            0,
            1
          )
        );

      const positionAttribute =
        geometry.getAttribute(
          "position"
        );

      const targetAttribute =
        geometry.getAttribute(
          "aTarget"
        );

      const scatterAttribute =
        geometry.getAttribute(
          "aScatter"
        );

      const positions =
        positionAttribute.array;

      const targets =
        targetAttribute.array;

      const scatters =
        scatterAttribute.array;

      // =======================================================
      // MOVE PIXELS
      // =======================================================

      for (
        let i = 0, j = 0;
        i < targets.length;
        i += 2, j += 3
      ) {
        const u =
          targets[i];

        const v =
          targets[i + 1];

        /*
         * Exact position inside the
         * actual Contact image.
         */
        const targetX =
          imageRect.left +
          u * imageRect.width -
          window.innerWidth / 2;

        const targetY =
          -(
            imageRect.top +
            v * imageRect.height
          ) +
          window.innerHeight / 2;

        /*
         * Scatter -> image.
         */
        positions[j] =
          scatters[j] +
          (
            targetX -
            scatters[j]
          ) *
            reconstruction;

        positions[j + 1] =
          scatters[j + 1] +
          (
            targetY -
            scatters[j + 1]
          ) *
            reconstruction;

        /*
         * Z returns to image plane.
         */
        positions[j + 2] =
          scatters[j + 2] *
          (
            1 -
            reconstruction
          );
      }

      positionAttribute.needsUpdate =
        true;

      // =======================================================
      // RENDER
      // =======================================================

      renderer.render(
        scene,
        camera
      );

      raf =
        requestAnimationFrame(
          update
        );
    };

    // =========================================================
    // RESIZE
    // =========================================================

    const resize = () => {
      if (
        !renderer ||
        !camera
      ) {
        return;
      }

      camera.left =
        -window.innerWidth / 2;

      camera.right =
        window.innerWidth / 2;

      camera.top =
        window.innerHeight / 2;

      camera.bottom =
        -window.innerHeight / 2;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      /*
       * Re-sample image because
       * Contact image dimensions may change.
       */
      loadImage();
    };

    // =========================================================
    // START
    // =========================================================

    setup();

    loadImage();

    update();

    window.addEventListener(
      "resize",
      resize
    );

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      destroyed = true;

      if (raf) {
        cancelAnimationFrame(raf);
      }

      window.removeEventListener(
        "resize",
        resize
      );

      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();

      if (
        renderer?.domElement &&
        renderer.domElement.parentNode ===
          container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="closing-particle-image"
      aria-hidden="true"
    />
  );
}