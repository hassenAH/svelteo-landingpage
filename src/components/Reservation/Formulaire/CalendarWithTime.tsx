import { useState } from "react";

import styles from "./CalendarWithTime.module.scss";
import { Calendar } from "../Calendar/Calendar";
import TimePicker from "../Calendar/TimePicker";

// Optional: bubble the final selection up
type Props = {
    onConfirm?: (dateTime: Date) => void;
};

export default function CalendarWithTime({ onConfirm }: Props) {
    const [pickedDay, setPickedDay] = useState<Date | null>(null);
    const [finalDateTime, setFinalDateTime] = useState<Date | null>(null);

    const handleDaySelect = (d: Date) => {
        setPickedDay(d);
        setFinalDateTime(null);
        // you can also auto-scroll to the picker or open a modal
    };

    const handleTimeSelect = (dt: Date) => {
        setFinalDateTime(dt);
        onConfirm?.(dt);
    };

    return (
        <div className={styles.wrap}>
            <Calendar
                initialDate={new Date()}
                selectedDate={pickedDay ?? undefined}
                onSelect={handleDaySelect}
            />

            {pickedDay && (
                <div className={styles.timeArea}>
                    <TimePicker date={pickedDay} onSelect={handleTimeSelect} />
                    {finalDateTime && (
                        <div className={styles.summary}>
                            Selected:{" "}
                            <strong>
                                {finalDateTime.toLocaleString([], {
                                    weekday: "short",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </strong>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
