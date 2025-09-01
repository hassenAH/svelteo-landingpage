import { motion } from "framer-motion";
import "../styles/sections/cta.scss";

export default function CTA() {
    return (
        <section id="cta" className="section">
            <div className="container">
                <motion.div className="card cta"
                    initial={{ scale: .98, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: .4 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                >
                    <h2>Ready to deploy?</h2>
                    <p>Connect to GitHub and Netlify, push to <code>main</code>, and watch it go live.</p>
                    <a className="btn" href="https://app.netlify.com" target="_blank" rel="noreferrer">Deploy</a>
                </motion.div>
            </div>
        </section>
    );
}
