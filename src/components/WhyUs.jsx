"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* =====================================================
   WHY US DATA
===================================================== */

const cards = [
  {
    number: "01",
    title: "CREATE",
    description:
      "Ideas with intention. From concept to execution, we build moments that feel distinct.",
    images: [
      "/why-us/create/01.jpeg",
      "/why-us/create/02.jpeg",
      "/why-us/create/03.jpeg",
      "/why-us/create/04.jpeg",
      "/why-us/create/05.jpeg",
    ],
  },
  {
    number: "02",
    title: "CONNECT",
    description:
      "People before platforms. We create experiences that bring communities together.",
    images: [
      "/why-us/connect/01.jpeg",
      "/why-us/connect/02.jpeg",
      "/why-us/connect/03.jpeg",
      "/why-us/connect/04.jpeg",
      "/why-us/connect/05.jpeg",
    ],
  },
  {
    number: "03",
    title: "CAPTURE",
    description:
      "Moments that stay. Visuals and stories designed to live beyond the event itself.",
    images: [
      "/why-us/capture/01.jpeg",
      "/why-us/capture/02.jpeg",
      "/why-us/capture/03.jpeg",
      "/why-us/capture/04.jpeg",
      "/why-us/capture/05.jpeg",
    ],
  },
];


/* =====================================================
   VERTEX SHADER

   Used ONLY during image transitions.
===================================================== */

const vertexShader = `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;


/* =====================================================
   FRAGMENT SHADER

   IMPORTANT:

   This shader is NOT used for the normal photograph.

   It only exists while changing from one image
   to another.

   No:
   - dark overlay
   - brightness change
   - RGB split
   - chromatic aberration
   - permanent opacity
===================================================== */

const fragmentShader = `
  precision highp float;

  uniform sampler2D tex1;
  uniform sampler2D tex2;

  uniform float progress;

  varying vec2 vUv;


  void main() {

    /*
      Very subtle displacement.

      This only exists during the transition.
    */

    float strength = 0.045;


    float sourceNoise =
      texture2D(
        tex2,
        vUv
      ).r;


    float targetNoise =
      texture2D(
        tex1,
        vUv
      ).r;


    float sourceDisplacement =
      (sourceNoise - 0.5) *
      strength *
      progress;


    float targetDisplacement =
      (targetNoise - 0.5) *
      strength *
      (1.0 - progress);


    vec2 sourceUv =
      vUv +
      vec2(
        0.0,
        sourceDisplacement
      );


    vec2 targetUv =
      vUv -
      vec2(
        0.0,
        targetDisplacement
      );


    /*
      Prevent sampling outside the texture.
    */

    sourceUv =
      clamp(
        sourceUv,
        vec2(0.001),
        vec2(0.999)
      );


    targetUv =
      clamp(
        targetUv,
        vec2(0.001),
        vec2(0.999)
      );


    vec4 source =
      texture2D(
        tex1,
        sourceUv
      );


    vec4 target =
      texture2D(
        tex2,
        targetUv
      );


    /*
      Clean transition.

      No color manipulation.
      No RGB splitting.
    */

    vec4 finalColor =
      mix(
        source,
        target,
        smoothstep(
          0.0,
          1.0,
          progress
        )
      );


    gl_FragColor =
      finalColor;
  }
