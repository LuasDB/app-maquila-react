import { useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        rfc: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        creditLimit: '',
        creditDays: '',
        active: true,
        ...customer
    }) 

    const [errors, setErrors] = useState({}) 

    const mexicanStates = [
        { value: 'AGS', label: 'Aguascalientes' },
        { value: 'BC', label: 'Baja California' },
        { value: 'BCS', label: 'Baja California Sur' },
        { value: 'CAMP', label: 'Campeche' },
        { value: 'CHIS', label: 'Chiapas' },
        { value: 'CHIH', label: 'Chihuahua' },
        { value: 'CDMX', label: 'Ciudad de México' },
        { value: 'COAH', label: 'Coahuila' },
        { value: 'COL', label: 'Colima' },
        { value: 'DGO', label: 'Durango' },
        { value: 'GTO', label: 'Guanajuato' },
        { value: 'GRO', label: 'Guerrero' },
        { value: 'HGO', label: 'Hidalgo' },
        { value: 'JAL', label: 'Jalisco' },
        { value: 'MEX', label: 'Estado de México' },
        { value: 'MICH', label: 'Michoacán' },
        { value: 'MOR', label: 'Morelos' },
        { value: 'NAY', label: 'Nayarit' },
        { value: 'NL', label: 'Nuevo León' },
        { value: 'OAX', label: 'Oaxaca' },
        { value: 'PUE', label: 'Puebla' },
        { value: 'QRO', label: 'Querétaro' },
        { value: 'QROO', label: 'Quintana Roo' },
        { value: 'SLP', label: 'San Luis Potosí' },
        { value: 'SIN', label: 'Sinaloa' },
        { value: 'SON', label: 'Sonora' },
        { value: 'TAB', label: 'Tabasco' },
        { value: 'TAMPS', label: 'Tamaulipas' },
        { value: 'TLAX', label: 'Tlaxcala' },
        { value: 'VER', label: 'Veracruz' },
        { value: 'YUC', label: 'Yucatán' },
        { value: 'ZAC', label: 'Zacatecas' }
    ] 

const handleChange = (e) => {
    const { name, value, type, checked } = e.target 
    setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
    })) 
    if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' })) 
    }
} 

const validate = () => {
    const newErrors = {} 

    if (!formData.name.trim()) {
    newErrors.name = 'El nombre es requerido' 
    }

    if (!formData.phone.trim()) {
    newErrors.phone = 'El teléfono es requerido' 
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'El correo no es válido' 
    }

    if (!formData.address.trim()) {
    newErrors.address = 'La dirección es requerida' 
    }

    if (!formData.city.trim()) {
    newErrors.city = 'La ciudad es requerida' 
    }

    if (!formData.state) {
    newErrors.state = 'El estado es requerido' 
    }

    if (!formData.creditLimit || parseFloat(formData.creditLimit) <= 0) {
    newErrors.creditLimit = 'El límite de crédito debe ser mayor a 0' 
    }

    if (!formData.creditDays || parseInt(formData.creditDays) <= 0) {
    newErrors.creditDays = 'Los días de crédito deben ser mayor a 0' 
    }

    setErrors(newErrors) 
    return Object.keys(newErrors).length === 0 
} 

    const handleSubmit = () => {
        if (validate()) {
        const submitData = {
            ...formData,
            creditLimit: parseFloat(formData.creditLimit),
            creditDays: parseInt(formData.creditDays)
        } 
        onSubmit(submitData) 
        }
    } 

    return (
        <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
            label="Nombre Comercial"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Tienda El Pantalón"
            />

            <Input
            label="Razón Social"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Comercializadora El Pantalón S.A."
            />

            <Input
            label="RFC"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            placeholder="CEP123456789"
            />

            <Input
            label="Teléfono"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="555-1234"
            />

            <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="contacto@cliente.com"
            />

            <Input
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
            placeholder="Ciudad de México"
            />
        </div>

        <Input
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
            placeholder="Av. Principal #123, Col. Centro"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
            label="Estado"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={mexicanStates}
            error={errors.state}
            required
            />

            <Input
            label="Límite de Crédito"
            name="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={handleChange}
            error={errors.creditLimit}
            required
            placeholder="50000"
            />

            <Input
            label="Días de Crédito"
            name="creditDays"
            type="number"
            value={formData.creditDays}
            onChange={handleChange}
            error={errors.creditDays}
            required
            placeholder="30"
            />
        </div>

        <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Cliente activo</span>
            </label>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            {customer ? 'Actualizar' : 'Crear'} Cliente
            </Button>
        </div>
        </div>
    )
}

export default CustomerForm