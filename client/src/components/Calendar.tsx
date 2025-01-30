import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, isSameDay, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useState } from "react";
import { ClassName } from "../utilities";

type CalendarProps = {
    min: Date,
    max: Date,
    onSelect: (date: Date) => void;
} & ClassName;

const Calendar = ({ min, max, className = "", onSelect }: CalendarProps) => {
    const [date, setDate] = useState(new Date());
    const [selected, setSelected] = useState<Date | undefined>(undefined);

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

    const handleDateSelect = (date: Date) => {
        setSelected(date);
        setDate(date);
        onSelect(date);
    }

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
            <div className="grid grid-cols-7 grid-rows-7 text-sm">
                {weekDays.map(day => (
                    <div key={day} className="px-2 py-1 text-center font-semibold border text-zinc-400 border-zinc-50">{day}</div>
                ))}
                {days.map((day, index) => {
                    const isDisabled = day.getTime() < min.getTime() || day.getTime() > max.getTime();
                    const isSelected = day.getTime() === selected?.getTime();
                    const otherMonth = day.getMonth() !== date.getMonth();

                    const cursor = isDisabled ? "cursor-default" : "cursor-pointer";
                    const hover = !isDisabled && !isSelected ? "hover:bg-green-800" : "";

                    const color = isDisabled ? "brightness-50" :
                        isSelected ? "bg-green-600" :
                        otherMonth ? "brightness-75" : "text-zinc-50";

                    return (
                        <button
                            key={index}
                            tabIndex={0}
                            className={`px-2 py-1 text-center font-semibold border border-zinc-50 ${cursor} ${color} ${hover}`}
                            onClick={e => {
                                e.preventDefault();
                                if (!isDisabled) {
                                    handleDateSelect(day);
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
