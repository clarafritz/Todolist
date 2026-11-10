/* -----------------------------------------
TasksPage.jsx -> Page Tasks de Bloom
----------------------------------------- */
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronRight, Flower2, Search, CalendarDays, ListTodo, CirclePlay, CheckCheck, GripVertical } from 'lucide-react';
import './TasksPage.css';

const taskCategories = [
    { name: 'Personal', color: '#F8E3E9' },
    { name: 'School', color: '#E9E3F5' },
    { name: 'Work', color: '#E1EDF7' },
    { name: 'Other', color: '#E4F0E6' }
];
const taskStatuses = [
    { id: 'todo', name: 'To do', icon: ListTodo },
    { id: 'progress', name: 'In progress', icon: CirclePlay },
    { id: 'done', name: 'Done', icon: CheckCheck }
];
const emptyTask = {
    title: '',
    category: 'Personal',
    customCategory: '',
    priority: 'Medium',
    date: '',
    status: 'todo'
};


/* Fonction : Retourne une date au format YYYY-MM-DD */
/* Paramètre : date */
/* Return : string */
function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/* Fonction : Récupère les données du localStorage */
/* Paramètres : key, fallback */
/* Return : données sauvegardées */
function readStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

/* Fonction : Crée un identifiant unique */
/* Paramètre : aucun */
/* Return : string */
function createId() {
    return crypto.randomUUID();
}

/* Fonction : Vérifie si une tâche est terminée */
/* Paramètre : task */
/* Return : boolean */
function isTaskCompleted(task) {
    if (task.children?.length > 0) {
        return task.children.every(isTaskCompleted);
    }

    return task.completed === true;
}

/* Fonction : Récupère toutes les sous-tâches */
/* Paramètre : children */
/* Return : tableau */
function getAllChildren(children) {
    return children.flatMap((child) => [
        child,
        ...getAllChildren(child.children || [])
    ]);
}

/* Fonction : Calcule la progression d'une tâche */
/* Paramètre : task */
/* Return : objet */
function getTaskProgress(task) {
    const children = getAllChildren(task.children || []);
    const tasks = children.filter((child) => !child.children?.length);

    return {
        completed: tasks.filter(isTaskCompleted).length,
        total: tasks.length
    };
}

/* Fonction : Met à jour une sous-tâche */
/* Paramètres : children, childId, callback */
/* Return : tableau */
function updateChildren(children, childId, callback) {
    return children.map((child) => {
        if (child.id === childId) return callback(child);

        return {
            ...child,
            children: updateChildren(child.children || [], childId, callback)
        };
    });
}

/* Fonction : Supprime une sous-tâche */
/* Paramètres : children, childId */
/* Return : tableau */
function removeChild(children, childId) {
    return children
        .filter((child) => child.id !== childId)
        .map((child) => ({
            ...child,
            children: removeChild(child.children || [], childId)
        }));
}

/* Fonction : Recherche une sous-tâche */
/* Paramètres : children, childId */
/* Return : objet ou undefined */
function findChild(children, childId) {
    for (const child of children) {
        if (child.id === childId) return child;

        const found = findChild(child.children || [], childId);
        if (found) return found;
    }

    return undefined;
}

/* Fonction : Modifie l'état des sous-tâches */
/* Paramètres : children, completed */
/* Return : tableau */
function completeChildren(children, completed) {
    return children.map((child) => ({
        ...child,
        completed,
        children: completeChildren(child.children || [], completed)
    }));
}

/* Fonction : Affiche le formulaire d'ajout d'une sous-tâche */
/* Paramètres : onSave, onCancel */
/* Return : JSX */
function TaskInlineForm({ onSave, onCancel }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title.trim()) return;

        onSave(title.trim());
    };

    return (
        <form className='task-inline-form' onSubmit={handleSubmit}>
            <input
                autoFocus
                type='text'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') onCancel();
                }}
                placeholder='New subtask...'
                aria-label='New subtask'
            />
            <button type='submit' aria-label='Save subtask'>
                <Check size={15} />
            </button>
            <button type='button' onClick={onCancel} aria-label='Cancel'>
                <X size={15} />
            </button>
        </form>
    );
}

