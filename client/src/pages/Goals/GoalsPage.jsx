/* -----------------------------------------
GoalsPage.jsx -> Page des objectifs de Bloom
----------------------------------------- */
import { useEffect, useState } from 'react';
import {
    Plus, ChevronLeft, ChevronRight, Target, ImagePlus,
    ChartNoAxesColumnIncreasing, Sparkles, Heart, Check,
    Pencil, Trash2, X, Flower2, CalendarDays
} from 'lucide-react';
import './GoalsPage.css';


// Fonction : crée un identifiant unique
// Paramètre : aucun
// Return : une chaîne de caractères
function createId() {
    return crypto.randomUUID();
}

// Fonction : lit les données enregistrées
// Paramètre : key, fallback
// Return : les données ou la valeur par défaut
function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

// Fonction : crée la clé d'un mois
// Paramètre : date
// Return : une chaîne au format YYYY-MM
function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Fonction : retourne le lundi de la semaine
// Paramètre : date
// Return : une date
function getWeekStart(date) {
    const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
    return result;
}

// Fonction : crée une clé de jour locale
// Paramètre : date
// Return : une chaîne au format YYYY-MM-DD
function getDayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Fonction : ouvre la base locale des images
// Paramètre : aucun
// Return : une promesse contenant la base
function openMoodboardDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('bloom-moodboards', 1);

        request.onupgradeneeded = () => {
            const database = request.result;

            if (!database.objectStoreNames.contains('photos')) {
                database.createObjectStore('photos', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Fonction : lit les photos enregistrées pour un mois
// Paramètre : monthKey
// Return : une promesse contenant les photos
async function loadPhotos(monthKey) {
    const database = await openMoodboardDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readonly');
        const request = transaction.objectStore('photos').getAll();

        request.onsuccess = () => {
            resolve(request.result.filter(photo => photo.monthKey === monthKey));
        };

        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => database.close();
    });
}

// Fonction : ajoute une photo dans la base locale
// Paramètre : photo
// Return : une promesse
async function savePhoto(photo) {
    const database = await openMoodboardDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readwrite');
        transaction.objectStore('photos').put(photo);

        transaction.oncomplete = () => {
            database.close();
            resolve();
        };

        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
}

// Fonction : supprime une photo de la base locale
// Paramètre : id
// Return : une promesse
async function removePhoto(id) {
    const database = await openMoodboardDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction('photos', 'readwrite');
        transaction.objectStore('photos').delete(id);

        transaction.oncomplete = () => {
            database.close();
            resolve();
        };

        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
}

// Fonction : affiche une fenêtre pour ajouter ou modifier un élément
// Paramètre : modal, value, setValue, onClose, onSave
// Return : du JSX
function GoalModal({ modal, value, setValue, onClose, onSave }) {
    if (!modal) return null;

    return (
        <div className='goals-modal-overlay' onMouseDown={onClose}>
            <div className='goals-modal' onMouseDown={event => event.stopPropagation()}>
                <div className='goals-modal-header'>
                    <h2>{modal.id ? 'Edit' : 'Add'} {modal.type === 'intention' ? 'an intention' : modal.type === 'habit' ? 'a habit' : 'a little win'}</h2>
                    <button type='button' className='goals-icon-button' onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSave}>
                    <label htmlFor='goals-modal-input'>
                        {modal.type === 'intention' ? 'My intention' : modal.type === 'habit' ? 'My weekly habit' : 'My little win'}
                    </label>

                    <input
                        id='goals-modal-input'
                        autoFocus
                        maxLength={160}
                        placeholder={modal.type === 'intention' ? 'What would you like to achieve?' : modal.type === 'habit' ? 'What would you like to practice?' : 'What made you proud or happy?'}
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />

                    <div className='goals-modal-actions'>
                        <button type='button' className='goals-secondary-button' onClick={onClose}>Cancel</button>
                        <button type='submit' className='goals-primary-button' disabled={!value.trim()}>
                            {modal.id ? 'Save changes' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Fonction : affiche la page Goals
// Paramètre : aucun
// Return : du JSX
function GoalsPage() {
    const [selectedMonth, setSelectedMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [monthsData, setMonthsData] = useState(() => readStorage('bloom-goals', {}));
    const [photos, setPhotos] = useState([]);
    const [photosLoading, setPhotosLoading] = useState(true);
    const [photoError, setPhotoError] = useState('');
    const [modal, setModal] = useState(null);
    const [modalValue, setModalValue] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

    const monthKey = getMonthKey(selectedMonth);
    const monthData = monthsData[monthKey] || {};
    const intentions = monthData.intentions || [];
    const habits = monthData.habits || [];
    const wins = monthData.wins || [];
    const completedCount = intentions.filter(item => item.completed).length;
    const progress = intentions.length ? Math.round((completedCount / intentions.length) * 100) : 0;
    const monthLabel = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return date;
    });

    useEffect(() => {
        localStorage.setItem('bloom-goals', JSON.stringify(monthsData));
    }, [monthsData]);

    useEffect(() => {
        let active = true;
        let urls = [];

        setPhotos([]);
        setPhotosLoading(true);
        setPhotoError('');

        loadPhotos(monthKey)
            .then(items => {
                if (!active) return;

                urls = items.map(item => ({
                    id: item.id,
                    url: URL.createObjectURL(item.file)
                }));

                setPhotos(urls);
            })
            .catch(() => {
                if (active) setPhotoError('Unable to load your photos.');
            })
            .finally(() => {
                if (active) setPhotosLoading(false);
            });

        return () => {
            active = false;
            urls.forEach(photo => URL.revokeObjectURL(photo.url));
        };
    }, [monthKey]);

    // Fonction : met à jour les données du mois sélectionné
    // Paramètre : changes
    // Return : aucun
    function updateMonth(changes) {
        setMonthsData(previous => ({
            ...previous,
            [monthKey]: {
                ...previous[monthKey],
                ...changes
            }
        }));
    }

    // Fonction : change le mois affiché
    // Paramètre : direction
    // Return : aucun
    function changeMonth(direction) {
        const nextMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + direction, 1);
        const today = new Date();
        const reference = getMonthKey(nextMonth) === getMonthKey(today) ? today : nextMonth;

        setSelectedMonth(nextMonth);
        setWeekStart(getWeekStart(reference));
    }

    // Fonction : ouvre la fenêtre de création ou modification
    // Paramètre : type, item
    // Return : aucun
    function openModal(type, item = null) {
        setModal({ type, id: item?.id || null });
        setModalValue(item?.text || '');
    }

    // Fonction : enregistre une intention, une habitude ou une victoire
    // Paramètre : event
    // Return : aucun
    function saveItem(event) {
        event.preventDefault();

        const text = modalValue.trim();
        if (!text || !modal) return;

        const field = modal.type === 'intention' ? 'intentions' : modal.type === 'habit' ? 'habits' : 'wins';
        const items = monthData[field] || [];

        if (modal.id) {
            updateMonth({
                [field]: items.map(item => item.id === modal.id ? { ...item, text } : item)
            });
        } else {
            const item = modal.type === 'intention'
                ? { id: createId(), text, completed: false }
                : modal.type === 'habit'
                    ? { id: createId(), text, days: {} }
                    : { id: createId(), text };

            updateMonth({ [field]: [...items, item] });
        }

        setModal(null);
        setModalValue('');
    }

    // Fonction : coche ou décoche une intention
    // Paramètre : id
    // Return : aucun
    function toggleIntention(id) {
        updateMonth({
            intentions: intentions.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
        });
    }

    // Fonction : coche ou décoche une habitude pour une journée
    // Paramètre : habitId, dayKey
    // Return : aucun
    function toggleHabit(habitId, dayKey) {
        updateMonth({
            habits: habits.map(habit => {
                if (habit.id !== habitId) return habit;

                return {
                    ...habit,
                    days: {
                        ...habit.days,
                        [dayKey]: !habit.days?.[dayKey]
                    }
                };
            })
        });
    }

    // Fonction : supprime un élément après confirmation
    // Paramètre : aucun
    // Return : aucun
    function confirmDelete() {
        if (!deleteConfirm) return;

        const field = deleteConfirm.type === 'intention' ? 'intentions' : deleteConfirm.type === 'habit' ? 'habits' : 'wins';

        updateMonth({
            [field]: (monthData[field] || []).filter(item => item.id !== deleteConfirm.id)
        });

        setDeleteConfirm(null);
    }

    // Fonction : ajoute plusieurs photos au moodboard
    // Paramètre : event
    // Return : une promesse
    async function addPhotos(event) {
        const files = Array.from(event.target.files || []);
        event.target.value = '';

        if (!files.length) return;

        setPhotoError('');

        if (photos.length + files.length > 12) {
            setPhotoError('You can add up to 12 photos per month.');
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
                setPhotoError('Choose images smaller than 5 MB.');
                return;
            }
        }

        try {
            for (const file of files) {
                await savePhoto({ id: createId(), monthKey, file });
            }

            const updated = await loadPhotos(monthKey);

            if (getMonthKey(selectedMonth) === monthKey) {
                setPhotos(previous => {
                    previous.forEach(photo => URL.revokeObjectURL(photo.url));
                    return updated.map(item => ({
                        id: item.id,
                        url: URL.createObjectURL(item.file)
                    }));
                });
            }
        } catch {
            setPhotoError('Unable to save your photos.');
        }
    }

    // Fonction : supprime une photo du moodboard
    // Paramètre : id
    // Return : une promesse
    async function deletePhoto(id) {
        try {
            await removePhoto(id);
            setPhotos(previous => previous.filter(photo => {
                if (photo.id === id) URL.revokeObjectURL(photo.url);
                return photo.id !== id;
            }));
        } catch {
            setPhotoError('Unable to delete this photo.');
        }
    }

    // Fonction : change la semaine affichée
    // Paramètre : direction
    // Return : aucun
    function changeWeek(direction) {
        const next = new Date(weekStart);
        next.setDate(next.getDate() + direction * 7);
        setWeekStart(next);
    }

    return (
        <main className='goals-page'>
            <header className='goals-page-header'>
                <div className='goals-month-navigation'>
                    <button type='button' aria-label='Previous month' onClick={() => changeMonth(-1)}>
                        <ChevronLeft size={18} />
                    </button>
                    <span>{monthLabel}</span>
                    <button type='button' aria-label='Next month' onClick={() => changeMonth(1)}>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            <section className='goals-overview'>
                <div className='goals-overview-month'>
                    <span className='goals-eyebrow'>THIS MONTH'S CHAPTER</span>
                    <h2>{selectedMonth.toLocaleDateString('en-US', { month: 'long' })}</h2>
                    <p>Little steps, real progress.</p>
                </div>

                <div className='goals-overview-progress'>
                    <div className='goals-progress-ring' style={{ '--progress': `${progress}%` }}>
                        <div>{progress}%</div>
                    </div>

                    <div className='goals-progress-details'>
                        <h3>My progress</h3>
                        <p>{completedCount} of {intentions.length} goals achieved</p>
                        <div className='goals-progress-bar'>
                            <div style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </section>

            <div className='goals-main-grid'>
                <section className='goals-widget goals-intentions'>
                    <div className='goals-widget-header'>
                        <div className='goals-widget-heading'>
                            <Target size={22} />
                            <div>
                                <h2>My intentions</h2>
                                <p>My main goals for this month ♡</p>
                            </div>
                        </div>

                        <button type='button' className='goals-add-button' aria-label='Add intention' onClick={() => openModal('intention')}>
                            <Plus size={19} />
                        </button>
                    </div>

                    {intentions.length === 0 ? (
                        <div className='goals-empty'>
                            <Flower2 size={27} />
                            <span>No intentions yet ♡</span>
                            <p>What would you like to achieve this month?</p>
                            <button type='button' onClick={() => openModal('intention')}>Add an intention</button>
                        </div>
                    ) : (
                        <div className='goals-intentions-list'>
                            {intentions.map(item => (
                                <div className='goals-intention-row' key={item.id}>
                                    <button type='button' className={`goals-check ${item.completed ? 'is-checked' : ''}`} aria-label={item.completed ? 'Uncheck intention' : 'Complete intention'} onClick={() => toggleIntention(item.id)}>
                                        {item.completed && <Check size={14} />}
                                    </button>

                                    <span className={item.completed ? 'is-completed' : ''}>{item.text}</span>

                                    <div className='goals-item-actions'>
                                        <button type='button' aria-label='Edit intention' onClick={() => openModal('intention', item)}>
                                            <Pencil size={14} />
                                        </button>
                                        <button type='button' aria-label='Delete intention' onClick={() => setDeleteConfirm({ type: 'intention', id: item.id })}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className='goals-widget goals-moodboard'>
                    <div className='goals-widget-header'>
                        <div className='goals-widget-heading'>
                            <ImagePlus size={22} />
                            <div>
                                <h2>My monthly moodboard</h2>
                                <p>The vibe of my month ♡</p>
                            </div>
                        </div>

                        <label className='goals-add-button' aria-label='Add photos' title='Add photos'>
                            <Plus size={19} />
                            <input type='file' accept='image/*' multiple onChange={addPhotos} hidden />
                        </label>
                    </div>

                    {photosLoading ? (
                        <div className='goals-empty'><span>Loading your photos...</span></div>
                    ) : photos.length === 0 ? (
                        <label className='goals-moodboard-empty'>
                            <span className='goals-moodboard-plus'><Plus size={25} /></span>
                            <strong>Add some inspiration</strong>
                            <span>Create your monthly moodboard ♡</span>
                            <input type='file' accept='image/*' multiple onChange={addPhotos} hidden />
                        </label>
                    ) : (
                        <div className={`goals-photo-grid goals-photo-count-${Math.min(photos.length, 5)}`}>
                            {photos.map(photo => (
                                <div className='goals-photo' key={photo.id}>
                                    <img src={photo.url} alt='Monthly moodboard inspiration' />
                                    <button type='button' aria-label='Remove photo' onClick={() => deletePhoto(photo.id)}>
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {photoError && <p className='goals-photo-error'>{photoError}</p>}
                </section>

                <section className='goals-widget goals-habits'>
                    <div className='goals-widget-header'>
                        <div className='goals-widget-heading'>
                            <ChartNoAxesColumnIncreasing size={22} />
                            <div>
                                <h2>My habits</h2>
                                <p>Small actions, big results ♡</p>
                            </div>
                        </div>

                        <button type='button' className='goals-add-button' aria-label='Add habit' onClick={() => openModal('habit')}>
                            <Plus size={19} />
                        </button>
                    </div>

                    {habits.length === 0 ? (
                        <div className='goals-empty'>
                            <Flower2 size={27} />
                            <span>No habits yet ♡</span>
                            <p>Add a weekly habit to track your progress.</p>
                            <button type='button' onClick={() => openModal('habit')}>Add a habit</button>
                        </div>
                    ) : (
                        <div className='goals-habits-content'>
                            <div className='goals-week-navigation'>
                                <button type='button' aria-label='Previous week' onClick={() => changeWeek(-1)}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span>
                                    {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {' – '}
                                    {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <button type='button' aria-label='Next week' onClick={() => changeWeek(1)}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className='goals-habits-scroll'>
                                <div className='goals-habit-grid'>
                                    <span />
                                    {weekDays.map(day => (
                                        <span className='goals-habit-day' key={getDayKey(day)}>
                                            {day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                                            <small>{day.getDate()}</small>
                                        </span>
                                    ))}

                                    {habits.map(habit => (
                                        <div className='goals-habit-row' key={habit.id}>
                                            <div className='goals-habit-name'>
                                                <span title={habit.text}>{habit.text}</span>
                                                <div className='goals-item-actions'>
                                                    <button type='button' aria-label='Edit habit' onClick={() => openModal('habit', habit)}>
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button type='button' aria-label='Delete habit' onClick={() => setDeleteConfirm({ type: 'habit', id: habit.id })}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {weekDays.map(day => {
                                                const dayKey = getDayKey(day);
                                                const isInMonth = getMonthKey(day) === monthKey;
                                                const checked = !!habit.days?.[dayKey];

                                                return (
                                                    <button
                                                        type='button'
                                                        key={dayKey}
                                                        className={`goals-habit-check ${checked ? 'is-checked' : ''}`}
                                                        disabled={!isInMonth}
                                                        aria-label={`${habit.text}, ${dayKey}`}
                                                        aria-pressed={checked}
                                                        onClick={() => toggleHabit(habit.id, dayKey)}
                                                    >
                                                        {checked && <Check size={12} />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <section className='goals-widget goals-wins'>
                <div className='goals-widget-header'>
                    <div className='goals-widget-heading'>
                        <Heart size={22} />
                        <div>
                            <h2>My little wins</h2>
                            <p>The little moments worth celebrating ♡</p>
                        </div>
                    </div>

                    <button type='button' className='goals-add-button' aria-label='Add little win' onClick={() => openModal('win')}>
                        <Plus size={19} />
                    </button>
                </div>

                {wins.length === 0 ? (
                    <div className='goals-wins-empty'>
                        <Sparkles size={19} />
                        <span>Every little victory deserves to be celebrated ♡</span>
                        <button type='button' onClick={() => openModal('win')}>Add your first little win</button>
                    </div>
                ) : (
                    <div className='goals-wins-list'>
                        {wins.map(win => (
                            <div className='goals-win-item' key={win.id}>
                                <Sparkles size={17} />
                                <span>{win.text}</span>
                                <div className='goals-item-actions'>
                                    <button type='button' aria-label='Edit little win' onClick={() => openModal('win', win)}>
                                        <Pencil size={14} />
                                    </button>
                                    <button type='button' aria-label='Delete little win' onClick={() => setDeleteConfirm({ type: 'win', id: win.id })}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <GoalModal
                modal={modal}
                value={modalValue}
                setValue={setModalValue}
                onClose={() => setModal(null)}
                onSave={saveItem}
            />

            {deleteConfirm && (
                <div className='goals-modal-overlay' onMouseDown={() => setDeleteConfirm(null)}>
                    <div className='goals-modal goals-delete-modal' onMouseDown={event => event.stopPropagation()}>
                        <div className='goals-delete-icon'><Trash2 size={22} /></div>
                        <h2>Delete this {deleteConfirm.type === 'intention' ? 'intention' : deleteConfirm.type === 'habit' ? 'habit' : 'little win'}?</h2>
                        <p>This action cannot be undone.</p>
                        <div className='goals-modal-actions'>
                            <button type='button' className='goals-secondary-button' onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button type='button' className='goals-primary-button' onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default GoalsPage;
