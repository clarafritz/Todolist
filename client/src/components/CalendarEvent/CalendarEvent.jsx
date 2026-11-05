/* -----------------------------------------
CalendarEvent.jsx -> Formulaire événement calendrier 
----------------------------------------- */
import { useState } from 'react';
import { X } from 'lucide-react';
import './CalendarEvent.css';


/* Fonction : Affiche le formulaire d'événement */
/* Paramètres : date, onClose, onSave */
/* Return : JSX */
function CalendarEvent({ date, onClose, onSave }) {
    /* info événement */
    const [title, setTitle] = useState('');
    const [eventDate, setEventDate] = useState(date);
    const [time, setTime] = useState('');
    const [label, setLabel] = useState('Personal');


    /* Fonction : Enregistre un événement */
    /* Paramètre : event */
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim() || !eventDate) {
            return;
        }

        const newEvent = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date: eventDate,
            time,
            label
        };

        onSave(newEvent);
        onClose();
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
                    <h2 id='event-title'>New Event</h2>

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

                    <div className='event-actions'>
                        <button
                            type='button'
                            className='event-cancel'
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type='submit' className='event-save'> Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CalendarEvent;
