import { useContext } from 'react';
import '../CSS/Home.css'
import { ThemeContext } from '../Contexts/ThemeContext';
import { NavLink } from 'react-router-dom';

export const Home = () => {

    // Accedemos al contexto usando useContext
    const themeContext = useContext(ThemeContext); // Accede al contexto
    const { theme } = themeContext!;

    return (
        <div className={`home ${theme}`}>
            <h1>Bienvenidos a la página principal</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi sapiente itaque id at quam enim fugit explicabo aspernatur hic inventore, sunt aut, ab a quo minima suscipit exercitationem molestias! Sed.</p>

            <div className='botones_espacio'>
                <NavLink to='/VoiceRecognition' className={"nav-link active"}>
                    <button>
                        Reconocedor de Voz
                        🎙️
                    </button>
                </NavLink>
                <NavLink to='/KozzyIA' className={"nav-link active"}>
                    <button>
                        Kozzy IA
                    </button>
                </NavLink>
            </div>
        </div>
    );
}