/* Fonction : Affiche une sous-tâche et ses enfants */
/* Paramètres : child, taskId, depth, onToggle, onAdd, onEdit, onDelete */
/* Return : JSX */
function TaskChild({ child, taskId, depth, onToggle, onAdd, onEdit, onDelete }) {
    const [expanded, setExpanded] = useState(true);
    const [addingChild, setAddingChild] = useState(false);
    const [editingChild, setEditingChild] = useState(false);
    const [title, setTitle] = useState(child.title);

    const completed = isTaskCompleted(child);
    const hasChildren = child.children?.length > 0;

    const saveTitle = () => {
        if (title.trim()) {
            onEdit(taskId, child.id, title.trim());
        } else {
            setTitle(child.title);
        }

        setEditingChild(false);
    };

    return (
        <div className='task-child-group'>
            <div className='task-child-row' style={{ marginLeft: `${Math.min(depth, 5) * 12}px` }}>
                {hasChildren && (
                    <button
                        type='button'
                        className='task-child-expand'
                        onClick={() => setExpanded(!expanded)}
                        aria-label={expanded ? 'Collapse group' : 'Expand group'}
                    >
                        {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                )}

                <input
                    type='checkbox'
                    checked={completed}
                    onChange={() => onToggle(taskId, child.id)}
                    aria-label={`Complete ${child.title}`}
                />

                {editingChild ? (
                    <input
                        autoFocus
                        className='task-child-input'
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') saveTitle();
                            if (event.key === 'Escape') {
                                setTitle(child.title);
                                setEditingChild(false);
                            }
                        }}
                    />
                ) : (
                    <span className={`task-child-title ${completed ? 'completed' : ''}`}>
                        {child.title}
                    </span>
                )}

                <div className='task-child-actions'>
                    <button
                        type='button'
                        onClick={() => {
                            setAddingChild(!addingChild);
                            setExpanded(true);
                        }}
                        aria-label={`Add subtask to ${child.title}`}
                        title='Add subtask'
                    >
                        <Plus size={13} />
                    </button>
                    <button
                        type='button'
                        onClick={() => setEditingChild(true)}
                        aria-label={`Edit ${child.title}`}
                        title='Edit'
                    >
                        <Pencil size={12} />
                    </button>
                    <button
                        type='button'
                        onClick={() => onDelete(taskId, child.id)}
                        aria-label={`Delete ${child.title}`}
                        title='Delete'
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {addingChild && (
                <div className='task-child-form'>
                    <TaskInlineForm
                        onSave={(value) => {
                            onAdd(taskId, child.id, value);
                            setAddingChild(false);
                        }}
                        onCancel={() => setAddingChild(false)}
                    />
                </div>
            )}

            {expanded && (child.children || []).map((item) => (
                <TaskChild
                    key={item.id}
                    child={item}
                    taskId={taskId}
                    depth={depth + 1}
                    onToggle={onToggle}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

/* Fonction : Affiche une carte de tâche */
/* Paramètres : task et callbacks */
/* Return : JSX */
function TaskCard({ task, onToggle, onEdit, onDelete, onAddChild, onToggleChild, onEditChild, onDeleteChild, onDragStart }) {
    const [expanded, setExpanded] = useState(true);
    const [addingChild, setAddingChild] = useState(false);

    const completed = isTaskCompleted(task);
    const progress = getTaskProgress(task);
    const percent = progress.total ? Math.round((progress.completed / progress.total) * 100) : 0;
    const category = taskCategories.find((item) => item.name === task.category);
    const categoryName = task.category === 'Other' && task.customCategory ? task.customCategory : task.category;

    const formattedDate = task.date
        ? new Date(`${task.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    return (
        <article className={`task-card ${completed ? 'task-card-done' : ''}`}>
            <div className='task-card-main'>
                {!completed && (
                    <span
                        className='task-drag-handle'
                        draggable
                        onDragStart={(event) => onDragStart(event, task.id)}
                        title='Drag to move task'
                        aria-label='Drag task'
                    >
                        <GripVertical size={15} />
                    </span>
                )}

                <input
                    type='checkbox'
                    checked={completed}
                    onChange={() => onToggle(task.id)}
                    aria-label={`Complete ${task.title}`}
                />

                <div className='task-card-content'>
                    <div className='task-card-top'>
                        <span className={`task-card-title ${completed ? 'completed' : ''}`}>
                            {task.title}
                        </span>

                        <span className='task-category' style={{ backgroundColor: category?.color || '#F3E3E9' }}>
                            {categoryName}
                        </span>

                        <span className={`task-priority priority-${(task.priority || 'Medium').toLowerCase()}`}>
                            {task.priority || 'Medium'}
                        </span>

                        <div className='task-card-actions'>
                            {progress.total > 0 && (
                                <span className='task-progress-count'>
                                    {progress.completed}/{progress.total}
                                </span>
                            )}
                            <button
                                type='button'
                                onClick={() => {
                                    setAddingChild(!addingChild);
                                    setExpanded(true);
                                }}
                                aria-label={`Add subtask to ${task.title}`}
                                title='Add subtask'
                            >
                                <Plus size={15} />
                            </button>
                            <button type='button' onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title='Edit task'>
                                <Pencil size={13} />
                            </button>
                            <button type='button' onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title='Delete task'>
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>

                    {formattedDate && (
                        <span className='task-date'>
                            <CalendarDays size={12} />
                            {formattedDate}
                        </span>
                    )}
                </div>
            </div>

            {addingChild && (
                <div className='task-root-form'>
                    <TaskInlineForm
                        onSave={(title) => {
                            onAddChild(task.id, null, title);
                            setAddingChild(false);
                        }}
                        onCancel={() => setAddingChild(false)}
                    />
                </div>
            )}

            {task.children?.length > 0 && (
                <>
                    <button
                        type='button'
                        className='task-children-toggle'
                        onClick={() => setExpanded(!expanded)}
                        aria-label={expanded ? 'Hide subtasks' : 'Show subtasks'}
                        title={expanded ? 'Hide subtasks' : 'Show subtasks'}
                    >
                        {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                    </button>

                    {expanded && (
                        <div className='task-children'>
                            {task.children.map((child) => (
                                <TaskChild
                                    key={child.id}
                                    child={child}
                                    taskId={task.id}
                                    depth={0}
                                    onToggle={onToggleChild}
                                    onAdd={onAddChild}
                                    onEdit={onEditChild}
                                    onDelete={onDeleteChild}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </article>
    );
}

/* Fonction : Affiche la page Tasks */
/* Paramètre : aucun */
/* Return : JSX */
function TasksPage() {
    const [tasks, setTasks] = useState(() => readStorage('bloom-tasks', []));
    const [completionHistory, setCompletionHistory] = useState(() => readStorage('bloom-task-completions', []));
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState(emptyTask);
    const [draggedOver, setDraggedOver] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const today = formatLocalDate(new Date());

    useEffect(() => {
        localStorage.setItem('bloom-tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('bloom-task-completions', JSON.stringify(completionHistory));
    }, [completionHistory]);

    /* Fonction : Enregistre une tâche terminée */
    /* Paramètre : taskId */
    /* Return : aucun */
    const recordCompletion = (taskId) => {
        setCompletionHistory((previous) => {
            if (previous.some((item) => item.taskId === taskId)) return previous;

            return [
                ...previous,
                { id: createId(), taskId, date: new Date().toISOString() }
            ];
        });
    };

    /* Fonction : Ouvre le formulaire de création */
    /* Paramètre : status */
    /* Return : aucun */
    const openCreateTask = (status = 'todo') => {
        setEditingTask(null);
        setTaskForm({ ...emptyTask, status });
        setShowTaskForm(true);
    };

    /* Fonction : Ouvre le formulaire de modification */
    /* Paramètre : task */
    /* Return : aucun */
    const openEditTask = (task) => {
        setEditingTask(task.id);
        setTaskForm({
            title: task.title,
            category: task.category || 'Personal',
            customCategory: task.customCategory || '',
            priority: task.priority || 'Medium',
            date: task.date || '',
            status: task.status || 'todo'
        });
        setShowTaskForm(true);
    };

    /* Fonction : Crée ou modifie une tâche */
    /* Paramètre : event */
    /* Return : aucun */
    const saveTask = (event) => {
        event.preventDefault();

        const title = taskForm.title.trim();
        if (!title) return;

        const values = {
            ...taskForm,
            title,
            customCategory: taskForm.category === 'Other' ? taskForm.customCategory.trim() : ''
        };

        if (editingTask) {
            const currentTask = tasks.find((task) => task.id === editingTask);

            setTasks((previous) => previous.map((task) =>
                task.id === editingTask
                    ? { ...task, ...values, status: currentTask?.status || 'todo' }
                    : task
            ));
        } else {
            setTasks((previous) => [
                ...previous,
                {
                    id: createId(),
                    ...values,
                    completed: false,
                    children: [],
                    createdAt: new Date().toISOString()
                }
            ]);
        }

        setShowTaskForm(false);
        setEditingTask(null);
    };

    /* Fonction : Termine ou réactive une tâche */
    /* Paramètre : taskId */
    /* Return : aucun */
    const toggleTask = (taskId) => {
        const task = tasks.find((item) => item.id === taskId);
        if (!task) return;

        const completed = !isTaskCompleted(task);
        if (completed) recordCompletion(taskId);

        setTasks((previous) => previous.map((item) =>
            item.id === taskId
                ? {
                    ...item,
                    completed,
                    status: completed ? 'done' : item.previousStatus || 'todo',
                    previousStatus: completed
                        ? item.status === 'done' ? item.previousStatus || 'todo' : item.status
                        : item.previousStatus,
                    children: completeChildren(item.children || [], completed)
                }
                : item
        ));
    };

    /* Fonction : Supprime une tâche */
    /* Paramètre : taskId */
    /* Return : aucun */
    const deleteTask = (taskId) => {
        setDeleteConfirm({ type: 'task', taskId });
    };

    /* Fonction : Ajoute une sous-tâche */
    /* Paramètres : taskId, parentId, title */
    /* Return : aucun */
    const addChild = (taskId, parentId, title) => {
        const newChild = {
            id: createId(),
            title,
            completed: false,
            children: []
        };

        setTasks((previous) => previous.map((task) => {
            if (task.id !== taskId) return task;

            const children = parentId
                ? updateChildren(task.children || [], parentId, (child) => ({
                    ...child,
                    completed: false,
                    children: [...(child.children || []), newChild]
                }))
                : [...(task.children || []), newChild];

            return {
                ...task,
                completed: false,
                status: task.status === 'done' ? task.previousStatus || 'todo' : task.status,
                children
            };
        }));
    };

    /* Fonction : Termine ou réactive une sous-tâche */
    /* Paramètres : taskId, childId */
    /* Return : aucun */
    const toggleChild = (taskId, childId) => {
        const task = tasks.find((item) => item.id === taskId);
        if (!task) return;

        const child = findChild(task.children || [], childId);
        if (!child) return;

        const completed = !isTaskCompleted(child);

        const children = updateChildren(task.children || [], childId, (item) => ({
            ...item,
            completed,
            children: completeChildren(item.children || [], completed)
        }));

        const allCompleted = children.length > 0 && children.every(isTaskCompleted);

        if (allCompleted && !isTaskCompleted(task)) recordCompletion(taskId);

        setTasks((previous) => previous.map((item) =>
            item.id === taskId
                ? {
                    ...item,
                    children,
                    completed: allCompleted,
                    status: allCompleted
                        ? 'done'
                        : item.status === 'done' ? item.previousStatus || 'todo' : item.status,
                    previousStatus: allCompleted
                        ? item.status === 'done' ? item.previousStatus || 'todo' : item.status
                        : item.previousStatus
                }
                : item
        ));
    };

    /* Fonction : Modifie une sous-tâche */
    /* Paramètres : taskId, childId, title */
    /* Return : aucun */
    const editChild = (taskId, childId, title) => {
        setTasks((previous) => previous.map((task) =>
            task.id === taskId
                ? {
                    ...task,
                    children: updateChildren(task.children || [], childId, (child) => ({ ...child, title }))
                }
                : task
        ));
    };

    /* Fonction : Supprime une sous-tâche */
    /* Paramètres : taskId, childId */
    /* Return : aucun */
    const deleteChild = (taskId, childId) => {
        setDeleteConfirm({ type: 'child', taskId, childId });
    };

    /* Fonction : Confirme la suppression d'une tâche ou sous-tâche */
    /* Paramètre : aucun */
    /* Return : aucun */
    const confirmDelete = () => {
        if (!deleteConfirm) return;

        if (deleteConfirm.type === 'task') {
            setTasks((previous) => previous.filter((task) => task.id !== deleteConfirm.taskId));
        } else {
            const task = tasks.find((item) => item.id === deleteConfirm.taskId);

            if (task) {
                const children = removeChild(task.children || [], deleteConfirm.childId);
                const completed = children.length > 0 && children.every(isTaskCompleted);

                if (completed && !isTaskCompleted(task)) recordCompletion(task.id);

                setTasks((previous) => previous.map((item) =>
                    item.id === deleteConfirm.taskId
                        ? {
                            ...item,
                            children,
                            completed: children.length > 0 ? completed : false,
                            status: completed
                                ? 'done'
                                : item.status === 'done' ? item.previousStatus || 'todo' : item.status,
                            previousStatus: completed && item.status !== 'done' ? item.status : item.previousStatus
                        }
                        : item
                ));
            }
        }
        setDeleteConfirm(null);
    };

    /* Fonction : Prépare le déplacement d'une tâche */
    /* Paramètres : event, taskId */
    /* Return : aucun */
    const handleDragStart = (event, taskId) => {
        event.dataTransfer.setData('text/plain', taskId);
        event.dataTransfer.effectAllowed = 'move';
    };

    /* Fonction : Déplace une tâche dans une colonne */
    /* Paramètres : event, status */
    /* Return : aucun */
    const handleDrop = (event, status) => {
        event.preventDefault();
        setDraggedOver(null);

        if (status === 'done') return;

        const taskId = event.dataTransfer.getData('text/plain');

        setTasks((previous) => previous.map((task) =>
            task.id === taskId && !isTaskCompleted(task)
                ? { ...task, status }
                : task
        ));
    };

    /* Fonction : Filtre et trie les tâches */
    /* Paramètre : aucun */
    /* Return : tableau */
    const getFilteredTasks = () => {
        return tasks
            .filter((task) => {
                const completed = isTaskCompleted(task);

                if (activeFilter === 'today' && task.date !== today) return false;
                if (activeFilter === 'upcoming' && (!task.date || task.date <= today)) return false;
                if (activeFilter === 'completed' && !completed) return false;
                if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
                if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

                if (search.trim()) {
                    const titles = [
                        task.title,
                        task.customCategory || '',
                        ...getAllChildren(task.children || []).map((child) => child.title)
                    ];

                    if (!titles.some((title) => title.toLowerCase().includes(search.trim().toLowerCase()))) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (!a.date && !b.date) return 0;
                if (!a.date) return 1;
                if (!b.date) return -1;

                return sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
            });
    };

    const filteredTasks = getFilteredTasks();
    const completedTasks = tasks.filter(isTaskCompleted).length;
    const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() + 6) % 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    /* Fonction : Compte les tâches terminées sur une période */
    /* Paramètre : startDate */
    /* Return : number */
    const completionCount = (startDate) => {
        return completionHistory.filter((item) => new Date(item.date) >= startDate).length;
    };

    return (
        <section className='tasks-page'>
            <div className='tasks-header'>
                <div>
                    <h1>My Tasks</h1>
                    <p>Organize, track and complete your projects ♡</p>
                </div>

                <button type='button' className='tasks-add-button' onClick={() => openCreateTask()}>
                    <Plus size={17} />
                    Add task
                </button>
            </div>

            <div className='tasks-overview'>
                <div className='tasks-progress-panel'>
                    <div className='tasks-flower'>
                        <Flower2 size={30} strokeWidth={1.5} />
                    </div>

                    <div className='tasks-progress-info'>
                        <div className='tasks-progress-heading'>
                            <h2>My progress</h2>
                            <strong>{progressPercent}%</strong>
                        </div>

                        <div className='tasks-progress-bar'>
                            <div style={{ width: `${progressPercent}%` }} />
                        </div>

                        <span>{completedTasks} of {tasks.length} tasks completed</span>
                    </div>
                </div>

                <div className='tasks-stats'>
                    {[
                        { label: 'Today', count: completionCount(startOfDay) },
                        { label: 'This week', count: completionCount(startOfWeek) },
                        { label: 'This month', count: completionCount(startOfMonth) }
                    ].map((stat) => (
                        <div key={stat.label} className='tasks-stat'>
                            <CalendarDays size={17} />
                            <span>{stat.label}</span>
                            <strong>{stat.count}</strong>
                            <small>completed</small>
                        </div>
                    ))}
                </div>
            </div>

            <div className='tasks-toolbar'>
                <div className='tasks-filters'>
                    {[
                        { id: 'all', name: 'All tasks' },
                        { id: 'today', name: 'Today' },
                        { id: 'upcoming', name: 'Upcoming' },
                        { id: 'completed', name: 'Completed' }
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            type='button'
                            className={activeFilter === filter.id ? 'active' : ''}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.name}
                        </button>
                    ))}
                </div>

                <div className='tasks-toolbar-controls'>
                    <label className='tasks-search'>
                        <Search size={15} />
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Search a task...'
                        />
                    </label>

                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label='Filter by category'>
                        <option value='all'>All categories</option>
                        {taskCategories.map((category) => (
                            <option key={category.name} value={category.name}>{category.name}</option>
                        ))}
                    </select>

                    <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label='Filter by priority'>
                        <option value='all'>All priorities</option>
                        <option value='High'>High</option>
                        <option value='Medium'>Medium</option>
                        <option value='Low'>Low</option>
                    </select>

                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label='Sort by due date'>
                        <option value='asc'>Due date ↑</option>
                        <option value='desc'>Due date ↓</option>
                    </select>
                </div>
            </div>

            <div className='tasks-board'>
                {taskStatuses.map((status) => {
                    const Icon = status.icon;

                    const columnTasks = filteredTasks.filter((task) => {
                        if (isTaskCompleted(task)) return status.id === 'done';

                        return task.status === status.id || (task.status === 'done' && status.id === 'todo');
                    });

                    return (
                        <div
                            key={status.id}
                            className={`tasks-column tasks-column-${status.id} ${draggedOver === status.id ? 'drag-over' : ''}`}
                            onDragOver={(event) => {
                                if (status.id === 'done') return;

                                event.preventDefault();
                                event.dataTransfer.dropEffect = 'move';
                                if (draggedOver !== status.id) setDraggedOver(status.id);
                            }}
                            onDragLeave={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget)) setDraggedOver(null);
                            }}
                            onDrop={(event) => handleDrop(event, status.id)}
                        >
                            <div className='tasks-column-header'>
                                <div className='tasks-column-title'>
                                    <Icon size={18} strokeWidth={1.6} />
                                    <h2>{status.name}</h2>
                                    <span>{columnTasks.length}</span>
                                </div>

                                {status.id !== 'done' && (
                                    <button
                                        type='button'
                                        onClick={() => openCreateTask(status.id)}
                                        aria-label={`Add task to ${status.name}`}
                                        title='Add task'
                                    >
                                        <Plus size={19} />
                                    </button>
                                )}
                            </div>

                            <div className='tasks-column-list'>
                                {columnTasks.length === 0 ? (
                                    <div className='tasks-empty'>
                                        <Flower2 size={23} strokeWidth={1.3} />
                                        <p>No tasks here yet ♡</p>
                                    </div>
                                ) : (
                                    columnTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onToggle={toggleTask}
                                            onEdit={openEditTask}
                                            onDelete={deleteTask}
                                            onAddChild={addChild}
                                            onToggleChild={toggleChild}
                                            onEditChild={editChild}
                                            onDeleteChild={deleteChild}
                                            onDragStart={handleDragStart}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showTaskForm && (
                <div className='task-modal-overlay'>
                    <div className='task-modal' role='dialog' aria-modal='true' aria-labelledby='task-modal-title'>
                        <div className='task-modal-header'>
                            <h2 id='task-modal-title'>{editingTask ? 'Edit Task' : 'New Task'}</h2>
                            <button type='button' onClick={() => setShowTaskForm(false)} aria-label='Close'>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveTask}>
                            <label>
                                Task title
                                <input
                                    autoFocus
                                    required
                                    type='text'
                                    value={taskForm.title}
                                    onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                                    placeholder='What would you like to do?'
                                />
                            </label>

                            <div className='task-modal-fields'>
                                <label>
                                    Category
                                    <select
                                        value={taskForm.category}
                                        onChange={(event) => setTaskForm({ ...taskForm, category: event.target.value })}
                                    >
                                        {taskCategories.map((category) => (
                                            <option key={category.name} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Priority
                                    <select
                                        value={taskForm.priority}
                                        onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
                                    >
                                        <option value='Low'>Low</option>
                                        <option value='Medium'>Medium</option>
                                        <option value='High'>High</option>
                                    </select>
                                </label>
                            </div>

                            {taskForm.category === 'Other' && (
                                <label>
                                    Specify category (optional)
                                    <input
                                        type='text'
                                        value={taskForm.customCategory}
                                        onChange={(event) => setTaskForm({ ...taskForm, customCategory: event.target.value })}
                                        placeholder='e.g. Sport, Project...'
                                    />
                                </label>
                            )}

                            <label>
                                Due date (optional)
                                <input
                                    type='date'
                                    value={taskForm.date}
                                    onChange={(event) => setTaskForm({ ...taskForm, date: event.target.value })}
                                />
                            </label>

                            <div className='task-modal-footer'>
                                <button type='button' className='task-modal-cancel' onClick={() => setShowTaskForm(false)}>
                                    Cancel
                                </button>
                                <button type='submit' className='task-modal-save'>
                                    {editingTask ? 'Save changes' : 'Create task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className='task-modal-overlay'>
                    <div className='task-delete-modal' role='dialog' aria-modal='true' aria-labelledby='delete-modal-title'>
                        <div className='task-delete-icon'>
                            <Trash2 size={23} strokeWidth={1.5} />
                        </div>

                        <h2 id='delete-modal-title'>
                            Delete this {deleteConfirm.type === 'task' ? 'task' : 'subtask'}?
                        </h2>

                        <p>
                            {deleteConfirm.type === 'task'
                                ? 'This task and all its subtasks will be permanently deleted.'
                                : 'This subtask and its children will be permanently deleted.'}
                            {' '}Are you sure?
                        </p>

                        <div className='task-delete-actions'>
                            <button type='button' className='task-modal-cancel' onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </button>
                            <button type='button' className='task-delete-button' onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default TasksPage;
