import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "../Calendar/Calendar";
import styles from "./CalendarWithTime.module.scss";

type CalendarWithTimeProps = {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    label?: string;
    monthNames?: string[];
    dayNames?: string[];
};

type Period = "matin" | "apres";

/* ---------------- helpers ---------------- */

const toLocalDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const formatDateLabel = (d: Date | null) =>
    d
        ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "Choisir une date";

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6; // Sun=0, Sat=6
const isMonday = (d: Date) => d.getDay() === 1;

type Bounds = { min: number | null; max: number | null }; // hours in 24h, null = closed
// Lundi: 12–19, Mar–Ven: 9–19, Sam/Dim: fermé
const boundsFor = (d: Date | null): Bounds => {
    if (!d) return { min: 9, max: 19 };
    if (isWeekend(d)) return { min: null, max: null };
    if (isMonday(d)) return { min: 12, max: 19 };
    return { min: 9, max: 19 };
};

// Add near your helpers
const formatHourLabel = (h12: number, p: Period) => {
    const h = p === "apres" ? fromH12(h12, "apres") : h12; // 1→13, 2→14, ..., 7→19
    return String(h).padStart(2, "0"); // "09", "13", "19"
};

const fromH12 = (h12: number, p: Period) => (p === "apres" ? (h12 === 12 ? 12 : h12 + 12) : h12);
const periodFrom24 = (h24: number): Period => (h24 < 12 ? "matin" : "apres");
const toH12 = (h24: number, p: Period) => (p === "apres" ? (h24 === 12 ? 12 : h24 - 12) : h24);

const clampToDayBounds = (d: Date | null, h24: number, m: number) => {
    const { min, max } = boundsFor(d);
    if (min == null || max == null) return { h24, m }; // closed day handled elsewhere
    if (h24 < min) h24 = min;
    if (h24 > max) h24 = max;
    if (h24 === max && m > 0) m = 0; // closing hour → only :00
    return { h24, m };
};

/* ---------------- component ---------------- */

