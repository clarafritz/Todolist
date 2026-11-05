/* -----------------------------------------
Calendar.jsx -> Calendrier mensuel Bloom
----------------------------------------- */
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';


/* Fonction : Affiche un calendrier mensuel */
/* Paramètre : variant (full pour la page dédié calendar // compact pour page home) */
/* Return : JSX */
function CalendarWidget({ variant = 'compact' }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    /* Fonction : Change le mois affiché */
    /* Paramètre : offset (-1 ou +1) */
    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    /* Fonction : Sélectionne une date */
    /* Paramètre : day (numéro du jour) */
    const selectDay = (day) => {
        setSelectedDate(new Date(year, month, day));
    };


    /* Tab : cases calendrier */
    const days = Array.from(
        { length: firstDay + daysInMonth },
        (_, index) => {
            const day = index - firstDay + 1;
            return day > 0 ? day : null;
        }
    );


    return (
        <div className={`calendar-widget calendar-${variant}`}>
            {/* Navigation mensuelle */}
            <div className='calendar-navigation'>
                <button
                    type='button'
                    onClick={() => changeMonth(-1)}
                    aria-label='Previous month'
                >
                    <ChevronLeft size={20} />
                </button>

                <h3>
                    {currentDate.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </h3>

                <button
                    type='button'
                    onClick={() => changeMonth(1)}
                    aria-label='Next month'
                >
                    <ChevronRight size={20} />
                </button>
            </div>


            {/* Grille du calendrier */}
            <div className='calendar-grid'>

                {weekDays.map((day) => (
                    <span key={day} className='calendar-weekday'>
                        {variant === 'compact' ? day[0] : day}
                    </span>
                ))}

                {days.map((day, index) => {
                    if (day === null) {
                        return (
                            <span
                                key={`empty-${index}`}
                                className='calendar-empty'
                            />
                        );
                    }

                    const isSelected =
                        day === selectedDate.getDate() &&
                        month === selectedDate.getMonth() &&
                        year === selectedDate.getFullYear();

                    return (
                        <button
                            key={day}
                            type='button'
                            className={`calendar-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => selectDay(day)}
                            aria-pressed={isSelected}
                            aria-label={`${day} ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                        >
                            <span className='calendar-day-number'>
                                {day}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarWidget;
