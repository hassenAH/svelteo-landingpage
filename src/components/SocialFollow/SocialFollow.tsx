import { motion, type Variants } from "framer-motion";
import styles from "./SocialFollow.module.scss";

export type SocialLink = {
    label: string;
    href: string;
    iconSrc: string; // e.g. /icons/facebook.svg
    aria?: string;   // optional, overrides label for screen readers
};

type SocialFollowProps = {
    title?: string;
    subtitle?: string;
    links?: SocialLink[];
};

const container: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "tween", duration: 0.45, ease: [0.22, 0.61, 0.36, 1], staggerChildren: 0.08 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 20 } }
};

export default function SocialFollow({
    title = "Suivez-nous sur les réseaux",
    subtitle = "Rejoignez la communauté Sveltéo pour des conseils, des nouveautés et des offres exclusives.",
    links = [
        { label: "Facebook", href: "https://facebook.com", iconSrc: "/icons/facebook.svg" },
        { label: "Instagram", href: "https://instagram.com", iconSrc: "/icons/instagram.svg" },
        { label: "Email", href: "mailto:info@svelteo.fr", iconSrc: "/icons/email.svg", aria: "Envoyer un e-mail" },
        // add more if needed
    ],
}: SocialFollowProps) {
    return (
        <section className={styles.section} aria-labelledby="social-title">
            <motion.div
                className={styles.inner}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
            >
                <motion.header className={styles.header} variants={item}>
                    <h2 id="social-title" className={styles.title}>{title}</h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                </motion.header>

                <ul className={styles.grid} role="list">
                    {links.map((l) => (
                        <motion.li key={l.href} className={styles.card} variants={item}>
                            <motion.a
                                href={l.href}
                                className={styles.btn}
                                aria-label={l.aria ?? l.label}
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                target={l.href.startsWith("http") ? "_blank" : undefined}
                                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            >
                                <span className={styles.iconWrap}>
                                    <img src={l.iconSrc} alt="" width={22} height={22} />
                                </span>
                                <span className={styles.label}>{l.label}</span>
                            </motion.a>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </section>
    );
}
