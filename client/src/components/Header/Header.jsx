/* -----------------------------------------
Header.jsx -> en tete bloom 
----------------------------------------- */
import { Search, Bell, Heart } from 'lucide-react';
import './Header.css';


/* Fonction : Affiche header du Dashboard */
/* Paramètre : aucun */
/* Return : JSX */
function Header() {
    return (
        <header className='header'>
            <div className='header-welcome'>
                <h1>
                    Good morning
                    <Heart size={22} strokeWidth={1.5} aria-hidden='true' />
                </h1>
                <p>A little progress every day.</p>
            </div>

            <div className='header-actions'>
                <button
                    type='button'
                    className='header-button'
                    aria-label='Search'
                >
                    <Search size={20} strokeWidth={1.8} />
                </button>

                <button
                    type='button'
                    className='header-button'
                    aria-label='Notifications'
                >
                    <Bell size={20} strokeWidth={1.8} />
                </button>

                {/* Avatar temporaire */}
                <div className='header-avatar' aria-label='User profile'>
                    <span>C</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
