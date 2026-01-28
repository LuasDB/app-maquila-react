import React, { useState } from 'react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 

const SewingForm = ({ roll, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        seamstress: '',
        embroider: '',
        piecesDelivered: roll.cutting.pieces.toString(),
        pricePerPiece: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        estimatedReturnDate: ''
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

        if (!formData.seamstress.trim()) {
        newErrors.seamstress = 'El nombre del maquilero es requerido' 
        }

        if (!formData.piecesDelivered || parseInt(formData.piecesDelivered) <= 0) {
        newErrors.piecesDelivered = 'Las piezas deben ser mayores a 0' 
        }

        if (parseInt(formData.piecesDelivered) > roll.cutting.pieces) {
        newErrors.piecesDelivered = `No puede entregar más de ${roll.cutting.pieces} piezas` 
        }

        if (!formData.pricePerPiece || parseFloat(formData.pricePerPiece) <= 0) {
        newErrors.pricePerPiece = 'El precio debe ser mayor a 0' 
        }

        if (!formData.deliveryDate) {
        newErrors.deliveryDate = 'La fecha de entrega es requerida' 
        }

        setErrors(newErrors) 
        return Object.keys(newErrors).length === 0 
    } 

    const handleSubmit = () => {
        if (validate()) {
        onSubmit(formData) 
        }
    } 

    const totalCost = formData.piecesDelivered && formData.pricePerPiece
        ? parseInt(formData.piecesDelivered) * parseFloat(formData.pricePerPiece)
        : 0 

    return (
        <div>
        {/* Información del Corte */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Información del Corte</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <span className="text-blue-700">Piezas Cortadas:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.cutting.pieces}</span>
            </div>
            <div>
                <span className="text-blue-700">Producto:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.cutting.productType}</span>
            </div>
            <div>
                <span className="text-blue-700">Talla:</span>
                <span className="ml-2 font-medium text-blue-900">{roll.cutting.size}</span>
            </div>
            </div>
        </div>

        <div className="space-y-4">
            <Input
            label="Maquilero"
            name="seamstress"
            value={formData.seamstress}
            onChange={handleChange}
            error={errors.seamstress}
            required
            placeholder="Taller de Costura López"
            />

            <Input
            label="Bordador (Opcional)"
            name="embroider"
            value={formData.embroider}
            onChange={handleChange}
            placeholder="Bordados Finos"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Piezas a Entregar"
                name="piecesDelivered"
                type="number"
                value={formData.piecesDelivered}
                onChange={handleChange}
                error={errors.piecesDelivered}
                required
                min="1"
                max={roll.cutting.pieces}
            />

            <Input
                label="Precio por Pieza"
                name="pricePerPiece"
                type="number"
                value={formData.pricePerPiece}
                onChange={handleChange}
                error={errors.pricePerPiece}
                required
                placeholder="25"
                min="0"
                step="0.01"
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Fecha de Entrega al Maquilero"
                name="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={handleChange}
                error={errors.deliveryDate}
                required
            />

            <Input
                label="Fecha Estimada de Retorno"
                name="estimatedReturnDate"
                type="date"
                value={formData.estimatedReturnDate}
                onChange={handleChange}
            />
            </div>

            {/* Resumen de Costos */}
            {totalCost > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900 mb-2">Resumen de Costos</p>
                <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-green-700">Piezas:</span>
                    <span className="font-semibold text-green-900">{formData.piecesDelivered}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-green-700">Precio por pieza:</span>
                    <span className="font-semibold text-green-900">
                    ${parseFloat(formData.pricePerPiece).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between border-t border-green-300 pt-1 mt-1">
                    <span className="text-green-700 font-semibold">Total Maquila:</span>
                    <span className="font-bold text-green-900">
                    ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                </div>
            </div>
            )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onCancel}>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            Registrar Salida a Maquila
            </Button>
        </div>
        </div>
    ) 
} 

export default SewingForm 