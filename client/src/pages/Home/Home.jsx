/* -----------------------------------------
Home.jsx -> Page d'accueil Bloom
----------------------------------------- */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Check, Clock3, FileText, Flower2, Heart, Sparkles, Target } from 'lucide-react';
import Header from '../../components/Header/Header';
import CalendarWidget from '../../components/Widgets/Calendar/Calendar';
import './Home.css';


const motivations = [
    "You don't have to know everything today. Just learn one more thing.",
    "Every study session brings you closer to your goals.",
    "The effort you put in today will pay off tomorrow.",
    "You are capable of learning difficult things.",
    "One chapter at a time. You've got this!",
    "Your hard work is building the future you want.",
    "It's okay to take a break. Just don't give up on yourself.",
    "Small study sessions lead to big achievements.",
    "You don't need motivation every day. Sometimes, showing up is enough.",
    "Keep going. You're making more progress than you think.",
    "Every mistake is a chance to understand something better.",
    "Focus on progress, not on how much you have left to do.",
    "You can do hard things. Even when they take time.",
    "The exam is temporary. What you learn stays with you."
];


// Fonction : récupère les données sauvegardées
// Paramètres : clé et valeur par défaut
// Return : données enregistrées ou valeur par défaut
function readStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

// Fonction : retourne une date locale
// Paramètre : date
// Return : chaîne au format YYYY-MM-DD
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Fonction : vérifie si une tâche est terminée
// Paramètre : task
// Return : boolean
function isTaskCompleted(task) {
    if (task.children?.length > 0) {
        return task.children.every(isTaskCompleted);
    }

    return task.completed === true;
}

// Fonction : extrait le texte d'une note
// Paramètre : content
// Return : texte sans balises HTML
function getNotePreview(content) {
    const element = document.createElement('div');
    element.innerHTML = content || '';

    return element.textContent?.trim() || '';
}

