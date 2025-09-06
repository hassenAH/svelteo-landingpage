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

type HMS = { h: number; m: number; s?: number };

/** Native <input type="time"> always uses 24h "HH:MM" (seconds only if step < 60) */
const TIME_RE = /^\d{2}:\d{2}$/;

const toLocalDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const formatDateLabel = (d: Date | null) =>
    d
        ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "Choisir une date";

const formatTimeValue = (d: Date | null) => {
    if (!d) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
};

const parseTime = (val: string): HMS | null => {
    if (!val || !TIME_RE.test(val)) return null;
    const [hh, mm] = val.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return { h: Math.min(23, Math.max(0, hh)), m: Math.min(59, Math.max(0, mm)) };
};

export default function CalendarWithTime({
    value = null,
    onChange,
    label = "Date & Heure",
    monthNames,
    dayNames,
}: CalendarWithTimeProps) {
    const [open, setOpen] = useState(false);

    // Keep local states but avoid churn/jumpiness
    const [pickedDateOnly, setPickedDateOnly] = useState<Date | null>(value ? toLocalDateOnly(value) : null);
    const [timeStr, setTimeStr] = useState<string>(formatTimeValue(value));
    const [timeHMS, setTimeHMS] = useState<HMS | null>(() => parseTime(formatTimeValue(value)));

    const popRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const timeRef = useRef<HTMLInputElement | null>(null);

    // Sync from parent value, but only if it actually changed (prevents cursor jump while typing)
    useEffect(() => {
        const nextDateOnly = value ? toLocalDateOnly(value) : null;
        const nextTimeStr = formatTimeValue(value);

        const sameDate =
            (pickedDateOnly === null && nextDateOnly === null) ||
            (pickedDateOnly &&
                nextDateOnly &&
                pickedDateOnly.getFullYear() === nextDateOnly.getFullYear() &&
                pickedDateOnly.getMonth() === nextDateOnly.getMonth() &&
                pickedDateOnly.getDate() === nextDateOnly.getDate());

        const sameTime = timeStr === nextTimeStr;

        if (!sameDate) setPickedDateOnly(nextDateOnly);
        if (!sameTime) {
            setTimeStr(nextTimeStr);
            setTimeHMS(parseTime(nextTimeStr));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Accept time only when valid (so typing "09:" doesn’t explode state)
    useEffect(() => {
        const hms = parseTime(timeStr);
        if (hms) setTimeHMS(hms);
    }, [timeStr]);

    // Build combined datetime only when both parts are valid
    const combined = useMemo(() => {
        if (!pickedDateOnly || !timeHMS) return null;
        return new Date(
            pickedDateOnly.getFullYear(),
            pickedDateOnly.getMonth(),
            pickedDateOnly.getDate(),
            timeHMS.h,
            timeHMS.m,
            0,
            0
        );
    }, [pickedDateOnly, timeHMS]);

    // Emit to parent only when actual combined value changes
    const lastEmittedRef = useRef<number | null>(null);
    useEffect(() => {
        const cur = combined ? combined.getTime() : null;
        if (cur !== lastEmittedRef.current) {
            lastEmittedRef.current = cur;
            onChange?.(combined ?? null);
        }
    }, [combined, onChange]);

    // Close popover on outside click / ESC (robust against clicking the trigger)
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

    const onDayPicked = (d: Date) => {
        // Assume Calendar already gives a local date-only (or at least local day)
        setPickedDateOnly(toLocalDateOnly(d));
        setOpen(false);

        // If no valid time yet, set a sensible default
        if (!timeHMS) {
            setTimeStr("10:00");
            setTimeHMS({ h: 10, m: 0 });
        }

        // Focus time input next tick
        requestAnimationFrame(() => {
            timeRef.current?.focus();
            // Safari doesn’t support select() on type=time; this is safe to call anyway
            timeRef.current?.select?.();
        });
    };

    return (
        <div className={styles.wrap}>
            <label className={styles.label}>{label}</label>

            <div className={styles.row}>
                {/* Trigger that shows current date and opens the popover */}
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

                {/* Time input */}
                <input
                    ref={timeRef}
                    type="time"
                    className={styles.time}
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    onBlur={(e) => {
                        const hms = parseTime(e.target.value);
                        if (hms) {
                            const hh = String(hms.h).padStart(2, "0");
                            const mm = String(hms.m).padStart(2, "0");
                            setTimeStr(`${hh}:${mm}`);
                        }
                    }}
                    aria-label="Heure"
                    inputMode="numeric"
                    min="08:00"
                    max="20:00"
                    step={60 * 15} // 15-minute steps
                    lang="fr-FR"
                />
            </div>

            {/* Popover with the existing Calendar component */}
            {open && (
                <div ref={popRef} role="dialog" aria-label="Sélecteur de date" className={styles.popover}>
                    <Calendar
                        initialDate={pickedDateOnly ?? new Date()}
                        selectedDate={pickedDateOnly ?? undefined}
                        onSelect={onDayPicked}
                        monthNames={monthNames}
                        dayNames={dayNames}
                    />
                </div>
            )}
        </div>
    );
}
