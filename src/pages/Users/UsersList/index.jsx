import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X, Eye, EyeOff, UserCheck, UserX } from 'lucide-react'
import userService from '@/services/userService'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import UserForm from '@/pages/Users/UserForm'

const UsersList = () => {
    const [users, setUsers] = useState([]) 
    const [filteredUsers, setFilteredUsers] = useState([]) 
    const [searchTerm, setSearchTerm] = useState('') 
    const [isModalOpen, setIsModalOpen] = useState(false) 
    const [selectedUser, setSelectedUser] = useState(null) 
    const [loading, setLoading] = useState(true) 
    const [filterRole, setFilterRole] = useState('') 
    const [error, setError] = useState('') 

    const loadUsers = async () => {
        try {
          setLoading(true)
          setError('')
          const response = await userService.getAll()
          setUsers(response.data)
          console.log(response)
        } catch (error) {
          setError(error.response?.data?.message || 'Error al cargar usuarios')
          console.error(error.response?.data?.message || 'Error al cargar usuarios')
        }finally{
          setLoading(false)
        }
    } 

    const filterUsers = () => {
        let filtered = [...users] 

        if (searchTerm) {
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) 
        }

        if (filterRole) {
        filtered = filtered.filter(user => user.role === filterRole) 
        }

        setFilteredUsers(filtered) 
    } 

    useEffect(() => {
        try {
            loadUsers()
        } catch (error) {
            alert('nada')
        }
    }, []) 

    useEffect(() => {
        filterUsers() 
    }, [users, searchTerm, filterRole]) 



  const handleCreate = () => {
    setSelectedUser(null) 
    setIsModalOpen(true) 
  } 

  const handleEdit = (user) => {
    setSelectedUser(user) 
    setIsModalOpen(true) 
  } 

  const handleDelete = async (id) => {
    //Agregar modales interactivos
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
    
    try {
      await userService.delete(id)
      await loadUsers()
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.message) 
    }

  } 

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        console.log('Useuario modificado',selectedUser)
        await userService.update(selectedUser._id, {...formData,updatedAt:new Date().toISOString()}) 
      } else {
        await userService.create({...formData, createdAt:new Date().toISOString()}) 
      }
      setIsModalOpen(false) 
      await loadUsers() 
    } catch (error) {
      alert('Error: ' + error.message) 
    }
    if (selectedUser) {
      await userService.update(selectedUser.id, formData) 
    } else {
      await userService.create(formData) 
    }
    setIsModalOpen(false) 
    loadUsers() 
  } 

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      supervisor: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      seller: 'bg-yellow-100 text-yellow-800'
    } 

    const labels = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      operator: 'Operador',
      seller: 'Vendedor'
    } 

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[role]}`}>
        {labels[role]}
      </span>
    ) 
  } 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    ) 
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
  ) 
} 

export default UsersList 