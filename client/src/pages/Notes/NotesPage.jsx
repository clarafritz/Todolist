/* -----------------------------------------
NotesPage.jsx -> Page Notes de Bloom
----------------------------------------- */
import { useEffect, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, Minus, Plus, Search, Settings2, Files, Folder, Pencil, Trash2, X, Check, ChevronRight } from 'lucide-react';
import './NotesPage.css';
import Placeholder from '@tiptap/extension-placeholder';


const DEFAULT_FOLDERS = [
    { id: 'personal', name: 'Personal' },
    { id: 'school', name: 'School' },
    { id: 'ideas', name: 'Ideas' }
];

const FontSize = Extension.create({
    name: 'fontSize',

    addGlobalAttributes() {
        return [{
            types: ['textStyle'],
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize || null,
                    renderHTML: attributes => attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {}
                }
            }
        }];
    }
});


// Fonction : récupérer les données sauvegardées
// Paramètres : clé et valeur par défaut
// Return : données enregistrées ou valeur par défaut
function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}


// Fonction : afficher l'éditeur enrichi d'une note
// Paramètres : note et fonction de mise à jour
// Return : JSX de l'éditeur
function NoteEditor({ note, onUpdate }) {
    const [fontSize, setFontSize] = useState(14);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ underline: false }),
            TextStyle,
            FontSize,
            Highlight.configure({ multicolor: false }),
            Underline,
            Placeholder.configure({
                placeholder: 'Start writing your thoughts here... ♡'
            })
        ],
        content: note.content,
        editorProps: {
            attributes: {
                class: 'notes-writing-area'
            }
        },
        onUpdate: ({ editor }) => {
            onUpdate(note.id, { content: editor.getHTML() });
        }
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor?.isActive('bold') ?? false,
            italic: editor?.isActive('italic') ?? false,
            underline: editor?.isActive('underline') ?? false,
            highlight: editor?.isActive('highlight') ?? false
        })
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== note.content) {
            editor.commands.setContent(note.content, { emitUpdate: false });
        }
    }, [editor, note.id, note.content]);

    useEffect(() => {
        if (!editor) return;

        const updateSize = () => {
            const currentSize = editor.getAttributes('textStyle').fontSize;
            setFontSize(currentSize ? parseInt(currentSize, 10) || 14 : 14);
        };

        editor.on('selectionUpdate', updateSize);
        return () => editor.off('selectionUpdate', updateSize);
    }, [editor]);

    // Fonction : modifier la taille du texte sélectionné
    // Paramètre : variation de taille
    // Return : aucun
    function changeFontSize(amount) {
        if (!editor) return;

        const nextSize = Math.max(10, Math.min(36, fontSize + amount));
        editor.chain().focus().setMark('textStyle', { fontSize: `${nextSize}px` }).run();
        setFontSize(nextSize);
    }

    return (
        <>
            <div
                className="notes-editor-content"
                onClick={() => editor?.chain().focus().run()}
            >
                <EditorContent editor={editor} />
            </div>

            <div className="notes-toolbar">
                <div className="notes-format-actions">
                    <button
                        type="button"
                        className={editorState.bold ? 'active' : ''}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        title="Gras"
                        aria-label="Gras"
                    >
                        <Bold size={17} />
                    </button>

                    <button
                        type="button"
                        className={editorState.italic ? 'active' : ''}
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        title="Italique"
                        aria-label="Italique"
                    >
                        <Italic size={17} />
                    </button>

                    <button
                        type="button"
                        className={editorState.underline ? 'active' : ''}
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        title="Souligné"
                        aria-label="Souligné"
                    >
                        <UnderlineIcon size={17} />
                    </button>

                    <button
                        type="button"
                        className={editorState.highlight ? 'active' : ''}
                        onClick={() => editor?.chain().focus().toggleHighlight().run()}
                        title="Surligner"
                        aria-label="Surligner"
                    >
                        <Highlighter size={17} />
                    </button>
                </div>

                <div className="notes-font-size">
                    <button type="button" onClick={() => changeFontSize(-1)} aria-label="Réduire la police">
                        <Minus size={15} />
                    </button>
                    <span>{fontSize}</span>
                    <button type="button" onClick={() => changeFontSize(1)} aria-label="Augmenter la police">
                        <Plus size={15} />
                    </button>
                </div>
            </div>
        </>
    );
}


