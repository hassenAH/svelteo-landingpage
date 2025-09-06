import { useState } from "react";
import styles from "./Reservation.module.scss";
import SuccessPopup from "../SuccessPopup/SuccessPopup";

import Booking from "../Booking/Booking";
import CalendarWithTime from "./CalendarWithTime";

export default function Reservation() {
    const [successOpen, setSuccessOpen] = useState(false);
    const [pickedDateTime, setPickedDateTime] = useState<Date | null>(null);

    return (
        <>
            <section className={styles.reservation}>
                <div className={styles.calendar}>
                    <CalendarWithTime
                        value={pickedDateTime}
                        onChange={setPickedDateTime}
                        label="Sélectionnez la date et l'heure"
                    />
                </div>

                <div className={styles.booking}>
                    <Booking pickedDate={pickedDateTime} onSuccess={() => setSuccessOpen(true)} />
                </div>
            </section>

            <SuccessPopup
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                title="Réservation envoyée"
                message="Nous vous contactons très vite pour finaliser votre séance. Merci !"
                autoCloseMs={4000}
            />
        </>
    );
}
