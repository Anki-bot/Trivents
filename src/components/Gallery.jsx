"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import "./Gallery.css";

const TOTAL_ITEMS = 28;

const galleryImages = Array.from(
  { length: TOTAL_ITEMS },
  (_, index) =>
    `/gallery/${String(index + 1).padStart(2, "0")}.jpeg`
);


/* =====================================================
   GRID MOTION
===================================================== */

function GridMotion({ items }) {
  const rowRefs = useRef([]);
  const mouseX = useRef(0.5);

  const rows = useMemo(() => {
    return Array.from({ length: 4 }, (_, rowIndex) => {
      return items.slice(
        rowIndex * 7,
        rowIndex * 7 + 7
      );
    });
  }, [items]);


  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.current =
        event.clientX /
        window.innerWidth;
    };


    window.addEventListener(
      "mousemove",
      handleMouseMove,
      { passive: true }
    );


    const ticker = () => {
      const centerOffset =
        mouseX.current - 0.5;


      rowRefs.current.forEach(
        (row, index) => {

          if (!row) return;


          const direction =
            index % 2 === 0
              ? 1
              : -1;


          const distance =
            centerOffset *
            180 *
            direction;


          gsap.to(row, {
            x: distance,
            duration:
              0.9 +
              index * 0.12,
            ease: "power3.out",
            overwrite: "auto",
          });

        }
      );
    };


    gsap.ticker.add(ticker);


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );


      gsap.ticker.remove(ticker);


      rowRefs.current.forEach(
        (row) => {
          if (row) {
            gsap.killTweensOf(row);
          }
        }
      );

    };

  }, []);


  return (
    <div className="gallery-motion">

      <div className="gallery-motion-grid">

        {rows.map(
          (row, rowIndex) => (

            <div
              key={rowIndex}
              ref={(element) => {
                rowRefs.current[rowIndex] =
                  element;
              }}
              className="gallery-motion-row"
            >

              {row.map(
                (image, imageIndex) => (

                  <div
                    key={`${image}-${imageIndex}`}
                    className="gallery-motion-item"
                  >

                    <div className="gallery-motion-image-wrap">

                      <img
                        src={image}
                        alt=""
                        draggable={false}
                        loading={
                          rowIndex === 0
                            ? "eager"
                            : "lazy"
                        }
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* =====================================================
   GALLERY
===================================================== */

export default function Gallery() {

  return (
    <section
      id="gallery"
      className="gallery-section"
    >

      <div className="gallery-inner">

        {/* -----------------------------------------
            HEADER
        ----------------------------------------- */}

        <div className="gallery-header">

          <div className="gallery-kicker">

            <span />

            GALLERY

          </div>


          <h2>

            COLLABS
            <br />
            & EVENTS

          </h2>


          <p>

            A collection of moments,
            collaborations and experiences
            created along the way.

          </p>

        </div>


        {/* -----------------------------------------
            GRID MOTION
        ----------------------------------------- */}

        <GridMotion
          items={galleryImages}
        />


        {/* -----------------------------------------
            FOOTER LABEL
        ----------------------------------------- */}

        <div className="gallery-footer">

          <span>
            TRIVENTS / ARCHIVE
          </span>

          <span>
            28 MOMENTS
          </span>

        </div>

      </div>

    </section>
  );
}