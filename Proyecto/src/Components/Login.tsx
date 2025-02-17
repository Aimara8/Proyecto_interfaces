import React, { useState, useContext } from 'react';
import '../CSS/Login.css'
import { ThemeContext } from '../Contexts/ThemeContext';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const { login } = useAuth(); // Obtenemos la función de login del contexto
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Accedemos al contexto usando useContext
    const themeContext = useContext(ThemeContext); // Accede al contexto
    const { theme } = themeContext!;

    // Inicializa el hook useNavigate para redirigir
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validación simple
        if (!username || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        
        const userData = { username }; // Simulando datos de usuario
        login(userData); // Llama a la función de login con los datos del usuario

        // Redirigir al usuario a otra página después de iniciar sesión
        navigate('/Home'); // Navega a la página de inicio

    };

    return (
        <div className={`login-container ${theme}`}>
            <form onSubmit={handleSubmit} className={`login-form ${theme}`}>

                <h2>Iniciar Sesión</h2>
                <div className='login-name'>
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='login-password'>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
