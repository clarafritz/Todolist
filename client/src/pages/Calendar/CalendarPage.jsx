/* -----------------------------------------
CalendarPage.jsx -> Page UNIQUEMENT pour calendrier 
----------------------------------------- */
import CalendarWidget from '../../components/Widgets/Calendar/Calendar';
import './CalendarPage.css';


/* Fonction : Affiche la page calendrier */
/* Paramètre : aucun */
/* Return : JSX */
function CalendarPage() {
    return (
        <section className='calendar-page'>
            <div className='calendar-page-content'>
                <CalendarWidget variant='full' />
            </div>
        </section>
    );
}

export default CalendarPage;
