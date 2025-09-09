// SuccessPopup.tsx
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { createPortal } from "react-dom";
import styles from "./SuccessPopup.module.scss";

type SuccessPopupProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    autoCloseMs?: number; // 0 disables
};

export default function SuccessPopup({
    open,
    onClose,
    title = "Merci !",
    message = "Votre demande a bien été envoyée. Nous revenons vers vous très vite.",
    autoCloseMs = 4000,
}: SuccessPopupProps) {
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const id = requestAnimationFrame(() => closeBtnRef.current?.focus());
        return () => cancelAnimationFrame(id);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open || !autoCloseMs) return;
        const t = setTimeout(onClose, autoCloseMs);
        return () => clearTimeout(t);
    }, [open, autoCloseMs, onClose]);

    // (Optional) lock body scroll while open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const confetti = useMemo(
        () => Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            x: (i / 12) * 100,
            delay: (i % 6) * 0.08,
            scale: 0.8 + (i % 3) * 0.15,
        })),
        []
    );

    // SSR-safe: if document not available, render nothing
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <MotionConfig reducedMotion="user">
                    {/* Overlay centers content (modal nested inside) */}
                    <motion.div
                        key="overlay"
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            key="modal"
                            className={styles.wrap}
                            onClick={(e) => e.stopPropagation()}
                            aria-modal="true"
                            role="alertdialog"
                            aria-labelledby="success-title"
                            aria-describedby="success-desc"
                            initial={{ opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 24 } }}
                            exit={{ opacity: 0, scale: 0.98, y: 4, transition: { duration: 0.15 } }}
                        >
                            {/* Confetti */}
                            <div className={styles.confetti} aria-hidden>
                                {confetti.map((c) => (
                                    <motion.span
                                        key={c.id}
                                        className={styles.confettiPiece}
                                        style={{ left: `${c.x}%` }}
                                        initial={{ y: -20, opacity: 0, rotate: -10, scale: c.scale }}
                                        animate={{
                                            y: [-20, 10, -6, 12],
                                            opacity: [0, 1, 1, 0],
                                            rotate: [-10, 20, -8, 15],
                                            transition: { duration: 1.1, delay: c.delay, ease: "easeOut" },
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Close (X) */}
                            <button
                                className={styles.close}
                                aria-label="Fermer la fenêtre"
                                onClick={onClose}
                                ref={closeBtnRef}
                                type="button"
                            >
                                ×
                            </button>

                            {/* Check */}
                            <div className={styles.checkWrap} aria-hidden>
                                <motion.svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <motion.circle
                                        cx="42" cy="42" r="38" stroke="url(#g)" strokeWidth="4"
                                        initial={{ pathLength: 0, opacity: 0.6 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                    />
                                    <motion.path
                                        d="M26 44.5l11 10L58 32"
                                        stroke="#0f9c9c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                                    />
                                    <defs>
                                        <linearGradient id="g" x1="0" y1="0" x2="84" y2="84" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#0f9c9c" />
                                            <stop offset="1" stopColor="#7ae2e2" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>
                            </div>

                            {/* Content */}
                            <h3 id="success-title" className={styles.title}>{title}</h3>
                            <p id="success-desc" className={styles.desc}>{message}</p>

                            <div className={styles.actions}>
                                <button className={styles.primary} onClick={onClose} type="button">Fermer</button>
                            </div>

                            {autoCloseMs > 0 && (
                                <motion.div
                                    className={styles.progress}
                                    initial={{ scaleX: 1 }}
                                    animate={{ scaleX: 0 }}
                                    transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </MotionConfig>
            )}
        </AnimatePresence>,
        document.body
    );
}
