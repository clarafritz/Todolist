/* -----------------------------------------
App.jsx -> Composant principal Bloom
----------------------------------------- */
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import CalendarPage from './pages/Calendar/CalendarPage';
import PagePlaceholder from './components/PagePlaceholder/PagePlaceholder';
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

    /*Ferme  Sidebar w echap */
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


    return (
        <BrowserRouter>
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

                {/* Contenu page active */}
                <main className='app-content'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route
                            path='/calendar'
                            element={<CalendarPage />}
                        />
                        <Route
                            path='/tasks'
                            element={<PagePlaceholder title='Tasks' />}
                        />
                        <Route
                            path='/goals'
                            element={<PagePlaceholder title='Goals' />}
                        />
                        <Route
                            path='/notes'
                            element={<PagePlaceholder title='Notes' />}
                        />
                        <Route
                            path='/customize'
                            element={<PagePlaceholder title='Customize' />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
