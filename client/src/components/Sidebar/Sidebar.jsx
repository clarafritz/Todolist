/* -----------------------------------------
Sidebar.jsx -> Menu nav de Bloom
----------------------------------------- */
import {
    House,
    CalendarDays,
    ListTodo,
    Star,
    NotebookPen,
    Palette,
    X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';


/* Tableau : contient les liens de navigation */
/* Objet : label (txt), icon, path */
const navItems = [
    { label: 'Home', icon: House, path: '/' },
    { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
    { label: 'Tasks', icon: ListTodo, path: '/tasks' },
    { label: 'Goals', icon: Star, path: '/goals' },
    { label: 'Notes', icon: NotebookPen, path: '/notes' },
];


/* Fonction : Affiche le menu latéral */
/* Paramètres : isOpen, onClose */
/* Return : JSX */
function Sidebar({ isOpen, onClose }) {
    return (
        <aside
            id='bloom-sidebar'
            className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        >
            <div className='sidebar-logo'>
                <span>Bloom</span>
                <p>Your space</p>

                <button
                    type='button'
                    className='sidebar-close'
                    onClick={onClose}
                    aria-label='Close navigation menu'
                >
                    <X size={22} aria-hidden='true' />
                </button>
            </div>

            <nav className='sidebar-nav' aria-label='Main navigation'>

                {/* Génère liens depuis tab */}
                {navItems.map(({ label, icon: Icon, path }) =>
                    <NavLink
                        key={label}
                        to={path}
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icon
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden='true'
                        />
                        <span>{label}</span>
                    </NavLink>
                )}
            </nav>

            <div className='sidebar-bottom'>
                <NavLink
                    to='/customize'
                    onClick={onClose}
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                >
                    <Palette
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden='true'
                    />
                    <span>Customize</span>
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;
