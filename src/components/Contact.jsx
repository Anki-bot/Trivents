export default function Contact() {
  return (
    <section
      id="contact"
      className="contact-section"
    >
      <div className="contact-layout">

        {/* =========================================
            LEFT — CONTACT CONTENT
        ========================================= */}

        <div className="contact-copy">

          <div className="contact-kicker">
            <span />
            CONTACT
          </div>

          <h2 className="contact-heading">
            LET&apos;S CREATE
            <br />
            SOMETHING
            <br />
            MEMORABLE
          </h2>

          <a
            href="mailto:creative.trivents@gmail.com"
            className="contact-email"
          >
            creative.trivents@gmail.com
          </a>

          <div className="contact-action-wrap">
            <a
              href="mailto:creative.trivents@gmail.com"
              className="contact-button"
            >
              Join Us Now
            </a>
          </div>

        </div>

        {/* =========================================
            RIGHT — IMAGE
        ========================================= */}

        <div className="contact-visual">

          <div className="contact-image-box">
            <img
              src="/closing/College.jpeg"
              alt="Trinity Institute, Greater Noida"
            />
          </div>

          <div className="contact-image-caption">
               TRIVENTS @TIIPS GN
          </div>

        </div>

      </div>
    </section>
  );
}