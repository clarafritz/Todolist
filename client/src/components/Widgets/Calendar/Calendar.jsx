/* -----------------------------------------
Calendar.jsx -> Calendrier mensuel Bloom
----------------------------------------- */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, StickyNote } from 'lucide-react';
import './Calendar.css';
import CalendarEvent from '../../CalendarEvent/CalendarEvent';
import CalendarDayEvents from '../../CalendarDayEvents/CalendarDayEvents';
import { getCalendarLabels } from '../../../data/calendarLabels';
import { NO_CALENDAR_LABEL, NO_CALENDAR_LABEL_COLOR } from '../../../data/calendarLabels';
import CalendarEventNotes from '../../CalendarDayEvents/CalendarEventNotes';


/* Fonction : Affiche un calendrier mensuel */
/* Paramètre : variant (full pour la page dédié calendar // compact pour page home), visibleLabels, hidePastEvents */
/* Return : JSX */
function CalendarWidget({ variant = 'compact', visibleLabels = null, hidePastEvents = false }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('month');
    const [isEventOpen, setIsEventOpen] = useState(false);
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('bloom-events');
        return savedEvents ? JSON.parse(savedEvents) : [];
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const [notesEvent, setNotesEvent] = useState(null);
    /* filtre event :  selon dates / labels */
    const filteredEvents = events.filter((event) => {
        const labels = getCalendarLabels();
        const labelExists = labels.some((label) => label.name === event.label);

        const isLabelVisible =
            !event.label ||
            !labelExists ||
            visibleLabels === null ||
            visibleLabels.includes(event.label);

        /* verifie si date est passée (h + date) */
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
        const currentTime = [
            String(now.getHours()).padStart(2, '0'),
            String(now.getMinutes()).padStart(2, '0')
        ].join(':');
        const isPastEvent =
            event.date < today ||
            (event.date === today && event.time && event.time < currentTime);

        return isLabelVisible && (!hidePastEvents || !isPastEvent);
    });
    /* recup couleur associé au label event */
    const getEventColor = (event) => {
        if (!event.label || event.label === NO_CALENDAR_LABEL) {
            return NO_CALENDAR_LABEL_COLOR;
        }
        const labels = getCalendarLabels();
        const eventLabel = labels.find((label) => label.name === event.label);
        return eventLabel?.color || NO_CALENDAR_LABEL_COLOR;
    };
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    /* premier jour de la semaine (format hebdomadaire) */
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = (startOfWeek.getDay() + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)
    const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return date;
    });
    /* heure affiche format : month / day */
    const calendarHours = Array.from({length: 24}, (_, index) => index);
    /* jours affichés */
    const visibleDates = calendarView === 'day'
        ? [currentDate]
        : weekDates;


    /* Fonction : synchronise events apres modif des labels */
    useEffect(() => {
        const syncEvents = () => {
            const savedEvents = localStorage.getItem('bloom-events');
            setEvents(savedEvents ? JSON.parse(savedEvents) : []);
        };

        window.addEventListener('bloom-calendar-labels-updated', syncEvents);

        return () => {
            window.removeEventListener('bloom-calendar-labels-updated', syncEvents);
        };
    }, []);


    /* Fonction : Change la période affiché */
    /* Paramètre : offset (-1 ou +1) */
    const changePeriod = (offset) => {
        if (variant === 'compact' || calendarView === 'month') {
            setCurrentDate(new Date(year, month + offset, 1));
        } else {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + offset * (calendarView === 'week' ? 7 : 1));
            setCurrentDate(date);
        }
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
                        onClick={() => changePeriod(-1)}
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
                        onClick={() => changePeriod(1)}
                        aria-label='Next month'
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>


                {/* Grille du calendrier */}
                {/* choix de vue calendrier */}
                {variant === 'full' && (
                    <div className='calendar-view-switch'>
                        {['day' , 'week' , 'month'].map((view) => (
                            <button 
                                key={view}
                                type='button'
                                className={calendarView === view ? 'active' : ''}
                                onClick={() => setCalendarView(view)}
                                aria-pressed={calendarView === view}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* vue day / hebdo + horaires */}
                {variant === 'full' && (calendarView === 'week' || calendarView === 'day') && (
                    <div 
                        className={`calendar-time-grid ${calendarView === 'day' ? 'calendar-time-day' : ''}`}
                        style={{ '--calendar-columns': visibleDates.length }}
                    >
                        <div className='calendar-time-header'>
                            <span></span>

                            {visibleDates.map((date) => (
                                <span key={date.toDateString()}>
                                    {date.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            ))}
                        </div>

                        {/* Événements sans heure */}
                        <div className='calendar-all-day-row'>
                            <span className='calendar-all-day-label'></span>

                            {visibleDates.map((date) => {
                                /* Date du jour au format YYYY-MM-DD */
                                const dayDate = [
                                    date.getFullYear(),
                                    String(date.getMonth() + 1).padStart(2, '0'),
                                    String(date.getDate()).padStart(2, '0')
                                ].join('-');

                                /* Événements sans heure pour ce jour */
                                const allDayEvents = filteredEvents.filter((event) =>
                                    event.date === dayDate && !event.time
                                );

                                return (
                                    <div key={dayDate} className='calendar-all-day-cell'>
                                        {allDayEvents.map((event) => (
                                            <button
                                                key={event.id}
                                                type='button'
                                                className='calendar-time-event'
                                                style={{
                                                    backgroundColor: getEventColor(event)
                                                }}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    editEvent(event);
                                                }}
                                            >
                                                <span>{event.title}</span>
                                                {event.notes?.trim() && (
                                                    <span
                                                        role='button'
                                                        tabIndex={0}
                                                        className='calendar-note-trigger'
                                                        aria-label={`Open notes for ${event.title}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNotesEvent(event);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setNotesEvent(event);
                                                            }
                                                        }}
                                                    >
                                                        <StickyNote size={12} />
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        <div className='calendar-time-body'>
                            {calendarHours.map((hour) => (
                                <div className='calendar-time-row' key={hour}>
                                    <span className='calendar-time-label'>
                                        {String(hour).padStart(2, '0')}:00
                                    </span>

                                    {visibleDates.map((date) => {
                                        const dayDate = [
                                            date.getFullYear(),
                                            String(date.getMonth() + 1).padStart(2, '0'),
                                            String(date.getDate()).padStart(2, '0')
                                        ].join('-');

                                        const hourEvents = filteredEvents.filter((event) =>
                                            event.date === dayDate &&
                                            event.time &&
                                            Number(event.time.split(':')[0]) === hour
                                        );

                                        return (
                                            <div
                                                key={dayDate}
                                                className='calendar-time-cell'
                                            >
                                                {hourEvents.map((event) => (
                                                    <button
                                                        key={event.id}
                                                        type='button'
                                                        className='calendar-time-event'
                                                        style={{ backgroundColor: getEventColor(event) }}
                                                        onClick={() => {
                                                            setSelectedDate(date);
                                                            editEvent(event);
                                                        }}
                                                    >
                                                        <span>{event.time}</span>
                                                        <span>{event.title}</span>
                                                        {event.notes?.trim() && (
                                                            <span
                                                                role='button'
                                                                tabIndex={0}
                                                                className='calendar-note-trigger'
                                                                aria-label={`Open notes for ${event.title}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setNotesEvent(event);
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setNotesEvent(event);
                                                                    }
                                                                }}
                                                            >
                                                                <StickyNote size={12} />
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* vue mensuelle */}
                {(variant === 'compact' || calendarView === 'month') && (
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
                            const dayEvents = filteredEvents.filter((event) => event.date === dayDate);


                            return (
                                <div
                                    key={day}
                                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => selectDay(day)}
                                    onKeyDown={(e) => {
                                        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            selectDay(day);
                                        }
                                    }}
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
                                                backgroundColor: getEventColor(dayEvents[0])
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
                                                        backgroundColor: getEventColor(event)
                                                    }}
                                                >
                                                    {event.title}
                                                    {event.notes?.trim() && (
                                                        <button
                                                            type='button'
                                                            className='calendar-note-trigger'
                                                            aria-label={`Open notes for ${event.title}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNotesEvent(event);
                                                            }}
                                                        >
                                                            <StickyNote size={12} />
                                                        </button>
                                                    )}
                                                </span>
                                                ))}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            {isDayOpen && (
                <CalendarDayEvents
                    date={formattedDate}
                    events={filteredEvents.filter((event) => event.date === formattedDate)}
                    onClose={() => setIsDayOpen(false)}
                    onAdd={openNewEvent}
                    onEdit={editEvent}
                    getEventColor={getEventColor}
                    onShowNotes={(event) => setNotesEvent(event)}
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

            {notesEvent && (
                <CalendarEventNotes
                    event={notesEvent}
                    onClose={() => setNotesEvent(null)}
                    onSave={(updatedEvent) => {
                        updateEvent(updatedEvent);
                        setNotesEvent(updatedEvent);
                    }}
                />
            )}
        </>
    );
}

export default CalendarWidget;
