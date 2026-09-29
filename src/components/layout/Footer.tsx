import { profile } from "@/content/profile";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p className={styles.small}>Built with Next.js and GSAP.</p>
      </div>
    </footer>
  );
}
