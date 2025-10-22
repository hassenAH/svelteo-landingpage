import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type TargetAndTransition, type Variants } from "framer-motion";
import styles from "./Hero.module.scss";

type Slide = { src: string; alt?: string };

type HeroProps = {
    title?: string;
    description?: string;
    slides?: Slide[];
    /** Auto-advance delay in ms (set to 0 to disable) */
    autoPlayMs?: number;
    fit?: "cover" | "contain" | "fill";
    objectPosition?: string; // e.g. "50% 50%", "center top"
    /** Optional primary CTA */
    cta?: { label: string; href: string } | null;
};

const DEFAULT_SLIDES: Slide[] = [
    { src: "/images/hero-1.webp", alt: "Cryolipolyse en cabine" },
    { src: "/images/hero-2.webp", alt: "Soin manuel amincissant" },
    { src: "/images/hero-3.webp", alt: "Tunnel infrarouge & soins détox" },
];

const swipeConfidenceThreshold = 6_000; // framer demo-style heuristic

export default function Hero({
    title = "Retrouvez votre silhouette en toute sérénité",
    description = `Sveltéo Clinic Minceur accompagne femmes et hommes avec des protocoles sur mesure : cryolipolyse, pressothérapie, tunnel infrarouge & soins détox, coaching alimentaire et bilan morphologique. Un cadre chic, un suivi sérieux, des résultats concrets.`,
    slides = DEFAULT_SLIDES,
    autoPlayMs = 5000,
    fit = "cover",
    objectPosition = "50% 50%",
    cta = { label: "Prendre rendez-vous", href: "#rendezvous" },
}: HeroProps) {
    const total = Math.max(1, slides.length);
    const [page, setPage] = useState(0); // virtual page (can go negative)
    const [direction, setDirection] = useState(0); // -1 left, +1 right
    const [hovered, setHovered] = useState(false);

    const index = useMemo(() => {
        // wrap page into [0,total)
        const m = ((page % total) + total) % total;
        return m;
    }, [page, total]);

    // autoplay
    useEffect(() => {
        if (!autoPlayMs || autoPlayMs < 800 || hovered || total < 2) return;
        const t = setInterval(() => paginate(+1), autoPlayMs);
        return () => clearInterval(t);
    }, [autoPlayMs, hovered, total, page]);

    function paginate(dir: number) {
        setDirection(dir);
        setPage((p) => p + dir);
    }

    function onDragEnd(_e: any, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (swipe < -swipeConfidenceThreshold) paginate(+1);
        else if (swipe > swipeConfidenceThreshold) paginate(-1);
    }

    // Variants for slide animation
    const slideVariants: Variants = {
        enter: (dir: number): TargetAndTransition => ({
            x: dir > 0 ? 120 : -120,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 260, damping: 24 },
        } as TargetAndTransition,
        exit: (dir: number): TargetAndTransition => ({
            x: dir > 0 ? -120 : 120,
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.22 },
        }),
    };

    return (
        <MotionConfig reducedMotion="user">
            <section className={styles.hero} aria-labelledby="hero-title">
                <div className={styles.inner}>
                    {/* Left copy */}
                    <motion.div
                        className={styles.left}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    >
                        <h1 id="hero-title" className={styles.title}>
                            {title}
                        </h1>
                        <p className={styles.desc}>{description}</p>

                        {cta && (
                            <div className={styles.actions}>
                                <motion.a
                                    href={cta.href}
                                    className={styles.btnPrimary}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                    {cta.label}
                                </motion.a>
                            </div>
                        )}
                    </motion.div>

                    {/* Right carousel */}
                    <div
                        className={styles.right}
                        aria-roledescription="carousel"
                        aria-label="Galerie Sveltéo"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onFocus={() => setHovered(true)}
                        onBlur={() => setHovered(false)}
                    >
                        <div className={styles.frame}>
                            <AnimatePresence custom={direction} initial={false}>
                                <motion.img
                                    key={page} // force re-animate on page change
                                    src={slides[index]?.src}
                                    alt={slides[index]?.alt ?? ""}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className={styles.slide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    drag="x"
                                    dragElastic={0.9}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={onDragEnd}
                                    style={{ objectFit: fit, objectPosition }}
                                />
                            </AnimatePresence>

                            {total > 1 && (
                                <>
                                    {/* Arrows */}
                                    <motion.button
                                        className={`${styles.arrow} ${styles.leftArrow}`}
                                        aria-label="Précédent"
                                        onClick={() => paginate(-1)}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        className={`${styles.arrow} ${styles.rightArrow}`}
                                        aria-label="Suivant"
                                        onClick={() => paginate(+1)}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </motion.button>

                                    {/* Dots */}
                                    <div className={styles.dots} role="tablist" aria-label="Navigation des images">
                                        {slides.map((_, i) => {
                                            const isActive = i === index;
                                            return (
                                                <button
                                                    key={i}
                                                    role="tab"
                                                    aria-selected={isActive}
                                                    aria-label={`Aller à l’image ${i + 1}`}
                                                    className={`${styles.dot} ${isActive ? styles.dotActive : ""}`}
                                                    onClick={() => {
                                                        setDirection(i > index ? +1 : -1);
                                                        setPage((p) => p + (i - index));
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </MotionConfig>
    );
}
