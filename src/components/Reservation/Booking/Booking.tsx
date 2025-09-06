import { useState } from "react";
import styles from "./Booking.module.scss";

// Booking.tsx (add prop)
type BookingProps = {
    pickedDate: Date | null;
    onSuccess?: () => void;
};

type FormState = {
    pickedDate: Date | null;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    acceptGDPR: boolean;
};

export default function Booking({ pickedDate, onSuccess }: BookingProps) {

    const [formData, setFormData] = useState<FormState>({
        pickedDate,
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        acceptGDPR: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // basic guard
        if (!formData.acceptGDPR) return;

        const pickedDateStr =
            formData.pickedDate ? new Date(formData.pickedDate).toISOString() : "";
        console.log(formData.pickedDate)
        const params = new URLSearchParams({
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            email: formData.email,
            pickedDate: pickedDateStr,
            acceptGDPR: String(formData.acceptGDPR),
            page: window.location.pathname,
            ua: navigator.userAgent,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
        });
        console.log(pickedDateStr);
        try {
            const resp = await fetch("https://script.google.com/macros/s/AKfycbxNbeSg94T18aAf7jvfNSulE6xLCpvTUE6aCEIdUxhLM-a71oIgG_vwBafU5Oix7RP5/exec", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
                body: params.toString(),
                // mode: "cors" // default is fine; keep headers simple to avoid preflight
            });
            onSuccess?.();
            // Apps Script often doesn't include CORS headers; avoid reading JSON if not needed
            // If you DO want to inspect response JSON, you can try:
            const data = await resp.json();
            console.log(data)

            // optionally reset:
            setFormData(prev => ({ ...prev, nom: "", prenom: "", telephone: "", email: "" }));
        } catch (err) {
            console.error(err);
            alert("Oups, une erreur est survenue. Merci de réessayer.");
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    Cures minceur personnalisées à Nice - Réservez votre séance découverte
                </h1>

                <form onSubmit={handleSubmit} className={styles.form} id="booking-form">
                    {/* Nom */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            {/* ...your SVG... */}
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                placeholder="Nom"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Prénom */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            {/* ...your SVG... */}
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleInputChange}
                                placeholder="Prénom"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            {/* ...your SVG... */}
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                                placeholder="Téléphone"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            {/* ...your SVG... */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    {/* (Optional) keep the picked date as a hidden field for debugging/backends */}
                    {/* <input type="hidden" name="pickedDate" value={formData.pickedDate?.toISOString() ?? ""} /> */}

                    {/* GDPR Section + Agreement */}
                    <div className={styles.gdprHeader}>
                        <div className={styles.gdprTitle}>
                            <span className={styles.gdprText}>
                                Règlement général sur la protection des données (RGPD)
                            </span>
                            <span className={styles.required}>*</span>
                        </div>
                    </div>

                    <div className={styles.gdprBox}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="acceptGDPR"
                                checked={formData.acceptGDPR}
                                onChange={handleInputChange}
                                className={styles.checkbox}
                                required
                            />
                            <span className={styles.checkboxText}>J'accepte</span>
                        </label>
                        <p className={styles.gdprInfo}>
                            J'ai pris connaissance du règlement général sur la protection des données. <br />
                            En cliquant sur valider, j'autorise Sveltéo à me contacter par téléphone.
                        </p>
                    </div>

                    {/* Submit (inside the form) */}
                    <button
                        type="submit"
                        disabled={!formData.acceptGDPR}
                        className={styles.submitBtn}
                    >
                        Valider
                    </button>
                </form>
            </div>
        </div>
    );
}

