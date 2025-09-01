import { motion, useScroll, useTransform } from "framer-motion";
import "../styles/sections/features.scss";
import { useRef } from "react";

const card = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } })
};

export default function Features() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["0.2 1", "1 1"] });
    const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

    return (
        <section id="features" className="section">
            <div className="container">
                <motion.h2 style={{ rotate }}>What you get</motion.h2>
                <div ref={ref} className="features">
                    {[
                        ["TypeScript", "Strong types, safer code."],
                        ["SCSS", "Nest, variables, mixins—ship fast."],
                        ["Framer Motion", "Crisp micro-interactions."],
                    ].map(([title, desc], i) => (
                        <motion.article key={title} className="card feature" variants={card} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} custom={i}>
                            <h3>{title}</h3>
                            <p>{desc}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
