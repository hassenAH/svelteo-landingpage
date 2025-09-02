
import styles from "./Services.module.scss";

export default function Services() {
    const services = [
        {
            title: "Tunnel infrarouge & soins détox",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/79690726c7bff96fffcff0520b1093f039bb57b4?width=682",
        },
        {
            title: "Cures minceur personnalisées",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/65a334e128e4d8983e728d9eabfa4567fe90a9ee?width=694",
        },
        {
            title: "Cryolipolyse",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/27e619991abcdcca0e287057c11810547b1bc481?width=750",
        },
        {
            title: "Soins manuels amincissants",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/35416fa57d8d5fed99c5f5b97d03d9ab57fd539d?width=692",
        },
        {
            title: "Coaching alimentaire",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/d1a3fe1689ca057bb05e5dabd1b0effbe02f7213?width=622",
        },
        {
            title: "Bilan morphologique",
            image:
                "https://api.builder.io/api/v1/image/assets/TEMP/18f9d0ff5b8939260141a285961b232e0b4e1493?width=784",
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header Section */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Découvrir Nos Services</h1>
                    <p className={styles.description}>
                        Un parcours simple : bilan → protocole → suivi. Chaque cure associe
                        des séances ciblées, des soins de soutien et un accompagnement
                        alimentaire pour consolider les résultats.
                    </p>
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
