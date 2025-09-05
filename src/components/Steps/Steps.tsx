
import styles from "./Steps.module.scss";

export default function Steps() {
    const steps = [
        {
            title: "Échange & réservation :",
            description: "Vous réservez en ligne ou par téléphone",
            image:
                "/images/Échange.webp",
        },
        {
            title: "Bilan & plan :",
            description: "Définition d'un protocole réaliste et motivant",
            image:
                "/images/Bilan.webp",
        },
        {
            title: "Suivi & résultats :",
            description: "Séances régulières et ajustements personnalisés",
            image:
                "/images/Suivi.webp",
        },
    ];

    return (
        <div className={styles.section}>
            {/* Decorative SVG - Top Right */}
            <div className={`${styles.svg} ${styles.svgTopRight}`}>
                <svg
                    width="52"
                    height="66"
                    viewBox="0 0 52 66"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.51294 33.7555C6.08581 27.3602 5.98281 21.2015 6.17131 14.7147C6.20794 13.4479 5.21278 12.3947 3.94976 12.3565C2.68597 12.3184 1.63126 13.3181 1.59386 14.585C1.41529 20.736 1.55954 26.5893 0.0668068 32.6641C-0.235403 33.8927 0.516322 35.1367 1.74348 35.4343C2.96986 35.7396 4.2115 34.9841 4.51294 33.7555Z"
                        fill="#50BDC5"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.8764 46.1492C28.5469 36.396 38.6007 23.8498 45.6278 11.1814C46.2406 10.0748 45.8414 8.67817 44.7364 8.06765C43.6313 7.45712 42.2364 7.854 41.6235 8.96057C34.8284 21.2092 25.105 33.3434 14.7872 42.7684C13.8546 43.6231 13.7897 45.0731 14.6422 46.0042C15.4946 46.9352 16.9438 47.0039 17.8764 46.1492Z"
                        fill="#50BDC5"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.579 56.8028C30.3383 58.4131 40.3974 55.6658 49.2714 51.7814C50.4291 51.27 50.9572 49.9193 50.4512 48.7669C49.9445 47.6069 48.5929 47.0803 47.4352 47.584C39.3534 51.125 30.2131 53.7503 21.3246 52.285C20.0776 52.079 18.8986 52.9261 18.6933 54.17C18.4872 55.414 19.3328 56.5968 20.579 56.8028Z"
                        fill="#50BDC5"
                    />
                </svg>
            </div>

            {/* Decorative SVG - Bottom Left */}
            <div className={`${styles.svg} ${styles.svgBottomLeft}`}>
                <svg
                    width="52"
                    height="63"
                    viewBox="0 0 52 63"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M45.7197 2.09223C40.0609 10.3717 34.9647 19.008 30.4405 27.9355C27.9558 26.6628 25.4335 25.4653 22.8737 24.357C26.2118 18.2989 29.5451 12.2361 32.8831 6.17794C34.6553 2.96573 29.742 0.0869433 27.9698 3.29915C24.5005 9.59679 21.0359 15.8945 17.5666 22.1921C15.2225 21.2951 12.8549 20.4638 10.4591 19.7031C6.96173 18.59 5.46148 24.0893 8.94487 25.1976C10.9139 25.8222 12.8643 26.5078 14.7911 27.2311C14.0222 28.6212 13.258 30.0159 12.4891 31.406C10.4591 29.8563 8.4948 28.2126 6.60542 26.4703C3.91436 23.9907 -0.122275 28.0154 2.58286 30.4997C4.86605 32.6035 7.25706 34.5713 9.72776 36.4216C6.61007 42.0806 3.49709 47.7395 0.379393 53.3984C-1.39277 56.6106 3.52052 59.4894 5.29269 56.2772C8.33537 50.7545 11.3781 45.2317 14.416 39.7043C17.1212 41.4748 19.9201 43.1043 22.794 44.5743C20.853 49.2799 19.0574 54.0512 17.426 58.879C16.2492 62.3588 21.7391 63.8522 22.9111 60.3958C24.4442 55.8734 26.1227 51.4072 27.9371 47.0022C32.2081 48.8525 36.6338 50.3741 41.1767 51.5481C44.7257 52.4639 46.2401 46.9693 42.6911 46.0536C38.3919 44.9453 34.21 43.5082 30.1687 41.7612C31.0548 39.7513 31.9736 37.7506 32.916 35.7689C37.0792 38.1592 41.1111 40.7844 44.9977 43.6491C47.9513 45.8234 50.7923 40.8783 47.8715 38.7274C43.8771 35.7876 39.7234 33.0919 35.4383 30.6499C39.9343 21.7835 45.0117 13.2082 50.6329 4.97571C52.7052 1.93256 47.7778 -0.922741 45.7197 2.09223Z"
                        fill="#CFEAFF"
                    />
                </svg>
            </div>

            {/* Title */}
            <h2 className={styles.title}>Votre expérience en 3 étapes</h2>

            {/* Steps */}
            <div className={styles.grid}>
                {steps.map((step, index) => (
                    <div key={index} className={styles.card}>
                        <img src={step.image} alt={step.title} className={styles.image} />
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{step.title}</h3>
                            <p className={styles.cardText}>{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