// Fonction : afficher la page Notes
// Paramètre : aucun
// Return : JSX
function NotesPage() {
    const [folders, setFolders] = useState(() => loadData('bloom-note-folders', DEFAULT_FOLDERS));
    const [notes, setNotes] = useState(() => loadData('bloom-notes', []));
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');

    const currentNote = notes.find(note => note.id === selectedNote);
    const visibleNotes = notes.filter(note =>
        (selectedFolder === 'all' || note.folderId === selectedFolder) &&
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        localStorage.setItem('bloom-note-folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('bloom-notes', JSON.stringify(notes));
    }, [notes]);

    // Fonction : sélectionner un dossier
    // Paramètre : identifiant du dossier
    // Return : aucun
    function openFolder(folderId) {
        setSelectedFolder(folderId);
        setSelectedNote(null);
        setSearch('');
        setSearchOpen(false);
    }

    // Fonction : créer un dossier
    // Paramètre : aucun
    // Return : aucun
    function addFolder() {
        const name = window.prompt('Name of your new folder ♡');
        if (!name?.trim()) return;

        const id = crypto.randomUUID();
        setFolders([...folders, { id, name: name.trim() }]);
        openFolder(id);
    }

    // Fonction : enregistrer le nouveau nom d'un dossier
    // Paramètre : identifiant du dossier
    // Return : aucun
    function saveFolderName(folderId) {
        if (!folderName.trim()) return;

        setFolders(folders.map(folder =>
            folder.id === folderId ? { ...folder, name: folderName.trim() } : folder
        ));
        setEditingFolder(null);
        setFolderName('');
    }

    // Fonction : supprimer un dossier et ses notes
    // Paramètre : identifiant du dossier
    // Return : aucun
    function deleteFolder(folderId) {
        const folder = folders.find(item => item.id === folderId);
        if (!window.confirm(`Delete "${folder?.name}" and all its notes?`)) return;

        setFolders(folders.filter(item => item.id !== folderId));
        setNotes(notes.filter(note => note.folderId !== folderId));

        if (selectedFolder === folderId) {
            setSelectedFolder(null);
            setSelectedNote(null);
        }
    }

    // Fonction : créer une note dans le dossier sélectionné
    // Paramètre : aucun
    // Return : aucun
    function addNote() {
        const folderId = selectedFolder === 'all' ? (folders[0]?.id || null) : selectedFolder;

        if (!folderId) {
            window.alert('Create a folder first ♡');
            return;
        }

        const newNote = {
            id: crypto.randomUUID(),
            folderId,
            title: 'Untitled note',
            content: '<p></p>',
            updatedAt: new Date().toISOString()
        };

        setNotes([newNote, ...notes]);
        setSelectedNote(newNote.id);
    }

    // Fonction : mettre à jour une note
    // Paramètres : identifiant et modifications
    // Return : aucun
    function updateNote(noteId, changes) {
        setNotes(previous => previous.map(note =>
            note.id === noteId
                ? { ...note, ...changes, updatedAt: new Date().toISOString() }
                : note
        ));
    }

    // Fonction : supprimer une note
    // Paramètre : identifiant de la note
    // Return : aucun
    function deleteNote(noteId) {
        if (!window.confirm('Delete this note?')) return;

        setNotes(previous => previous.filter(note => note.id !== noteId));
        setSelectedNote(null);
    }

    // Fonction : retirer les balises HTML de l'aperçu
    // Paramètre : contenu HTML
    // Return : texte simple
    function getPreview(content) {
        const element = document.createElement('div');
        element.innerHTML = content;
        return element.textContent || 'Empty note...';
    }

    return (
        <div className="notes-page">
            <div className="notes-page-header">
                <div>
                    <h1>My Notes</h1>
                    <p>A little space for your thoughts ♡</p>
                </div>
                <span>Your little notebook ✿</span>
            </div>

            <div className="notes-layout">
                <section className="notes-panel notes-folders">
                    <div className="notes-panel-header">
                        <h2>My folders</h2>
                        <button
                            type="button"
                            className={settingsOpen ? 'notes-icon-button active' : 'notes-icon-button'}
                            onClick={() => {
                                setSettingsOpen(!settingsOpen);
                                setEditingFolder(null);
                            }}
                            title="Manage folders"
                            aria-label="Manage folders"
                        >
                            <Settings2 size={18} />
                        </button>
                    </div>

                    <div className="notes-folder-list">
                        <button
                            type="button"
                            className={`notes-folder-item ${selectedFolder === 'all' ? 'selected' : ''}`}
                            onClick={() => openFolder('all')}
                        >
                            <Files size={17} />
                            <span>All notes</span>
                            {selectedFolder === 'all' && <ChevronRight size={15} />}
                        </button>

                        {folders.map(folder => (
                            <div className="notes-folder-row" key={folder.id}>
                                {editingFolder === folder.id ? (
                                    <div className="notes-folder-edit">
                                        <input
                                            value={folderName}
                                            onChange={event => setFolderName(event.target.value)}
                                            onKeyDown={event => {
                                                if (event.key === 'Enter') saveFolderName(folder.id);
                                                if (event.key === 'Escape') setEditingFolder(null);
                                            }}
                                            autoFocus
                                        />
                                        <button type="button" onClick={() => saveFolderName(folder.id)} aria-label="Save folder">
                                            <Check size={15} />
                                        </button>
                                        <button type="button" onClick={() => setEditingFolder(null)} aria-label="Cancel">
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={`notes-folder-item ${selectedFolder === folder.id ? 'selected' : ''}`}
                                            onClick={() => openFolder(folder.id)}
                                        >
                                            <Folder size={17} />
                                            <span>{folder.name}</span>
                                            {selectedFolder === folder.id && <ChevronRight size={15} />}
                                        </button>

                                        {settingsOpen && (
                                            <div className="notes-folder-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingFolder(folder.id);
                                                        setFolderName(folder.name);
                                                    }}
                                                    title="Rename folder"
                                                    aria-label={`Rename ${folder.name}`}
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteFolder(folder.id)}
                                                    title="Delete folder"
                                                    aria-label={`Delete ${folder.name}`}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="button" className="notes-add-folder" onClick={addFolder}>
                        <Plus size={16} />
                        <span>New folder</span>
                    </button>
                </section>

                {selectedFolder !== null && (
                    <section className="notes-panel notes-list-panel">
                        <div className="notes-panel-header">
                            <h2>{selectedFolder === 'all' ? 'All notes' : folders.find(folder => folder.id === selectedFolder)?.name}</h2>

                            <div className="notes-header-actions">
                                <button
                                    type="button"
                                    className="notes-icon-button"
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    title="Search notes"
                                    aria-label="Search notes"
                                >
                                    <Search size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="notes-icon-button"
                                    onClick={addNote}
                                    title="New note"
                                    aria-label="New note"
                                >
                                    <Plus size={19} />
                                </button>
                            </div>
                        </div>

                        {searchOpen && (
                            <input
                                className="notes-search"
                                type="text"
                                placeholder="Search notes..."
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                autoFocus
                            />
                        )}

                        <div className="notes-items">
                            {visibleNotes.length === 0 ? (
                                <p className="notes-empty-list">No notes here yet ♡</p>
                            ) : (
                                visibleNotes.map(note => (
                                    <button
                                        type="button"
                                        key={note.id}
                                        className={`notes-item ${selectedNote === note.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedNote(note.id)}
                                    >
                                        <strong>{note.title || 'Untitled note'}</strong>
                                        <span>{getPreview(note.content)}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {currentNote && (
                    <section className="notes-panel notes-editor-panel">
                        <div className="notes-editor-top">
                            <span>
                                {folders.find(folder => folder.id === currentNote.folderId)?.name}
                                {' · '}
                                {new Date(currentNote.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                            </span>

                            <button
                                type="button"
                                className="notes-icon-button"
                                onClick={() => deleteNote(currentNote.id)}
                                title="Delete note"
                                aria-label="Delete note"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>

                        <input
                            className="notes-title-input"
                            value={currentNote.title}
                            onChange={event => updateNote(currentNote.id, { title: event.target.value })}
                            placeholder="Untitled note"
                            aria-label="Note title"
                        />

                        <NoteEditor key={currentNote.id} note={currentNote} onUpdate={updateNote} />
                    </section>
                )}
            </div>
        </div>
    );
}

export default NotesPage;
