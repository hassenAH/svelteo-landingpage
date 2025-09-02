import "./styles/base.scss";

import Navbar from "./components/Navbar/Navbar";
import HighlightBanner from "./components/Navbar/HighlightBanner";
import Services from "./components/Services/Services";
import AboutClinic from "./components/AboutClinic/AboutClinic";
import Steps from "./components/Steps/Steps";
import Footer from "./components/footer/Footer";

import Section from "./components/Section/Section";
import SocialFollow from "./components/SocialFollow/SocialFollow";
import ReserveSession from "./components/ReserveSession/ReserveSession";

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

      <Section id="steps" parallax={50} retrigger>
        <ReserveSession
          // optional: customize
          buttonLabel="Nous appeler" // or "nous appelez" to match your copy
          phone="+91-88787878787"
          note="Disponible du lundi au samedi, 9h–19h."
        />
      </Section>

      <Section id="SocialFollow" parallax={50} retrigger>
        <SocialFollow
          links={[
            { label: "Facebook", href: "https://facebook.com/", iconSrc: "/icons/facebook.svg" },
            { label: "Instagram", href: "https://instagram.com/", iconSrc: "/icons/instagram.svg" },
            { label: "LinkedIn", href: "https://www.linkedin.com/company/", iconSrc: "/icons/linkedin.svg" },


          ]}
        />
      </Section>


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
