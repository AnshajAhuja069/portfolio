import Link from "next/link";
import type { Metadata } from "next";
import { publishedProjects } from "@/content/projects";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="nf-title">
      <p className="eyebrow">404</p>
      <h1 id="nf-title" className={`display ${styles.title}`}>
        This page wandered off.
      </h1>
      <p className={styles.lead}>The link may be old, or the case study may have moved. These are the ones that exist:</p>
      <ul className={styles.list} role="list">
        {publishedProjects.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/" className={styles.home}>
          Back to the homepage
        </Link>
      </p>
    </section>
  );
}
