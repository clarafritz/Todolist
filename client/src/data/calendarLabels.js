/* -----------------------------------------
calendarLabels.js -> Labels calendar
----------------------------------------- */

/* Labels par défaut */
export const defaultCalendarLabels = [
    { id: 'personal', name: 'Personal', color: '#F8E3E9' },
    { id: 'meeting', name: 'Meeting', color: '#E1EDF7' },
    { id: 'school', name: 'School', color: '#E9E3F5' },
    { id: 'appointment', name: 'Appointment', color: '#E4F0E6' }
];


/* Fonction : Récupère les labels sauvegardés */
/* Paramètre : aucun */
/* Return : tab de labels */
export const getCalendarLabels = () => {
    const savedLabels = localStorage.getItem('bloom-calendar-labels');

    return savedLabels ? JSON.parse(savedLabels) : defaultCalendarLabels;
};

/* Fonction : Sauvegarde les labels */
/* Paramètre : labels (tab de labels) */
export const saveCalendarLabels = (labels) => {
    localStorage.setItem('bloom-calendar-labels', JSON.stringify(labels));
};