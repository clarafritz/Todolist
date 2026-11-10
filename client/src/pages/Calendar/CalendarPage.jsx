/* -----------------------------------------
CalendarPage.jsx -> Page UNIQUEMENT pour calendrier 
----------------------------------------- */
import CalendarWidget from '../../components/Widgets/Calendar/Calendar';
import './CalendarPage.css';
import { useState } from 'react';
import { getCalendarLabels, saveCalendarLabels, NO_CALENDAR_LABEL } from '../../data/calendarLabels';
import { Pencil } from 'lucide-react';

/* Palette couleur personnaliser pour labels */
const labelColors = [
    { name: 'Rose', value: '#F8E3E9' },
    { name: 'Peach', value: '#F9E5DA' },
    { name: 'Yellow', value: '#F8EFCB' },
    { name: 'Green', value: '#E4F0E6' },
    { name: 'Blue', value: '#E1EDF7' },
    { name: 'Lavender', value: '#E9E3F5' },
    { name: 'Grey', value: '#EBE8E8' }
]


/* Fonction : Affiche la page calendrier */
/* Paramètre : aucun */
/* Return : JSX */
function CalendarPage() {
    const [calendarLabels, setCalendarLabels] = useState(getCalendarLabels);
    /* label : on peut modif la couleur par defaut */
    const [editingLabelColor, setEditingLabelColor] = useState(null);
    /*nom label en cours de modif */
    const [editingLabelName, setEditingLabelName] = useState('');
    const [visibleLabels, setVisibleLabels] = useState(
        () => getCalendarLabels().map((label) => label.name)
    );

    /* panneau option etat */
    const [showOptions, setShowOptions] = useState(() => {
        const saved = localStorage.getItem('bloom-calendar-options-visible');
        return saved === null ? true : saved === 'true';
    });
    const [hidePastEvents, setHidePastEvents] = useState(false);



    /* Fonction : Affiche / masque évent label */
    /* Parametre : LabelName */
    const toggleLabel = (labelName) => {
        setVisibleLabels((previous) =>
            previous.includes(labelName)
                ? previous.filter((name) => name !== labelName)
                : [...previous, labelName]
        );
    }

    /* Fonction : modifie + sauvegarde couleur label */
    /* Parametre : labelname, newcolor */
    const changeLabelColor = (labelName, newColor) => {
        const updatedLabels = calendarLabels.map((label) =>
            label.name === labelName
                ? { ...label, color: newColor }
                : label
        );
        setCalendarLabels(updatedLabels);
        saveCalendarLabels(updatedLabels);
        setEditingLabelColor(null);
    };

    /* Fonction : renomme un label + ses événements */
    /* Paramètres : labelName, newName */
    const renameLabel = (labelName, newName) => {
        const name = newName.trim();
        if (!name || calendarLabels.some((label) =>
            label.name === name && label.name !== labelName
        )) {
            return false;
        }

        const updatedLabels = calendarLabels.map((label) =>
            label.name === labelName
                ? { ...label, name }
                : label
        );

        setCalendarLabels(updatedLabels);
        saveCalendarLabels(updatedLabels);

        const savedEvents = JSON.parse(localStorage.getItem('bloom-events') || '[]');
        const updatedEvents = savedEvents.map((event) =>
            event.label === labelName
                ? { ...event, label: name }
                : event
        );

        localStorage.setItem('bloom-events', JSON.stringify(updatedEvents));
        window.dispatchEvent(new Event('bloom-calendar-labels-updated'));
        setVisibleLabels((previous) =>
            previous.map((label) => label === labelName ? name : label)
        );

        return true;
    };

    /* Fonction : suppr un label sans supprimer event */
    /* Paramètre : labelName */
    const deleteLabel = (labelName) => {
        const updatedLabels = calendarLabels.filter((label) =>
            label.name !== labelName
        );

        setCalendarLabels(updatedLabels);
        saveCalendarLabels(updatedLabels);

        const savedEvents = JSON.parse(localStorage.getItem('bloom-events') || '[]');
        const updatedEvents = savedEvents.map((event) =>
            event.label === labelName
                ? { ...event, label: NO_CALENDAR_LABEL }
                : event
        );

        localStorage.setItem('bloom-events', JSON.stringify(updatedEvents));
        window.dispatchEvent(new Event('bloom-calendar-labels-updated'));
        setVisibleLabels((previous) =>
            previous.filter((name) => name !== labelName)
        );

        setEditingLabelColor(null);
        setEditingLabelName('');
    };

    /* Fonction : affiche / masque options */
    /* Paramètre : aucun */
    const toggleOptions = () => {
        const nextValue = !showOptions;
        setShowOptions(nextValue);
        localStorage.setItem('bloom-calendar-options-visible', String(nextValue));
    };


    return (
        <section className='calendar-page'>
            <div className='calendar-page-content'>
                {!showOptions && (
                    <button 
                        type='button'
                        className='calendar-options-toggle'
                        onClick={toggleOptions}
                        aria-expanded={showOptions}
                    >Show options</button>
                )}
                <div className='calendar-page-main'>
                    <CalendarWidget
                        variant='full'
                        visibleLabels={visibleLabels}
                        hidePastEvents={hidePastEvents}
                    />
                </div>

                {/* panneau option droite calendrier */}
                {showOptions && (
                    <aside className='calendar-page-sidebar'>
                        <div className='calendar-options-header'>
                            <h3>Calendar options</h3>

                            <button 
                                type='button'
                                className='calendar-options-toggle'
                                onClick={toggleOptions}
                                aria-expanded={showOptions}
                            >Hide</button>
                        </div>

                        {/* liste labels droite calendrier */}
                        <h4 className='calendar-options-section-title'>Label filters</h4>
                        
                        <div className='calendar-label-filters'>
                            {calendarLabels.map((label) => (
                                <div key={label.id} className='calendar-label-filter'>
                                    <input
                                        type='checkbox'
                                        checked={visibleLabels.includes(label.name)}
                                        onChange={() => toggleLabel(label.name)}
                                    />
                                    <span
                                        className='calendar-label-color'
                                        style={{ backgroundColor: label.color }}
                                    ></span>

                                    <span>{label.name}</span>

                                    <button
                                        type='button'
                                        className='calendar-label-edit'
                                        onClick={() => {
                                            const isEditing = editingLabelColor === label.name;

                                            setEditingLabelColor(isEditing ? null : label.name);
                                            setEditingLabelName(isEditing ? '' : label.name);
                                        }}
                                        aria-label={`Edit ${label.name}`}
                                    >
                                        <Pencil size={13} />
                                    </button>

                                    {editingLabelColor === label.name && (
                                        <div className='calendar-label-rename'>
                                            <input
                                                type='text'
                                                className='calendar-label-name-input'
                                                value={editingLabelName}
                                                onChange={(event) => setEditingLabelName(event.target.value)}
                                                placeholder='Label name'
                                                aria-label={`Rename ${label.name}`}
                                            />

                                            <button
                                                type='button'
                                                className='calendar-label-save'
                                                onClick={() => {
                                                    const isRenamed = renameLabel(label.name, editingLabelName);

                                                    if (isRenamed) {
                                                        setEditingLabelColor(null);
                                                        setEditingLabelName('');
                                                    }
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}

                                    {editingLabelColor === label.name && (
                                        <div className='calendar-label-palette'>
                                            {labelColors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type='button'
                                                    className='calendar-label-palette-color'
                                                    style={{ backgroundColor: color.value }}
                                                    onClick={() => changeLabelColor(label.name, color.value)}
                                                    aria-label={`Choose ${color.name}`}
                                                ></button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Options d'affichage du calendrier */}
                        <div className='calendar-display-options'>
                            <h4 className='calendar-options-section-title'>Display options</h4>

                            {/* Interrupteur pour masquer les événements passés */}
                            <label className='calendar-display-option'>
                                <span>Hide past events</span>

                                <input
                                    type='checkbox'
                                    checked={hidePastEvents}
                                    onChange={() => setHidePastEvents(!hidePastEvents)}
                                />

                                <span className='calendar-display-switch'></span>
                            </label>
                        </div>
                    </aside>
                )}
            </div>
        </section>
    );
}

export default CalendarPage;
