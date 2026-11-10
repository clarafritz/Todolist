/* -----------------------------------------
CalendarEventNotes.jsx -> Affichage des notes d'un événement
----------------------------------------- */
import { useState } from 'react';
import {
    X,
    Pencil
} from 'lucide-react';
import './CalendarEventNotes.css';


/* Fonction : Affiche et modifie les notes d'un événement */
/* Paramètres : event, onClose, onSave */
/* Return : JSX */
function CalendarEventNotes({ event, onClose, onSave }) {
    const [notes, setNotes] = useState(event.notes || '');

    /* Fonction : Sauvegarde les notes modifiées */
    /* Paramètre : aucun */
    /* Return : aucun */
    const saveNotes = () => {
        onSave({ ...event, notes });
        onClose();
    };

    return (
        <div className='event-notes-overlay' onClick={onClose}>
            <div
                className='event-notes-modal'
                role='dialog'
                aria-modal='true'
                aria-labelledby='event-notes-title'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='event-notes-header'>
                    <h2 id='event-notes-title'>{event.title}</h2>

                    <button
                        type='button'
                        onClick={onClose}
                        aria-label='Close notes'
                    >
                        <X size={20} />
                    </button>
                </div>

                <textarea
                    className='event-notes-textarea'
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder='Write your notes here...'
                    aria-label='Event notes'
                />

                <button
                    type='button'
                    className='event-notes-edit'
                    onClick={saveNotes}
                >
                    Save notes
                </button>
            </div>
        </div>
    );
}

export default CalendarEventNotes;