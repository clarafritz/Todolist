/* -----------------------------------------
CalendarDayEvents.jsx -> Événements d'une journée sur clique dans calendrier full 
----------------------------------------- */
import { 
    X, 
    Plus, 
    Pencil 
} from 'lucide-react';
import './CalendarDayEvents.css';


/* Fonction : Affiche les événements d'une journée */
/* Paramètres : date, events, onClose, onAdd, onEdit, getEventColor, onShowNotes */
/* Return : JSX */
function CalendarDayEvents({ date, events, onClose, onAdd, onEdit, getEventColor, onShowNotes }) {
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });


    return (
        <div className='day-events-overlay'>
            <div
                className='day-events-modal'
                role='dialog'
                aria-modal='true'
                aria-labelledby='day-events-title'
            >
                <div className='day-events-header'>
                    <h2 id='day-events-title'>{formattedDate}</h2>

                    <button
                        type='button'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className='day-events-list'>
                    {events.length === 0 ? (
                        <p className='day-events-empty'>No events for this day yet.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className='day-event-item'>
                                <span
                                    className='day-event-color'
                                    style={{ backgroundColor: getEventColor(event) }}
                                ></span>

                                <div className='day-event-info'>
                                    <span className='day-event-name'>{event.title}</span>
                                    <span className='day-event-details'>
                                        {event.time ? `${event.time} · ` : ''}{event.label}
                                    </span>

                                    {event.notes?.trim() && (
                                        <div className='day-event-notes'>
                                            <p className='day-event-notes-preview'>
                                                {event.notes}
                                            </p>

                                            <button
                                                type='button'
                                                className='day-event-see-more'
                                                onClick={() => onShowNotes(event)}
                                            >
                                                See more
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type='button'
                                    className='day-event-edit'
                                    onClick={() => onEdit(event)}
                                    aria-label={`Edit ${event.title}`}
                                >
                                    <Pencil size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <button
                    type='button'
                    className='day-events-add'
                    onClick={onAdd}
                >
                    <Plus size={18} />
                    Add new event
                </button>
            </div>
        </div>
    );
}

export default CalendarDayEvents;