export default function CalendarWithTime({
    value = null,
    onChange,
    label = "Date & Heure",
    monthNames,
    dayNames,
}: CalendarWithTimeProps) {
    const [open, setOpen] = useState(false);

    // date-only selection
    const [pickedDateOnly, setPickedDateOnly] = useState<Date | null>(value ? toLocalDateOnly(value) : null);

    // time controls (12h + period)
    const initH24 = value ? value.getHours() : 9;
    const initMins = value ? value.getMinutes() : 0;
    const initPeriod = periodFrom24(initH24);
    const [period, setPeriod] = useState<Period>(initPeriod);
    const [hour12, setHour12] = useState<number>(toH12(initH24, initPeriod));
    const [mins, setMins] = useState<number>(initMins);

    const popRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const hourRef = useRef<HTMLSelectElement | null>(null);

    // which period(s) are allowed for the currently picked day
    const allowedPeriods: Period[] = useMemo(() => {
        if (!pickedDateOnly) return ["matin", "apres"];
        if (isWeekend(pickedDateOnly)) return []; // closed
        if (isMonday(pickedDateOnly)) return ["apres"]; // hide "matin" on Monday
        return ["matin", "apres"];
    }, [pickedDateOnly]);

    // ensure selected period is valid for the day (e.g., switch to 'apres' on Monday)
    useEffect(() => {
        if (!pickedDateOnly) return;
        if (!allowedPeriods.includes(period)) {
            const fallback = allowedPeriods[0] ?? "apres";
            setPeriod(fallback);
            // also snap hour to the day's opening hour
            const { min } = boundsFor(pickedDateOnly);
            if (min != null) {
                const pr = periodFrom24(min);
                setHour12(toH12(min, pr));
                setMins(0);
            }
        }
    }, [pickedDateOnly, allowedPeriods, period]);

    // sync from parent value (without jumpiness)
    useEffect(() => {
        const nextDateOnly = value ? toLocalDateOnly(value) : null;
        const sameDate =
            (pickedDateOnly === null && nextDateOnly === null) ||
            (pickedDateOnly &&
                nextDateOnly &&
                pickedDateOnly.getFullYear() === nextDateOnly.getFullYear() &&
                pickedDateOnly.getMonth() === nextDateOnly.getMonth() &&
                pickedDateOnly.getDate() === nextDateOnly.getDate());

        if (!sameDate) setPickedDateOnly(nextDateOnly);

        if (value) {
            const h24 = value.getHours();
            const m = value.getMinutes();
            const pr = periodFrom24(h24);
            setPeriod(pr);
            setHour12(toH12(h24, pr));
            setMins(m);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // if the selected day changes, ensure current time fits that day's bounds
    useEffect(() => {
        if (!pickedDateOnly) return;
        const prevH24 = fromH12(hour12, period);
        const prevM = mins;
        const { h24, m } = clampToDayBounds(pickedDateOnly, prevH24, prevM);
        if (h24 !== prevH24 || m !== prevM) {
            const pr = periodFrom24(h24);
            setPeriod(pr);
            setHour12(toH12(h24, pr));
            setMins(m);
        }
    }, [pickedDateOnly]); // eslint-disable-line react-hooks/exhaustive-deps

    // build combined value
    const combined = useMemo(() => {
        if (!pickedDateOnly) return null;
        const { min, max } = boundsFor(pickedDateOnly);
        if (min == null || max == null) return null; // closed day
        const { h24, m } = clampToDayBounds(pickedDateOnly, fromH12(hour12, period), mins);
        return new Date(
            pickedDateOnly.getFullYear(),
            pickedDateOnly.getMonth(),
            pickedDateOnly.getDate(),
            h24,
            m,
            0,
            0
        );
    }, [pickedDateOnly, hour12, mins, period]);

    // emit to parent only when actual combined value changes
    const lastEmittedRef = useRef<number | null>(null);
    useEffect(() => {
        const cur = combined ? combined.getTime() : null;
        if (cur !== lastEmittedRef.current) {
            lastEmittedRef.current = cur;
            onChange?.(combined ?? null);
        }
    }, [combined, onChange]);

    // close popover on outside click / ESC
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node;
            const insidePop = !!popRef.current && popRef.current.contains(t);
            const onTrigger = !!triggerRef.current && triggerRef.current.contains(t);
            if (!insidePop && !onTrigger) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    // choose a day
    const onDayPicked = (d: Date) => {
        if (isWeekend(d)) return; // closed
        const local = toLocalDateOnly(d);
        setPickedDateOnly(local);
        setOpen(false);
        // snap to opening time for this day
        const { min } = boundsFor(local);
        if (min != null) {
            const pr = periodFrom24(min);
            setPeriod(pr);
            setHour12(toH12(min, pr));
            setMins(0);
        }
        requestAnimationFrame(() => hourRef.current?.focus());
    };

    // options + disabled logic
    const MATIN_12 = [9, 10, 11];
    const APRES_12 = [12, 1, 2, 3, 4, 5, 6, 7]; // 12 → 19

    const dayBounds = boundsFor(pickedDateOnly);
    const dayClosed = dayBounds.min == null || dayBounds.max == null;

    const hourDisabled = (h12Opt: number, p: Period) => {
        const { min, max } = dayBounds;
        if (min == null || max == null) return true;
        const h24 = fromH12(h12Opt, p);
        return h24 < min || h24 > max;
    };

    const minuteDisabled = (mOpt: number) => {
        const { min, max } = dayBounds;
        if (min == null || max == null) return true;
        const h24 = fromH12(hour12, period);
        if (h24 < min || h24 > max) return true;
        if (h24 === max) return mOpt !== 0; // closing hour: only :00
        return false;
    };

    return (
        <div className={styles.wrap}>
            <label className={styles.label}>{label}</label>

            <div className={styles.row}>
                {/* Trigger showing current date */}
                <button
                    ref={triggerRef}
                    type="button"
                    className={styles.trigger}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={styles.triggerDate}>{formatDateLabel(pickedDateOnly)}</span>
                    <svg className={styles.calendarIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 2v2H5a2 2 0 0 0-2 2v1h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 7H3v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9Z" />
                    </svg>
                </button>

                {/* Time controls */}
                <div className={styles.timeRow}>
                    <div className={styles.timeGroup} aria-label="Heure">
                        <select
                            ref={hourRef}
                            className={styles.timeSelect}
                            value={hour12}
                            onChange={(e) => setHour12(Number(e.target.value))}
                            aria-label="Heure"
                            disabled={dayClosed}
                        >
                            {(period === "matin" ? MATIN_12 : APRES_12).map((h) => (
                                <option key={h} value={h} disabled={hourDisabled(h, period)}>
                                    {formatHourLabel(h, period)}   {/* shows 09,10,11 or 12,13,14...19 */}
                                </option>
                            ))}
                        </select>


                        <span className={styles.timeSep}>:</span>

                        <select
                            className={styles.timeSelect}
                            value={mins}
                            onChange={(e) => setMins(Number(e.target.value))}
                            aria-label="Minutes"
                            disabled={dayClosed}
                        >
                            {[0, 15, 30, 45].map((m) => (
                                <option key={m} value={m} disabled={minuteDisabled(m)}>
                                    {String(m).padStart(2, "0")}
                                </option>
                            ))}
                        </select>

                        {/* Period: hide "Matin" entirely on Monday */}
                        <select
                            className={styles.timeSelect}
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as Period)}
                            aria-label="Période"
                            disabled={dayClosed}
                        >
                            {allowedPeriods.includes("matin") && <option value="matin">Matin</option>}
                            {allowedPeriods.includes("apres") && <option value="apres">Après-midi</option>}
                        </select>
                    </div>
                </div>
            </div>

            {/* Popover with Calendar */}
            {open && (
                <div ref={popRef} role="dialog" aria-label="Sélecteur de date" className={styles.popover}>
                    <Calendar
                        initialDate={pickedDateOnly ?? new Date()}
                        selectedDate={pickedDateOnly ?? undefined}
                        onSelect={onDayPicked}
                        monthNames={monthNames}
                        dayNames={dayNames}

                        isDateDisabled={(d: Date) => isWeekend(d)}
                        getDayClassName={(d: Date) => (isWeekend(d) ? styles.dayDisabled : "")}

                    />
                </div>
            )}
        </div>
    );
}
