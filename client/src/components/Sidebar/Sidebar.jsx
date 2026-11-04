/* -----------------------------------------
Sidebar.jsx -> Menu nav de Bloom
----------------------------------------- */
import { //icône menu 
    LayoutDashboard,
    ListTodo,
    CalendarDays,
    NotebookPen,
    Target, 
    FolderKanban,
    PanelsTopLeft, 
    Palette
} from 'lucide-react';
import './Sidebar.css';


/* Tableau : contient liens nav */
/* Objet possède : label (txt), icon, path */ 
const navItems = [
    {label: 'My Day', icon: LayoutDashboard, path: '#myday'},
    {label: 'Tasks', icon: ListTodo, path: '#tasks'},
    {label: 'Calendar', icon: CalendarDays, path: '#calendar'},
    {label: 'Notes', icon: NotebookPen, path: '#notes'},
    {label: 'Goals', icon: Target, path: '#goals'},
    {label: 'Projects', icon: FolderKanban, path: '#projects'},
    {label: 'My Spaces', icon: PanelsTopLeft, path: '#spaces'},
]


/* Fonction : Affiche menu nav latéral */
/* Paramètre : aucun */
/* Return : JSX */ 
function Sidebar() {
    return (
        <aside className='sidebar'>

            <div className='sidebar-logo'>
                <span>Bloom</span>
                <p>Your space</p>
            </div>

            <nav className='sidebar-nav' aria-label='Main navigation'>
                {/* Genere : liens a partir tableau */}
                {navItems.map(({label, icon: Icon, path}, index) =>
                    <a 
                        key={label}
                        href={path}
                        className={`sidebar-link ${index === 0 ? 'active' : ''}`}
                    >
                        <Icon
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden='true'
                        />

                        {/* Texte lien */}
                        <span>{label}</span>
                    </a>
                )}
            </nav>


            <div className='sidebar-bottom'>
                <a href='#customize' className='sidebar-link'>
                    <Palette
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden='true'
                    />
                    <span>Customize</span>
                </a>
            </div>
        </aside>
    )
}


export default Sidebar;
