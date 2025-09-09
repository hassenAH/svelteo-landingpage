import { useEffect, useState } from "react";
import styles from "./Booking.module.scss";

type BookingProps = {
    pickedDate: Date | null;
    onSuccess?: () => void;
};

// 👇 Define your available offers here
const OFFRES = [
    "Soin découverte minceur 40 min",
    "Bilan morphologique complet",
    "Séance découverte Cryolipolyse (1 zone)",
] as const;
type Offre = (typeof OFFRES)[number] | "";

type FormState = {
    pickedDate: Date | null;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    acceptGDPR: boolean;
    offre: Offre;
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
        pickedDate: pickedDate ?? null,
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        acceptGDPR: false,
        offre: "", // ✅ default empty
    });

    // keep in sync without altering time
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            pickedDate: pickedDate ?? null,
        }));
    }, [pickedDate]);

    // Only allow string keys here to satisfy TS
    type TextKeys = "nom" | "prenom" | "telephone" | "email" | "offre";

    const onTextOrSelectChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const key = e.currentTarget.name as TextKeys;
        const val =
            key === "offre" ? (e.currentTarget.value as Offre) : e.currentTarget.value;
        setFormData((p) => ({ ...p, [key]: val }));
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked;
        setFormData(p => ({ ...p, acceptGDPR: checked }));
    };


    // Listen to "set-offre" global event from Offers grid
    useEffect(() => {
        const onSetOffre = (evt: Event) => {
            const ce = evt as CustomEvent<string>;
            const picked = (ce.detail ?? "") as Offre;
            setFormData((prev) => ({ ...prev, offre: picked }));
        };

        window.addEventListener("set-offre", onSetOffre as EventListener);
        return () => window.removeEventListener("set-offre", onSetOffre as EventListener);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.acceptGDPR) return;

        const pickedDateStr = formData.pickedDate ? toLocalDateTime(formData.pickedDate) : "";

        const params = new URLSearchParams({
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            email: formData.email,
            offre: formData.offre || "Non précisé",
            pickedDate: pickedDateStr,
            acceptGDPR: String(formData.acceptGDPR),
            page: window.location.pathname,
            ua: navigator.userAgent,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        });

        try {
            const resp = await fetch(
                "https://script.google.com/macros/s/AKfycbxI9ag0YUWGc1FLDJdHYej3q0R89U-mhmMhXfiCY2wV5Ih8Qm8GT0RAfzuncuqU3g/exec",
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
                offre: "",
                acceptGDPR: false,
            }));
        } catch (err) {
            console.error(err);
            alert("Oups, une erreur est survenue. Merci de réessayer.");
        }
    };

    return (
        <div className={styles.container} id="rendezvous">
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    Cures minceur personnalisées à Nice - Réservez votre séance découverte
                </h1>

                <form onSubmit={handleSubmit} className={styles.form} id="booking-form">
                    {/* Offre */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            <select
                                name="offre"
                                value={formData.offre}
                                onChange={onTextOrSelectChange}
                                className={`${styles.input} ${styles.select}`}
                                required
                                aria-label="Choisissez une offre"
                            >
                                <option value="" disabled>
                                    Choisir une offre
                                </option>
                                {OFFRES.map((o) => (
                                    <option key={o} value={o}>
                                        {o}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Nom */}
                    <div className={styles.field}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={onTextOrSelectChange}
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
                                onChange={onTextOrSelectChange}
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
                                onChange={onTextOrSelectChange}
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
                                onChange={onTextOrSelectChange}
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
                                onChange={onCheckboxChange}
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
