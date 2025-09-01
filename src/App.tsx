import "./styles/base.scss";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";

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
