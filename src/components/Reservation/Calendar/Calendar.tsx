import { useMemo, useState } from "react";
import styles from "./Calendar.module.scss";

type CalendarProps = {
    selectedDate?: Date | null;
    onSelect?: (date: Date) => void;
    initialDate?: Date;
    monthNames?: string[];
    dayNames?: string[];
};

export function Calendar({
    selectedDate = null,
    onSelect,
    initialDate,
    monthNames = [
        "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
        "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE",
    ],
    dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
}: CalendarProps) {
    const today = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }, []);

    // ✅ If initialDate is in the past, start from today’s month
    const initialView = useMemo(() => {
        if (!initialDate) return today;
        const id = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate());
        return id < today ? today : id;
    }, [initialDate, today]);

    const [viewDate, setViewDate] = useState<Date>(initialView);

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();

    // Monday-first
    const mondayFirstIdx = (startOfMonth.getDay() + 6) % 7;

    // Can we go to previous month? (block months before current month)
    // ✅ Only allow going to months >= today’s month (year,month comparison)
    const canGoPrev =
        viewDate.getFullYear() > today.getFullYear() ||
        (viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() > today.getMonth());

    const cells = useMemo(() => {
        const arr: { date: Date; inCurrentMonth: boolean }[] = [];
        const prevMonthLastDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

        // Prev month trailing
        for (let i = mondayFirstIdx - 1; i >= 0; i--) {
            const day = prevMonthLastDate - i;
            arr.push({
                date: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, day),
                inCurrentMonth: false,
            });
        }
        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            arr.push({
                date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d),
                inCurrentMonth: true,
            });
        }
        // Next month leading
        const totalCells = 42;
        for (let d = 1; arr.length < totalCells; d++) {
            arr.push({
                date: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, d),
                inCurrentMonth: false,
            });
        }
        return arr;
    }, [viewDate, daysInMonth, mondayFirstIdx]);

    const navigateMonth = (dir: "prev" | "next") => {
        if (dir === "prev" && !canGoPrev) return; // ✅ block navigating into past months
        const next = new Date(viewDate);
        next.setMonth(viewDate.getMonth() + (dir === "prev" ? -1 : 1));
        setViewDate(next);
    };

    const handleSelect = (date: Date) => {
        // ✅ ignore past dates
        if (date < today) return;
        onSelect?.(date);
    };

    const monthLabel = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    return (
        <section className={styles.calendar} aria-label="Calendar">
            {/* Header */}
            <header className={styles.header}>
                <h2 className={styles.title} title={monthLabel}>
                    {monthLabel}
                </h2>

                <div className={styles.navBtns}>
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => navigateMonth("prev")}
                        className={styles.navBtn}
                        disabled={!canGoPrev} // ✅ disable prev when viewing current month
                    >
                        <svg className={styles.chev} viewBox="0 0 8 12" aria-hidden="true">
                            <path d="M6.19 11.88L0.05 5.74 6.19 -0.4" stroke="currentColor" strokeWidth="1.3" fill="none" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => navigateMonth("next")}
                        className={styles.navBtn}
                    >
                        <svg className={styles.chev} viewBox="0 0 8 12" aria-hidden="true">
                            <path d="M1.28 -0.4L7.42 5.74 1.28 11.88" stroke="currentColor" strokeWidth="1.3" fill="none" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className={styles.divider} />

            {/* Weekday headers */}
            <div className={styles.weekRow} role="row">
                {dayNames.map((d) => (
                    <div key={d} role="columnheader" className={styles.weekCell}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className={styles.grid} role="grid" aria-readonly="true">
                {cells.map(({ date, inCurrentMonth }, i) => {
                    const isToday = isSameDay(date, today);
                    const isSelected = selectedDate != null && isSameDay(date, selectedDate);

                    // ✅ disable any day before today
                    const isPast = date < today;
                    const classNames = [
                        styles.cell,
                        !inCurrentMonth && styles.dim,
                        isToday && styles.today,
                        isSelected && styles.selected,
                        isPast && styles.disabled, // optional: style for disabled past days
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <button
                            key={date.toISOString() + i}
                            type="button"
                            role="gridcell"
                            aria-selected={!!isSelected}
                            aria-disabled={isPast}
                            title={date.toDateString()}
                            className={classNames}
                            onClick={() => handleSelect(date)}
                            disabled={isPast} // ✅ hard block selection
                        >
                            <span className={styles.dayNum}>{date.getDate()}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
