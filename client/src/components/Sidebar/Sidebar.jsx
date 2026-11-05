/* -----------------------------------------
Sidebar.jsx -> Menu nav de Bloom
----------------------------------------- */
import {
    LayoutDashboard,
    ListTodo,
    CalendarDays,
    NotebookPen,
    Target,
    FolderKanban,
    PanelsTopLeft,
    Palette,
    X
} from 'lucide-react';
import './Sidebar.css';

/* Tableau : contient les liens de navigation */
/* Objet : label (texte), icon (composant), path (lien) */
const navItems = [
    { label: 'My Day', icon: LayoutDashboard, path: '#myday' },
    { label: 'Tasks', icon: ListTodo, path: '#tasks' },
    { label: 'Calendar', icon: CalendarDays, path: '#calendar' },
    { label: 'Notes', icon: NotebookPen, path: '#notes' },
    { label: 'Goals', icon: Target, path: '#goals' },
    { label: 'Projects', icon: FolderKanban, path: '#projects' },
    { label: 'My Spaces', icon: PanelsTopLeft, path: '#spaces' },
];


/* Fonction : Affiche le menu de navigation latéral */
/* Paramètres : isOpen (état), onClose (fermeture) */
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
                {/* génère liens : à partir tab */}
                {navItems.map(({ label, icon: Icon, path }, index) =>
                    <a
                        key={label}
                        href={path}
                        onClick={onClose}
                        className={`sidebar-link ${index === 0 ? 'active' : ''}`}
                    >
                        <Icon
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden='true'
                        />
                        <span>{label}</span>
                    </a>
                )}
            </nav>

            <div className='sidebar-bottom'>
                <a
                    href='#customize'
                    className='sidebar-link'
                    onClick={onClose}
                >
                    <Palette
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden='true'
                    />
                    <span>Customize</span>
                </a>
            </div>
        </aside>
    );
}

export default Sidebar;
