import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useState } from "react";
import { ClassName } from "../utilities";

type CalendarProps = {
    onSelect: (date: Date) => void;
} & ClassName;

const Calendar = ({ className = "", onSelect }: CalendarProps) => {
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
                    setDate(prev => subMonths(prev, 1));
                }} className="px-4 py-1 cursor-pointer">&lt;</button>
                <h3 className="inline text-center font-semibold">
                    {format(date, "MMMM yyyy")}
                </h3>
                <button onClick={e => {
                    e.preventDefault();
                    setDate(prev => addMonths(prev, 1));
                }} className="px-4 py-1 cursor-pointer">&gt;</button>
            </div>
            <div className="grid grid-cols-7 grid-rows-7 text-sm">
                {weekDays.map(day => (
                    <div key={day} className="px-2 py-1 text-center font-semibold border text-zinc-400 border-zinc-50">{day}</div>
                ))}
                {days.map((day, index) => {
                    const otherMonth = day.getMonth() !== date.getMonth();
                    const isSelected = day.getTime() === selected?.getTime();

                    return (
                        <button
                            key={index}
                            tabIndex={0}
                            className={`px-2 py-1 text-center font-semibold border cursor-pointer border-zinc-50 ${otherMonth && !isSelected ? "text-zinc-400" : ""} ${isSelected ? "bg-green-600" : "hover:bg-green-800"}`}
                            onClick={e => {
                                e.preventDefault();
                                handleDateSelect(day);
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
