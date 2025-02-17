import React, { useContext, useReducer, useState } from 'react';
import '../CSS/SeriesReducer.css'
import { ThemeContext } from '../Contexts/ThemeContext';

// Definición de tipos
interface Serie {
    id: string;
    title: string;
    estrellas: number;
}

// Definimos las acciones que se pueden realizar sobre las series
type Action =
    | { type: '[SERIE] Agregar Serie'; payload: Serie } // Acción para agregar una serie
    | { type: '[SERIE] Aumentar Estrellas'; payload: string } // Acción para aumentar estrellas
    | { type: '[SERIE] Disminuir Estrellas'; payload: string } // Acción para disminuir estrellas
    | { type: '[SERIE] Eliminar Serie'; payload: string }; // Acción para eliminar una serie

// Definición del estado inicial como un array vacío de series
const initialState: Serie[] = [];

// Reducer para manejar las acciones del carrito
const seriesReducer = (state: Serie[] = initialState, action: Action): Serie[] => {
    switch (action.type) {
        case '[SERIE] Agregar Serie':
            // Agrega una nueva serie al estado, inicializando las estrellas en 1
            return [...state, { ...action.payload, estrellas: 1 }];

        case '[SERIE] Aumentar Estrellas':
            return state.map(item => {
                // Aumenta las estrellas de la serie correspondiente si no supera 5
                if (item.id === action.payload && item.estrellas < 5) {
                    return { ...item, estrellas: item.estrellas + 1 };
                }
                return item;
            });

        case '[SERIE] Disminuir Estrellas':
            return state.map(item => {
                // Disminuye las estrellas de la serie correspondiente si no es menor a 1
                if (item.id === action.payload && item.estrellas > 1) {
                    return { ...item, estrellas: item.estrellas - 1 };
                }
                return item;
            });

        case '[SERIE] Eliminar Serie':
            // Filtra y elimina la serie correspondiente del estado
            return state.filter(serie => serie.id !== action.payload);

        default:
            return state;
    }
};

// Acciones

const aumentarEstrellas = (dispatch: React.Dispatch<Action>, id: string) => {
    const action: Action = {
        type: '[SERIE] Aumentar Estrellas',
        payload: id,
    };
    dispatch(action);
};

const disminuirEstrellas = (dispatch: React.Dispatch<Action>, id: string) => {
    const action: Action = {
        type: '[SERIE] Disminuir Estrellas',
        payload: id,
    };
    dispatch(action);
};

const eliminarSerie = (dispatch: React.Dispatch<Action>, id: string) => {
    const action: Action = {
        type: '[SERIE] Eliminar Serie',
        payload: id,
    };
    dispatch(action);
};

// Componente principal
const Series: React.FC = () => {
    const [listaSeries, dispatch] = useReducer(seriesReducer, initialState);
    const [nombreSerie, setNombreSerie] = useState(''); // Estado para el nombre de la serie

    // Accedemos al contexto usando useContext
    const themeContext = useContext(ThemeContext); // Accede al contexto
    const { theme } = themeContext!;

    // Función para agregar una nueva serie
    const agregarNuevaSerie = () => {
        if (nombreSerie.trim() === '') {
            alert('Por favor, ingresa un nombre para la serie.');
            return;
        }

        const nuevaSerie: Serie = {
            id: Math.random().toString(), // Generar un ID único
            title: nombreSerie, // Usar el nombre ingresado
            estrellas: 1,
        };
        dispatch({ type: '[SERIE] Agregar Serie', payload: nuevaSerie }); // Despachar acción para agregar la serie
        setNombreSerie(''); // Limpiar el input después de agregar la serie
    };

    return (
        <div className={`fondo ${theme}`}>
            <div className={`series_reducer ${theme}`}>
                <h1>Lista de Series</h1>
                <div className='ingreso'>
                    <input
                        type="text"
                        value={nombreSerie}
                        onChange={(e) => setNombreSerie(e.target.value)} // Actualizar el estado con el valor del input
                        placeholder="Ingresa el nombre de la serie"
                    />
                    <button onClick={agregarNuevaSerie} className='btn btn-agregar'>Agregar Serie</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Estrellas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaSeries.map(item => ( // Mapeamos la lista de series para mostrar en la tabla
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => disminuirEstrellas(dispatch, item.id)}
                                    >
                                        -
                                    </button>
                                    <span className="btn btn-primary">{item.estrellas}/5</span>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => aumentarEstrellas(dispatch, item.id)}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => eliminarSerie(dispatch, item.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Series;