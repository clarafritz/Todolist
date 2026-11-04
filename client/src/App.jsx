
/* -----------------------------------------
App.jsx -> Composant principal 
----------------------------------------- */
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';


/* Fonction : Affiche structure principale */
/* Paramètre : aucun */
/* Return : JSX */
function App() {
    return (
        <div className='app'>
            <Sidebar />

            <main className='app-content'>
                <h1>Welcome to Bloom</h1>
                <p>Your little space to plan, dream & bloom.</p>
            </main>
        </div>
    );
}

export default App;
