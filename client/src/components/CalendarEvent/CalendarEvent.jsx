/* -----------------------------------------
CalendarEvent.jsx -> Formulaire événement calendrier 
----------------------------------------- */
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import './CalendarEvent.css';
import { getCalendarLabels, saveCalendarLabels, NO_CALENDAR_LABEL, NO_CALENDAR_LABEL_COLOR } from '../../data/calendarLabels';
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
    /* labels dispo */
    const [calendarLabels, setCalendarLabels] = useState(getCalendarLabels);
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#F8E3E9');

    /* info événement */
    const [title, setTitle] = useState(eventToEdit?.title || '');
    const [eventDate, setEventDate] = useState(eventToEdit?.date || date);
    const [time, setTime] = useState(eventToEdit?.time || '');
    const [label, setLabel] = useState(eventToEdit?.label ?? NO_CALENDAR_LABEL);
    const [color, setColor] = useState(
        () => calendarLabels.find(
            (calendarLabel) => calendarLabel.name === (eventToEdit?.label ?? NO_CALENDAR_LABEL)
        )?.color || "#F8E3E9"
    );


    /* Fonction : créer label personnalisé */
    /* Paramètre : aucun */
    const addLabel = () => {
        const name = newLabelName.trim();
        if (!name) {
            return;
        }

        const alreadyExists = calendarLabels.some(
            (calendarLabel) => calendarLabel.name.toLowerCase() === name.toLowerCase()
        );

        if (alreadyExists) {
            return; 
        }

        const newLabel = {
            id: crypto.randomUUID(),
            name,
            color: newLabelColor
        };

        const updatedLabels = [...calendarLabels, newLabel];

        saveCalendarLabels(updatedLabels);
        setCalendarLabels(updatedLabels);
        window.dispatchEvent(new Event('bloom-calendar-label-created'));
        setLabel(newLabel.name);
        setColor(newLabel.color);
        setNewLabelName('');
        setNewLabelColor('#F8E3E9');
        setIsLabelOpen(false);
    };

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
            color: label === NO_CALENDAR_LABEL
                ? NO_CALENDAR_LABEL_COLOR
                : calendarLabels.find((calendarLabel) => calendarLabel.name === label)?.color || NO_CALENDAR_LABEL_COLOR
        };

        onSave(newEvent);
        window.dispatchEvent(new Event('bloom-calendar-label-created'));
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
                            onChange={(event) => {
                                const selectedLabel = calendarLabels.find(
                                    (calendarLabel) => calendarLabel.name === event.target.value
                                );

                                setLabel(event.target.value);

                                if (selectedLabel) {
                                    setColor(selectedLabel.color);
                                }
                            }}
                        >
                            <option value={NO_CALENDAR_LABEL}>No label</option>
                            {calendarLabels.map((calendarLabel) => (
                                <option
                                    key={calendarLabel.id}
                                    value={calendarLabel.name}
                                >
                                    {calendarLabel.name}
                                </option>
                            ))}
                        </select>

                        <button 
                            type='button'
                            className='event-add-label'
                            onClick={() => setIsLabelOpen(!isLabelOpen)}
                        >
                            <Plus size={16} />
                            Add Label
                        </button>

                        {isLabelOpen && (
                            <div className='event-label-creator'>
                                <label htmlFor='new-label-name'>New label name</label>
                                <input 
                                    id='new-label-name'
                                    type='text'
                                    placeholder='e.g. Sport'
                                    value={newLabelName}
                                    onChange={(event) => setNewLabelName(event.target.value)}
                                />

                                <label>Label color</label>
                                <div className='event-colors'>
                                    {eventColors.map((eventColor) => (
                                        <button 
                                            key={eventColor.value}
                                            type='button'
                                            className={`event-color ${newLabelColor === eventColor.value ? 'selected' : ''}`}
                                            onClick={() => setNewLabelColor(eventColor.value)}
                                            aria-label={`${eventColor.name} label color`}
                                            aria-pressed={newLabelColor === eventColor.value}
                                        >
                                            <span 
                                                className='event-color-preview'
                                                style={{ backgroundColor: eventColor.value }}
                                            ></span>
                                        </button>
                                    ))}
                            </div>

                            <button 
                                type='button'
                                className='event-create-label'
                                onClick={addLabel}
                            >
                                Create label
                            </button>
                            </div>
                        )}
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