// Fonction : affiche la page d'accueil
// Paramètre : aucun
// Return : JSX
function Home() {
    const [tasks] = useState(() => readStorage('bloom-tasks', []));
    const [events] = useState(() => readStorage('bloom-events', []));
    const [goals] = useState(() => readStorage('bloom-goals', {}));
    const [notes] = useState(() => readStorage('bloom-notes', []));
    const today = new Date();
    const todayKey = formatLocalDate(today);
    const monthKey = todayKey.slice(0, 7);

    const todayEvents = events
        .filter(event => event.date === todayKey)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    const todayTasks = tasks.filter(task =>
        task.date === todayKey && !isTaskCompleted(task)
    );

    const upcomingTasks = tasks
        .filter(task => !isTaskCompleted(task) && task.date && task.date >= todayKey)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 4);

    const intentions = goals[monthKey]?.intentions || [];
    const completedGoals = intentions.filter(item => item.completed).length;
    const goalsProgress = intentions.length
        ? Math.round((completedGoals / intentions.length) * 100)
        : 0;

    const recentNotes = [...notes]
        .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime() || 0;
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime() || 0;

            return dateB - dateA;
        })
        .slice(0, 3);

    const dayNumber = Math.floor(
        (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
            Date.UTC(today.getFullYear(), 0, 1)) / 86400000
    );

    const motivation = motivations[dayNumber % motivations.length];

    return (
        <section className='home'>
            <Header />

            <div className='home-content'>
                <article className='home-widget widget-calendar'>
                    <div className='home-widget-header'>
                        <h2>Calendar</h2>
                        <Link to='/calendar' className='home-widget-link' aria-label='Open calendar'>
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    <CalendarWidget variant='compact' />
                </article>

                <article className='home-widget widget-day'>
                    <div className='home-widget-header'>
                        <h2>My day</h2>
                        <span className='home-widget-date'>
                            {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    <p className='home-widget-subtitle'>
                        A little look at your day ♡
                    </p>

                    <div className='home-day-summary'>
                        <div>
                            <CalendarDays size={17} />
                            <strong>{todayEvents.length}</strong>
                            <span>Events</span>
                        </div>

                        <div>
                            <Check size={17} />
                            <strong>{todayTasks.length}</strong>
                            <span>Tasks left</span>
                        </div>
                    </div>

                    <div className='home-day-list'>
                        {todayEvents.length === 0 && todayTasks.length === 0 ? (
                            <div className='home-empty'>
                                <Flower2 size={24} />
                                <p>A little breathing room today ♡</p>
                            </div>
                        ) : (
                            <>
                                {todayEvents.slice(0, 2).map(event => (
                                    <div className='home-list-item' key={`event-${event.id}`}>
                                        <span className='home-item-icon'>
                                            <CalendarDays size={15} />
                                        </span>

                                        <div className='home-item-text'>
                                            <strong>{event.title}</strong>
                                            <small>{event.time || 'All day'} · Event</small>
                                        </div>
                                    </div>
                                ))}

                                {todayTasks.slice(0, 2).map(task => (
                                    <div className='home-list-item' key={`task-${task.id}`}>
                                        <span className='home-item-icon'>
                                            <Check size={15} />
                                        </span>

                                        <div className='home-item-text'>
                                            <strong>{task.title}</strong>
                                            <small>Task · {task.priority || 'Medium'} priority</small>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </article>

                <article className='home-widget widget-motivation'>
                    <div className='home-widget-header'>
                        <h2>Daily motivation</h2>
                        <Sparkles size={19} className='home-motivation-icon' />
                    </div>

                    <div className='home-motivation-content'>
                        <Heart size={25} />
                        <p>“{motivation}”</p>
                        <span>A gentle reminder for today</span>
                    </div>
                </article>

                <article className='home-widget widget-tasks'>
                    <div className='home-widget-header'>
                        <h2>Upcoming tasks</h2>
                        <Link to='/tasks' className='home-widget-link' aria-label='Open tasks'>
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    {upcomingTasks.length === 0 ? (
                        <div className='home-empty'>
                            <Check size={24} />
                            <p>All caught up! Enjoy your little break ♡</p>
                        </div>
                    ) : (
                        <div className='home-widget-list'>
                            {upcomingTasks.map(task => (
                                <div className='home-list-item' key={task.id}>
                                    <span className='home-task-circle' />

                                    <div className='home-item-text'>
                                        <strong>{task.title}</strong>
                                        <small>
                                            <Clock3 size={12} />
                                            {task.date === todayKey
                                                ? 'Today'
                                                : new Date(`${task.date}T12:00:00`).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                        </small>
                                    </div>

                                    {task.priority === 'High' && (
                                        <span className='home-priority'>High</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className='home-widget widget-goals'>
                    <div className='home-widget-header'>
                        <h2>Goals</h2>
                        <Link to='/goals' className='home-widget-link' aria-label='Open goals'>
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    <div className='home-goals-content'>
                        <div className='home-goals-progress' style={{ '--progress': `${goalsProgress}%` }}>
                            <div>
                                <Target size={17} />
                                <strong>{goalsProgress}%</strong>
                            </div>
                        </div>

                        <div className='home-goals-info'>
                            <strong>My monthly progress</strong>
                            <p>
                                {intentions.length === 0
                                    ? 'Your next chapter starts here ♡'
                                    : `${completedGoals} of ${intentions.length} intentions achieved`}
                            </p>
                            <span>
                                {today.toLocaleDateString('en-US', { month: 'long' })}
                            </span>
                        </div>
                    </div>

                    <div className='home-goals-bar'>
                        <div style={{ width: `${goalsProgress}%` }} />
                    </div>
                </article>

                <article className='home-widget widget-notes'>
                    <div className='home-widget-header'>
                        <h2>Quick notes</h2>
                        <Link to='/notes' className='home-widget-link' aria-label='Open notes'>
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    {recentNotes.length === 0 ? (
                        <div className='home-empty'>
                            <FileText size={24} />
                            <p>Your thoughts deserve a little space ♡</p>
                        </div>
                    ) : (
                        <div className='home-widget-list'>
                            {recentNotes.map(note => (
                                <Link to='/notes' className='home-list-item home-note-item' key={note.id}>
                                    <span className='home-item-icon'>
                                        <FileText size={16} />
                                    </span>

                                    <div className='home-item-text'>
                                        <strong>{note.title || 'Untitled note'}</strong>
                                        <small>
                                            {getNotePreview(note.content) || 'A little space for your thoughts...'}
                                        </small>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}

export default Home;
