
import styles from "./Footer.module.scss";

type FooterProps = {
    logoSrc?: string;
    clinicName?: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    /** Public paths for icons in /public (e.g. /icons/mail.svg) */
    icons?: {
        mail?: string;
        facebook?: string;
        instagram?: string;
    };
};

export default function Footer({
    logoSrc = "/logo-svelteo.webp",
    clinicName = "Sveltéo Clinic Minceur",
    city = "Nice",
    address = "14 Boulevard Risso, 06300 Nice",
    phone = "+91-88787878787",
    email = "info@Suryanursinghome.com",
    icons = {
        mail: "/icons/mail.svg",
        facebook: "/icons/facebook.svg",
        instagram: "/icons/instagram.svg",
    },
}: FooterProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                {/* Logo + Contact */}
                <div className={styles.brandBlock}>
                    <img
                        src={logoSrc}
                        alt="Sveltéo Logo"
                        className={styles.logo}
                        loading="lazy"
                        width={331}
                        height={136}
                    />

                    <address className={styles.contact} aria-label="Contact">
                        <div className={styles.contactLine}>
                            <span className={styles.highlight}>{clinicName}</span>
                            <span> – {city}</span>
                        </div>
                        <div className={styles.contactLine}>{address}</div>
                        <div className={styles.contactLine}>
                            <a className={styles.link} href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                        </div>
                        <div className={styles.contactLine}>
                            <a className={styles.link} href={`mailto:${email}`}>{email}</a>
                        </div>
                    </address>
                </div>

                {/* Socials */}
                <nav className={styles.socials} aria-label="Social media">
                    <a className={styles.socialBtn} href={`mailto:${email}`} aria-label="Email">
                        <img src={icons.mail} alt="" loading="lazy" />
                    </a>
                    <a className={styles.socialBtn} href="#" aria-label="Facebook">
                        <img src={icons.facebook} alt="" loading="lazy" />
                    </a>
                    <a className={styles.socialBtn} href="#" aria-label="Instagram">
                        <img src={icons.instagram} alt="" loading="lazy" />
                    </a>
                </nav>
            </div>
        </footer>
    );
}
