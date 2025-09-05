
import styles from "./Services.module.scss";

export default function Services() {
    const services = [
        {
            title: "Tunnel infrarouge & soins détox",
            image:
                "/images/Tunnel.webp",
        },
        {
            title: "Cures minceur personnalisées",
            image:
                "/images/Cures.webp",
        },
        {
            title: "Cryolipolyse",
            image:
                "/images/Cryolipolyse.webp",
        },
        {
            title: "Soins manuels amincissants",
            image:
                "/images/Soins.webp",
        },
        {
            title: "Coaching alimentaire",
            image:
                "/images/Coaching.webp",
        },
        {
            title: "Bilan morphologique",
            image:
                "/images/Bilanservice.webp",
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header Section */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Découvrir Nos Services</h1>

                </div>

                {/* Services Grid */}
                <div className={styles.services}>
                    <div className={styles.grid}>
                        {services.map((service, index) => (
                            <div key={index} className={styles.card}>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className={styles.image}
                                />
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