`;


/* =====================================================
   SHADER TRANSITION CANVAS
===================================================== */

function TransitionCanvas({
  from,
  to,
  onComplete,
}) {
  const containerRef = useRef(null);

  const rendererRef = useRef(null);
  const materialRef = useRef(null);

  const animationRef = useRef(null);

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }


    let disposed = false;


    /* -----------------------------------------------
       SCENE
    ----------------------------------------------- */

    const scene =
      new THREE.Scene();


    /* -----------------------------------------------
       ORTHOGRAPHIC CAMERA

       No perspective distortion.
    ----------------------------------------------- */

    const camera =
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0.1,
        10
      );

    camera.position.z = 1;


    /* -----------------------------------------------
       RENDERER
    ----------------------------------------------- */

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      });


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        3
      )
    );


    renderer.setClearColor(
      0x000000,
      0
    );


    renderer.outputColorSpace =
      THREE.SRGBColorSpace;


    renderer.toneMapping =
      THREE.NoToneMapping;


    rendererRef.current =
      renderer;


    container.appendChild(
      renderer.domElement
    );


    /* -----------------------------------------------
       FULL SCREEN PLANE
    ----------------------------------------------- */

    const geometry =
      new THREE.PlaneGeometry(
        2,
        2,
        1,
        1
      );


    /* -----------------------------------------------
       TEXTURES
    ----------------------------------------------- */

    const loader =
      new THREE.TextureLoader();


    const loadTexture =
      async (src) => {

        const texture =
          await loader.loadAsync(
            src
          );


        texture.colorSpace =
          THREE.SRGBColorSpace;


        texture.generateMipmaps =
          true;


        texture.minFilter =
          THREE.LinearMipmapLinearFilter;


        texture.magFilter =
          THREE.LinearFilter;


        texture.anisotropy =
          Math.min(
            renderer
              .capabilities
              .getMaxAnisotropy(),
            16
          );


        texture.needsUpdate =
          true;


        return texture;
      };


    /* -----------------------------------------------
       SETUP
    ----------------------------------------------- */

    const setup =
      async () => {

        try {

          const [
            sourceTexture,
            targetTexture,
          ] =
            await Promise.all([
              loadTexture(from),
              loadTexture(to),
            ]);


          if (disposed) {

            sourceTexture.dispose();
            targetTexture.dispose();

            return;

          }


          /* -----------------------------------------
             MATERIAL
          ----------------------------------------- */

          const material =
            new THREE.ShaderMaterial({

              uniforms: {

                tex1: {
                  value:
                    sourceTexture,
                },

                tex2: {
                  value:
                    targetTexture,
                },

                progress: {
                  value: 0,
                },

              },


              vertexShader,
              fragmentShader,


              transparent: true,


              depthWrite: false,
              depthTest: false,

            });


          materialRef.current =
            material;


          /* -----------------------------------------
             MESH
          ----------------------------------------- */

          const mesh =
            new THREE.Mesh(
              geometry,
              material
            );


          scene.add(mesh);


          /* -----------------------------------------
             RESIZE
          ----------------------------------------- */

          const resize =
            () => {

              if (!container) {
                return;
              }


              const width =
                container.clientWidth;


              const height =
                container.clientHeight;


              if (
                !width ||
                !height
              ) {
                return;
              }


              renderer.setSize(
                width,
                height,
                false
              );

            };


          resize();


          const resizeObserver =
            new ResizeObserver(
              resize
            );


          resizeObserver.observe(
            container
          );


          /* -----------------------------------------
             ANIMATION
          ----------------------------------------- */

          const startTime =
            performance.now();


          const duration = 650;


          const animate =
            (time) => {

              if (disposed) {
                return;
              }


              const elapsed =
                time -
                startTime;


              const rawProgress =
                Math.min(
                  elapsed /
                    duration,
                  1
                );


              /*
                Smooth easing.
              */

              const eased =
                1 -
                Math.pow(
                  1 -
                    rawProgress,
                  3
                );


              material.uniforms.progress.value =
                eased;


              renderer.render(
                scene,
                camera
              );


              if (
                rawProgress <
                1
              ) {

                animationRef.current =
                  requestAnimationFrame(
                    animate
                  );

              } else {

                /*
                  Transition finished.

                  The parent immediately switches
                  back to the REAL <img>.
                */

                resizeObserver.disconnect();


                sourceTexture.dispose();
                targetTexture.dispose();

                material.dispose();
                geometry.dispose();

                renderer.dispose();


                if (
                  renderer.domElement
                    .parentNode
                ) {

                  renderer.domElement
                    .parentNode
                    .removeChild(
                      renderer.domElement
                    );

                }


                onComplete();

              }

            };


          animationRef.current =
            requestAnimationFrame(
              animate
            );

        } catch (error) {

          console.error(
            "WhyUs transition error:",
            error
          );

          onComplete();

        }

      };


    setup();


    /* -----------------------------------------------
       CLEANUP
    ----------------------------------------------- */

    return () => {

      disposed = true;


      if (
        animationRef.current
      ) {

        cancelAnimationFrame(
          animationRef.current
        );

      }


      if (
        materialRef.current
      ) {

        materialRef.current.dispose();

      }


      if (
        renderer.domElement
          .parentNode
      ) {

        renderer.domElement
          .parentNode
          .removeChild(
            renderer.domElement
          );

      }


      geometry.dispose();


      renderer.dispose();

    };

  }, [
    from,
    to,
    onComplete,
  ]);


  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}


/* =====================================================
   SHADER CARD
===================================================== */

function ShaderCard({
  card,
}) {

  const [currentIndex, setCurrentIndex] =
    useState(0);


  const [transition, setTransition] =
    useState(null);


  const [imageRatio, setImageRatio] =
    useState(null);


  const currentImage =
    card.images[currentIndex];


  /* -----------------------------------------------
     GET ORIGINAL IMAGE DIMENSIONS

     This allows the photo container to follow
     the actual photograph instead of forcing it
     into a different aspect ratio.
  ----------------------------------------------- */

  useEffect(() => {

    const image =
      new Image();


    image.onload =
      () => {

        if (
          image.naturalWidth &&
          image.naturalHeight
        ) {

          setImageRatio(
            image.naturalWidth /
            image.naturalHeight
          );

        }

      };


    image.src =
      currentImage;

  }, [
    currentImage,
  ]);


  /* -----------------------------------------------
     START TRANSITION
  ----------------------------------------------- */

  const startTransition =
    (direction) => {

      if (transition) {
        return;
      }


      const nextIndex =
        Math.max(
          0,
          Math.min(
            card.images.length - 1,
            currentIndex +
              direction
          )
        );


      if (
        nextIndex ===
        currentIndex
      ) {
        return;
      }


      setTransition({
        from:
          currentImage,

        to:
          card.images[
            nextIndex
          ],

        nextIndex,
      });

    };


  /* -----------------------------------------------
     WHEEL
  ----------------------------------------------- */

  const handleWheel =
    (event) => {

      event.preventDefault();


      if (
        Math.abs(
          event.deltaY
        ) < 2
      ) {
        return;
      }


      startTransition(
        event.deltaY > 0
          ? 1
          : -1
      );

    };


  /* -----------------------------------------------
     TRANSITION COMPLETE
  ----------------------------------------------- */

  const finishTransition =
    () => {

      if (!transition) {
        return;
      }


      setCurrentIndex(
        transition.nextIndex
      );


      setTransition(
        null
      );

    };


  return (
    <article
      className="why-us-card"
      style={{
        position: "relative",
        zIndex: 50,
        isolation: "isolate",
      }}
    >

      {/* -----------------------------------------
          TOP
      ----------------------------------------- */}

      <div
        className="why-us-card-top"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >

        <span
          className="why-us-card-number"
        >
          {card.number}
        </span>


        <span
          className="why-us-card-status"
        >
          05 IMAGES
        </span>

      </div>


      {/* -----------------------------------------
          PHOTO AREA

          IMPORTANT:

          The real <img> is always underneath.

          Three.js only appears during transition.
      ----------------------------------------- */}

      <div
        className="why-us-shader"
        onWheel={handleWheel}
        style={{
          position: "relative",

          width: "100%",

          /*
            Follow the actual image ratio.
            This prevents forcing a portrait image
            into an unrelated shape.
          */

          aspectRatio:
            imageRatio
              ? `${imageRatio}`
              : "736 / 1308",

          minHeight: 0,

          overflow: "hidden",

          borderRadius: 11,

          background:
            "#080808",

          cursor:
            transition
              ? "wait"
              : "grab",

          touchAction:
            "pan-y",

          userSelect:
            "none",

          /*
            Absolutely no visual processing.
          */

          filter:
            "none",

          opacity: 1,

          mixBlendMode:
            "normal",

          isolation:
            "isolate",

          /*
            Above the global spectral ghost.
          */

          zIndex: 60,
        }}
      >

        {/* ---------------------------------------
            ORIGINAL PHOTO

            This is the important part.

            Browser renders the JPEG directly.
            No Three.js.
            No shader.
            No filter.
            No opacity.
            No color manipulation.
        --------------------------------------- */}

        <img
          src={currentImage}
          alt={`${card.title} event`}
          draggable={false}
          style={{
            position:
              "absolute",

            inset: 0,

            display:
              "block",

            width:
              "100%",

            height:
              "100%",

            /*
              The image already determines the
              container aspect ratio, so there is
              no stretching or forced crop.
            */

            objectFit:
              "fill",

            objectPosition:
              "center",

            margin:
              0,

            padding:
              0,

            opacity:
              1,

            filter:
              "none",

            mixBlendMode:
              "normal",

            transform:
              "none",

            zIndex:
              1,
          }}
        />


        {/* ---------------------------------------
            THREE.JS TRANSITION

            Exists ONLY while changing photos.
        --------------------------------------- */}

        {transition && (
          <TransitionCanvas
            from={
              transition.from
            }
            to={
              transition.to
            }
            onComplete={
              finishTransition
            }
          />
        )}

      </div>


      {/* -----------------------------------------
          BOTTOM
      ----------------------------------------- */}

      <div
        className="why-us-card-bottom"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >

        <div>

          <h3>
            {card.title}
          </h3>


          <p>
            {card.description}
          </p>

        </div>


        <div
          className="why-us-scroll"
        >

          SCROLL

          <span>
            ↕
          </span>

        </div>

      </div>


      <div
        className="why-us-card-line"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      />

    </article>
  );
}


/* =====================================================
   WHY US
===================================================== */

export default function WhyUs() {

  return (

    <section
      id="why-us"
      className="why-us-section"
      style={{
        position: "relative",

        /*
          Keeps the whole Why Us section above
          the global spectral/cursor canvas.
        */

        zIndex: 50,

        isolation: "isolate",
      }}
    >

      <div
        className="why-us-inner"
        style={{
          position: "relative",
          zIndex: 50,
        }}
      >

        {/* -----------------------------------------
            HEADER
        ----------------------------------------- */}

        <div
          className="why-us-header"
          style={{
            position: "relative",
            zIndex: 50,
          }}
        >

          <div
            className="why-us-kicker"
          >

            <span />

            WHY TRIVENTS

          </div>


          <h2>
            EXPERIENCE BEYOND ORDINARY
          </h2>


          <p>

            We turn events into
            experiences, experiences
            into stories, and stories
            into something people
            remember.

          </p>

        </div>


        {/* -----------------------------------------
            CARDS
        ----------------------------------------- */}

        <div
          className="why-us-grid"
          style={{
            position: "relative",
            zIndex: 50,
          }}
        >

          {cards.map(
            (card) => (

              <ShaderCard
                key={
                  card.title
                }
                card={
                  card
                }
              />

            )
          )}

        </div>

      </div>

    </section>
  );
}