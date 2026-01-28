import React, { useState } from 'react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 

const RollForm = ({ roll, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fabricType: roll?.fabric.type || '',
        meters: roll?.fabric.meters || '',
        supplier: roll?.fabric.supplier || '',
        purchaseDate: roll?.fabric.purchaseDate 
        ? new Date(roll.fabric.purchaseDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
        cost: roll?.fabric.cost || ''
    }) 

    const [errors, setErrors] = useState({}) 

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

        if (!formData.fabricType.trim()) {
        newErrors.fabricType = 'El tipo de tela es requerido' 
        }

        if (!formData.meters || parseFloat(formData.meters) <= 0) {
        newErrors.meters = 'Los metros deben ser mayores a 0' 
        }

        if (!formData.purchaseDate) {
        newErrors.purchaseDate = 'La fecha de compra es requerida' 
        }

        if (!formData.cost || parseFloat(formData.cost) <= 0) {
        newErrors.cost = 'El costo debe ser mayor a 0' 
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
        <div className="space-y-4">
            <Input
            label="Tipo de Tela"
            name="fabricType"
            value={formData.fabricType}
            onChange={handleChange}
            error={errors.fabricType}
            required
            placeholder="Mezclilla 14oz, Denim, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Metros"
                name="meters"
                type="number"
                value={formData.meters}
                onChange={handleChange}
                error={errors.meters}
                required
                placeholder="50"
                min="0"
                step="0.01"
            />

            <Input
                label="Costo Total del Rollo"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                error={errors.cost}
                required
                placeholder="5000"
                min="0"
                step="0.01"
            />
            </div>

            <Input
            label="Proveedor"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="Proveedor de Telas S.A."
            />

            <Input
            label="Fecha de Compra"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            error={errors.purchaseDate}
            required
            />

            {/* Resumen */}
            {formData.meters && formData.cost && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Resumen</p>
                <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-blue-700">Costo por metro:</span>
                    <span className="font-semibold text-blue-900">
                    ${(parseFloat(formData.cost) / parseFloat(formData.meters)).toFixed(2)}
                    </span>
                </div>
                </div>
            </div>
            )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            {roll ? 'Actualizar' : 'Crear'} Rollo
            </Button>
        </div>
        </div>
    ) 
} 

export default RollForm 