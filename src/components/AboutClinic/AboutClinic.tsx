import styles from "./AboutClinic.module.scss";

const cards = [
    {
        image: "/icons/morphologie.svg",
        text: "Protocoles personnalisés en fonction de votre morphologie et de vos objectifs.",
        bgColor: "#E0F7FA",
    },
    {
        image: "/icons/Encadrement.svg",
        text: "Encadrement sérieux et accompagnement attentif à chaque étape.",
        bgColor: "#FFF3E0",
    },
    {
        image: "/icons/Technologies.svg",
        text: "Technologies efficaces et soins manuels experts pour des résultats visibles.",
        bgColor: "#FFFDE7",
    },
    {
        image: "/icons/Coaching.svg",
        text: "Coaching alimentaire pour ancrer des habitudes durables.",
        bgColor: "#E8F5E9",
    },
];

export default function AboutClinic() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>
                    À Propos Sveltéo clinic Minceur Nice
                </h1>
                <br />
                <br />
                <div className={styles.content}>
                    {/* Left copy */}
                    <div className={styles.left}>
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
                    </div>

                    {/* Right: cards */}
                    <div className={styles.right}>
                        {/* Mobile stacked */}
                        <div className={styles.cardsMobile}>
                            {cards.map(({ image, text, bgColor }, i) => (
                                <article
                                    key={i}
                                    className={`${styles.card} ${styles.cardHover}`}
                                    style={{ ["--card-bg" as any]: bgColor }}
                                >
                                    <div className={styles.iconWrap}>
                                        <div className={styles.iconBob}>
                                            <img src={image} alt="" width={40} height={40} />
                                        </div>
                                    </div>
                                    <p className={styles.cardText}>{text}</p>
                                </article>
                            ))}
                        </div>

                        {/* Desktop absolute layout */}
                        <div className={styles.cardsDesktop}>
                            <article
                                className={`${styles.card} ${styles.card1} ${styles.cardHover}`}
                                style={{ ["--card-bg" as any]: cards[0].bgColor }}
                            >
                                <div className={styles.cardInner}>
                                    <div className={`${styles.iconWrap} ${styles.iconRaised}`}>
                                        <div className={styles.iconBob}>
                                            <img src={cards[0].image} alt="" width={40} height={40} />
                                        </div>
                                    </div>
                                    <p className={styles.cardText}>{cards[0].text}</p>
                                </div>
                            </article>

                            <article
                                className={`${styles.card} ${styles.card2} ${styles.cardHover}`}
                                style={{ ["--card-bg" as any]: cards[1].bgColor }}
                            >
                                <div className={styles.cardInner}>
                                    <div className={`${styles.iconWrap} ${styles.iconRaised}`}>
                                        <div className={styles.iconBob}>
                                            <img src={cards[1].image} alt="" width={40} height={40} />
                                        </div>
                                    </div>

                                    <p className={styles.cardText}>{cards[1].text}</p>

                                </div>
                            </article>

                            <article
                                className={`${styles.card} ${styles.card3} ${styles.cardHover}`}
                                style={{ ["--card-bg" as any]: cards[2].bgColor }}
                            >
                                <div className={styles.cardInner}>
                                    <div className={styles.iconWrap}>
                                        <div className={styles.iconBob}>
                                            <img src={cards[2].image} alt="" width={40} height={40} />
                                        </div>
                                    </div>
                                    <p className={styles.cardText}>{cards[2].text}</p>
                                </div>
                            </article>

                            <article
                                className={`${styles.card} ${styles.card4} ${styles.cardHover}`}
                                style={{ ["--card-bg" as any]: cards[3].bgColor }}
                            >
                                <div className={styles.cardCenter}>
                                    <div className={styles.iconWrap}>
                                        <div className={styles.iconBob}>
                                            <img src={cards[3].image} alt="" width={40} height={40} />
                                        </div>
                                    </div>
                                    <p className={styles.cardText}>{cards[3].text}</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
