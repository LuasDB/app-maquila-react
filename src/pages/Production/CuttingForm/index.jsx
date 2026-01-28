import React, { useState } from 'react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 
import Select from '@/components/common/Select' 

const CuttingForm = ({ roll, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        pieces: '',
        productType: '',
        size: '',
        notes: ''
    }) 

    const [errors, setErrors] = useState({}) 

    const productTypeOptions = [
        { value: 'BASICO', label: 'BASICO' },
        { value: 'EXTRA', label: 'EXTRA' },
        { value: 'CAMPANA', label: 'CAMPANA' },
        { value: 'WIDE LEG', label: 'WIDE LEG' },
        { value: 'SKINNY', label: 'SKINNY' },
        { value: 'BOOTCUT', label: 'BOOTCUT' },
        { value: 'CARGO', label: 'CARGO' }
    ] 

    const sizeOptions = [
        { value: '26', label: '26' },
        { value: '28', label: '28' },
        { value: '30', label: '30' },
        { value: '32', label: '32' },
        { value: '34', label: '34' },
        { value: '36', label: '36' },
        { value: '38', label: '38' },
        { value: '40', label: '40' },
        { value: '42', label: '42' }
    ] 

    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData(prev => ({
        ...prev,
        [name]: value
        })) 
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' })) 
        }
    } 

    const validate = () => {
        const newErrors = {} 

        if (!formData.date) {
        newErrors.date = 'La fecha es requerida' 
        }

        if (!formData.pieces || parseInt(formData.pieces) <= 0) {
        newErrors.pieces = 'El número de piezas debe ser mayor a 0' 
        }

        if (!formData.productType) {
        newErrors.productType = 'El tipo de producto es requerido' 
        }

        if (!formData.size) {
        newErrors.size = 'La talla es requerida' 
        }

        setErrors(newErrors) 
        return Object.keys(newErrors).length === 0 
    } 

    const handleSubmit = () => {
        if (validate()) {
        onSubmit(formData) 
        }
    } 

    return (
        <div>
        {/* Información del Rollo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información del Rollo</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <span className="text-blue-700">Folio:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.folio}</span>
            </div>
            <div>
                <span className="text-blue-700">Tipo de Tela:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.fabric.type}</span>
            </div>
            <div>
                <span className="text-blue-700">Metros:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.fabric.meters} m</span>
            </div>
            <div>
                <span className="text-blue-700">Costo:</span>
                <span className="ml-2 font-medium text-blue-900">
                ${roll.fabric.cost.toLocaleString('es-MX')}
                </span>
            </div>
            </div>
        </div>

        <div className="space-y-4">
            <Input
            label="Fecha de Corte"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
            />

            <Input
            label="Número de Piezas"
            name="pieces"
            type="number"
            value={formData.pieces}
            onChange={handleChange}
            error={errors.pieces}
            required
            placeholder="100"
            min="1"
            />

            <Select
            label="Tipo de Producto"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            options={productTypeOptions}
            error={errors.productType}
            required
            />

            <Select
            label="Talla"
            name="size"
            value={formData.size}
            onChange={handleChange}
            options={sizeOptions}
            error={errors.size}
            required
            />

            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas / Observaciones
            </label>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Observaciones sobre el corte..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            Registrar Corte
            </Button>
        </div>
        </div>
    ) 
} 

export default CuttingForm 