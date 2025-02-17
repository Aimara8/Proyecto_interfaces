// AuthContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

// Creamos el contexto de autenticación, inicializándolo como undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser ] = useState<User | null>(null); // Estado para almacenar el usuario autenticado

    // Función para iniciar sesión
    const login = (userData: User) => {
        setUser (userData); // Actualiza el estado con los datos del usuario
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser (null); // Actualiza el estado
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext); // Accedemos al contexto
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider'); // Error si se usa fuera del proveedor
    }
    return context; // Retornamos el contexto
};