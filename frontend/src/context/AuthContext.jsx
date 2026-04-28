import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('psicorose_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para iniciar sesión (actualiza el estado y localStorage)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('psicorose_user', JSON.stringify(userData));
    localStorage.setItem('psicorose_token', userData.token);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('psicorose_user');
    localStorage.removeItem('psicorose_token');
    window.location.href = '/login';
  };

  // Función para actualizar los datos del usuario en tiempo real
  const updateUser = (updatedData) => {
    // Mantener el token actual si no viene en los nuevos datos
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('psicorose_user', JSON.stringify(newUser));
  };

  // El valor que estará disponible en toda la aplicación
  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
