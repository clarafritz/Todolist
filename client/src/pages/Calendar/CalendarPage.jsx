/* -----------------------------------------
CalendarPage.jsx -> Page UNIQUEMENT pour calendrier 
----------------------------------------- */
import Header from '../../components/Header/Header';
import CalendarWidget from '../../components/Widgets/Calendar/Calendar';
import './CalendarPage.css';


/* Fonction : Affiche la page calendrier */
/* Paramètre : aucun */
/* Return : JSX */
function CalendarPage() {
    return (
        <section className='calendar-page'>
            <Header />

            <div className='calendar-page-content'>
                <h2>My Calendar</h2>

                <CalendarWidget variant='full' />
            </div>
        </section>
    );
}

export default CalendarPage;
