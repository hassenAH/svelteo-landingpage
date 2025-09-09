import { useState } from "react";
import styles from "./FAQWithVideo.module.scss";

type FAQItem = { question: string; answer: string };

type FAQWithVideoProps = {
    title?: string;
    videoId: string;
    items: FAQItem[];
    allowMultiple?: boolean;
};

export default function FAQWithVideo({
    title = "Questions fréquemment posées",
    videoId,
    items,
    allowMultiple = true,
}: FAQWithVideoProps) {
    const [open, setOpen] = useState<Set<number>>(new Set([0])); // open first

    const toggle = (idx: number) => {
        setOpen(prev => {
            const next = new Set(prev);
            if (allowMultiple) {
                next.has(idx) ? next.delete(idx) : next.add(idx);
            } else {
                next.clear(); next.add(idx);
            }
            return next;
        });
    };

    return (
        <section className={styles.section} aria-labelledby="faq-title">
            <div className={styles.inner}>
                <header className={styles.header}>
                    <h2 id="social-title" className={styles.title}>{title}</h2>
                </header>

                <div className={styles.layout}>
                    {/* Left: Video */}
                    <aside className={styles.videoCol}>
                        <div className={styles.player}>
                            <iframe
                                className={styles.iframe}
                                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </aside>

                    {/* Right: Full accordion */}
                    <div className={styles.faqCol} role="list">
                        {items.map((item, i) => {
                            const isOpen = open.has(i);
                            const panelId = `faq-panel-${i}`;
                            const btnId = `faq-button-${i}`;
                            return (
                                <article className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`} key={i} role="listitem">
                                    <button
                                        id={btnId}
                                        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => toggle(i)}
                                    >
                                        <span className={styles.q}>

                                            {item.question}
                                        </span>
                                        <svg className={styles.chev} viewBox="0 0 20 20" aria-hidden="true">
                                            <path d="M5.5 7.5l4.5 4 4.5-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={btnId}
                                        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
                                    >
                                        <p className={styles.answer}>{item.answer}</p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
