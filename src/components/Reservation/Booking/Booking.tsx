import { useEffect, useState } from "react";
import styles from "./Booking.module.scss";

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

// helpers
const pad = (n: number) => String(n).padStart(2, "0");

// Local "YYYY-MM-DD HH:mm:ss" (no TZ shift)
const toLocalDateOnly = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const toLocalDateTime = (d: Date) =>
    `${toLocalDateOnly(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export default function Booking({ pickedDate, onSuccess }: BookingProps) {
    const [formData, setFormData] = useState<FormState>({
        // ✅ keep the time from the prop; do NOT coerce to noon
        pickedDate: pickedDate ?? null,
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        acceptGDPR: false,
    });

    // ✅ keep in sync without altering time
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            pickedDate: pickedDate ?? null,
        }));
    }, [pickedDate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.acceptGDPR) return;

        const pickedDateStr = formData.pickedDate ? toLocalDateTime(formData.pickedDate) : "";

        const params = new URLSearchParams({
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            email: formData.email,
            pickedDate: pickedDateStr, // e.g. "2025-09-06 10:15:00"
            acceptGDPR: String(formData.acceptGDPR),
            page: window.location.pathname,
            ua: navigator.userAgent,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        });

        try {
            const resp = await fetch(
                "https://script.google.com/macros/s/AKfycbw2NPqZWauuywmEa1RvT_3XD3B2-UpN9tPFThkg8irer2jGDqID_dX1QOkax6AGld4e/exec",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
                    body: params.toString(),
                }
            );

            try {
                const data = await resp.json();
                console.log("Apps Script response:", data);
            } catch { }

            onSuccess?.();

            setFormData((prev) => ({
                ...prev,
                nom: "",
                prenom: "",
                telephone: "",
                email: "",
            }));
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

                    {/* GDPR */}
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

                    <button type="submit" disabled={!formData.acceptGDPR} className={styles.submitBtn}>
                        Valider
                    </button>
                </form>
            </div>
        </div>
    );
}
