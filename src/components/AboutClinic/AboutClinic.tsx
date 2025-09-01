import { motion, MotionConfig, type Variants } from "framer-motion";

import styles from "./AboutClinic.module.scss";
import MoneyIcon from "./icons/MoneyIcon";
import SupportIcon from "./icons/SupportIcon";
import InvestigationIcon from "./icons/InvestigationIcon";
import MonitoringIcon from "./icons/MonitoringIcon";


const container: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.08 },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function AboutClinic() {
    return (
        // Respect user's OS reduced-motion preference
        <MotionConfig reducedMotion="user">
            <motion.div
                className={styles.page}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={container}
            >
                <div className={styles.container}>
                    <motion.h1 className={styles.title} variants={item}>
                        À Propos Sveltéo Clinique Minceur Nice
                    </motion.h1>

                    <div className={styles.content}>
                        {/* Left copy */}
                        <motion.div className={styles.left} variants={item}>
                            <h2 className={styles.subtitle}>Qui sommes-nous ?</h2>
                            <p className={styles.lede}>
                                <span>
                                    Chez Sveltéo Clinic Minceur, nous croyons que chaque personne mérite de se sentir bien dans son corps.
                                </span>
                                <br />
                                <span>
                                    Installé au cœur de Nice, notre centre réunit des technologies modernes, des soins manuels experts et
                                    un accompagnement personnalisé pour vous aider à atteindre vos objectifs minceur.
                                </span>
                            </p>
                        </motion.div>

                        {/* Right: cards */}
                        <div className={styles.right}>
                            {/* Mobile stacked */}
                            <div className={styles.cardsMobile}>
                                {[
                                    {
                                        Icon: MoneyIcon,
                                        text: "Protocoles personnalisés en fonction de votre morphologie et de vos objectifs.",
                                        color: styles.blue,
                                    },
                                    {
                                        Icon: SupportIcon,
                                        text: "Encadrement sérieux et accompagnement attentif à chaque étape.",
                                        color: "",
                                    },
                                    {
                                        Icon: InvestigationIcon,
                                        text: "Technologies efficaces et soins manuels experts pour des résultats visibles.",
                                        color: styles.yellow,
                                    },
                                    {
                                        Icon: MonitoringIcon,
                                        text: "Coaching alimentaire pour ancrer des habitudes durables.",
                                        color: styles.green,
                                    },
                                ].map(({ Icon, text, color }, i) => (
                                    <motion.article
                                        key={i}
                                        className={`${styles.card} ${styles.cardHover}`}
                                        variants={item}
                                        whileHover={{ y: -4, rotateX: 1.2, rotateY: -1.2 }}
                                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                    >
                                        <div className={`${styles.iconWrap} ${color}`}>
                                            <div className={styles.iconBob}>
                                                <Icon />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>{text}</p>
                                    </motion.article>
                                ))}
                            </div>

                            {/* Desktop absolute layout */}
                            <div className={styles.cardsDesktop}>
                                <motion.article
                                    className={`${styles.card} ${styles.card1} ${styles.cardHover}`}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInner}>
                                        <div className={`${styles.iconWrap} ${styles.blue} ${styles.iconRaised}`}>
                                            <div className={styles.iconBob}>
                                                <MoneyIcon />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>
                                            Protocoles personnalisés en fonction de votre morphologie et de vos objectifs.
                                        </p>
                                    </div>
                                </motion.article>

                                <motion.article
                                    className={`${styles.card} ${styles.card2} ${styles.cardHover}`}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInnerAlt}>
                                        <div className={styles.iconFloat}>
                                            <div className={styles.iconBob}>
                                                <SupportIcon />
                                            </div>
                                        </div>
                                        <div className={styles.cardBottomPad}>
                                            <p className={styles.cardText}>
                                                Encadrement sérieux et accompagnement attentif à chaque étape.
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>

                                <motion.article
                                    className={`${styles.card} ${styles.card3} ${styles.cardHover}`}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInner}>
                                        <div className={`${styles.iconWrap} ${styles.yellow}`}>
                                            <div className={styles.iconBob}>
                                                <InvestigationIcon />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>
                                            Technologies efficaces et soins manuels experts pour des résultats visibles.
                                        </p>
                                    </div>
                                </motion.article>

                                <motion.article
                                    className={`${styles.card} ${styles.card4} ${styles.cardHover}`}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardCenter}>
                                        <div className={`${styles.iconWrap} ${styles.green}`}>
                                            <div className={styles.iconBob}>
                                                <MonitoringIcon />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>Coaching alimentaire pour ancrer des habitudes durables.</p>
                                    </div>
                                </motion.article>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </MotionConfig>
    );
}
