/* -----------------------------------------
CalendarPage.jsx -> Page UNIQUEMENT pour calendrier 
----------------------------------------- */
import CalendarWidget from '../../components/Widgets/Calendar/Calendar';
import './CalendarPage.css';
import { useState } from 'react';
import { getCalendarLabels } from '../../data/calendarLabels';


/* Fonction : Affiche la page calendrier */
/* Paramètre : aucun */
/* Return : JSX */
function CalendarPage() {
    const [calendarLabels, setCalendarLabels] = useState(getCalendarLabels);
    const [visibleLabels, setVisibleLabels] = useState(
        () => getCalendarLabels().map((label) => label.name)
    );

    /* panneau option etat */
    const [showOptions, setShowOptions] = useState(() => {
        const saved = localStorage.getItem('bloom-calendar-options-visible');
        return saved === null ? true : saved === 'true';
    });



    /* Fonction : Affiche / masque évent label */
    /* Parametre : LabelName */
    const toggleLabel = (labelName) => {
        setVisibleLabels((previous) =>
            previous.includes(labelName)
                ? previous.filter((name) => name !== labelName)
                : [...previous, labelName]
        );
    }

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
                    <CalendarWidget variant='full' visibleLabels={visibleLabels} />
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
                        <div className='calendar-label-filters'>
                            {calendarLabels.map((label) => (
                                <label key={label.name} className='calendar-label-filter'>
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
                                </label>
                            ))}
                        </div>
                    </aside>
                )}
            </div>
        </section>
    );
}

export default CalendarPage;
