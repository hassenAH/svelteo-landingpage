import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import styles from "./Navbar.module.scss";

const LINKS = [
    { label: "Rendez-vous", href: "#rendezvous" },
    { label: "Nos offres", href: "#offres" },
    { label: "Découvrez-nous", href: "#about" },
    { label: "Prestations", href: "#services" },
    { label: "Nous contacter", href: "#contact" },
];

const listVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 220, damping: 22 },
    },
};

const drawerVariants: Variants = {
    hidden: { y: -16, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 220,
            damping: 20,
            when: "beforeChildren",
            staggerChildren: 0.06,
        },
    },
    exit: { y: -8, opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const drawerItem: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function Navbar() {
    const [open, setOpen] = useState(false);

    // Sticky state for glass background
    const [sticky, setSticky] = useState(false);
    useEffect(() => {
        const onScroll = () => setSticky(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.header
            className={`${styles.header} ${sticky ? styles.isSticky : ""}`}
        >
            <nav aria-label="Primary" className={styles.nav}>
                {/* Logo */}
                <a href="/" className={styles.logo} aria-label="Sveltéo home">
                    <motion.img
                        src="/logo-svelteo.webp"
                        alt="Sveltéo"
                        loading="lazy"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                </a>

                {/* Desktop links */}
                <div className={styles.desktopWrap}>
                    <motion.ul
                        className={styles.menuPill}
                        variants={listVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.6 }}
                    >
                        {LINKS.map(({ label, href }) => (
                            <motion.li key={label} className={styles.item} variants={itemVariants}>
                                <motion.a
                                    href={href}
                                    whileHover={{ color: "#0f9c9c", y: -1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                >
                                    {label}
                                    <motion.span
                                        aria-hidden
                                        className={styles.underline}
                                        initial={{ scaleX: 0, originX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                    />
                                </motion.a>
                            </motion.li>
                        ))}

                        {/* Social icons */}
                        <li className={styles.icon}>
                            <motion.a href="https://www.facebook.com/SvelteoNice?locale=fr_FR" whileHover={{ y: -1, scale: 1.02 }}>
                                <img src="/icons/facebook.svg" alt="Facebook" className={styles.svgIcon} />
                            </motion.a>
                            <motion.a href="https://www.instagram.com/svelteo_clinic_minceur_nice/" whileHover={{ y: -1, scale: 1.02 }}>
                                <img src="/icons/instagram.svg" alt="Instagram" className={styles.svgIcon} />
                            </motion.a>
                            <motion.a href="mailto:info@svelteo.com" whileHover={{ y: -1, scale: 1.02 }}>
                                <img src="/icons/email.svg" alt="Email" className={styles.svgIcon} />
                            </motion.a>
                        </li>
                    </motion.ul>
                </div>

                {/* Mobile burger */}
                <motion.button
                    className={styles.burger}
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    whileTap={{ scale: 0.96 }}
                >
                    <div className={`${styles.bar} ${open ? styles.open : ""}`} />
                </motion.button>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        className={styles.drawer}
                        variants={drawerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        {LINKS.map(({ label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                variants={drawerItem}
                                onClick={() => setOpen(false)}
                                whileHover={{ color: "#0f9c9c" }}
                            >
                                {label}
                            </motion.a>
                        ))}
                        <div className={styles.drawerIcon}>
                            <motion.a href="https://www.facebook.com/SvelteoNice?locale=fr_FR" >
                                <img src="/icons/facebook.svg" alt="Facebook" className={styles.svgIcon} />
                            </motion.a>
                            <motion.a href="https://www.instagram.com/svelteo_clinic_minceur_nice/" >
                                <img src="/icons/instagram.svg" alt="Instagram" className={styles.svgIcon} />
                            </motion.a>
                            <motion.a href="mailto:info@svelteo.com" >
                                <img src="/icons/email.svg" alt="Email" className={styles.svgIcon} />
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
