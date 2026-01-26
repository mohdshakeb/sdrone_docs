'use client';

import React, { useMemo, useState, useEffect } from 'react';
import styles from '@/components/ui/CalendarPanel.module.css';

interface CalendarPanelProps {
    isOpen: boolean;
    value: Date | null;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
}

export function formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

export function getCalendarDays(
    viewDate: Date,
    selectedDate: Date | null,
    minDate?: Date,
    maxDate?: Date
): CalendarDay[] {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End on the Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        days.push({
            date: new Date(current),
            isCurrentMonth: current.getMonth() === month,
            isToday: isSameDay(current, today),
            isSelected: selectedDate ? isSameDay(current, selectedDate) : false,
            isDisabled: isDateDisabled(current, minDate, maxDate),
        });
        current.setDate(current.getDate() + 1);
    }

    return days;
}

export default function CalendarPanel({
    isOpen,
    value,
    onChange,
    minDate,
    maxDate,
}: CalendarPanelProps) {
    const [viewDate, setViewDate] = useState(() => value ?? new Date());

    // Update view date when value changes
    useEffect(() => {
        if (value) {
            setViewDate(value);
        }
    }, [value]);

    const calendarDays = useMemo(
        () => getCalendarDays(viewDate, value, minDate, maxDate),
        [viewDate, value, minDate, maxDate]
    );

    const handleDayClick = (day: CalendarDay) => {
        if (day.isDisabled) return;
        onChange(day.date);
    };

    const handlePrevMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleClearDate = () => {
        onChange(null as any); // Will be handled by parent
    };

    const panelClassNames = [
        styles.panel,
        isOpen && styles.panelOpen,
    ].filter(Boolean).join(' ');

    return (
        <div className={panelClassNames}>
            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <span className={`${styles.monthYear} text-caption-strong`}>
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <div className={styles.navButtons}>
                    <button
                        type="button"
                        className={styles.navButton}
                        onClick={handlePrevMonth}
                        aria-label="Previous month"
                    >
                        &#8249;
                    </button>
                    <button
                        type="button"
                        className={styles.navButton}
                        onClick={handleNextMonth}
                        aria-label="Next month"
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className={styles.weekdays}>
                {WEEKDAYS.map(day => (
                    <div key={day} className={`${styles.weekday} text-caption-small`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className={styles.days}>
                {calendarDays.map((day, index) => {
                    const dayClassNames = [
                        styles.day,
                        'text-caption',
                        !day.isCurrentMonth && styles.dayOutside,
                        day.isToday && !day.isSelected && styles.dayToday,
                        day.isSelected && styles.daySelected,
                        day.isDisabled && styles.dayDisabled,
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={index}
                            type="button"
                            className={dayClassNames}
                            onClick={() => handleDayClick(day)}
                            disabled={day.isDisabled}
                            tabIndex={isOpen ? 0 : -1}
                            aria-label={day.date.toDateString()}
                            aria-selected={day.isSelected}
                        >
                            {day.date.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Footer with Clear */}
            {value && (
                <div className={styles.footer}>
                    <button
                        type="button"
                        className={`${styles.clearDateButton} text-caption`}
                        onClick={handleClearDate}
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}
