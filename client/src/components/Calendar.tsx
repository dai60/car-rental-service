import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, isAfter, isBefore, isSameDay, isSameMonth, isWithinInterval, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { ClassName } from "../utilities";

export type CalendarDateState = [Date | undefined, Date | undefined];

type CalendarProps = {
    min: Date,
    max: Date,
    onSelect: (date: CalendarDateState) => void;
    defautValue?: CalendarDateState;
} & ClassName;

const Calendar = ({ className = "", min, max, defautValue, onSelect }: CalendarProps) => {
    const [date, setDate] = useState(defautValue && defautValue[0] ? defautValue[0] : addDays(new Date(), 1));
    const [selected, setSelected] = useState<CalendarDateState>(defautValue ?? [undefined, undefined]);
    const [hover, setHover] = useState<Date | undefined>(undefined);

    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    const days = eachDayOfInterval({ start, end });

    while (days.length <= 5 * 7) {
        const nextStart = addDays(days[days.length - 1], 1);
        const nextEnd = endOfWeek(nextStart);
        days.push(...eachDayOfInterval({ start: nextStart, end: nextEnd }));
    }

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const changeMonth = (nav: -1 | 1) => {
        if (nav === -1) {
            setDate(prev => {
                const next = subMonths(prev, 1);
                return endOfMonth(next) < min ? prev : next;
            });
        }
        else {
            setDate(prev => {
                const next = addMonths(prev, 1);
                return startOfMonth(next) > max ? prev : next;
            })
        }
    }

    useEffect(() => {
        onSelect(selected);
    }, [selected]);

    return (
        <div className={`border-2 border-zinc-50 rounded-md ${className}`}>
            <div className="flex justify-between items-center border border-zinc-50">
                <button onClick={e => {
                    e.preventDefault();
                    changeMonth(-1);
                }} className="px-4 py-1 cursor-pointer">&lt;</button>
                <h3 className="inline text-center font-semibold">
                    {format(date, "MMMM yyyy")}
                </h3>
                <button onClick={e => {
                    e.preventDefault();
                    changeMonth(1);
                }} className="px-4 py-1 cursor-pointer">&gt;</button>
            </div>
            <div className="grid grid-cols-7 grid-rows-7 text-sm" onMouseLeave={() => setHover(undefined)}>
                {weekDays.map(day => (
                    <div key={day} className="px-2 py-1 text-center font-semibold border text-zinc-400 border-zinc-50">{day}</div>
                ))}
                {days.map((day, index) => {
                    const isDisabled = isBefore(day, min) || isAfter(day, max);
                    const isSelected = selected[0] && (
                        (isSameDay(selected[0], day)) ||
                        (selected[1] && isWithinInterval(day, { start: selected[0], end: selected[1] }))
                    );

                    const isHover = hover && (
                        isSameDay(hover, day) ||
                        (selected[0] && !selected[1] && isWithinInterval(day, { start: selected[0], end: hover }))
                    );

                    const otherMonth = !isSameMonth(day, date);

                    const cursor = isDisabled ? "cursor-default" : "cursor-pointer";
                    const color = isDisabled ? "brightness-50" :
                        isSelected ? "bg-green-600" :
                        isHover ? "bg-green-800" :
                        otherMonth ? "brightness-75" : "text-zinc-50";

                    return (
                        <button
                            key={index}
                            tabIndex={0}
                            className={`px-2 py-1 text-center font-semibold border border-zinc-50 ${cursor} ${color}`}
                            onMouseEnter={() => {
                                setHover(day);
                            }}
                            onClick={e => {
                                e.preventDefault();
                                if (!isDisabled) {
                                    setSelected(prev => {
                                        if (prev[0] && !prev[1]) {
                                            return isAfter(day, prev[0]) ? [prev[0], day] : [day, prev[0]];
                                        }
                                        else return [day, undefined];
                                    })
                                    setDate(day);
                                }
                            }}>
                            {getDate(day)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
