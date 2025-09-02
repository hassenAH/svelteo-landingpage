import { MotionConfig, motion, type Variants } from "framer-motion";
import styles from "./ReserveSession.module.scss";

type ReserveSessionProps = {
    id?: string;
    title?: string;
    description?: string;

    buttonLabel?: string;

    phone?: string;

    note?: string;
};

const container: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 90, damping: 16, mass: 0.7, staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 18 } }
};

export default function ReserveSession({
    id = "reservation",
    title = "Réserver votre séance",
    description = "Choisissez votre point d’entrée : séance découverte guidée avec bilan offert, ou bilan morphologique complet pour construire votre programme.",
    // You asked for "nous appelez" — common UI phrasing is "Nous appeler".
    // Use either; you can change via prop:
    buttonLabel = "nous appelez",
    phone = "+91-88787878787",
    note,
}: ReserveSessionProps) {
    const telHref = `tel:${phone.replace(/[\s()-]/g, "")}`;

    return (
        <MotionConfig reducedMotion="user">
            <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
                <motion.div
                    className={styles.card}
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                >
                    <motion.h2 id={`${id}-title`} className={styles.title} variants={item}>
                        {title}
                    </motion.h2>

                    <motion.p className={styles.text} variants={item}>
                        {description}
                    </motion.p>

                    <motion.div className={styles.actions} variants={item}>
                        <motion.a
                            href={telHref}
                            className={styles.btnPrimary}
                            aria-label={`${buttonLabel} au ${phone}`}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                            <span className={styles.phoneIcon} aria-hidden>
                                <img src="/icons/phone.svg" alt="" width={18} height={18} />
                            </span>
                            <span>{buttonLabel}</span>
                        </motion.a>

                        <span className={styles.phoneText} aria-hidden>
                            {phone}
                        </span>
                    </motion.div>

                    {note && (
                        <motion.p className={styles.note} variants={item}>
                            {note}
                        </motion.p>
                    )}
                </motion.div>
            </section>
        </MotionConfig>
    );
}
