import "./styles/base.scss";

import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
    </>
  );
}
