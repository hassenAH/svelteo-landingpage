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
import Hero from "./components/Hero/Hero";
import Offers from "./components/Offers/Offers";
import Reservation from "./components/Reservation/Formulaire/Reservation";



export default function App() {
  return (
    <>
      <HighlightBanner />
      <Navbar />

      <Section id="hero" parallax={60} retrigger>
        <Hero
          fit="cover"
          slides={[
            { src: "/images/hero-1.webp", alt: "Cryolipolyse en cabine" },
            { src: "/images/hero-2.webp", alt: "Soin manuel amincissant" },
            { src: "/images/hero-3.webp", alt: "Suivi et bilan morphologique" },
          ]}
          autoPlayMs={5000} // set 0 to disable
          cta={{ label: "Prendre rendez-vous", href: "#rendezvous" }}
        />
        <Reservation />

      </Section>
      <Offers
        reserveHref="#reservation"              // or an external booking link
        reserveLabel="Réserver maintenant"
      />
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
          phone="+33 4 83 93 47 37"
          note="Disponible du lundi au samedi, 9h–19h."
        />
      </Section>

      <Section id="SocialFollow" parallax={50} retrigger>
        <SocialFollow
          links={[
            { label: "Facebook", href: "https://www.facebook.com/SvelteoNice?locale=fr_FR", iconSrc: "/icons/facebook.svg" },
            { label: "Instagram", href: "https://www.instagram.com/svelteo_clinic_minceur_nice/", iconSrc: "/icons/instagram.svg" },
            { label: "LinkedIn", href: "https://www.linkedin.com/company/svelteo-clinic-minceur-nice/?viewAsMember=true", iconSrc: "/icons/linkedin.svg" },


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
