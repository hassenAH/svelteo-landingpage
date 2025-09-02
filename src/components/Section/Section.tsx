import { useRef, type PropsWithChildren } from "react";
import { motion, MotionConfig, useScroll, useTransform, type Variants } from "framer-motion";
import styles from "./Section.module.scss";

type SectionProps = PropsWithChildren<{
    id: string;
    className?: string;
    /** Extra parallax depth in px (how far the bg/title drifts) */
    parallax?: number; // default 60
    /** Trigger again on each re-entry */
    retrigger?: boolean; // default true
}>;

const container: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 70, damping: 18, mass: 0.7 }
    }
};

export default function Section({
    id,
    className,
    parallax = 60,
    retrigger = true,
    children
}: SectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"], // maps [when section enters, when it leaves]
    });

    // Subtle parallax for a background layer or title band
    const y = useTransform(scrollYProgress, [0, 1], [0, -parallax]);
    const yOpposite = useTransform(scrollYProgress, [0, 1], [0, parallax * 0.5]);

    return (
        <MotionConfig reducedMotion="user">
            <section id={id} className={`${styles.section} ${className ?? ""}`}>
                {/* Parallax back plate (optional visual accent) */}
                <motion.div aria-hidden className={styles.backplate} style={{ y }} />
                <motion.div
                    ref={ref}
                    className={styles.content}
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: !retrigger, amount: 0.2 }}
                >
                    {/* Optional parallax header strip (you can remove if you don’t want it) */}
                    <motion.div className={styles.headerBand} style={{ y: yOpposite }} />
                    {children}
                </motion.div>
            </section>
        </MotionConfig>
    );
}
