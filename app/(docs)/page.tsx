'use client';

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <img
            src="/logo_light.png"
            alt="S-Drone Logo"
            className={`${styles.logo} logo-light`}
          />
          <img
            src="/logo_dark.png"
            alt="S-Drone Logo"
            className={`${styles.logo} logo-dark`}
          />
        </div>

        <div className={styles.intro}>
          <h1>SDRONE Design Documentation</h1>
          <p>
            A comprehensive documentation for design handoff with prototype.
          </p>
        </div>

        <div className={styles.ctas}>
          <Link
            href="/login"
            className={styles.primary}
            target="_blank"
          >
            Web
          </Link>
          <Link
            href="/mobile-login"
            className={styles.primary}
            target="_blank"
          >
            Mobile
          </Link>
          <a
            href="https://github.com/mohdshakeb/sdrone_docs.git"
            className={styles.secondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Github
          </a>
        </div>
      </main>

      <style jsx global>{`
        [data-theme='light'] .logo-dark { display: none; }
        [data-theme='dark'] .logo-light { display: none; }
      `}</style>
    </div>
  );
}
