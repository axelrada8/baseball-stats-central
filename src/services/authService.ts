
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export const authService = {
  // Registrar nuevo usuario
  register: (userData: { name: string; email: string; password: string }): boolean => {
    const users = authService.getUsers();
    
    // Verificar si el email ya existe
    if (users.some(user => user.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // En un app real, esto debería estar hasheado
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return true;
  },

  // Iniciar sesión
  login: (email: string, password: string): User | null => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Almacenar usuario actual (sin la contraseña)
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      localStorage.setItem('user', JSON.stringify(userSession));
      return user;
    }
    
    return null;
  },

  // Obtener todos los usuarios registrados
  getUsers: (): User[] => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  },

  // Verificar si un email está registrado
  isEmailRegistered: (email: string): boolean => {
    const users = authService.getUsers();
    return users.some(user => user.email === email);
  },

  // Cerrar sesión
  logout: (): void => {
    localStorage.removeItem('user');
  }
};
