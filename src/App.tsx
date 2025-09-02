import "./styles/base.scss";

import Navbar from "./components/Navbar/Navbar";
import HighlightBanner from "./components/Navbar/HighlightBanner";
import Services from "./components/Services/Services";
import AboutClinic from "./components/AboutClinic/AboutClinic";
import Steps from "./components/Steps/Steps";
import Footer from "./components/footer/Footer";

import Section from "./components/Section/Section";

export default function App() {
  return (
    <>
      <HighlightBanner />
      <Navbar />

      <Section id="services" parallax={60} retrigger>
        <Services />
      </Section>

      <Section id="about" parallax={80} retrigger>
        <AboutClinic />
      </Section>

      <Section id="steps" parallax={50} retrigger>
        <Steps />
      </Section>

      {/* Footer can animate with Framer like we did earlier */}
      <Section id="contact" parallax={30} retrigger>
        <Footer
          icons={{
            mail: "/icons/email.svg",
            facebook: "/icons/facebook.svg",
            instagram: "/icons/instagram.svg",
          }}
        />
      </Section>
    </>
  );
}
