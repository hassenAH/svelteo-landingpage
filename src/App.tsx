import "./styles/base.scss";

import Navbar from "./components/Navbar/Navbar";

import AboutClinic from "./components/AboutClinic/AboutClinic";
import HighlightBanner from "./components/Navbar/HighlightBanner";
import Services from "./components/Services/Services";
import Steps from "./components/Steps/Steps";
import Footer from "./components/footer/Footer";

export default function App() {
  return (
    <>
      <HighlightBanner />
      <Navbar />
      <Services />
      <AboutClinic />
      <Steps />
      <Footer
        icons={{
          mail: "/icons/email.svg",
          facebook: "/icons/facebook.svg",
          instagram: "/icons/instagram.svg",
        }}
      />
    </>
  );
}
