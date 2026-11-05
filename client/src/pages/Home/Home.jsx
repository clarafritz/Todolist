/* -----------------------------------------
Home.jsx -> Page d'accueil Bloom
----------------------------------------- */
import Header from '../../components/Header/Header';
import './Home.css';

/* Fonction : Affiche la page d'accueil */
/* Paramètre : aucun */
/* Return : JSX */
function Home() {
    return (
        <section className='home'>
            <Header />

            <div className='home-content'>
                <article className='home-widget widget-calendar'>
                    <h2>Calendar</h2>
                </article>

                <article className='home-widget widget-day'>
                    <h2>My Day</h2>
                </article>

                <article className='home-widget widget-tasks'>
                    <h2>Upcoming Tasks</h2>
                </article>

                <article className='home-widget widget-goals'>
                    <h2>Goals</h2>
                </article>

                <article className='home-widget widget-motivation'>
                    <h2>Daily Motivation</h2>
                </article>

                <article className='home-widget widget-notes'>
                    <h2>Quick Notes</h2>
                </article>

            </div>
        </section>
    );
}

export default Home;
