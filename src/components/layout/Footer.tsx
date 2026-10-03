import { profile } from "@/content/profile";
import { GuideRestore } from "@/components/guide/GuideRestore";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} data-surface="paper">
      <div className={`container ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p className={styles.small}>
          Built with Next.js and GSAP. <GuideRestore className={styles.restore} />
        </p>
      </div>
    </footer>
  );
}
