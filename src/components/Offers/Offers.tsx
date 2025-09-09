// Offers.tsx
import { MotionConfig, motion, type Variants } from "framer-motion";
import styles from "./Offers.module.scss";

export type Offer = {
    badge: string;
    title: string;
    lines: string[];
    price: string;
    featured?: boolean;
    href?: string;
};

type OffersProps = {
    id?: string;
    offers?: Offer[];
    /** Anchor to booking section (e.g. "#rendezvous") */
    reserveHref?: string;
    reserveLabel?: string;
    note?: string;
};

const container: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 0.61, 0.36, 1],
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const cardV: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 220, damping: 22 },
    },
};

export default function Offers({
    id = "offres",
    reserveHref = "#rendezvous",
    reserveLabel = "Réserver maintenant",
    note = "Offres réservées aux nouveaux clients, places limitées. Prix TTC. Sveltéo Clinic Minceur – 14 Boulevard Risso, 06300 Nice.",
    offers = [
        {
            badge: "Offre la plus choisie",
            title: "Soin découverte minceur 40 min",
            lines: ["Bilan morphologique offert – durée totale ~1h30"],
            price: "29,90 €",
            featured: true,
        },
        {
            badge: "Point de départ",
            title: "Bilan morphologique complet",
            lines: ["Analyse corporelle, habitudes & objectifs – ~45 min"],
            price: "19,90 €",
        },
        {
            badge: "Offre découverte",
            title: "Séance découverte Cryolipolyse (1 zone)",
            lines: [
                "Idéal pour tester la cryolipolyse – traitement ciblé par le froid pour réduire les graisses localisées (au lieu de 156 €).",
            ],
            price: "99,50 €",
        },
    ],
}: OffersProps) {
    // derive anchor id if reserveHref starts with "#"
    const bookingAnchorId =
        reserveHref && reserveHref.startsWith("#")
            ? reserveHref.slice(1) || "rendezvous"
            : "rendezvous";

    const handlePick = (offreTitle: string) => {
        // 1) Update Booking form via global event
        window.dispatchEvent(new CustomEvent<string>("set-offre", { detail: offreTitle }));

        // 2) Smooth-scroll to booking section if present
        const el = document.getElementById(bookingAnchorId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <MotionConfig reducedMotion="user">
            <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
                <motion.div
                    className={styles.inner}
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                >
                    <header className={styles.header}>
                        <h2 id={`${id}-title`} className={styles.title}>
                            Nos offres
                        </h2>
                        <p className={styles.subtitle}>
                            Choisissez votre point d’entrée et démarrez sereinement votre programme personnalisé.
                        </p>
                    </header>

                    <div className={styles.grid}>
                        {offers.map((o, i) => (
                            <motion.article
                                key={i}
                                className={`${styles.card} ${o.featured ? styles.featured : ""}`}
                                variants={cardV}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                                role="button"
                                tabIndex={0}
                                onClick={() => handlePick(o.title)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault(); // prevent page scroll on Space
                                        handlePick(o.title);
                                    }
                                }}
                                aria-label={`Choisir l’offre ${o.title}`}
                            >
                                <div className={styles.cardBorder}>
                                    <div className={styles.cardBody}>
                                        <div className={styles.badgeRow}>
                                            <span className={styles.badge}>{o.badge}</span>
                                        </div>

                                        <h3 className={styles.cardTitle}>{o.title}</h3>

                                        <ul className={styles.list} role="list">
                                            {o.lines.map((ln, idx) => (
                                                <li key={idx} className={styles.listItem}>
                                                    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                                                        <path
                                                            d="M7.5 13.2l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L13.5 7l-6 6.2z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                    <span>{ln}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={styles.priceRow} aria-label={`Prix ${o.price}`}>
                                            <span className={styles.price}>{o.price}</span>
                                        </div>

                                        <motion.a
                                            href={reserveHref}
                                            className={styles.btnPrimary}
                                            whileHover={{ y: -2, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            aria-label={`${reserveLabel} – ${o.title}`}
                                            onClick={(e) => {
                                                e.preventDefault(); // avoid jumping if it's an anchor
                                                handlePick(o.title);
                                            }}
                                        >
                                            {reserveLabel}
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <p className={styles.note}>{note}</p>
                </motion.div>
            </section>
        </MotionConfig>
    );
}
