/* -----------------------------------------
PagePlaceholder.jsx -> Page temporaire Bloom
----------------------------------------- */
import Header from '../Header/Header';

/* Fonction : Affiche une page en construction */
/* Paramètre : title*/
/* Return : JSX */
function PagePlaceholder({ title }) {
    return (
        <section className='page-placeholder'>
            <Header />

            <h2>{title}</h2>
            <p>This space is growing.</p>
        </section>
    );
}

export default PagePlaceholder;
