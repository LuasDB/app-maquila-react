import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Eye, EyeOff, UserCheck, UserX } from 'lucide-react';

// ============================================
// SERVICIOS (userService.js)
// ============================================

// Simulación de datos iniciales
const initialUsers = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', active: true, createdAt: '2024-01-15' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'supervisor', active: true, createdAt: '2024-02-20' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'operator', active: true, createdAt: '2024-03-10' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'seller', active: false, createdAt: '2024-03-25' },
];

// Simulación de API con almacenamiento en memoria
let usersDB = [...initialUsers];

const userService = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...usersDB]);
      }, 300);
    });
  },

  getById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = usersDB.find(u => u.id === id);
        resolve(user);
      }, 200);
    });
  },

  create: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: Math.max(...usersDB.map(u => u.id), 0) + 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
        usersDB = [...usersDB, newUser];
        resolve(newUser);
      }, 300);
    });
  },

  update: (id, userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        usersDB = usersDB.map(u => u.id === id ? { ...u, ...userData } : u);
        resolve(usersDB.find(u => u.id === id));
      }, 300);
    });
  },

  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        usersDB = usersDB.filter(u => u.id !== id);
        resolve(true);
      }, 300);
    });
  }
};

// ============================================
// COMPONENTES COMUNES
// ============================================

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const Input = ({ label, name, type = 'text', value, onChange, error, required = false, placeholder = '' }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Select = ({ label, name, value, onChange, options, error, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <option value="">Seleccionar...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = 'xl' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 lg:w-[50%]">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
            
            <div className={`
                relative z-50 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full  ${sizes[size]}
            `}>
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    </div>
  );
};

// ============================================
// COMPONENTE: UserForm
// ============================================

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        active: true,
        ...user
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const roleOptions = [
        { value: 'admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'operator', label: 'Operador' },
        { value: 'seller', label: 'Vendedor' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
        newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El correo no es válido';
        }

        if (!user && !formData.password) {
        newErrors.password = 'La contraseña es requerida';
        } else if (!user && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.role) {
        newErrors.role = 'El rol es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
        onSubmit(formData);
        }
    };

    return (
        <div>
        <Input
            label="Nombre Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Juan Pérez"
        />

        <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="usuario@example.com"
        />

        {!user && (
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                `}
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
        )}

        <Select
            label="Rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
            required
        />

        <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Usuario activo</span>
            </label>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            {user ? 'Actualizar' : 'Crear'} Usuario
            </Button>
        </div>
        </div>
    );
    };

// ============================================
// COMPONENTE: UsersList
// ============================================

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setLoading(false);
    };

    const filterUsers = () => {
        let filtered = [...users];

        if (searchTerm) {
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        if (filterRole) {
        filtered = filtered.filter(user => user.role === filterRole);
        }

        setFilteredUsers(filtered);
    };

    useEffect(() => {
        try {
            loadUsers()
        } catch (error) {
            alert('nada')
        }
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, filterRole]);

 

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
   
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await userService.delete(id);
      loadUsers();
    }
  };

  const handleSubmit = async (formData) => {
    if (selectedUser) {
      await userService.update(selectedUser.id, formData);
    } else {
      await userService.create(formData);
    }
    setIsModalOpen(false);
    loadUsers();
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      supervisor: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      seller: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      operator: 'Operador',
      seller: 'Vendedor'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[role]}`}>
        {labels[role]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      {/* Header con búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="operator">Operador</option>
              <option value="seller">Vendedor</option>
            </select>

            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-5 h-5 mr-2 inline" />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden sm:block">
        <div className="relative -mx-4 sm:mx-0 overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {user.active ? (
                        <span className="flex items-center text-green-600">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activo
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <UserX className="w-4 h-4 mr-1" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE */}
    <div className="sm:hidden space-y-3">
    {filteredUsers.map(user => (
        <div key={user.id} className="bg-white rounded-lg shadow p-4">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500 break-all">{user.email}</div>
        <div className="mt-2 flex justify-between items-center">
            {getRoleBadge(user.role)}
            <div className="flex gap-3">
            <Edit2 className="w-4 h-4" onClick={() => handleEdit(user)}/>
            <Trash2 className="w-4 h-4 text-red-600" onClick={() => handleDelete(user.id)}/>
            </div>
        </div>
        </div>
    ))}
    </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Usuarios</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Activos</div>
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.active).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Inactivos</div>
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => !u.active).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Administradores</div>
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UsersList;