import React from "react";
import styles from "./TimePicker.module.scss";

export type TimePickerProps = {
    /** Date you’re picking a time for (used for the heading) */
    date: Date;
    /** On time select, returns the full Date with hours/minutes applied */
    onSelect: (dateTime: Date) => void;
    /** Minute step for slots (default 30) */
    stepMinutes?: number;
    /** Working hours (inclusive): 24h format (default 8..20) */
    startHour?: number;
    endHour?: number;
};

export default function TimePicker({
    date,
    onSelect,
    stepMinutes = 30,
    startHour = 8,
    endHour = 20,
}: TimePickerProps) {
    const slots: { label: string; h: number; m: number }[] = [];

    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += stepMinutes) {
            const label =
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            slots.push({ label, h, m });
        }
    }

    const pretty = date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const handlePick = (h: number, m: number) => {
        const d = new Date(date);
        d.setHours(h, m, 0, 0);
        onSelect(d);
    };

    return (
        <section className={styles.picker} aria-label="Select time">
            <header className={styles.header}>
                <h3 className={styles.title}>Select a time</h3>
                <div className={styles.sub}>{pretty}</div>
            </header>

            <div className={styles.grid} role="listbox" aria-label="Available times">
                {slots.map((s) => (
                    <button
                        key={s.label}
                        type="button"
                        role="option"
                        aria-label={`Time ${s.label}`}
                        className={styles.slot}
                        onClick={() => handlePick(s.h, s.m)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </section>
    );
}
