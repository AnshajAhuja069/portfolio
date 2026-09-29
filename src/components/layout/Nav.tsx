import Link from "next/link";
import { profile } from "@/content/profile";
import { SurfaceWatcher } from "./SurfaceWatcher";
import styles from "./Nav.module.css";

/**
 * The wordmark and the link pill are separate fixed elements so the wordmark
 * can use a true "negative" blend against whatever is underneath it (a fixed
 * parent would isolate the blend). See Nav.module.css + SurfaceWatcher.
 */
export function Nav() {
  return (
    <header className={styles.nav}>
      <nav aria-label="Primary">
        <Link href="/" id="nav-wordmark" className={styles.wordmark}>
          <span className={styles.dot} aria-hidden="true" />
          {profile.name}
        </Link>
        <ul className={styles.links} role="list">
          <li>
            <Link href="/#work" className={styles.link}>
              Work
            </Link>
          </li>
          {profile.resume && (
            <li>
              <Link href="/resume" className={styles.link}>
                {profile.resume.label}
              </Link>
            </li>
          )}
          <li>
            <Link href="/#contact" className={styles.link}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <SurfaceWatcher />
    </header>
  );
}
