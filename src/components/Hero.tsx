import { motion } from "framer-motion";
import "../styles/sections/hero.scss";

const text = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: .6 } }
};
const bgBlob = {
    hidden: { scale: .9, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: .8, delay: .2 } }
};

export default function Hero() {
    return (
        <section className="section hero">
            <div className="container">
                <motion.div className="hero__bg" variants={bgBlob} initial="hidden" animate="show" />
                <motion.h1 variants={text} initial="hidden" animate="show">
                    Build eye-catching experiences.
                </motion.h1>
                <motion.p variants={text} initial="hidden" animate="show" transition={{ delay: .1 }}>
                    React + TypeScript + SCSS + Framer Motion. Deployed on Netlify in minutes.
                </motion.p>
                <motion.div className="hero__cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <a href="#cta" className="btn">Launch Now</a>
                </motion.div>
            </div>
        </section>
    );
}
