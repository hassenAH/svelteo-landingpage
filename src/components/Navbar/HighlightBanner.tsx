
import styles from "./HighlightBanner.module.scss";



export default function HighlightBanner() {
    return (
        <section className={styles.banner}>
            <p className={styles.text}>
                Votre santé et votre bien-être sont au cœur de nos priorités. C&apos;est pourquoi notre clinique
                s&apos;engage à vous offrir des soins personnalisés et de haute qualité pour atteindre vos
                objectifs d&apos;amincissement.
            </p>
        </section>

    );
}
