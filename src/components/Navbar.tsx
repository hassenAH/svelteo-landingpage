import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "../styles/sections/navbar.scss";
export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container">
                <a className="brand" href="#">✨ Brand</a>

                {/* Desktop links */}
                <div className="links desktop">
                    <a href="#features">Features</a>
                    <a href="#cta" className="btn">Get Started</a>
                </div>

                {/* Mobile menu button */}
                <button
                    className="burger"
                    aria-label="Menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(v => !v)}
                >

                    <div className={`bar ${open ? "open" : ""}`} />
                </button>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-menu"
                        className="mobile-drawer"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    >
                        <a onClick={() => setOpen(false)} href="#features">Features</a>
                        <a onClick={() => setOpen(false)} href="#cta" className="btn">Get Started</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
