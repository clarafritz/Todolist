/* -----------------------------------------
CalendarEvent.jsx -> Formulaire événement calendrier 
----------------------------------------- */
import { useState } from 'react';
import { X } from 'lucide-react';
import './CalendarEvent.css';

/* Palette couleurs labels events */
const eventColors = [
    { name: 'Rose', value: '#F8E3E9' },
    { name: 'Peach', value: '#F9E5DA' },
    { name: 'Yellow', value: '#F8EFCB' },
    { name: 'Green', value: '#E4F0E6' },
    { name: 'Blue', value: '#E1EDF7' },
    { name: 'Lavender', value: '#E9E3F5' },
    { name: 'Grey', value: '#EBE8E8' },
];



/* Fonction : Affiche le formulaire d'événement */
/* Paramètres : date, onClose, onSave, eventToEdit, onDelete */
/* Return : JSX */
function CalendarEvent({ date, eventToEdit, onClose, onSave, onDelete}) {
    /* info événement */
    const [title, setTitle] = useState(eventToEdit?.title || '');
    const [eventDate, setEventDate] = useState(eventToEdit?.date || date);
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [label, setLabel] = useState(eventToEdit?.label || 'Personal');
    const [color, setColor] = useState(eventToEdit?.color || '#F8E3E9');


    /* Fonction : Enregistre un événement */
    /* Paramètre : event */
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim() || !eventDate) {
            return;
        }

        const newEvent = {
            id: eventToEdit?.id || crypto.randomUUID(),
            title: title.trim(),
            date: eventDate,
            time,
            label,
            color
        };

        onSave(newEvent);
        onClose();
    };

    /* Fonction : suppr event en cours */
    /* Paramètre : aucun */ 
    const handleDelete = () => {
        if (!eventToEdit) {
            return;
        }

        const confirmed = window.confirm('Are you sure you want to delete this event?');

        if(confirmed){
            onDelete(eventToEdit.id);
            onClose();
        }
    };

    return (
        <div className='event-overlay'>
            <div
                className='event-modal'
                role='dialog'
                aria-modal='true'
                aria-labelledby='event-title'
            >

                <div className='event-header'>
                    <h2 id='event-title'>
                        {eventToEdit ? 'Edit Event' : 'New Event'}
                    </h2>

                    <button
                        type='button'
                        onClick={onClose}
                        aria-label='Close form'
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='event-field'>
                        <label htmlFor='event-name'>Event title</label>
                        <input
                            id='event-name'
                            type='text'
                            placeholder='e.g. Team meeting'
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                    </div>

                    <div className='event-row'>
                        <div className='event-field'>
                            <label htmlFor='event-date'>Date</label>
                            <input
                                id='event-date'
                                type='date'
                                value={eventDate}
                                onChange={(event) => setEventDate(event.target.value)}
                                required
                            />
                        </div>

                        <div className='event-field'>
                            <label htmlFor='event-time'>Time</label>
                            <input
                                id='event-time'
                                type='time'
                                value={time}
                                onChange={(event) => setTime(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className='event-field'>
                        <label htmlFor='event-label'>Label</label>
                        <select
                            id='event-label'
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                        >
                            <option value='Personal'>Personal</option>
                            <option value='Meeting'>Meeting</option>
                            <option value='School'>School</option>
                            <option value='Appointment'>Appointment</option>
                        </select>
                    </div>

                    <div className='event-field'>
                        <label>Event color</label>

                        <div className='event-colors'>
                            {eventColors.map((eventColor) => (
                                <button
                                    key={eventColor.value}
                                    type='button'
                                    className={`event-color ${color === eventColor.value ? 'selected' : ''}`}
                                    onClick={() => setColor(eventColor.value)}
                                    aria-label={`${eventColor.name} color`}
                                    aria-pressed={color === eventColor.value}
                                >
                                    <span
                                        className='event-color-preview'
                                        style={{ backgroundColor: eventColor.value }}
                                    ></span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='event-actions'>
                        {eventToEdit && (
                            <button
                                type='button'
                                className='event-delete'
                                onClick={handleDelete}
                            >
                                Delete Event
                            </button>
                        )}
                        
                        <button
                            type='button'
                            className='event-cancel'
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type='submit' className='event-save'>
                            {eventToEdit ? 'Save Changes' : 'Save Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CalendarEvent;
