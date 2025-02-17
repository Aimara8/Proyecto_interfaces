import { createContext, useState, ReactNode } from 'react';

interface ThemeContextProps {
    theme: string; // El tema actual: 'light' o 'dark'
    toggleTheme: () => void; // Función para alternar el tema
}

// Crear un contexto para el tema
export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode; // Los componentes hijos del proveedor
}

// Proveedor de tema
export const ThemeProvider = ({ children }:ThemeProviderProps) => {
    const [theme, setTheme] = useState('light'); // Tema inicial

    // Alternar entre temas
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
