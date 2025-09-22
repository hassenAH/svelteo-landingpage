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

const ymd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type WindowHM = { start: [number, number]; end: [number, number] }; // [hour24, minute]

const SPECIAL_WINDOWS: Record<string, WindowHM> = {
    "2025-09-23": { start: [14, 0], end: [19, 0] }, // 14:00 → 19:00
    "2025-09-24": { start: [15, 30], end: [19, 0] }, // 15:30 → 19:00
    "2025-09-25": { start: [15, 30], end: [19, 0] }, // 15:30 → 19:00
    "2025-09-26": { start: [10, 30], end: [12, 30] }, // 10:30 → 12:30
};

const getSpecialWindow = (d: Date | null): WindowHM | null => {
    if (!d) return null;
    return SPECIAL_WINDOWS[ymd(d)] ?? null;
};
// Helpers to check day of week
const isWeekend = (d: Date) => {
    const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    return day === 0 || day === 6;
};

const isMonday = (d: Date) => d.getDay() === 1;

// 🔥 Check if date falls inside the blocked range
const isInDisabledRange = (d: Date) => {
    const start = new Date(2025, 8, 22); // months are 0-based → 8 = September
    const end = new Date(2025, 8, 26);

    // Normalize to date-only (ignore time part)
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return dd >= start && dd <= end;
};

type Bounds = {
    min: number | null; // hours in 24h, null = closed
    max: number | null;
};

// Opening hours:
// - Monday: 12–19
// - Tuesday–Friday: 9–19
// - Saturday/Sunday: closed
// - Disabled range: closed
const boundsFor = (d: Date | null): Bounds => {
    if (!d) return { min: 9, max: 19 };

    // If a special window exists, use its hour envelope
    const w = getSpecialWindow(d);
    if (w) return { min: w.start[0], max: w.end[0] };

    if (isWeekend(d)) return { min: null, max: null };
    if (isInDisabledRange(d)) return { min: null, max: null };
    if (isMonday(d)) return { min: 12, max: 19 };

    return { min: 9, max: 19 };
};
const isMinuteAllowedFor = (d: Date | null, h24: number, m: number) => {
    const w = getSpecialWindow(d);
    if (!w) {
        // default rules: if closing hour, only :00
        const { min, max } = boundsFor(d);
        if (min == null || max == null) return false;
        if (h24 < min || h24 > max) return false;
        if (h24 === max) return m === 0;
        return true;
    }

    const [sh, sm] = w.start;
    const [eh, em] = w.end;

    // Before start hour
    if (h24 < sh) return false;
    // After end hour
    if (h24 > eh) return false;

    // On start hour: minutes must be >= start minutes
    if (h24 === sh && m < sm) return false;

    // On end hour: minutes must be <= end minutes
    if (h24 === eh && m > em) return false;

    // Between hours is fine
    return true;
};

// Add near your helpers
const formatHourLabel = (h12: number, p: Period) => {
    const h = p === "apres" ? fromH12(h12, "apres") : h12; // 1→13, 2→14, ..., 7→19
    return String(h).padStart(2, "0"); // "09", "13", "19"
};

const fromH12 = (h12: number, p: Period) => (p === "apres" ? (h12 === 12 ? 12 : h12 + 12) : h12);
const periodFrom24 = (h24: number): Period => (h24 < 12 ? "matin" : "apres");
const toH12 = (h24: number, p: Period) => (p === "apres" ? (h24 === 12 ? 12 : h24 - 12) : h24);

