/* -----------------------------------------
Dashboard.jsx -> Tableau bord bloom 
----------------------------------------- */
import Header from '../../components/Header/Header';
import './Dashboard.css';


/* Fonction : affiche tab bord */
/* Paramètre : aucun */
/* Return : JSX */
function Dashboard() {
    return (
        <section className='dashboard' id='myday'>
            <Header />

            <div className='dashboard-content'>
                {/* widgets*/}
                <article className='dashboard-widget'>
                    <h2>My Day</h2>
                </article>

                <article className='dashboard-widget'>
                    <h2>Calendar</h2>
                </article>

                <article className='dashboard-widget'>
                    <h2>Upcoming Tasks</h2>
                </article>

                <article className='dashboard-widget'>
                    <h2>Goals</h2>
                </article>

                <article className='dashboard-widget'>
                    <h2>Daily Motivation</h2>
                </article>

                <article className='dashboard-widget'>
                    <h2>Quick Notes</h2>
                </article>
            </div>
        </section>
    )
}

export default Dashboard;