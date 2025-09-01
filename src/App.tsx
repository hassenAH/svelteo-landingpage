import "./styles/base.scss";

import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Navbar from "./components/Navbar/Navbar";
import CalendarWithTime from "./components/Reservation/Formulaire/CalendarWithTime";

export default function App() {
  return (
    <>
      <Navbar />
      <CalendarWithTime onConfirm={(dt) => console.log("Booked:", dt)} />
      <Hero />
      <Features />
      <CTA />
    </>
  );
}