const clampToDayBounds = (d: Date | null, h24In: number, mIn: number) => {
    let h24 = h24In;
    let m = mIn;

    const w = getSpecialWindow(d);
    if (w) {
        const [sh, sm] = w.start;
        const [eh, em] = w.end;

        // Clamp hour first
        if (h24 < sh) { h24 = sh; m = sm; }
        else if (h24 > eh) { h24 = eh; m = em; }
        else {
            // Inside hour range → clamp minutes to window edges if needed
            if (h24 === sh && m < sm) m = sm;
            if (h24 === eh && m > em) m = em;
        }
        return { h24, m };
    }

    const { min, max } = boundsFor(d);
    if (min == null || max == null) return { h24, m };
    if (h24 < min) { h24 = min; m = 0; }
    if (h24 > max) { h24 = max; m = 0; }
    if (h24 === max && m > 0) m = 0;
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
    /* ---- Period availability helpers ---- */

    // Minutes grid the UI offers
    const MINUTE_STEPS = [0, 15, 30, 45];

    const hourRangeForDay = (d: Date | null): [number, number] | null => {
        if (!d) return [9, 19];
        const w = getSpecialWindow(d);
        if (w) return [w.start[0], w.end[0]];
        const { min, max } = boundsFor(d);
        if (min == null || max == null) return null;
        return [min, max];
    };

    const hasAnySlot = (d: Date | null, p: Period): boolean => {
        const range = hourRangeForDay(d);
        if (!range) return false;
        const [hMin, hMax] = range;

        // Period partition: Matin < 12, Après >= 12
        const inPeriod = (h: number) => (p === "matin" ? h < 12 : h >= 12);

        for (let h = hMin; h <= hMax; h++) {
            if (!inPeriod(h)) continue;
            for (const m of MINUTE_STEPS) {
                if (isMinuteAllowedFor(d, h, m)) return true;
            }
        }
        return false;
    };

    // which period(s) are allowed for the currently picked day
    const allowedPeriods: Period[] = useMemo(() => {
        if (!pickedDateOnly) return ["matin", "apres"]; // neutral before picking
        const range = hourRangeForDay(pickedDateOnly);
        if (!range) return []; // closed day

        const list: Period[] = [];
        if (hasAnySlot(pickedDateOnly, "matin")) list.push("matin");
        if (hasAnySlot(pickedDateOnly, "apres")) list.push("apres");
        return list;
    }, [pickedDateOnly]);
    // ensure selected period is valid for the day (e.g., switch to 'apres' on Monday)
    useEffect(() => {
        if (!pickedDateOnly) return;
        if (!allowedPeriods.includes(period)) {
            const fallback = allowedPeriods[0];
            if (fallback) {
                setPeriod(fallback);
                // snap to the earliest valid slot of that day
                snapToDayStart(pickedDateOnly);
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
    const isDateDisabledExceptSpecial = (d: Date) => {
        // If a special window exists, the date should be selectable even if it’s in the blocked range
        if (getSpecialWindow(d)) return false;
        return isWeekend(d) || isInDisabledRange(d);
    };
    const onDayPicked = (d: Date) => {
        if (isDateDisabledExceptSpecial(d)) return; // keep weekend/range logic but allow specials
        const local = toLocalDateOnly(d);
        setPickedDateOnly(local);
        setOpen(false);

        // ⬅️ Reset to FIRST available time for that day
        snapToDayStart(local);

        requestAnimationFrame(() => hourRef.current?.focus());
    };

    // options + disabled logic
    const MATIN_12 = [9, 10, 11];
    const APRES_12 = [12, 1, 2, 3, 4, 5, 6, 7]; // 12 → 19

    const dayBounds = boundsFor(pickedDateOnly);
    const dayClosed = dayBounds.min == null || dayBounds.max == null;

    const hourDisabled = (h12Opt: number, p: Period) => {
        const h24 = fromH12(h12Opt, p);
        const { min, max } = dayBounds;
        const w = getSpecialWindow(pickedDateOnly);

        if (w) {
            const [sh] = w.start;
            const [eh] = w.end;
            return h24 < sh || h24 > eh;
        }

        if (min == null || max == null) return true;
        return h24 < min || h24 > max;
    };

    const minuteDisabled = (mOpt: number) => {
        const h24 = fromH12(hour12, period);
        return !isMinuteAllowedFor(pickedDateOnly, h24, mOpt);
    };
    const snapToDayStart = (d: Date) => {
        const w = getSpecialWindow(d); // from the previous snippet
        if (w) {
            const [sh, sm] = w.start;           // e.g., 15:30
            const pr = periodFrom24(sh);
            setPeriod(pr);
            setHour12(toH12(sh, pr));
            setMins(sm);
            return;
        }
        const { min } = boundsFor(d);
        if (min != null) {
            const pr = periodFrom24(min);
            setPeriod(pr);
            setHour12(toH12(min, pr));
            setMins(0);
        }
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
                        getDayClassName={(d: Date) =>
                            isWeekend(d) ? styles.dayDisabled : ""
                        }
                    />

                </div>
            )}
        </div>
    );
}
