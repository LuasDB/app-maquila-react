import { useState, } from 'react'
import {  Eye, EyeOff } from 'lucide-react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        active: true,
        ...user
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const roleOptions = [
        { value: 'admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'operator', label: 'Operador' },
        { value: 'seller', label: 'Vendedor' }
    ]

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido'
        }

        if (!formData.email.trim()) {
        newErrors.email = 'El correo es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El correo no es válido'
        }

        if (!user && !formData.password) {
        newErrors.password = 'La contraseña es requerida'
        } else if (!user && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        if (!formData.role) {
        newErrors.role = 'El rol es requerido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    };

    const handleSubmit = () => {
        if (validate()) {
        onSubmit(formData)
        }
    }

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
    )
}

export default UserForm


