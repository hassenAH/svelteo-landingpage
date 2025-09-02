import { motion, MotionConfig, type Variants } from "framer-motion";

import styles from "./AboutClinic.module.scss";

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

const cards = [
    {
        image: "/icons/money.png",
        text: "Protocoles personnalisés en fonction de votre morphologie et de vos objectifs.",
        bgColor: "#E0F7FA",
    },
    {
        image: "/icons/support.png",
        text: "Encadrement sérieux et accompagnement attentif à chaque étape.",
        bgColor: "#FFF3E0",
    },
    {
        image: "/icons/investigation.png",
        text: "Technologies efficaces et soins manuels experts pour des résultats visibles.",
        bgColor: "#FFFDE7",
    },
    {
        image: "/icons/monitoring.png",
        text: "Coaching alimentaire pour ancrer des habitudes durables.",
        bgColor: "#E8F5E9",
    },
];

export default function AboutClinic() {
    return (
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
                                    Chez Sveltéo Clinic Minceur, nous croyons que chaque personne
                                    mérite de se sentir bien dans son corps.
                                </span>
                                <br />
                                <span>
                                    Installé au cœur de Nice, notre centre réunit des technologies
                                    modernes, des soins manuels experts et un accompagnement
                                    personnalisé pour vous aider à atteindre vos objectifs minceur.
                                </span>
                            </p>
                        </motion.div>

                        {/* Right: cards */}
                        <div className={styles.right}>
                            {/* Mobile stacked */}
                            <div className={styles.cardsMobile}>
                                {cards.map(({ image, text, bgColor }, i) => (
                                    <motion.article
                                        key={i}
                                        className={`${styles.card} ${styles.cardHover}`}
                                        style={{ ["--card-bg" as any]: bgColor }}
                                        variants={item}
                                        whileHover={{ y: -4, rotateX: 1.2, rotateY: -1.2 }}
                                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                    >
                                        <div className={styles.iconWrap}>
                                            <div className={styles.iconBob}>
                                                <img src={image} alt="" width={40} height={40} />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>{text}</p>
                                    </motion.article>
                                ))}
                            </div>

                            {/* Desktop absolute layout (kept exactly as your design) */}
                            <div className={styles.cardsDesktop}>
                                {/* card 1 */}
                                <motion.article
                                    className={`${styles.card} ${styles.card1} ${styles.cardHover}`}
                                    style={{ ["--card-bg" as any]: cards[0].bgColor }}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInner}>
                                        <div className={`${styles.iconWrap} ${styles.iconRaised}`}>
                                            <div className={styles.iconBob}>
                                                <img src={cards[0].image} alt="" width={40} height={40} />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>{cards[0].text}</p>
                                    </div>
                                </motion.article>

                                {/* card 2 */}
                                <motion.article
                                    className={`${styles.card} ${styles.card2} ${styles.cardHover}`}
                                    style={{ ["--card-bg" as any]: cards[1].bgColor }}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInnerAlt}>
                                        <div className={styles.iconFloat}>
                                            <div className={styles.iconBob}>
                                                <img src={cards[1].image} alt="" width={40} height={40} />
                                            </div>
                                        </div>
                                        <div className={styles.cardBottomPad}>
                                            <p className={styles.cardText}>{cards[1].text}</p>
                                        </div>
                                    </div>
                                </motion.article>

                                {/* card 3 */}
                                <motion.article
                                    className={`${styles.card} ${styles.card3} ${styles.cardHover}`}
                                    style={{ ["--card-bg" as any]: cards[2].bgColor }}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardInner}>
                                        <div className={styles.iconWrap}>
                                            <div className={styles.iconBob}>
                                                <img src={cards[2].image} alt="" width={40} height={40} />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>{cards[2].text}</p>
                                    </div>
                                </motion.article>

                                {/* card 4 */}
                                <motion.article
                                    className={`${styles.card} ${styles.card4} ${styles.cardHover}`}
                                    style={{ ["--card-bg" as any]: cards[3].bgColor }}
                                    variants={item}
                                    whileHover={{ y: -6, rotateX: 1.2, rotateY: -1.2 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                >
                                    <div className={styles.cardCenter}>
                                        <div className={styles.iconWrap}>
                                            <div className={styles.iconBob}>
                                                <img src={cards[3].image} alt="" width={40} height={40} />
                                            </div>
                                        </div>
                                        <p className={styles.cardText}>{cards[3].text}</p>
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
