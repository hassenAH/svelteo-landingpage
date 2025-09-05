import { useState } from "react";
import Booking from "../Booking/Booking"
import { Calendar } from "../Calendar/Calendar"
import styles from "./Reservation.module.scss"
import SuccessPopup from "../SuccessPopup/SuccessPopup";


export default function Reservation() {
    const [successOpen, setSuccessOpen] = useState(false);
    const [pickedDay, setPickedDay] = useState<Date | null>(null);
    const handleDaySelect = (d: Date) => {
        setPickedDay(d);

    };
    return (
        <>
            <section className={styles.reservation}>
                <div className={styles.calendar}>
                    <Calendar
                        initialDate={new Date()}
                        selectedDate={pickedDay ?? undefined}
                        onSelect={handleDaySelect}
                    />
                </div>
                <div className={styles.booking}>
                    <Booking pickedDate={pickedDay} onSuccess={() => setSuccessOpen(true)} />
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