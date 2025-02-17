import { useContext, useState } from 'react';
import '../CSS/ResponsiveComponents.css'; // Importa tu archivo CSS
import { ThemeContext } from '../Contexts/ThemeContext';
import React from 'react';

interface Contador {
    count: number;
    increment: () => void;
    decrement: () => void;
}

const ComponenteUno = () => <div className="componente">Contenido del Componente Uno✨</div>;

const ComponenteDos: React.FC<Contador> = ({ count, increment, decrement }) => (
    <div className="componente comsegundo">
        <h2>Contador: {count}</h2>
        <div className='forgap'>
            <button onClick={decrement}>-</button>
            <button onClick={increment}>+</button>
        </div>
    </div >
);
const ComponenteTres = () => <div className="componente3"></div>;

const ResponsiveComponents = () => {
    const [showUno, setShowUno] = useState(false);
    const [showDos, setShowDos] = useState(false);
    const [showTres, setShowTres] = useState(false);
    const [count, setCount] = useState(0); // Estado para el contador

    // Accedemos al contexto usando useContext
    const themeContext = useContext(ThemeContext); // Accede al contexto
    const { theme } = themeContext!;

    // Funciones para manejar el contador
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count > 0 ? count - 1 : 0); // Evitar que el contador sea negativo

    return (
        <div className={`responsive-container ${theme}`}>
            <div className='component'>
                <button onClick={() => setShowUno(!showUno)}>
                    {showUno ? 'Ocultar Componente Uno' : 'Mostrar Componente Uno'}
                </button>
                {showUno && <ComponenteUno />}
            </div>

            <div className='component'>
                <button onClick={() => setShowDos(!showDos)}>
                    {showDos ? 'Ocultar Componente Dos' : 'Mostrar Componente Dos'}
                </button>
                {showDos && <ComponenteDos count={count} increment={increment} decrement={decrement} />}
            </div>

            <div className='component'>
                <button onClick={() => setShowTres(!showTres)}>
                    {showTres ? 'Ocultar Componente Tres' : 'Mostrar Componente Tres'}
                </button>
                {showTres && <ComponenteTres />}
            </div>
        </div>
    );
};

export default ResponsiveComponents;
