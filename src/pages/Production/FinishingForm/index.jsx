import React, { useState } from 'react' 
import Button from '@/components/common/Button' 
import Input from '@/components/common/Input' 

const FinishingForm = ({ roll, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        finisherName: '',
        piecesDelivered: roll.laundry.piecesReturned.toString(),
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

        if (!formData.finisherName.trim()) {
        newErrors.finisherName = 'El nombre del terminador es requerido' 
        }

        if (!formData.piecesDelivered || parseInt(formData.piecesDelivered) <= 0) {
        newErrors.piecesDelivered = 'Las piezas deben ser mayores a 0' 
        }

        if (parseInt(formData.piecesDelivered) > roll.laundry.piecesReturned) {
        newErrors.piecesDelivered = `No puede entregar más de ${roll.laundry.piecesReturned} piezas` 
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
        {/* Información de la Lavandería */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-orange-900 mb-2">Piezas Disponibles</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <span className="text-orange-700">Producto:</span>
                <span className="ml-2 font-medium text-orange-900">{roll.cutting.productType}</span>
            </div>
            <div>
                <span className="text-orange-700">Talla:</span>
                <span className="ml-2 font-medium text-orange-900">{roll.cutting.size}</span>
            </div>
            <div>
                <span className="text-orange-700">Piezas de Lavandería:</span>
                <span className="ml-2 font-medium text-green-700">{roll.laundry.piecesReturned}</span>
            </div>
            </div>
        </div>

        <div className="space-y-4">
            <Input
            label="Nombre del Terminador"
            name="finisherName"
            value={formData.finisherName}
            onChange={handleChange}
            error={errors.finisherName}
            required
            placeholder="Terminados y Empaque ABC"
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
                max={roll.laundry.piecesReturned}
            />

            <Input
                label="Precio por Pieza"
                name="pricePerPiece"
                type="number"
                value={formData.pricePerPiece}
                onChange={handleChange}
                error={errors.pricePerPiece}
                required
                placeholder="10"
                min="0"
                step="0.01"
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                label="Fecha de Entrega a Terminado"
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
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm font-medium text-orange-900 mb-2">Resumen de Costos</p>
                <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-orange-700">Piezas:</span>
                    <span className="font-semibold text-orange-900">{formData.piecesDelivered}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-orange-700">Precio por pieza:</span>
                    <span className="font-semibold text-orange-900">
                    ${parseFloat(formData.pricePerPiece).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between border-t border-orange-300 pt-1 mt-1">
                    <span className="text-orange-700 font-semibold">Total Terminado:</span>
                    <span className="font-bold text-orange-900">
                    ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex justify-between pt-1 mt-1">
                    <span className="text-orange-700">Inversión Total:</span>
                    <span className="font-semibold text-orange-900">
                    ${(roll.summary.totalInvested + totalCost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
            Registrar Salida a Terminado
            </Button>
        </div>
        </div>
    ) 
} 

export default FinishingForm 