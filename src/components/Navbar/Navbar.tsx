import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Navbar.module.scss";

const LINKS = ["Rendez-vous", "Nos offres", "Prestations", "Franchise", "Nous contacter"];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className={styles.header}>
            <nav aria-label="Primary" className={styles.nav}>
                {/* Logo */}
                <a href="/" className={styles.logo} aria-label="Sveltéo home">
                    <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/db2295f13eeb1803b3512c80e67cf190b559cfd2?width=492"
                        alt="Sveltéo"
                        loading="lazy"
                    />
                </a>

                {/* Desktop links */}
                <div className={styles.desktopWrap}>
                    <ul className={styles.menuPill}>
                        {LINKS.map((item) => (
                            <li key={item} className={styles.item}>
                                <a href="#">{item}</a>
                            </li>
                        ))}
                        <li className={styles.icon}>
                            <li className={styles.icon}>
                                <a href="#">
                                    <img src="/icons/facebook.svg" alt="Social links" className={styles.svgIcon} />
                                </a>
                            </li>
                            <li className={styles.icon}>
                                <a href="#">
                                    <img src="/icons/instagram.svg" alt="Social links" className={styles.svgIcon} />
                                </a>
                            </li><li className={styles.icon}>
                                <a href="#">
                                    <img src="/icons/email.svg" alt="Social links" className={styles.svgIcon} />
                                </a>
                            </li>
                        </li>
                    </ul>
                </div>

                {/* Mobile menu button */}
                <button
                    className={styles.burger}
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                >

                    <div className={`${styles.bar} ${open ? styles.open : ""}`} />
                </button>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        className={styles.drawer}
                        initial={{ y: -16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        {LINKS.map((item) => (
                            <a key={item} href="#" onClick={() => setOpen(false)}>
                                {item}
                            </a>
                        ))}
                        <div className={styles.drawerIcon}>
                            {/* icon again if you want it on mobile */}
                            <svg width="81" height="21" viewBox="0 0 81 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M20.156 10.525C20.156 5.005 15.676 0.525002 10.156 0.525002C4.63601 0.525002 0.156006 5.005 0.156006 10.525C0.156006 15.365 3.59601 19.395 8.15601 20.325V13.525H6.15601V10.525H8.15601V8.025C8.15601 6.095 9.72601 4.525 11.656 4.525H14.156V7.525H12.156C11.606 7.525 11.156 7.975 11.156 8.525V10.525H14.156V13.525H11.156V20.475C16.206 19.975 20.156 15.715 20.156 10.525Z" fill="#1E1E1E" />
                                <path d="M35.956 0.5H44.356C47.556 0.5 50.156 3.1 50.156 6.3V14.7C50.156 16.2383 49.5449 17.7135 48.4572 18.8012C47.3695 19.8889 45.8943 20.5 44.356 20.5H35.956C32.756 20.5 30.156 17.9 30.156 14.7V6.3C30.156 4.76174 30.7671 3.28649 31.8548 2.19878C32.9425 1.11107 34.4178 0.5 35.956 0.5ZM35.756 2.5C34.8012 2.5 33.8856 2.87928 33.2104 3.55442C32.5353 4.22955 32.156 5.14522 32.156 6.1V14.9C32.156 16.89 33.766 18.5 35.756 18.5H44.556C45.5108 18.5 46.4265 18.1207 47.1016 17.4456C47.7767 16.7705 48.156 15.8548 48.156 14.9V6.1C48.156 4.11 46.546 2.5 44.556 2.5H35.756ZM45.406 4C45.7375 4 46.0555 4.1317 46.2899 4.36612C46.5243 4.60054 46.656 4.91848 46.656 5.25C46.656 5.58152 46.5243 5.89946 46.2899 6.13388C46.0555 6.3683 45.7375 6.5 45.406 6.5C45.0745 6.5 44.7565 6.3683 44.5221 6.13388C44.2877 5.89946 44.156 5.58152 44.156 5.25C44.156 4.91848 44.2877 4.60054 44.5221 4.36612C44.7565 4.1317 45.0745 4 45.406 4ZM40.156 5.5C41.4821 5.5 42.7539 6.02678 43.6915 6.96447C44.6292 7.90215 45.156 9.17392 45.156 10.5C45.156 11.8261 44.6292 13.0979 43.6915 14.0355C42.7539 14.9732 41.4821 15.5 40.156 15.5C38.8299 15.5 37.5582 14.9732 36.6205 14.0355C35.6828 13.0979 35.156 11.8261 35.156 10.5C35.156 9.17392 35.6828 7.90215 36.6205 6.96447C37.5582 6.02678 38.8299 5.5 40.156 5.5ZM40.156 7.5C39.3604 7.5 38.5973 7.81607 38.0347 8.37868C37.4721 8.94129 37.156 9.70435 37.156 10.5C37.156 11.2956 37.4721 12.0587 38.0347 12.6213C38.5973 13.1839 39.3604 13.5 40.156 13.5C40.9517 13.5 41.7147 13.1839 42.2773 12.6213C42.8399 12.0587 43.156 11.2956 43.156 10.5C43.156 9.70435 42.8399 8.94129 42.2773 8.37868C41.7147 7.81607 40.9517 7.5 40.156 7.5Z" fill="#1E1E1E" />
                                <path d="M78.156 2.5H62.156C61.056 2.5 60.156 3.4 60.156 4.5V16.5C60.156 17.6 61.056 18.5 62.156 18.5H78.156C79.256 18.5 80.156 17.6 80.156 16.5V4.5C80.156 3.4 79.256 2.5 78.156 2.5ZM78.156 4.5L70.156 9.49L62.156 4.5H78.156ZM78.156 16.5H62.156V6.5L70.156 11.5L78.156 6.5V16.5Z" fill="#1E1E1E" />
                            </svg>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}
