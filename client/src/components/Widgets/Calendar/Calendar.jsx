/* -----------------------------------------
Calendar.jsx -> Calendrier mensuel Bloom
----------------------------------------- */
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';
import CalendarEvent from '../../CalendarEvent/CalendarEvent';
import CalendarDayEvents from '../../CalendarDayEvents/CalendarDayEvents';


/* Fonction : Affiche un calendrier mensuel */
/* Paramètre : variant (full pour la page dédié calendar // compact pour page home) */
/* Return : JSX */
function CalendarWidget({ variant = 'compact' }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEventOpen, setIsEventOpen] = useState(false);
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('bloom-events');
        return savedEvents ? JSON.parse(savedEvents) : [];
    });
    const [editingEvent, setEditingEvent] = useState(null);

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
        const date = new Date(year, month, day);
        setSelectedDate(date);

        if (variant === 'full') {
            setIsDayOpen(true);
        }
    };

    /* Fonction : Ajoute un événement à la liste */
    /* Paramètre : newEvent (événement créé) */
    const addEvent = (newEvent) => {
        const updatedEvents = [...events, newEvent];
        localStorage.setItem('bloom-events', JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
    };

    /* Fonction : sauvegarde modif event existant */
    /* Paramètre : updatedEvent */
    const updateEvent = (updatedEvent) => {
        const updatedEvents = events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
        );

        localStorage.setItem('bloom-events', JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
    };

    /* Fonction : suppr event */
    /* Paramètre : eventId */
    const deleteEvent = (eventId) => {
        const updatedEvents = events.filter((event) => event.id !== eventId);

        localStorage.setItem('bloom-events', JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
    };

    /* Fonction : Ouvre form création */
    /* Paramètre : aucun */
    const openNewEvent = () => {
        setEditingEvent(null);
        setIsDayOpen(false);
        setIsEventOpen(true);
    };

    /* Fonction : prépare modif d'un event */
    /* Paramètre : event */
    const editEvent = (event) => {
        setEditingEvent(event);
        setIsDayOpen(false);
        setIsEventOpen(true);
    };


    /* Tab : cases calendrier */
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const calendarWeeks = totalCells / 7;
    const days = Array.from(
        { length: totalCells },
        (_, index) => {
            const day = index - firstDay + 1;
            return day > 0 && day <= daysInMonth ? day : null;
        }
    );

    const formattedDate = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, '0'),
        String(selectedDate.getDate()).padStart(2, '0')
    ].join('-');

    return (
        <>
            <div className={`calendar-widget calendar-${variant} calendar-weeks-${calendarWeeks}`}>
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
                        /* Date case : YYYY-MM-DD */
                        const dayDate = [
                            year, 
                            String(month + 1).padStart(2, '0'),
                            String(day).padStart(2, '0')
                        ].join('-');
                        /* évènement correspondant à la date */
                        const dayEvents = events.filter((event) => event.date === dayDate);


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

                                {variant === 'compact' && dayEvents.length > 0 && (
                                    <span 
                                        className='calendar-event-dot' 
                                        style={{
                                            backgroundColor: dayEvents[0].color || '#F8E3E9'
                                        }}
                                        aria-hidden='true'
                                    ></span>
                                )}

                                {variant === 'full' && dayEvents.length > 0 && (
                                    <span className='calendar-day-events'>
                                        {dayEvents.map((event) => (
                                            <span 
                                                key={event.id} 
                                                className='calendar-event-item'
                                                style={{
                                                    backgroundColor: event.color || '#F8E3E9'
                                                }}
                                            >
                                                {event.title}
                                            </span>
                                        ))}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isDayOpen && (
                <CalendarDayEvents
                    date={formattedDate}
                    events={events.filter((event) => event.date === formattedDate)}
                    onClose={() => setIsDayOpen(false)}
                    onAdd={openNewEvent}
                    onEdit={editEvent}
                />
            )}

            {isEventOpen && (
                <CalendarEvent
                    date={formattedDate}
                    eventToEdit={editingEvent}
                    onClose={() => setIsEventOpen(false)}
                    onSave={editingEvent ? updateEvent : addEvent}
                    onDelete={deleteEvent}
                />
            )}
        </>
    );
}

export default CalendarWidget;
