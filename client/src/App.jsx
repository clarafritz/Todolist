/* -----------------------------------------
App.jsx -> Composant principal Bloom
----------------------------------------- */
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import './App.css';


/* Fonction : Affiche la structure principale */
/* Paramètre : aucun */
/* Return : JSX */
function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    /*Ferme Sidebar w echap */
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    /* ------------------- */
    return (
        <div className='app'>
            <button
                type='button'
                className='menu-toggle'
                onClick={openSidebar}
                aria-label='Open navigation menu'
                aria-controls='bloom-sidebar'
                aria-expanded={isSidebarOpen}
            >
                <Menu size={24} aria-hidden='true' />
            </button>

            {isSidebarOpen && (
                <button
                    type='button'
                    className='sidebar-overlay'
                    onClick={closeSidebar}
                    aria-label='Close navigation menu'
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <main className='app-content'>
                <Header />
            </main>
        </div>
    );
}

export default App;
